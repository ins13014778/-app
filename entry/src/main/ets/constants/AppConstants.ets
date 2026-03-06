/**
 * 应用常量定义
 * @description 定义应用中使用的常量值
 * @since API version 12
 */

import { ProfileMenuItem } from '../types/AppTypes';

interface LinearGradientOptions {
  angle: number;
  colors: Array<[number, number]>;
}

/**
 * 颜色常量
 */
export class AppColors {
  // 主题色
  static readonly PRIMARY_COLOR: string = '#34C759';           // 主色调（浅苹果绿）
  static readonly PRIMARY_LIGHT: string = '#E6F8EC';           // 主色调浅色
  static readonly ACCENT_COLOR: string = '#34A853';            // 强调色（浅绿色系）

  static readonly APP_BG: string = '#F2F2F7';
  static readonly SURFACE: string = '#FFFFFF';
  static readonly SURFACE_ALT: string = '#F5F5F7';
  static readonly SEPARATOR: string = '#E5E5EA';
  
  // 文本颜色
  static readonly TEXT_PRIMARY: string = '#333333';            // 主文本
  static readonly TEXT_SECONDARY: string = '#666666';          // 次要文本
  static readonly TEXT_TERTIARY: string = '#999999';           // 三级文本
  static readonly TEXT_PLACEHOLDER: string = '#CCCCCC';        // 占位符文本
  
  // 背景颜色
  static readonly BG_PRIMARY: string = '#F1FAF3';              // 主背景
  static readonly BG_SECONDARY: string = '#E6F5EA';            // 次要背景
  static readonly BG_TERTIARY: string = '#DCF0E1';             // 三级背景
  static readonly BG_GRADIENT: LinearGradientOptions = {
    angle: 180,
    colors: [[0xF6FFF9, 0.0], [0xE6F8EB, 0.5], [0xD2F1DB, 1.0]]
  };
  
  // 状态颜色
  static readonly SUCCESS_COLOR: string = '#52C41A';           // 成功
  static readonly WARNING_COLOR: string = '#FAAD14';           // 警告
  static readonly ERROR_COLOR: string = '#FF4D4F';             // 错误
  static readonly INFO_COLOR: string = '#1890FF';              // 信息
  
  // 设备状态颜色
  static readonly DEVICE_ONLINE: string = '#52C41A';           // 在线
  static readonly DEVICE_OFFLINE: string = '#D9D9D9';          // 离线
  static readonly DEVICE_ACTIVE: string = '#1890FF';           // 激活
}

/**
 * 字体大小常量
 */
export class FontSizes {
  static readonly SMALL: number = 12;
  static readonly NORMAL: number = 14;
  static readonly MEDIUM: number = 16;
  static readonly LARGE: number = 18;
  static readonly XLARGE: number = 20;
  static readonly XXLARGE: number = 24;
  static readonly TITLE: number = 28;
}

/**
 * 间距常量
 */
export class Spacing {
  static readonly XS: number = 4;
  static readonly SM: number = 8;
  static readonly MD: number = 12;
  static readonly LG: number = 16;
  static readonly XL: number = 20;
  static readonly XXL: number = 24;
}

/**
 * 圆角常量
 */
export class BorderRadius {
  static readonly SMALL: number = 4;
  static readonly MEDIUM: number = 8;
  static readonly LARGE: number = 12;
  static readonly XLARGE: number = 16;
  static readonly ROUND: number = 999;
}

/**
 * 定时器间隔常量（毫秒）
 */
export class TimerIntervals {
  static readonly DATE_UPDATE: number = 60000;                 // 日期更新间隔（1分钟）
  static readonly DATA_REFRESH: number = 5000;                 // 数据刷新间隔（5秒）
  static readonly SENSOR_REFRESH: number = 30000;              // 传感器数据刷新（30秒）
  static readonly MQTT_RECONNECT: number = 5000;               // MQTT重连间隔（5秒）
}

/**
 * 个人中心菜单配置
 */
export class ProfileMenuConfig {
  static readonly MENU_ITEMS: ProfileMenuItem[] = [
    {
      id: 'profile',
      title: '个人资料',
      icon: '个人资料.png',
      hasArrow: true
    },
    {
      id: 'edit',
      title: '编辑资料',
      icon: '编辑资料.png',
      hasArrow: true
    },
    {
      id: 'password',
      title: '修改密码',
      icon: '修改密码.png',
      hasArrow: true
    },
    {
      id: 'help',
      title: '帮助与反馈',
      icon: '帮助与反馈.png',
      hasArrow: true
    },
    {
      id: 'about',
      title: '关于我们',
      icon: '关于我们.png',
      hasArrow: true
    },
    {
      id: 'logout',
      title: '退出登录',
      icon: '退出登录.png',
      hasArrow: false
    }
  ];
}

/**
 * 验证规则常量
 */
export class ValidationRules {
  static readonly USERNAME_MIN_LENGTH: number = 3;
  static readonly USERNAME_MAX_LENGTH: number = 50;
  static readonly PASSWORD_MIN_LENGTH: number = 6;
  static readonly PASSWORD_MAX_LENGTH: number = 20;
  static readonly PHONE_LENGTH: number = 11;
}

/**
 * 传感器数据范围常量
 */
export class SensorRanges {
  // 温度范围（摄氏度）
  static readonly TEMP_MIN: number = -20;
  static readonly TEMP_MAX: number = 60;
  static readonly TEMP_OPTIMAL_MIN: number = 15;
  static readonly TEMP_OPTIMAL_MAX: number = 30;
  
  // 湿度范围（百分比）
  static readonly HUMIDITY_MIN: number = 0;
  static readonly HUMIDITY_MAX: number = 100;
  static readonly HUMIDITY_OPTIMAL_MIN: number = 40;
  static readonly HUMIDITY_OPTIMAL_MAX: number = 70;
  
  // 光照强度范围（Lux）
  static readonly LIGHT_MIN: number = 0;
  static readonly LIGHT_MAX: number = 100000;
  static readonly LIGHT_OPTIMAL_MIN: number = 500;
  static readonly LIGHT_OPTIMAL_MAX: number = 10000;
}

/**
 * 默认配置常量
 */
export class DefaultConfig {
  static readonly DEFAULT_AVATAR: string = '👤';
  static readonly DEFAULT_BIO: string = '智慧农业用户';
  static readonly DEFAULT_DEVICE_TOPIC: string = 'farm001';
  static readonly DEFAULT_QUERY_LIMIT: number = 100;
  static readonly DEFAULT_STATS_DAYS: number = 7;
}

