import socket from "@ohos:net.socket";
import { BemfaConfig } from "@normalized:N&&&entry/src/main/ets/config/BemfaConfig&";
// MQTT连接状态枚举
export enum MqttStatus {
    DISCONNECTED = 0,
    CONNECTING = 1,
    CONNECTED = 2,
    RECONNECTING = 3,
    ERROR = 4 // 错误
}
// MQTT消息接口
export interface MqttMessage {
    topic: string;
    payload: string;
    qos: number;
    retain: boolean;
}
// 消息回调类型
export type MessageCallback = (message: MqttMessage) => void;
export type StatusCallback = (status: MqttStatus) => void;
export class MqttService {
    private static instance: MqttService;
    private clientId: string = '';
    private status: MqttStatus = MqttStatus.DISCONNECTED;
    private tcpSocket: socket.TCPSocket | null = null;
    private reconnectTimer: number = -1;
    private reconnectCount: number = 0;
    private messageCallback: MessageCallback | null = null;
    private statusCallback: StatusCallback | null = null;
    private subscribedTopics: Set<string> = new Set();
    private keepAliveTimer: number = -1;
    private constructor() {
        // 使用配置文件中的默认UID作为客户端ID
        this.clientId = BemfaConfig.USER_UID || `harmony_${Date.now()}`;
        if (this.clientId && this.clientId.length === 32) {
            console.info('[MQTT] 使用内置UID作为客户端ID:', this.clientId.substring(0, 8) + '...');
        }
    }
    /**
     * 获取单例实例
     */
    public static getInstance(): MqttService {
        if (!MqttService.instance) {
            MqttService.instance = new MqttService();
        }
        return MqttService.instance;
    }
    /**
     * 设置客户端ID（使用用户UID）
     */
    public setClientId(clientId: string): void {
        this.clientId = clientId;
    }
    /**
     * 设置消息回调
     */
    public onMessage(callback: MessageCallback): void {
        this.messageCallback = callback;
    }
    /**
     * 设置状态回调
     */
    public onStatusChange(callback: StatusCallback): void {
        this.statusCallback = callback;
    }
    /**
     * 获取当前连接状态
     */
    public getStatus(): MqttStatus {
        return this.status;
    }
    /**
     * 连接到MQTT服务器
     */
    public async connect(): Promise<boolean> {
        if (this.status === MqttStatus.CONNECTED || this.status === MqttStatus.CONNECTING) {
            console.warn('[MQTT] 已经连接或正在连接中');
            return true;
        }
        if (!this.clientId) {
            console.error('[MQTT] 客户端ID未设置');
            return false;
        }
        try {
            this.updateStatus(MqttStatus.CONNECTING);
            console.info('[MQTT] 开始连接到巴法云MQTT服务器...');
            // 创建TCP Socket
            this.tcpSocket = socket.constructTCPSocketInstance();
            // 绑定事件监听
            this.setupSocketEvents();
            // 连接到服务器
            const address: socket.NetAddress = {
                address: BemfaConfig.MQTT_SERVER,
                port: BemfaConfig.MQTT_PORT,
                family: 1 // IPv4
            };
            try {
                await this.tcpSocket.connect({ address: address, timeout: 10000 });
                console.info('[MQTT] TCP连接建立成功');
                // 发送MQTT CONNECT消息
                await this.sendConnectMessage();
            }
            catch (connectError) {
                console.error('[MQTT] 连接或发送CONNECT消息失败:', connectError);
                throw new Error(`MQTT连接失败: ${connectError}`);
            }
            return true;
        }
        catch (error) {
            console.error('[MQTT] 连接失败:', error);
            this.updateStatus(MqttStatus.ERROR);
            this.scheduleReconnect();
            return false;
        }
    }
    /**
     * 设置Socket事件监听
     */
    private setupSocketEvents(): void {
        if (!this.tcpSocket) {
            return;
        }
        // 接收消息
        this.tcpSocket.on('message', (data: socket.SocketMessageInfo) => {
            try {
                const buffer = data.message as ArrayBuffer;
                this.handleReceivedData(buffer);
            }
            catch (error) {
                console.error('[MQTT] 处理接收数据失败:', error);
            }
        });
        // 连接关闭
        this.tcpSocket.on('close', () => {
            console.warn('[MQTT] 连接已关闭');
            this.updateStatus(MqttStatus.DISCONNECTED);
            this.scheduleReconnect();
        });
        // 连接错误
        this.tcpSocket.on('error', (err: Error) => {
            console.error('[MQTT] Socket错误:', err);
            this.updateStatus(MqttStatus.ERROR);
            this.scheduleReconnect();
        });
    }
    /**
     * 发送MQTT CONNECT消息
     */
    private async sendConnectMessage(): Promise<void> {
        // MQTT CONNECT消息结构（简化版）
        // 固定头: 0x10 (CONNECT) + 剩余长度
        // 可变头: 协议名MQTT + 协议级别4 + 连接标志 + 保活时间
        // 有效载荷: 客户端ID
        const protocolName = 'MQTT';
        const protocolLevel = 4; // MQTT 3.1.1
        const connectFlags = 0x02; // Clean Session
        const keepAlive = BemfaConfig.KEEP_ALIVE;
        // 构建可变头
        const variableHeader: number[] = [];
        // 协议名长度（2字节）+ 协议名
        variableHeader.push(0x00, protocolName.length);
        for (let i = 0; i < protocolName.length; i++) {
            variableHeader.push(protocolName.charCodeAt(i));
        }
        // 协议级别（1字节）
        variableHeader.push(protocolLevel);
        // 连接标志（1字节）
        variableHeader.push(connectFlags);
        // 保活时间（2字节，大端序）
        variableHeader.push((keepAlive >> 8) & 0xFF, keepAlive & 0xFF);
        // 构建有效载荷（客户端ID）
        const payload: number[] = [];
        // 客户端ID长度（2字节）+ 客户端ID
        payload.push((this.clientId.length >> 8) & 0xFF, this.clientId.length & 0xFF);
        for (let i = 0; i < this.clientId.length; i++) {
            payload.push(this.clientId.charCodeAt(i));
        }
        // 计算剩余长度
        const remainingLength = variableHeader.length + payload.length;
        // 构建完整MQTT消息
        const message: number[] = [];
        message.push(0x10); // CONNECT消息类型
        message.push(remainingLength); // 剩余长度（简化版，仅支持<128字节）
        message.push(...variableHeader);
        message.push(...payload);
        // 转换为ArrayBuffer并发送
        const buffer = new Uint8Array(message).buffer;
        if (this.tcpSocket) {
            try {
                await this.tcpSocket.send({ data: buffer });
                console.info('[MQTT] CONNECT消息已发送');
            }
            catch (sendError) {
                console.error('[MQTT] 发送CONNECT消息失败:', sendError);
                throw new Error(`发送CONNECT消息失败: ${sendError}`);
            }
        }
    }
    /**
     * 处理接收到的数据
     */
    private handleReceivedData(buffer: ArrayBuffer): void {
        const data = new Uint8Array(buffer);
        if (data.length === 0) {
            return;
        }
        const messageType = (data[0] >> 4) & 0x0F;
        switch (messageType) {
            case 2: // CONNACK
                this.handleConnack(data);
                break;
            case 3: // PUBLISH
                this.handlePublish(data);
                break;
            case 9: // SUBACK
                this.handleSuback(data);
                break;
            case 13: // PINGRESP
                console.info('[MQTT] 收到心跳响应');
                break;
            default:
                console.info('[MQTT] 收到未处理的消息类型:', messageType);
        }
    }
    /**
     * 处理CONNACK消息
     */
    private handleConnack(data: Uint8Array): void {
        if (data.length >= 4) {
            const returnCode = data[3];
            if (returnCode === 0) {
                console.info('[MQTT] 连接成功！');
                this.updateStatus(MqttStatus.CONNECTED);
                this.reconnectCount = 0;
                this.startKeepAlive();
                // 重新订阅之前的主题
                this.resubscribeAll();
            }
            else {
                console.error('[MQTT] 连接被拒绝，返回码:', returnCode);
                this.updateStatus(MqttStatus.ERROR);
            }
        }
    }
    /**
     * 处理PUBLISH消息（简化版）
     */
    private handlePublish(data: Uint8Array): void {
        try {
            let pos = 1;
            // 解析剩余长度
            let remainingLength = 0;
            let multiplier = 1;
            let byte = 0;
            do {
                byte = data[pos++];
                remainingLength += (byte & 0x7F) * multiplier;
                multiplier *= 128;
            } while ((byte & 0x80) !== 0);
            // 解析主题长度
            const topicLength = (data[pos] << 8) | data[pos + 1];
            pos += 2;
            // 解析主题
            const topicBytes = data.slice(pos, pos + topicLength);
            const topic = String.fromCharCode(...Array.from(topicBytes));
            pos += topicLength;
            // 解析消息内容
            const payloadBytes = data.slice(pos);
            const payload = String.fromCharCode(...Array.from(payloadBytes));
            console.info('[MQTT] 收到消息 - 主题:', topic, '内容:', payload);
            // 触发回调
            if (this.messageCallback) {
                const message: MqttMessage = {
                    topic: topic,
                    payload: payload,
                    qos: 0,
                    retain: false
                };
                this.messageCallback(message);
            }
        }
        catch (error) {
            console.error('[MQTT] 解析PUBLISH消息失败:', error);
        }
    }
    /**
     * 处理SUBACK消息
     */
    private handleSuback(data: Uint8Array): void {
        console.info('[MQTT] 订阅确认');
    }
    /**
     * 订阅主题
     */
    public async subscribe(topic: string, qos: number = 0): Promise<boolean> {
        if (this.status !== MqttStatus.CONNECTED || !this.tcpSocket) {
            console.error('[MQTT] 未连接，无法订阅');
            return false;
        }
        try {
            // MQTT SUBSCRIBE消息
            const messageId = Math.floor(Math.random() * 65535) + 1;
            const message: number[] = [];
            message.push(0x82); // SUBSCRIBE消息类型 + QoS 1
            // 可变头：消息ID
            const variableHeader: number[] = [];
            variableHeader.push((messageId >> 8) & 0xFF, messageId & 0xFF);
            // 有效载荷：主题
            const payload: number[] = [];
            payload.push((topic.length >> 8) & 0xFF, topic.length & 0xFF);
            for (let i = 0; i < topic.length; i++) {
                payload.push(topic.charCodeAt(i));
            }
            payload.push(qos); // QoS级别
            const remainingLength = variableHeader.length + payload.length;
            message.push(remainingLength);
            message.push(...variableHeader);
            message.push(...payload);
            const buffer = new Uint8Array(message).buffer;
            await this.tcpSocket.send({ data: buffer });
            this.subscribedTopics.add(topic);
            console.info('[MQTT] 已订阅主题:', topic);
            return true;
        }
        catch (error) {
            console.error('[MQTT] 订阅失败:', error);
            return false;
        }
    }
    /**
     * 发布消息
     */
    public async publish(topic: string, payload: string, qos: number = 0, retain: boolean = false): Promise<boolean> {
        if (this.status !== MqttStatus.CONNECTED || !this.tcpSocket) {
            console.error('[MQTT] 未连接，无法发布');
            return false;
        }
        try {
            // MQTT PUBLISH消息
            const flags = (qos << 1) | (retain ? 1 : 0);
            const message: number[] = [];
            message.push(0x30 | flags); // PUBLISH消息类型 + flags
            // 可变头：主题
            const variableHeader: number[] = [];
            variableHeader.push((topic.length >> 8) & 0xFF, topic.length & 0xFF);
            for (let i = 0; i < topic.length; i++) {
                variableHeader.push(topic.charCodeAt(i));
            }
            // 有效载荷：消息内容
            const payloadBytes: number[] = [];
            for (let i = 0; i < payload.length; i++) {
                payloadBytes.push(payload.charCodeAt(i));
            }
            const remainingLength = variableHeader.length + payloadBytes.length;
            message.push(remainingLength);
            message.push(...variableHeader);
            message.push(...payloadBytes);
            const buffer = new Uint8Array(message).buffer;
            await this.tcpSocket.send({ data: buffer });
            console.info('[MQTT] 消息已发布 - 主题:', topic, '内容:', payload);
            return true;
        }
        catch (error) {
            console.error('[MQTT] 发布失败:', error);
            return false;
        }
    }
    /**
     * 断开连接
     */
    public async disconnect(): Promise<void> {
        if (this.tcpSocket) {
            try {
                // 发送DISCONNECT消息
                const message = new Uint8Array([0xE0, 0x00]);
                await this.tcpSocket.send({ data: message.buffer });
                // 关闭连接
                await this.tcpSocket.close();
                this.tcpSocket = null;
            }
            catch (error) {
                console.error('[MQTT] 断开连接失败:', error);
            }
        }
        this.stopKeepAlive();
        this.stopReconnect();
        this.updateStatus(MqttStatus.DISCONNECTED);
        console.info('[MQTT] 已断开连接');
    }
    /**
     * 启动心跳保活
     */
    private startKeepAlive(): void {
        this.stopKeepAlive();
        this.keepAliveTimer = setInterval(() => {
            this.sendPing();
        }, (BemfaConfig.KEEP_ALIVE * 1000) / 2);
    }
    /**
     * 停止心跳保活
     */
    private stopKeepAlive(): void {
        if (this.keepAliveTimer !== -1) {
            clearInterval(this.keepAliveTimer);
            this.keepAliveTimer = -1;
        }
    }
    /**
     * 发送心跳包
     */
    private async sendPing(): Promise<void> {
        if (this.status === MqttStatus.CONNECTED && this.tcpSocket) {
            try {
                const message = new Uint8Array([0xC0, 0x00]); // PINGREQ
                await this.tcpSocket.send({ data: message.buffer });
                console.info('[MQTT] 心跳包已发送');
            }
            catch (error) {
                console.error('[MQTT] 发送心跳失败:', error);
            }
        }
    }
    /**
     * 重新订阅所有主题
     */
    private resubscribeAll(): void {
        this.subscribedTopics.forEach(topic => {
            this.subscribe(topic);
        });
    }
    /**
     * 计划重连
     */
    private scheduleReconnect(): void {
        if (this.reconnectCount >= BemfaConfig.MAX_RECONNECT_TIMES) {
            console.error('[MQTT] 达到最大重连次数，停止重连');
            return;
        }
        this.stopReconnect();
        this.updateStatus(MqttStatus.RECONNECTING);
        this.reconnectTimer = setTimeout(() => {
            this.reconnectCount++;
            console.info(`[MQTT] 尝试重连 (${this.reconnectCount}/${BemfaConfig.MAX_RECONNECT_TIMES})`);
            this.connect();
        }, BemfaConfig.RECONNECT_INTERVAL);
    }
    /**
     * 停止重连
     */
    private stopReconnect(): void {
        if (this.reconnectTimer !== -1) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = -1;
        }
    }
    /**
     * 更新状态
     */
    private updateStatus(status: MqttStatus): void {
        this.status = status;
        if (this.statusCallback) {
            this.statusCallback(status);
        }
    }
}
// 导出单例实例
export const mqttService = MqttService.getInstance();
