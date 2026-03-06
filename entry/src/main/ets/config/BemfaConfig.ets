/**
 * 巴法云配置文件
 * 存储巴法云MQTT连接相关的配置信息
 */

export class BemfaConfig {
  // MQTT服务器配置
  static readonly MQTT_SERVER = 'bemfa.com';
  static readonly MQTT_PORT = 9501;           // 普通TCP端口
  static readonly MQTT_TLS_PORT = 9503;       // TLS加密端口
  static readonly MQTT_WSS_PORT = 9504;       // WebSocket端口
  static readonly MQTT_WSS_PATH = '/wss';     // WebSocket路径
  
  // HTTP API配置
  static readonly HTTP_API_BASE = 'https://pro.bemfa.com/v1';
  static readonly CREATE_TOPIC_API = '/createTopic';
  static readonly GET_TOPICS_API = '/getTopics';
  
  // 用户私钥（UID）- 已内置
  static USER_UID = '7432041b992943a88a4fd59edaa02474';  // 巴法云私钥
  
  // MQTT连接配置
  static readonly KEEP_ALIVE = 60;            // 心跳间隔（秒）
  static readonly CLEAN_SESSION = true;       // 清除会话
  static readonly QOS_LEVEL = 1;              // 消息质量等级 (0或1)
  static readonly RECONNECT_INTERVAL = 5000;  // 重连间隔（毫秒）
  static readonly MAX_RECONNECT_TIMES = 10;   // 最大重连次数
  
  // 设备类型后缀定义（巴法云规范）
  static readonly DEVICE_TYPE_SOCKET: string = '001';      // 插座设备
  static readonly DEVICE_TYPE_LIGHT: string = '002';       // 灯泡设备
  static readonly DEVICE_TYPE_FAN: string = '003';         // 风扇设备
  static readonly DEVICE_TYPE_SENSOR: string = '004';      // 传感器设备
  static readonly DEVICE_TYPE_AC: string = '005';          // 空调设备
  static readonly DEVICE_TYPE_SWITCH: string = '006';      // 开关设备
  static readonly DEVICE_TYPE_CURTAIN: string = '009';     // 窗帘设备
  
  // MQTT协议类型（用于HTTP API）
  static readonly PROTOCOL_TYPE_MQTT_V1: number = 1;       // MQTT协议设备
  static readonly PROTOCOL_TYPE_TCP: number = 3;           // TCP协议设备
  static readonly PROTOCOL_TYPE_MQTT_V2: number = 5;       // MQTT协议设备V2版本（内测）
  static readonly PROTOCOL_TYPE_TCP_V2: number = 7;        // TCP协议设备V2版本（内测）
  
  // 存储键名
  static readonly STORAGE_KEY_UID: string = 'bemfa_uid';
  static readonly STORAGE_KEY_TOPICS: string = 'bemfa_topics';
  static readonly STORAGE_KEY_DEVICES: string = 'bemfa_devices';
}

