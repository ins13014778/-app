import http from "@ohos:net.http";
import preferences from "@ohos:data.preferences";
import type common from "@ohos:app.ability.common";
import { AppConfig } from "@normalized:N&&&entry/src/main/ets/config/AppConfig&";
/**
 * API响应接口定义 - 所有API响应的统一格式
 * @template T 响应数据的类型，默认为Record<string, Object>
 */
export interface ApiResponse<T = Record<string, Object>> {
    success: boolean; // 请求是否成功
    code: number; // 状态码（0=成功，其他=错误）
    message: string; // 响应消息
    data?: T; // 响应数据（可选）
    timestamp: string; // 响应时间戳
}
/**
 * 用户登录请求接口 - 用户登录时发送的数据
 */
export interface LoginRequest {
    login: string; // 用户名或邮箱（支持两种方式登录）
    password: string; // 密码
}
/**
 * 用户注册请求接口 - 用户注册时发送的数据
 */
export interface RegisterRequest {
    username: string; // 用户名（必填）
    email: string; // 邮箱（必填）
    phone?: string; // 手机号（可选）
    password: string; // 密码（必填）
}
/**
 * 用户信息接口 - 用户基本信息
 */
export interface UserInfo {
    id: number; // 用户ID
    username: string; // 用户名
    email: string; // 邮箱
    phone?: string; // 手机号（可选）
    avatar?: string; // 头像URL（可选）
    bio?: string; // 个人简介（可选）
    user_mode: string; // 用户模式（logged_in/guest）
    is_admin?: number; // 管理员标识（0=普通用户，1=管理员）
    created_at?: string; // 创建时间
    last_login?: string; // 最后登录时间
}
/**
 * 登录响应数据接口 - 登录成功后返回的数据
 */
export interface LoginResponse {
    user: UserInfo; // 用户信息
    token: string; // JWT令牌
    expires_in: number; // 令牌有效期（秒）
}
/**
 * 验证令牌响应接口 - 验证JWT令牌的结果
 */
export interface VerifyTokenResponse {
    valid: boolean; // 令牌是否有效
    user?: UserInfo; // 用户信息（令牌有效时返回）
}
/**
 * 登出响应接口 - 登出操作的结果
 */
export interface LogoutResponse {
    message: string; // 登出消息
}
/**
 * 用户配置接口 - 用户相关配置信息
 */
export interface UserConfig {
    bemfa_uid?: string; // 巴法云UID（可选）
    mqtt_config?: string; // MQTT配置（JSON字符串，可选）
}
/**
 * 更新用户配置请求 - 更新用户配置的请求数据
 */
export interface UpdateConfigRequest {
    bemfa_uid?: string; // 巴法云UID（可选）
    mqtt_config?: string; // MQTT配置（可选）
}
/**
 * 修改密码请求接口 - 修改密码的请求数据
 */
export interface ChangePasswordRequest {
    old_password: string; // 旧密码
    new_password: string; // 新密码
}
/**
 * 传感器数据上传请求接口 - 上传传感器数据的请求
 */
export interface SensorDataUploadRequest {
    user_id?: number; // 用户ID（可选）
    device_topic: string; // 设备主题（必填）
    temperature?: number; // 温度（可选）
    humidity?: number; // 湿度（可选）
    light_intensity?: number; // 光照强度（可选）
    water_depth?: number; // 水深（可选）
    soil_moisture?: number; // 土壤湿度（可选）
}
/**
 * 传感器数据批量上传请求接口 - 批量上传传感器数据
 */
