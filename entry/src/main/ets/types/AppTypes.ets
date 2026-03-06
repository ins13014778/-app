/**
 * 应用全局类型定义
 * @description 定义应用中使用的枚举、接口和类型别名
 * @since API version 12
 */

/**
 * 设备类型枚举
 */
export enum DeviceType {
  SPRINKLER = 'sprinkler',      // 喷灌设备
  LIGHTING = 'lighting',         // 照明设备
  FAN = 'fan',                   // 风扇设备
  SENSOR = 'sensor',             // 传感器
  PUMP = 'pump',                 // 水泵
  VALVE = 'valve',               // 阀门
  OTHER = 'other'                // 其他
}

/**
 * 用户角色枚举
 */
export enum UserRole {
  ADMIN = 1,                     // 管理员
  USER = 0                       // 普通用户
}

/**
 * 用户模式枚举
 */
export enum UserMode {
  NOT_LOGGED_IN = 'not_logged_in',  // 未登录
  GUEST = 'guest',                   // 游客模式
  LOGGED_IN = 'logged_in'            // 已登录
}

/**
 * 应用视图枚举
 */
export enum AppView {
  LOGIN = 'login',               // 登录页面
  REGISTER = 'register',         // 注册页面
  MAIN = 'main'                  // 主页面
}

/**
 * 数据分析类型枚举
 */
export enum AnalysisDataType {
  TEMPERATURE = '温度',
  HUMIDITY = '湿度',
  SOIL_MOISTURE = '土壤湿度',
  LIGHT = '光照强度'
}

/**
 * 控制设备接口定义
 */
export interface ControlDevice {
  id: number;
  name: string;
  topic: string;                 // MQTT主题
  isActive: boolean;             // 是否激活
  isOnline: boolean;             // 在线状态
  area: string;                  // 所属区域
  deviceType: string;            // 设备类型（使用DeviceType枚举值）
}

/**
 * 分析数据接口定义
 */
export interface AnalysisData {
  date: string;                  // 日期
  temperature: number;           // 温度
  humidity: number;              // 湿度
  soilMoisture: number;          // 土壤湿度（当前用于光照强度）
  yield: number;                 // 产量
}

/**
 * 用户信息接口定义
 */
export interface UserProfile {
  id: number;
  avatar: string;
  username: string;
  phone: string;
  email: string;
  bio: string;
  user_mode: string;             // 使用UserMode枚举值
  is_admin?: number;             // 使用UserRole枚举值
}

/**
 * 菜单项接口定义
 */
export interface ProfileMenuItem {
  id: string;
  title: string;
  icon: string;
  hasArrow: boolean;
}

/**
 * 传感器数据接口定义
 */
export interface SensorData {
  temperature?: number;
  humidity?: number;
  lightIntensity?: number;
  waterDepth?: number;
  soilMoisture?: number;
}

/**
 * 设备统计信息接口
 */
export interface DeviceStatistics {
  total: number;                 // 总设备数
  online: number;                // 在线设备数
  active: number;                // 激活设备数
  offline: number;               // 离线设备数
}

