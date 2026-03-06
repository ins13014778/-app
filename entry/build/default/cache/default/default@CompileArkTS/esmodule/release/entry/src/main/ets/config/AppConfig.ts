/**
 * 应用配置文件
 * 用于管理API服务器地址和其他全局配置
 */
export class AppConfig {
    // API服务器基础URL - 请根据实际部署情况修改
    // 本地测试环境（使用宝塔部署的API地址）
    static readonly LOCAL_API_BASE_URL = 'http://hm.zybbq.xyz/api';
    // 生产环境 - HTTPS版本（配置SSL证书后使用）
    static readonly PRODUCTION_API_BASE_URL = 'https://hm.zybbq.xyz/api';
    // 当前使用的API基础URL
    static readonly API_BASE_URL = AppConfig.PRODUCTION_API_BASE_URL;
    // 请求超时时间（毫秒）
    static readonly REQUEST_TIMEOUT = 10000;
    // JWT令牌存储键名
    static readonly TOKEN_STORAGE_KEY = 'auth_token';
    // 用户信息存储键名
    static readonly USER_INFO_STORAGE_KEY = 'user_info';
    // 应用版本
    static readonly APP_VERSION = '1.0.0';
    // 调试模式
    static readonly DEBUG_MODE = true;
    static readonly IOTDA_ENDPOINT = 'https://7bd4f4f359.st1.iotda-app.cn-north-4.myhuaweicloud.com:443';
    static readonly IOTDA_PROJECT_ID = '2ce7e0ea9b0944aea6191500c6390566';
    static readonly IOTDA_INSTANCE_ID = '9d867610-089e-4504-9960-3730eb6a8e48';
    static readonly IOTDA_APP_ID = '';
    // 注意：不在代码中保留任何调试用 Subject Token，避免泄露敏感信息
    static readonly IOTDA_DEBUG_DEVICE_ID = '690952c3e41f2979315e6b30_xianshiping-2';
    // 华为云 IAM 获取 Token 的必填参数说明：
    // - IAM_ENDPOINT：IAM 服务地址，例如 https://iam.cn-north-4.myhuaweicloud.com
    // - IAM_DOMAIN_NAME：账号所属域名（华为云账户名或企业域名）
    // - IAM_USER_NAME：IAM 用户名
    // - IAM_PASSWORD：IAM 用户密码
    // 作用域（二选一，至少填一个，用于 scope.project）：
    // - IAM_REGION_NAME：区域名，如 cn-north-4（请求体使用 project.name）
    // - IAM_PROJECT_ID：项目 ID（请求体使用 project.id）
    // 请求地址：{IAM_ENDPOINT}/v3/auth/tokens，成功后 Token 位于响应头 X-Subject-Token/x-subject-token
    static readonly IAM_ENDPOINT = 'https://iam.cn-north-4.myhuaweicloud.com';
    static readonly IAM_DOMAIN_NAME = 'a-cao1';
    static readonly IAM_USER_NAME = 'czp18646767830';
    static readonly IAM_PASSWORD = 'czp123..';
    static readonly IAM_REGION_NAME = 'cn-north-4';
    static readonly IAM_PROJECT_ID = '2ce7e0ea9b0944aea6191500c6390566';
}
/**
 * Coze AI配置
 */
export class CozeConfig {
    // Coze API基础URL
    static readonly BASE_URL = 'https://api.coze.cn';
    // Coze Access Token
    static readonly ACCESS_TOKEN = 'pat_Pk9PtZWyFz7tjB1JTpX1FiL8P0QTnGih5lwOhUH6AOyLyPZPOTBJIgfWMbssETJq';
    // Bot ID
    static readonly BOT_ID = '7565068393922445338';
    // 默认用户ID
    static readonly DEFAULT_USER_ID = '123456789';
    // 连接超时（毫秒）
    static readonly CONNECT_TIMEOUT = 30000;
    // 读取超时（毫秒）
    static readonly READ_TIMEOUT = 60000;
    // 快速回复问题
    static readonly QUICK_REPLIES = [
        '现在温度是多少？',
        '湿度情况如何？',
        '光照强度正常吗？',
        '需要浇水吗？',
        '帮我分析一下环境数据'
    ];
}
/**
 * 网络请求配置
 */
export interface RequestConfig {
    timeout?: number;
    headers?: Record<string, string>;
    retryCount?: number;
}
/**
 * 默认请求配置
 */
export const DEFAULT_REQUEST_CONFIG: RequestConfig = {
    timeout: AppConfig.REQUEST_TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    retryCount: 3
};