export interface SensorDataBatchUploadRequest {
    user_id?: number; // 用户ID（可选）
    data: SensorDataUploadRequest[]; // 传感器数据数组
}
// 传感器数据响应接口
export interface SensorDataResponse {
    id?: number;
    device_topic: string;
    temperature?: string;
    humidity?: string;
    light_intensity?: string;
    water_depth?: string;
    soil_moisture?: string;
    created_at?: string;
}
// 传感器数据查询参数接口
export interface SensorDataQueryParams {
    device_topic?: string;
    user_id?: number;
    start_time?: string;
    end_time?: string;
    limit?: number;
    offset?: number;
}
// 传感器数据查询结果接口
export interface SensorDataQueryResult {
    total: number;
    records: SensorDataResponse[];
}
// 传感器数据统计参数接口
export interface SensorDataStatsParams {
    type: string; // 'today' | 'range'
    device_topic?: string;
    user_id?: number;
    limit?: number;
}
export class ApiService {
    private static instance: ApiService;
    private baseUrl: string = AppConfig.API_BASE_URL;
    private token: string = '';
    private preferencesStore: preferences.Preferences | null = null;
    private context: common.UIAbilityContext | null = null;
    constructor() {
        // 延迟加载token，等待context设置
    }
    /**
     * 设置应用上下文（必须在使用API前调用）
     */
    public setContext(context: common.UIAbilityContext): void {
        this.context = context;
        if (!this.token) {
            this.loadTokenFromStorage();
        }
    }
    /**
     * 从本地存储加载令牌
     */
    private async loadTokenFromStorage(): Promise<void> {
        try {
            if (!this.context) {
                console.warn('[ApiService] Context未设置，跳过加载令牌');
                return;
            }
            const dataPreferences = await preferences.getPreferences(this.context, 'user_data');
            const savedToken = await dataPreferences.get(AppConfig.TOKEN_STORAGE_KEY, '');
            this.token = savedToken as string;
        }
        catch (error) {
            console.error('加载令牌失败:', error);
        }
    }
    /**
     * 保存令牌到本地存储
     */
    private async saveTokenToStorage(token: string): Promise<void> {
        try {
            if (!this.context) {
                console.warn('[ApiService] Context未设置，跳过保存令牌');
                return;
            }
            const dataPreferences = await preferences.getPreferences(this.context, 'user_data');
            await dataPreferences.put(AppConfig.TOKEN_STORAGE_KEY, token);
            await dataPreferences.flush();
            this.token = token;
        }
        catch (error) {
            console.error('保存令牌失败:', error);
        }
    }
    /**
     * 清除本地存储的令牌
     */
    private async clearTokenFromStorage(): Promise<void> {
        try {
            if (!this.context) {
                console.warn('[ApiService] Context未设置，跳过清除令牌');
                return;
            }
            const dataPreferences = await preferences.getPreferences(this.context, 'user_data');
            await dataPreferences.delete(AppConfig.TOKEN_STORAGE_KEY);
            await dataPreferences.flush();
            this.token = '';
        }
        catch (error) {
            console.error('清除令牌失败:', error);
        }
    }
    /**
     * 设置服务器地址
     */
    public setBaseUrl(url: string): void {
        this.baseUrl = url;
    }
    /**
     * 通用HTTP请求方法
     */
    private async request<T>(endpoint: string, method: http.RequestMethod, data?: Object, requireAuth: boolean = false): Promise<ApiResponse<T>> {
        const httpRequest = http.createHttp();
        try {
            // 构建请求头
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            };
            // 如果需要认证且有令牌，添加Authorization头
            if (requireAuth && this.token) {
                headers['Authorization'] = `Bearer ${this.token}`;
            }
            // 构建请求选项
            const options: http.HttpRequestOptions = {
                method: method,
                header: headers,
                readTimeout: AppConfig.REQUEST_TIMEOUT,
                connectTimeout: AppConfig.REQUEST_TIMEOUT
            };
            // 如果有数据，添加到请求体
            if (data && (method === http.RequestMethod.POST || method === http.RequestMethod.PUT)) {
                options.extraData = JSON.stringify(data);
            }
            console.log(`发送API请求: ${method} ${this.baseUrl}/${endpoint}`);
            console.log('请求数据:', data);
            // 发送请求
            const response = await httpRequest.request(`${this.baseUrl}/${endpoint}`, options);
            console.log('响应状态码:', response.responseCode);
            console.log('响应数据:', response.result);
            // 解析响应
            if (response.responseCode === 200) {
                const result = JSON.parse(response.result as string) as ApiResponse<T>;
                return result;
            }
            else {
                // 处理HTTP错误状态码
                let errorMessage = '请求失败';
                try {
                    const errorResult = JSON.parse(response.result as string) as ApiResponse<Record<string, Object>>;
                    errorMessage = errorResult.message || errorMessage;
                }
                catch (e) {
                    errorMessage = `HTTP ${response.responseCode} 错误`;
                }
                return {
                    success: false,
                    code: response.responseCode,
                    message: errorMessage,
                    timestamp: new Date().toISOString()
                } as ApiResponse<T>;
            }
        }
        catch (error) {
            console.error('❌ 网络请求异常:', error);
            console.error('❌ 错误类型:', typeof error);
            console.error('❌ 错误详情:', JSON.stringify(error));
            // 尝试获取更详细的错误信息
            let errorMessage = '网络连接失败，请检查网络设置';
            if (error && typeof error === 'object') {
                const errorObj = error as Record<string, Object>;
                if (errorObj.message) {
                    errorMessage = `网络错误: ${errorObj.message}`;
                }
                else if (errorObj.code) {
                    errorMessage = `网络错误码: ${errorObj.code}`;
                }
            }
            return {
                success: false,
                code: -1,
                message: errorMessage,
                timestamp: new Date().toISOString()
            } as ApiResponse<T>;
        }
        finally {
            httpRequest.destroy();
        }
    }
    /**
     * 用户注册
     */
    public async register(userData: RegisterRequest): Promise<ApiResponse<LoginResponse>> {
        return this.request<LoginResponse>('register', http.RequestMethod.POST, userData);
    }
    /**
     * 用户登录
     */
    public async login(loginData: LoginRequest): Promise<ApiResponse<LoginResponse>> {
        const response = await this.request<LoginResponse>('login', http.RequestMethod.POST, loginData);
        // 如果登录成功，保存令牌
        if (response.success && response.data?.token) {
            await this.saveTokenToStorage(response.data.token);
        }
        return response;
    }
    /**
     * 获取用户信息
     */
    public async getProfile(): Promise<ApiResponse<UserInfo>> {
        return this.request<UserInfo>('profile', http.RequestMethod.GET, undefined, true);
    }
    /**
     * 更新用户信息
     */
    public async updateProfile(userData: Partial<UserInfo>): Promise<ApiResponse<UserInfo>> {
        return this.request<UserInfo>('profile', http.RequestMethod.PUT, userData, true);
    }
    /**
     * 验证令牌
     */
    public async verifyToken(): Promise<ApiResponse<VerifyTokenResponse>> {
        return this.request<VerifyTokenResponse>('verify', http.RequestMethod.POST, undefined, true);
    }
    /**
     * 用户登出
     */
    public async logout(): Promise<ApiResponse<LogoutResponse>> {
        const response = await this.request<LogoutResponse>('logout', http.RequestMethod.POST, undefined, true);
        // 无论成功与否，都清除本地令牌
        await this.clearTokenFromStorage();
        return response;
    }
    /**
     * 检查是否已登录（有有效令牌）
     */
    public hasToken(): boolean {
        return this.token.length > 0;
    }
    /**
     * 获取当前令牌
     */
    public getToken(): string {
        return this.token;
    }
    /**
     * 手动设置令牌
     */
    public async setToken(token: string): Promise<void> {
        await this.saveTokenToStorage(token);
    }
    /**
     * 清除令牌
     */
    public async clearToken(): Promise<void> {
        await this.clearTokenFromStorage();
    }
    /**
     * 保存用户配置（巴法云UID等）到云端
     */
    public async saveUserConfig(config: UpdateConfigRequest): Promise<ApiResponse<Record<string, Object>>> {
        console.info('[API] 保存用户配置到云端');
        return this.request<Record<string, Object>>('profile/config', http.RequestMethod.PUT, config, true);
    }
    /**
     * 从云端获取用户配置
     */
    public async getUserConfig(): Promise<ApiResponse<UserConfig>> {
        console.info('[API] 从云端获取用户配置');
        return this.request<UserConfig>('profile/config', http.RequestMethod.GET, undefined, true);
    }
    /**
     * 修改密码
     */
    public async changePassword(data: ChangePasswordRequest): Promise<ApiResponse<Record<string, Object>>> {
        console.info('[API] 修改密码');
        return this.request<Record<string, Object>>('profile/change-password.php', http.RequestMethod.POST, data, true);
    }
    /**
     * 上传单条传感器数据
     */
    public async uploadSensorData(data: SensorDataUploadRequest): Promise<ApiResponse<SensorDataResponse>> {
        console.info('[API] 上传传感器数据:', JSON.stringify(data));
        return this.request<SensorDataResponse>('sensor_data/endpoints/upload.php', http.RequestMethod.POST, data, false // 不需要认证
        );
    }
    /**
     * 批量上传传感器数据
     */
    public async batchUploadSensorData(data: SensorDataBatchUploadRequest): Promise<ApiResponse<Record<string, Object>>> {
        console.info('[API] 批量上传传感器数据，数量:', data.data.length);
        return this.request<Record<string, Object>>('sensor_data/endpoints/batch_upload.php', http.RequestMethod.POST, data, false);
    }
    /**
     * 查询传感器历史数据
     */
    public async querySensorData(params: SensorDataQueryParams): Promise<ApiResponse<SensorDataQueryResult>> {
        // 手动构建查询字符串，避免使用any类型
        const queryParts: string[] = [];
        if (params.device_topic !== undefined && params.device_topic !== null) {
            queryParts.push(`device_topic=${encodeURIComponent(params.device_topic)}`);
        }
        if (params.user_id !== undefined && params.user_id !== null) {
            queryParts.push(`user_id=${encodeURIComponent(String(params.user_id))}`);
        }
        if (params.start_time !== undefined && params.start_time !== null) {
            queryParts.push(`start_time=${encodeURIComponent(params.start_time)}`);
        }
        if (params.end_time !== undefined && params.end_time !== null) {
            queryParts.push(`end_time=${encodeURIComponent(params.end_time)}`);
        }
        if (params.limit !== undefined && params.limit !== null) {
            queryParts.push(`limit=${encodeURIComponent(String(params.limit))}`);
        }
        if (params.offset !== undefined && params.offset !== null) {
            queryParts.push(`offset=${encodeURIComponent(String(params.offset))}`);
        }
        const queryString = queryParts.join('&');
        console.info('[API] 查询传感器数据:', queryString);
        return this.request<SensorDataQueryResult>(`sensor_data/endpoints/query.php?${queryString}`, http.RequestMethod.GET, undefined, false);
    }
    /**
     * 获取最新传感器数据
     */
    public async getLatestSensorData(deviceTopic?: string, userId?: number): Promise<ApiResponse<SensorDataResponse>> {
        let queryString = '';
        if (deviceTopic) {
            queryString += `device_topic=${encodeURIComponent(deviceTopic)}`;
        }
        if (userId) {
            queryString += (queryString ? '&' : '') + `user_id=${userId}`;
        }
        const url = queryString ? `sensor_data/endpoints/latest.php?${queryString}` : 'sensor_data/endpoints/latest.php';
        console.info('[API] 获取最新传感器数据:', url);
        return this.request<SensorDataResponse>(url, http.RequestMethod.GET, undefined, false);
    }
    /**
     * 获取传感器数据统计
     */
    public async getSensorStats(params: SensorDataStatsParams): Promise<ApiResponse<Record<string, Object>>> {
        // 手动构建查询字符串，避免使用any类型
        const queryParts: string[] = [];
        if (params.type !== undefined && params.type !== null) {
            queryParts.push(`type=${encodeURIComponent(params.type)}`);
        }
        if (params.device_topic !== undefined && params.device_topic !== null) {
            queryParts.push(`device_topic=${encodeURIComponent(params.device_topic)}`);
        }
        if (params.user_id !== undefined && params.user_id !== null) {
            queryParts.push(`user_id=${encodeURIComponent(String(params.user_id))}`);
        }
        if (params.limit !== undefined && params.limit !== null) {
            queryParts.push(`limit=${encodeURIComponent(String(params.limit))}`);
        }
        const queryString = queryParts.join('&');
        console.info('[API] 获取传感器统计:', queryString);
        return this.request<Record<string, Object>>(`sensor_data/endpoints/stats.php?${queryString}`, http.RequestMethod.GET, undefined, false);
    }
}
// 导出单例实例
export const apiService = new ApiService();
