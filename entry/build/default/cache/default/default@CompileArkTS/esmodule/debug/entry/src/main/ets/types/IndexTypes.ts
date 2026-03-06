/**
 * Index页面相关的类型定义
 */
// 控制设备类定义（支持响应式更新）
@Observed
export class ControlDevice {
    id: number = 0;
    name: string = '';
    topic: string = ''; // MQTT主题
    isActive: boolean = false;
    isOnline: boolean = false; // 在线状态
    area: string = '';
    deviceType: string = ''; // 设备类型
    constructor(id?: number, name?: string, topic?: string, isActive?: boolean, isOnline?: boolean, area?: string, deviceType?: string) {
        if (id !== undefined)
            this.id = id;
        if (name !== undefined)
            this.name = name;
        if (topic !== undefined)
            this.topic = topic;
        if (isActive !== undefined)
            this.isActive = isActive;
        if (isOnline !== undefined)
            this.isOnline = isOnline;
        if (area !== undefined)
            this.area = area;
        if (deviceType !== undefined)
            this.deviceType = deviceType;
    }
}
// 分析数据接口定义
export interface AnalysisData {
    date: string;
    temperature: number;
    humidity: number;
    soilMoisture: number;
    yield: number;
}
// AI消息接口
export interface AIMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
    imageUri?: string;
    fileId?: string;
}
// 用户信息接口定义
export interface UserProfile {
    id: number;
    avatar: string;
    username: string;
    phone: string;
    email: string;
    bio: string;
    user_mode: string;
    is_admin?: number;
}
// 菜单项接口定义
export interface ProfileMenuItem {
    id: string;
    title: string;
    icon: string;
    hasArrow: boolean;
}
