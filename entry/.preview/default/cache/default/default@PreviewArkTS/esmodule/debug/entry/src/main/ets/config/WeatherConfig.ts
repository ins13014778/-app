/**
 * 易客天气API配置
 */
export class WeatherConfig {
    // API基础URL
    static readonly BASE_URL = 'http://v1.yiketianqi.com/free/day';
    // API认证信息
    static readonly APP_ID = '97949776';
    static readonly APP_SECRET = 'pnkOL4yQ';
    // 默认城市（可以不传，API会根据IP自动识别）
    static readonly DEFAULT_CITY = '郑州';
    // 请求超时时间（毫秒）
    static readonly REQUEST_TIMEOUT = 10000;
}
