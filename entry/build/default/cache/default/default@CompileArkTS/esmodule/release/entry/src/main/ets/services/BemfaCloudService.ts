import http from "@ohos:net.http";
import { BemfaConfig } from "@normalized:N&&&entry/src/main/ets/config/BemfaConfig&";
// 创建主题请求接口
export interface CreateTopicRequest {
    uid: string; // 用户私钥
    topic: string; // 主题名称
    type: number; // 协议类型
    name?: string; // 主题昵称（可选）
}
// 创建主题响应接口
export interface CreateTopicResponse {
    code: number;
    message: string;
    data?: Record<string, Object>;
}
// 主题信息接口
export interface TopicInfo {
    topic: string;
    name: string;
    type: number;
    created_at?: string;
}
// 获取主题列表响应接口
export interface GetTopicsResponse {
    code: number;
    message: string;
    data?: TopicInfo[];
}
// 设备主题信息接口
export interface DeviceTopicInfo {
    topic: string;
    name: string;
}
// 设备在线状态查询响应接口
export interface DeviceOnlineResponse {
    code: number;
    message: string;
    data: boolean; // true=在线, false=离线
}
// 设备类型枚举
export type DeviceType = 'outlet' | 'light' | 'fan' | 'sensor' | 'aircondition' | 'switch' | 'curtain' | 'thermostat' | 'waterheater' | 'television' | 'airpurifier';
// 主题详细信息接口
export interface TopicDetail {
    topic: string; // 主题值
    msg: string; // 消息体
    name: string; // 主题名字
    online: boolean; // 是否在线
    tid: string; // 类型ID
    sid: string; // 
    time: string; // 消息发送的时间（UTC/GMT+08:00）
    unix: number; // 消息发送的时间戳
    type?: number; // 协议类型
    share?: boolean; // 是否是分享设备
    room?: string; // 房间名字
    pubOnline?: boolean; // 推送者是否在线
    deviceType?: DeviceType; // 设备类型
    group?: string; // 分组
    createTime?: string; // 主题创建时间
}
// 主题数据容器接口（API实际返回的是嵌套结构 data.data）
export interface TopicsDataContainer {
    data: TopicDetail[];
}
// 获取所有主题响应接口
// 注意：实际API返回是 msg 和嵌套的 data.data，不是文档示例的格式
export interface AllTopicsResponse {
    code: number;
    msg: string; // 实际返回的是 msg，不是 message
    data: TopicsDataContainer; // 实际是嵌套结构 data.data
}
// 获取主题昵称响应接口
export interface GetTopicNameResponse {
    code: number;
    message: string;
    data: string; // 主题昵称
}
// 修改主题昵称请求接口
export interface ModifyTopicNameRequest {
    uid: string; // 用户私钥
    topic: string; // 主题名称
    type: number; // 协议类型
    name: string; // 新的主题昵称
}
// 修改主题昵称响应接口
export interface ModifyTopicNameResponse {
    code: number;
    message: string;
    data: number;
}
// 消息记录接口
export interface MessageRecord {
    msg: string; // 消息内容
    time: string; // 消息发送时间（UTC/GMT+08:00）
    unix: number; // 消息时间戳
}
// 获取消息响应接口
export interface GetMessagesResponse {
    code: number;
    message: string;
    data: MessageRecord[];
}
// 设备分组信息接口
export interface DeviceGroup {
    name: string; // 分组名称
    num: number; // 分组内设备数量
}
// 分组数据容器接口
export interface GroupsDataContainer {
    data: DeviceGroup[];
}
// 获取所有分组响应接口
export interface GetAllGroupsResponse {
    code: number;
    msg: string;
    data: GroupsDataContainer;
}
// 设备数据容器接口
export interface DevicesDataContainer {
    data: TopicDetail[];
}
// 通过分组获取设备响应接口
export interface GetDevicesByGroupResponse {
    code: number;
    msg: string;
    data: DevicesDataContainer;
}
// 推送消息请求接口
export interface PostMessageRequest {
    uid: string; // 用户私钥
    topic: string; // 主题名称
    type: number; // 主题类型（1=MQTT, 3=TCP）
    msg: string; // 消息内容
    share?: boolean; // 是否为分享设备（可选）
    wemsg?: string; // 微信推送消息（可选）
}
// 推送消息响应接口
export interface PostMessageResponse {
    code: number;
    message: string;
    data: number;
}
export class BemfaCloudService {
    private static instance: BemfaCloudService;
    private uid: string = '';
    private constructor() {
        // 使用配置文件中的默认UID
        this.uid = BemfaConfig.USER_UID;
        if (this.uid) {
            console.info('[BemfaCloud] 使用内置UID:', this.uid.substring(0, 8) + '...');
        }
    }
    /**
     * 获取单例实例
     */
    public static getInstance(): BemfaCloudService {
        if (!BemfaCloudService.instance) {
            BemfaCloudService.instance = new BemfaCloudService();
        }
        return BemfaCloudService.instance;
    }
    /**
     * 设置用户UID
     */
    public setUID(uid: string): void {
        this.uid = uid;
    }
    /**
     * 获取当前UID
     */
    public getUID(): string {
        return this.uid;
    }
    /**
     * 创建主题（可以理解为创建一个新的设备通道）
     * 这个过程就像是在巴法云平台上注册一个新的设备身份
     * @param topic 主题名称（仅限字母、数字，就像是设备的身份证号码）
     * @param type 协议类型（1=MQTT, 3=TCP，就像选择不同的通信语言）
     * @param name 主题昵称（可选，就像是给设备起个友好的名字）
     */
    public async createTopic(topic: string, type: number, name?: string): Promise<CreateTopicResponse> {
        if (!this.uid) {
            return {
                code: -1,
                message: '请先配置巴法云UID'
            };
        }
        // 1. 准备请求地址：就像知道要把信寄到哪个邮局
        const url = BemfaConfig.HTTP_API_BASE + BemfaConfig.CREATE_TOPIC_API;
        // 2. 准备请求数据：就像准备要寄出的信件内容
        const requestData: CreateTopicRequest = {
            uid: this.uid,
            topic: topic,
            type: type // 通信协议类型，就像选择快递方式
        };
        // 如果有昵称，就添加到请求数据中
        if (name) {
            requestData.name = name;
        }
        try {
            console.info('[BemfaCloud] 创建主题请求:', JSON.stringify(requestData));
            // 3. 创建HTTP请求对象：就像叫来一位快递员
            const request = http.createHttp();
            // 4. 发送请求：就像把信件交给快递员
            const response = await request.request(url, {
                method: http.RequestMethod.POST,
                header: {
                    'Content-Type': 'application/json' // 告诉服务器我们发送的是JSON格式
                },
                extraData: JSON.stringify(requestData),
                expectDataType: http.HttpDataType.STRING,
                connectTimeout: 10000,
                readTimeout: 10000 // 读取超时时间：10秒
            });
            // 5. 释放请求对象：就像让快递员离开
            request.destroy();
            // 6. 处理响应：就像拆开收到的回信
            if (response.responseCode === 200) {
                // 状态码200表示成功，就像收到"一切正常"的回信
                const result = JSON.parse(response.result as string) as CreateTopicResponse;
                console.info('[BemfaCloud] 创建主题成功:', JSON.stringify(result));
                return result;
            }
            else {
                // 其他状态码表示出错，就像收到"地址错误"的回信
                console.error('[BemfaCloud] 创建主题失败:', response.responseCode);
                return {
                    code: response.responseCode,
                    message: `请求失败: ${response.responseCode}`
                };
            }
        }
        catch (error) {
            // 异常处理：就像遇到"快递员找不到地址"的情况
            console.error('[BemfaCloud] ❌ 创建主题异常');
            console.error('[BemfaCloud] 错误详情:', JSON.stringify(error));
            let errorMessage = '网络连接失败';
            if (error && typeof error === 'object') {
                const errorObj = error as Record<string, Object>;
                errorMessage = errorObj.message ? `${errorObj.message}` : '网络连接失败';
            }
            return {
                code: -1,
                message: errorMessage
            };
        }
    }
    /**
     * 获取主题列表
     */
    public async getTopics(): Promise<GetTopicsResponse> {
        if (!this.uid) {
            return {
                code: -1,
                message: '请先配置巴法云UID'
            };
        }
        const url = `${BemfaConfig.HTTP_API_BASE}${BemfaConfig.GET_TOPICS_API}?uid=${this.uid}`;
        try {
            console.info('[BemfaCloud] 获取主题列表:', url);
            const request = http.createHttp();
            const response = await request.request(url, {
                method: http.RequestMethod.GET,
                header: {
                    'Content-Type': 'application/json'
                },
                expectDataType: http.HttpDataType.STRING,
                connectTimeout: 10000,
                readTimeout: 10000
            });
            request.destroy();
            if (response.responseCode === 200) {
                const result = JSON.parse(response.result as string) as GetTopicsResponse;
                console.info('[BemfaCloud] 获取主题列表成功:', JSON.stringify(result));
                return result;
            }
            else {
                console.error('[BemfaCloud] 获取主题列表失败:', response.responseCode);
                return {
                    code: response.responseCode,
                    message: `请求失败: ${response.responseCode}`
                };
            }
        }
        catch (error) {
            console.error('[BemfaCloud] ❌ 获取主题列表异常');
            console.error('[BemfaCloud] 错误详情:', JSON.stringify(error));
            let errorMessage = '网络连接失败';
            if (error && typeof error === 'object') {
                const errorObj = error as Record<string, Object>;
                errorMessage = errorObj.message ? `${errorObj.message}` : '网络连接失败';
            }
            return {
                code: -1,
                message: errorMessage
            };
        }
    }
    /**
     * 批量创建设备主题
     * @param devices 设备列表
     */
    public async createMultipleTopics(devices: Array<DeviceTopicInfo>): Promise<Array<CreateTopicResponse>> {
        const results: Array<CreateTopicResponse> = [];
        for (const device of devices) {
            const result = await this.createTopic(device.topic, BemfaConfig.PROTOCOL_TYPE_MQTT_V1, device.name);
            results.push(result);
            // 避免请求过快，添加延迟
            await this.delay(500);
        }
        return results;
    }
    /**
     * 获取所有主题信息
     * @param type 主题类型（1=MQTT, 3=TCP）
     * @returns 所有主题的详细信息
     */
    public async getAllTopics(type: number = 1): Promise<AllTopicsResponse> {
        if (!this.uid) {
            const emptyData: TopicsDataContainer = { data: [] };
            return {
                code: -1,
                msg: '请先配置巴法云UID',
                data: emptyData
            };
        }
        // 注意：此接口参数名为openID，不是uid
        const url = `http://apis.bemfa.com/vb/api/v2/allTopic?openID=${this.uid}&type=${type}`;
        try {
            console.info('[BemfaCloud] 获取所有主题信息');
            console.info('[BemfaCloud] 请求URL:', url);
            const request = http.createHttp();
            const response = await request.request(url, {
                method: http.RequestMethod.GET,
                header: {
                    'Content-Type': 'application/json'
                },
                expectDataType: http.HttpDataType.STRING,
                connectTimeout: 15000,
                readTimeout: 15000
            });
            request.destroy();
            if (response.responseCode === 200) {
                const result = JSON.parse(response.result as string) as AllTopicsResponse;
                // 实际API返回是嵌套的 data.data 结构
                const topicCount = result.data?.data?.length || 0;
                console.info('[BemfaCloud] API返回码:', result.code);
                console.info('[BemfaCloud] API消息:', result.msg);
                console.info('[BemfaCloud] ✅ 成功获取主题数量:', topicCount);
                // 打印所有主题详情
                if (result.data?.data && result.data.data.length > 0) {
                    console.info('[BemfaCloud] ========== 所有设备列表 ==========');
                    result.data.data.forEach((topic, idx) => {
                        console.info(`[BemfaCloud] ${idx + 1}. ${topic.name || topic.topic}`);
                        console.info(`    - 主题: ${topic.topic}`);
                        console.info(`    - 类型: ${topic.deviceType || topic.tid || '未知'}`);
                        console.info(`    - 在线: ${topic.online ? '✅' : '❌'}`);
                        console.info(`    - 消息: ${topic.msg}`);
                    });
                    console.info('[BemfaCloud] =====================================');
                }
                else {
                    console.warn('[BemfaCloud] ⚠️ 没有获取到任何设备！');
                }
                return result;
            }
            else {
                console.error('[BemfaCloud] 获取主题信息失败:', response.responseCode);
                const emptyData: TopicsDataContainer = { data: [] };
                return {
                    code: response.responseCode,
                    msg: `请求失败: ${response.responseCode}`,
                    data: emptyData
                };
            }
        }
        catch (error) {
            console.error('[BemfaCloud] ❌ 获取主题信息异常');
            console.error('[BemfaCloud] 错误类型:', typeof error);
            console.error('[BemfaCloud] 错误内容:', JSON.stringify(error));
            // 尝试获取详细错误信息
            let errorMessage = '网络连接失败';
            if (error && typeof error === 'object') {
                const errorObj = error as Record<string, Object>;
                if (errorObj.message) {
                    errorMessage = `${errorObj.message}`;
                }
                else if (errorObj.code) {
                    errorMessage = `错误码: ${errorObj.code}`;
                }
            }
            console.error('[BemfaCloud] 详细错误:', errorMessage);
            console.error('[BemfaCloud] 请求URL:', url);
            console.error('[BemfaCloud] 提示: 预览器可能不支持真实网络请求，建议在真机上测试');
            const emptyData: TopicsDataContainer = { data: [] };
            return {
                code: -1,
                msg: errorMessage,
                data: emptyData
            };
        }
    }
    /**
     * 获取主题昵称
     * @param topic 主题名称
     * @param type 主题类型（1=MQTT, 3=TCP）
     * @returns 主题昵称
     */
    public async getTopicName(topic: string, type: number = 1): Promise<GetTopicNameResponse> {
        if (!this.uid) {
            return {
                code: -1,
                message: '请先配置巴法云UID',
                data: ''
            };
        }
        const url = `https://apis.bemfa.com/va/getName?uid=${this.uid}&topic=${topic}&type=${type}`;
        try {
            console.info('[BemfaCloud] 获取主题昵称:', topic);
            const request = http.createHttp();
            const response = await request.request(url, {
                method: http.RequestMethod.GET,
                header: {
                    'Content-Type': 'application/json'
                },
                expectDataType: http.HttpDataType.STRING,
                connectTimeout: 10000,
                readTimeout: 10000
            });
            request.destroy();
            if (response.responseCode === 200) {
                const result = JSON.parse(response.result as string) as GetTopicNameResponse;
                console.info('[BemfaCloud] 主题昵称:', topic, '→', result.data);
                return result;
            }
            else {
                console.error('[BemfaCloud] 获取主题昵称失败:', response.responseCode);
                return {
                    code: response.responseCode,
                    message: `请求失败: ${response.responseCode}`,
                    data: ''
                };
            }
        }
        catch (error) {
            console.error('[BemfaCloud] ❌ 获取主题昵称异常:', topic);
            console.error('[BemfaCloud] 错误详情:', JSON.stringify(error));
            let errorMessage = '网络连接失败';
            if (error && typeof error === 'object') {
                const errorObj = error as Record<string, Object>;
                errorMessage = errorObj.message ? `${errorObj.message}` : '网络连接失败';
            }
            return {
                code: -1,
                message: errorMessage,
                data: ''
            };
        }
    }
    /**
     * 修改主题昵称
     * @param topic 主题名称
     * @param newName 新的昵称
     * @param type 主题类型（1=MQTT, 3=TCP）
     * @returns 修改结果
     */
    public async modifyTopicName(topic: string, newName: string, type: number = 1): Promise<ModifyTopicNameResponse> {
        if (!this.uid) {
            return {
                code: -1,
                message: '请先配置巴法云UID',
                data: 0
            };
        }
        if (!newName || newName.trim().length === 0) {
            return {
                code: -1,
                message: '昵称不能为空',
                data: 0
            };
        }
        const url = 'https://apis.bemfa.com/va/modifyName';
        const requestData: ModifyTopicNameRequest = {
            uid: this.uid,
            topic: topic,
            type: type,
            name: newName.trim()
        };
        try {
            console.info('[BemfaCloud] 修改主题昵称:', topic, '→', newName);
            const request = http.createHttp();
            const response = await request.request(url, {
                method: http.RequestMethod.POST,
                header: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                extraData: JSON.stringify(requestData),
                expectDataType: http.HttpDataType.STRING,
                connectTimeout: 10000,
                readTimeout: 10000
            });
            request.destroy();
            if (response.responseCode === 200) {
                const result = JSON.parse(response.result as string) as ModifyTopicNameResponse;
                if (result.code === 0) {
                    console.info('[BemfaCloud] ✅ 修改昵称成功:', topic, '→', newName);
                }
                else {
                    console.error('[BemfaCloud] ❌ 修改昵称失败:', result.message);
                }
                return result;
            }
            else {
                console.error('[BemfaCloud] 修改昵称请求失败:', response.responseCode);
                return {
                    code: response.responseCode,
                    message: `请求失败: ${response.responseCode}`,
                    data: 0
                };
            }
        }
        catch (error) {
            console.error('[BemfaCloud] ❌ 修改昵称异常:', topic);
            console.error('[BemfaCloud] 错误详情:', JSON.stringify(error));
            let errorMessage = '网络连接失败';
            if (error && typeof error === 'object') {
                const errorObj = error as Record<string, Object>;
                errorMessage = errorObj.message ? `${errorObj.message}` : '网络连接失败';
            }
            return {
                code: -1,
                message: errorMessage,
                data: 0
            };
        }
    }
    /**
     * 查询设备在线状态
     * @param topic 主题名称
     * @param type 主题类型（1=MQTT, 3=TCP）
     * @returns 设备是否在线
     */
    public async checkDeviceOnline(topic: string, type: number = 1): Promise<DeviceOnlineResponse> {
        if (!this.uid) {
            return {
                code: -1,
                message: '请先配置巴法云UID',
                data: false
            };
        }
        const url = `https://apis.bemfa.com/va/online?uid=${this.uid}&topic=${topic}&type=${type}`;
        try {
            console.info('[BemfaCloud] 查询设备在线状态:', topic);
            const request = http.createHttp();
            const response = await request.request(url, {
                method: http.RequestMethod.GET,
                header: {
                    'Content-Type': 'application/json'
                },
                expectDataType: http.HttpDataType.STRING,
                connectTimeout: 10000,
                readTimeout: 10000
            });
            request.destroy();
            if (response.responseCode === 200) {
                const result = JSON.parse(response.result as string) as DeviceOnlineResponse;
                console.info('[BemfaCloud] 设备在线状态:', topic, result.data ? '在线' : '离线');
                return result;
            }
            else {
                console.error('[BemfaCloud] 查询设备在线状态失败:', response.responseCode);
                return {
                    code: response.responseCode,
                    message: `请求失败: ${response.responseCode}`,
                    data: false
                };
            }
        }
        catch (error) {
            console.error('[BemfaCloud] ❌ 查询设备在线状态异常:', topic);
            console.error('[BemfaCloud] 错误详情:', JSON.stringify(error));
            let errorMessage = '网络连接失败';
            if (error && typeof error === 'object') {
                const errorObj = error as Record<string, Object>;
                errorMessage = errorObj.message ? `${errorObj.message}` : '网络连接失败';
            }
            return {
                code: -1,
                message: errorMessage,
                data: false
            };
        }
    }
    /**
     * 批量查询设备在线状态
     * @param topics 主题列表
     * @param type 主题类型（1=MQTT, 3=TCP）
     * @returns 设备在线状态映射表
     */
    public async checkMultipleDevicesOnline(topics: Array<string>, type: number = 1): Promise<Map<string, boolean>> {
        const statusMap = new Map<string, boolean>();
        for (const topic of topics) {
            const result = await this.checkDeviceOnline(topic, type);
            if (result.code === 0) {
                statusMap.set(topic, result.data);
            }
            else {
                statusMap.set(topic, false); // 查询失败默认为离线
            }
            // 避免请求过快
            await this.delay(300);
        }
        return statusMap;
    }
    /**
     * 获取主题历史消息
     * @param topic 主题名称
     * @param type 主题类型（1=MQTT, 3=TCP）
     * @param num 获取的历史数据条数（默认1，最大5000）
     * @returns 历史消息列表
     */
    public async getMessages(topic: string, type: number = 1, num: number = 1): Promise<GetMessagesResponse> {
        if (!this.uid) {
            return {
                code: -1,
                message: '请先配置巴法云UID',
                data: []
            };
        }
        // 限制num范围
        if (num < 1)
            num = 1;
        if (num > 5000)
            num = 5000;
        const url = `https://apis.bemfa.com/va/getmsg?uid=${this.uid}&topic=${topic}&type=${type}&num=${num}`;
        try {
            console.info('[BemfaCloud] 获取历史消息:', topic, '数量:', num);
            const request = http.createHttp();
            const response = await request.request(url, {
                method: http.RequestMethod.GET,
                header: { 'Content-Type': 'application/json'
                },
                expectDataType: http.HttpDataType.STRING,
                connectTimeout: 15000,
                readTimeout: 15000
            });
            request.destroy();
            if (response.responseCode === 200) {
                const result = JSON.parse(response.result as string) as GetMessagesResponse;
                console.info('[BemfaCloud] 获取到历史消息数量:', result.data?.length || 0);
                // 打印最新的几条消息
                if (result.data && result.data.length > 0) {
                    const showCount = Math.min(3, result.data.length);
                    for (let i = 0; i < showCount; i++) {
                        const msg = result.data[i];
                        console.info(`[BemfaCloud] 消息${i + 1}: ${msg.msg} (${msg.time})`);
                    }
                }
                return result;
            }
            else {
                console.error('[BemfaCloud] 获取历史消息失败:', response.responseCode);
                return {
                    code: response.responseCode,
                    message: `请求失败: ${response.responseCode}`,
                    data: []
                };
            }
        }
        catch (error) {
            console.error('[BemfaCloud] ❌ 获取历史消息异常:', topic);
            console.error('[BemfaCloud] 错误详情:', JSON.stringify(error));
            let errorMessage = '网络连接失败';
            if (error && typeof error === 'object') {
                const errorObj = error as Record<string, Object>;
                errorMessage = errorObj.message ? `${errorObj.message}` : '网络连接失败';
            }
            return {
                code: -1,
                message: errorMessage,
                data: []
            };
        }
    }
    /**
     * 获取所有设备分组
     * @param type 主题类型（1=MQTT, 3=TCP）
     * @returns 设备分组列表
     */
    public async getAllGroups(type: number = 1): Promise<GetAllGroupsResponse> {
        if (!this.uid) {
            const emptyData: GroupsDataContainer = {
                data: []
            };
            return {
                code: -1,
                msg: '请先配置巴法云UID',
                data: emptyData
            };
        }
        const url = `http://apis.bemfa.com/vb/api/v1/allGroup?openID=${this.uid}&type=${type}`;
        try {
            console.info('[BemfaCloud] 获取所有分组');
            const request = http.createHttp();
            const response = await request.request(url, {
                method: http.RequestMethod.GET,
                header: {
                    'Content-Type': 'application/json'
                },
                expectDataType: http.HttpDataType.STRING,
                connectTimeout: 15000,
                readTimeout: 15000
            });
            request.destroy();
            if (response.responseCode === 200) {
                const result = JSON.parse(response.result as string) as GetAllGroupsResponse;
                console.info('[BemfaCloud] 获取到分组数量:', result.data?.data?.length || 0);
                // 打印分组信息
                result.data?.data?.forEach(group => {
                    console.info(`[BemfaCloud] 分组: ${group.name} | 设备数: ${group.num}`);
                });
                return result;
            }
            else {
                console.error('[BemfaCloud] 获取分组失败:', response.responseCode);
                const emptyData: GroupsDataContainer = {
                    data: []
                };
                return {
                    code: response.responseCode,
                    msg: `请求失败: ${response.responseCode}`,
                    data: emptyData
                };
            }
        }
        catch (error) {
            console.error('[BemfaCloud] ❌ 获取分组异常');
            console.error('[BemfaCloud] 错误详情:', JSON.stringify(error));
            let errorMessage = '网络连接失败';
            if (error && typeof error === 'object') {
                const errorObj = error as Record<string, Object>;
                errorMessage = errorObj.msg ? `${errorObj.msg}` : '网络连接失败';
            }
            const emptyData: GroupsDataContainer = {
                data: []
            };
            return {
                code: -1,
                msg: errorMessage,
                data: emptyData
            };
        }
    }
    /**
     * 通过分组获取设备
     * @param group 分组名称（可选，不传则获取所有设备）
     * @param type 主题类型（1=MQTT, 3=TCP）
     * @returns 分组下的设备列表
     */
    public async getDevicesByGroup(group: string = '', type: number = 1): Promise<GetDevicesByGroupResponse> {
        if (!this.uid) {
            const emptyData: DevicesDataContainer = {
                data: []
            };
            return {
                code: -1,
                msg: '请先配置巴法云UID',
                data: emptyData
            };
        }
        let url = `http://apis.bemfa.com/vb/api/v2/groupTopic?openID=${this.uid}&type=${type}`;
        if (group) {
            url += `&group=${encodeURIComponent(group)}`;
        }
        try {
            console.info('[BemfaCloud] 获取分组设备:', group || '全部');
            const request = http.createHttp();
            const response = await request.request(url, {
                method: http.RequestMethod.GET,
                header: {
                    'Content-Type': 'application/json'
                },
                expectDataType: http.HttpDataType.STRING,
                connectTimeout: 15000,
                readTimeout: 15000
            });
            request.destroy();
            if (response.responseCode === 200) {
                const result = JSON.parse(response.result as string) as GetDevicesByGroupResponse;
                console.info('[BemfaCloud] 获取到设备数量:', result.data?.data?.length || 0);
                // 打印设备信息
                result.data?.data?.forEach(device => {
                    console.info(`[BemfaCloud] 设备: ${device.topic} | 名称: ${device.name} | 分组: ${device.group || '未分组'}`);
                });
                return result;
            }
            else {
                console.error('[BemfaCloud] 获取分组设备失败:', response.responseCode);
                const emptyData: DevicesDataContainer = {
                    data: []
                };
                return {
                    code: response.responseCode,
                    msg: `请求失败: ${response.responseCode}`,
                    data: emptyData
                };
            }
        }
        catch (error) {
            console.error('[BemfaCloud] ❌ 获取分组设备异常');
            console.error('[BemfaCloud] 错误详情:', JSON.stringify(error));
            let errorMessage = '网络连接失败';
            if (error && typeof error === 'object') {
                const errorObj = error as Record<string, Object>;
                errorMessage = errorObj.msg ? `${errorObj.msg}` : '网络连接失败';
            }
            const emptyData: DevicesDataContainer = {
                data: []
            };
            return {
                code: -1,
                msg: errorMessage,
                data: emptyData
            };
        }
    }
    /**
     * 推送消息到指定主题（GET方式 - 官方sendMessage接口）
     * 官方文档：https://apis.bemfa.com/va/sendMessage
     * @param topic 主题名称
     * @param msg 消息内容（on/off等）
     * @param type 主题类型（1=MQTT, 3=TCP）
     * @param wemsg 微信推送消息（可选）
     * @returns 推送结果
     */
    public async sendMessage(topic: string, msg: string, type: number = 1, wemsg?: string): Promise<PostMessageResponse> {
        if (!this.uid) {
            return {
                code: -1,
                message: '请先配置巴法云UID',
                data: 0
            };
        }
        if (!msg || msg.trim().length === 0) {
            return {
                code: -1,
                message: '消息内容不能为空',
                data: 0
            };
        }
        // 构建URL参数（GET方式）
        let url = `https://apis.bemfa.com/va/sendMessage?uid=${this.uid}&topic=${topic}&type=${type}&msg=${encodeURIComponent(msg.trim())}`;
        // 添加可选的微信推送参数
        if (wemsg) {
            url += `&wemsg=${encodeURIComponent(wemsg)}`;
        }
        try {
            console.info('[BemfaCloud] 发送消息到主题:', topic, '内容:', msg);
            console.info('[BemfaCloud] 请求URL:', url);
            const request = http.createHttp();
            const response = await request.request(url, {
                method: http.RequestMethod.GET,
                header: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                expectDataType: http.HttpDataType.STRING,
                connectTimeout: 10000,
                readTimeout: 10000
            });
            request.destroy();
            if (response.responseCode === 200) {
                const result = JSON.parse(response.result as string) as PostMessageResponse;
                if (result.code === 0) {
                    console.info('[BemfaCloud] ✅ 发送消息成功:', topic, '→', msg);
                }
                else {
                    console.error('[BemfaCloud] ❌ 发送消息失败 code:', result.code, 'message:', result.message);
                }
                return result;
            }
            else {
                console.error('[BemfaCloud] 发送消息请求失败:', response.responseCode);
                return {
                    code: response.responseCode,
                    message: `请求失败: ${response.responseCode}`,
                    data: 0
                };
            }
        }
        catch (error) {
            console.error('[BemfaCloud] ❌ 发送消息异常:', topic);
            console.error('[BemfaCloud] 错误详情:', JSON.stringify(error));
            let errorMessage = '网络连接失败';
            if (error && typeof error === 'object') {
                const errorObj = error as Record<string, Object>;
                errorMessage = errorObj.message ? `${errorObj.message}` : '网络连接失败';
            }
            return {
                code: -1,
                message: errorMessage,
                data: 0
            };
        }
    }
    /**
     * 推送消息到指定主题（POST方式 - postJsonMsg接口）
     * 备用接口，保留以备使用
     */
    public async postMessage(topic: string, msg: string, type: number = 1, wemsg?: string, share?: boolean): Promise<PostMessageResponse> {
        if (!this.uid) {
            return {
                code: -1,
                message: '请先配置巴法云UID',
                data: 0
            };
        }
        if (!msg || msg.trim().length === 0) {
            return {
                code: -1,
                message: '消息内容不能为空',
                data: 0
            };
        }
        const url = 'https://apis.bemfa.com/va/postJsonMsg';
        const requestData: PostMessageRequest = {
            uid: this.uid,
            topic: topic,
            type: type,
            msg: msg.trim()
        };
        // 添加可选参数
        if (share !== undefined) {
            requestData.share = share;
        }
        if (wemsg) {
            requestData.wemsg = wemsg;
        }
        try {
            console.info('[BemfaCloud] 推送消息到主题:', topic, '内容:', msg);
            if (wemsg) {
                console.info('[BemfaCloud] 微信推送:', wemsg);
            }
            const request = http.createHttp();
            const response = await request.request(url, {
                method: http.RequestMethod.POST,
                header: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                extraData: JSON.stringify(requestData),
                expectDataType: http.HttpDataType.STRING,
                connectTimeout: 10000,
                readTimeout: 10000
            });
            request.destroy();
            if (response.responseCode === 200) {
                const result = JSON.parse(response.result as string) as PostMessageResponse;
                if (result.code === 0) {
                    console.info('[BemfaCloud] ✅ 推送消息成功:', topic);
                }
                else {
                    console.error('[BemfaCloud] ❌ 推送消息失败:', result.message);
                }
                return result;
            }
            else {
                console.error('[BemfaCloud] 推送消息请求失败:', response.responseCode);
                return {
                    code: response.responseCode,
                    message: `请求失败: ${response.responseCode}`,
                    data: 0
                };
            }
        }
        catch (error) {
            console.error('[BemfaCloud] ❌ 推送消息异常:', topic);
            console.error('[BemfaCloud] 错误详情:', JSON.stringify(error));
            let errorMessage = '网络连接失败';
            if (error && typeof error === 'object') {
                const errorObj = error as Record<string, Object>;
                errorMessage = errorObj.message ? `${errorObj.message}` : '网络连接失败';
            }
            return {
                code: -1,
                message: errorMessage,
                data: 0
            };
        }
    }
    /**
     * 延迟函数
     */
    private delay(ms: number): Promise<void> {
        return new Promise<void>(resolve => setTimeout(resolve, ms));
    }
}
// 导出单例实例
export const bemfaCloudService = BemfaCloudService.getInstance();
