if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Index_Params {
    soilHumidity?: number;
    temperature?: number;
    lightIntensity?: number;
    lastTempValue?: number;
    lastHumValue?: number;
    lastLightValue?: number;
    date?: string;
    lastUpdateTime?: string;
    todayMaxTemp?: number;
    todayMinTemp?: number;
    todayMaxHumidity?: number;
    todayMinHumidity?: number;
    currentIndex?: number;
    isLoggedIn?: boolean;
    userMode?: string;
    currentView?: string;
    username?: string;
    password?: string;
    confirmPassword?: string;
    email?: string;
    phone?: string;
    isLoading?: boolean;
    errorMessage?: string;
    successMessage?: string;
    userProfile?: UserProfile;
    controlDevices?: ControlDevice[];
    activeDeviceCount?: number;
    onlineDeviceCount?: number;
    mqttStatus?: MqttStatus;
    mqttStatusText?: string;
    bemfaUID?: string;
    showEditNameDialog?: boolean;
    editingDevice?: ControlDevice | null;
    newDeviceName?: string;
    sensorDataList?: SensorData[];
    aiMessages?: AIMessage[];
    aiInputText?: string;
    isAILoading?: boolean;
    aiQuickQuestions?: string[];
    aiChatScroller?: Scroller;
    pendingImageUri?: string;
    analysisData?: AnalysisData[];
    selectedDataType?: string;
    menuItems?: ProfileMenuItem[];
    dateTimerID?: number;
    dataRefreshTimerID?: number;
    sensorDataRefreshTimerID?: number;
}
import { apiService } from "@normalized:N&&&entry/src/main/ets/services/ApiService&";
import type { SensorDataUploadRequest } from "@normalized:N&&&entry/src/main/ets/services/ApiService&";
import { mqttService, MqttStatus } from "@normalized:N&&&entry/src/main/ets/services/MqttService&";
import type { MqttMessage } from "@normalized:N&&&entry/src/main/ets/services/MqttService&";
import { bemfaCloudService } from "@normalized:N&&&entry/src/main/ets/services/BemfaCloudService&";
import type { TopicDetail } from "@normalized:N&&&entry/src/main/ets/services/BemfaCloudService&";
import cozeService from "@normalized:N&&&entry/src/main/ets/services/CozeService&";
import picker from "@ohos:file.picker";
import type common from "@ohos:app.ability.common";
import { BemfaConfig } from "@normalized:N&&&entry/src/main/ets/config/BemfaConfig&";
import promptAction from "@ohos:promptAction";
import preferences from "@ohos:data.preferences";
import hilog from "@ohos:hilog";
import { AppColors } from "@normalized:N&&&entry/src/main/ets/constants/AppConstants&";
import { ControlDevice } from "@normalized:N&&&entry/src/main/ets/types/IndexTypes&";
import type { AnalysisData, AIMessage, UserProfile, ProfileMenuItem } from "@normalized:N&&&entry/src/main/ets/types/IndexTypes&";
import { HomePage } from "@normalized:N&&&entry/src/main/ets/components/home/HomePage&";
import { ControlPage } from "@normalized:N&&&entry/src/main/ets/components/control/ControlPage&";
import { AnalysisPage } from "@normalized:N&&&entry/src/main/ets/components/analysis/AnalysisPage&";
import { ProfilePage } from "@normalized:N&&&entry/src/main/ets/components/profile/ProfilePage&";
import { LoginPage } from "@normalized:N&&&entry/src/main/ets/components/common/LoginPage&";
import { RegisterPage } from "@normalized:N&&&entry/src/main/ets/components/common/RegisterPage&";
import { EditDeviceNameDialog } from "@normalized:N&&&entry/src/main/ets/components/common/EditDeviceNameDialog&";
import type { SensorData } from '../components/control/SensorDataCard';
const DOMAIN = 0x0101;
const TAG_INDEX = 'Index';
/**
 * 传感器主题配置接口
 * 定义传感器的基本信息：主题、名称、单位、图标和颜色
 */
interface SensorTopicConfig {
    topic: string; // MQTT主题名称
    name: string; // 传感器显示名称
    unit: string; // 数据单位（如°C、%、Lx等）
    icon: string; // 图标emoji
    color: string; // 显示颜色（十六进制）
}
/**
 * 简化的传感器主题配置（仅用于首页刷新）
 * 只包含主题和名称，用于快速获取传感器数据
 */
interface SimpleSensorTopic {
    topic: string; // MQTT主题名称
    name: string; // 传感器显示名称
}
/**
 * 设备状态接口
 * 记录设备的在线状态和最后消息
 */
interface DeviceStatus {
    online: boolean; // 设备是否在线
    msg: string; // 设备最后发送的消息
}
/**
 * 设备控制命令接口
 * 定义设备的开关命令（支持不同类型的设备）
 */
interface DeviceCommand {
    on: string; // 开启命令（如：on、pump_on、auto_on）
    off: string; // 关闭命令（如：off、pump_off、auto_off）
}
class Index extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__soilHumidity = new ObservedPropertySimplePU(0, this, "soilHumidity");
        this.__temperature = new ObservedPropertySimplePU(0, this, "temperature");
        this.__lightIntensity = new ObservedPropertySimplePU(0, this, "lightIntensity");
        this.__lastTempValue = new ObservedPropertySimplePU(0, this, "lastTempValue");
        this.__lastHumValue = new ObservedPropertySimplePU(0, this, "lastHumValue");
        this.__lastLightValue = new ObservedPropertySimplePU(0, this, "lastLightValue");
        this.__date = new ObservedPropertySimplePU('10月10日', this, "date");
        this.__lastUpdateTime = new ObservedPropertySimplePU('--:--', this, "lastUpdateTime");
        this.__todayMaxTemp = new ObservedPropertySimplePU(0, this, "todayMaxTemp");
        this.__todayMinTemp = new ObservedPropertySimplePU(0, this, "todayMinTemp");
        this.__todayMaxHumidity = new ObservedPropertySimplePU(0, this, "todayMaxHumidity");
        this.__todayMinHumidity = new ObservedPropertySimplePU(0, this, "todayMinHumidity");
        this.__currentIndex = new ObservedPropertySimplePU(0, this, "currentIndex");
        this.__isLoggedIn = new ObservedPropertySimplePU(false, this, "isLoggedIn");
        this.__userMode = new ObservedPropertySimplePU('guest', this, "userMode");
        this.__currentView = new ObservedPropertySimplePU('main', this, "currentView");
        this.__username = new ObservedPropertySimplePU('', this, "username");
        this.__password = new ObservedPropertySimplePU('', this, "password");
        this.__confirmPassword = new ObservedPropertySimplePU('', this, "confirmPassword");
        this.__email = new ObservedPropertySimplePU('', this, "email");
        this.__phone = new ObservedPropertySimplePU('', this, "phone");
        this.__isLoading = new ObservedPropertySimplePU(false, this, "isLoading");
        this.__errorMessage = new ObservedPropertySimplePU('', this, "errorMessage");
        this.__successMessage = new ObservedPropertySimplePU('', this, "successMessage");
        this.__userProfile = new ObservedPropertyObjectPU({
            id: 0,
            username: '',
            email: '',
            phone: '',
            avatar: '👤',
            bio: '智慧农业用户',
            user_mode: 'guest',
            is_admin: 0 // 是否为管理员（0=普通用户，1=管理员）
        }, this, "userProfile");
        this.__controlDevices = new ObservedPropertyObjectPU([], this, "controlDevices");
        this.__activeDeviceCount = new ObservedPropertySimplePU(0, this, "activeDeviceCount");
        this.__onlineDeviceCount = new ObservedPropertySimplePU(0, this, "onlineDeviceCount");
        this.__mqttStatus = new ObservedPropertySimplePU(MqttStatus.DISCONNECTED, this, "mqttStatus");
        this.__mqttStatusText = new ObservedPropertySimplePU('未连接', this, "mqttStatusText");
        this.__bemfaUID = new ObservedPropertySimplePU('', this, "bemfaUID");
        this.__showEditNameDialog = new ObservedPropertySimplePU(false, this, "showEditNameDialog");
        this.__editingDevice = new ObservedPropertyObjectPU(null, this, "editingDevice");
        this.__newDeviceName = new ObservedPropertySimplePU('', this, "newDeviceName");
        this.__sensorDataList = new ObservedPropertyObjectPU([], this, "sensorDataList");
        this.__aiMessages = new ObservedPropertyObjectPU([], this, "aiMessages");
        this.__aiInputText = new ObservedPropertySimplePU('', this, "aiInputText");
        this.__isAILoading = new ObservedPropertySimplePU(false, this, "isAILoading");
        this.__aiQuickQuestions = new ObservedPropertyObjectPU([], this, "aiQuickQuestions");
        this.aiChatScroller = new Scroller();
        this.__pendingImageUri = new ObservedPropertySimplePU('', this, "pendingImageUri");
        this.__analysisData = new ObservedPropertyObjectPU([], this, "analysisData");
        this.__selectedDataType = new ObservedPropertySimplePU('温度', this, "selectedDataType");
        this.__menuItems = new ObservedPropertyObjectPU([
            { id: 'settings', title: '温室设置', icon: '系统设置.png', hasArrow: true },
            { id: 'help', title: '帮助与反馈', icon: '帮助与反馈.png', hasArrow: true },
            { id: 'about', title: '关于我们', icon: '关于我们.png', hasArrow: true },
            { id: 'logout', title: '退出登录', icon: '退出登录.png', hasArrow: false }
        ], this, "menuItems");
        this.dateTimerID = -1;
        this.dataRefreshTimerID = -1;
        this.sensorDataRefreshTimerID = -1;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Index_Params) {
        if (params.soilHumidity !== undefined) {
            this.soilHumidity = params.soilHumidity;
        }
        if (params.temperature !== undefined) {
            this.temperature = params.temperature;
        }
        if (params.lightIntensity !== undefined) {
            this.lightIntensity = params.lightIntensity;
        }
        if (params.lastTempValue !== undefined) {
            this.lastTempValue = params.lastTempValue;
        }
        if (params.lastHumValue !== undefined) {
            this.lastHumValue = params.lastHumValue;
        }
        if (params.lastLightValue !== undefined) {
            this.lastLightValue = params.lastLightValue;
        }
        if (params.date !== undefined) {
            this.date = params.date;
        }
        if (params.lastUpdateTime !== undefined) {
            this.lastUpdateTime = params.lastUpdateTime;
        }
        if (params.todayMaxTemp !== undefined) {
            this.todayMaxTemp = params.todayMaxTemp;
        }
        if (params.todayMinTemp !== undefined) {
            this.todayMinTemp = params.todayMinTemp;
        }
        if (params.todayMaxHumidity !== undefined) {
            this.todayMaxHumidity = params.todayMaxHumidity;
        }
        if (params.todayMinHumidity !== undefined) {
            this.todayMinHumidity = params.todayMinHumidity;
        }
        if (params.currentIndex !== undefined) {
            this.currentIndex = params.currentIndex;
        }
        if (params.isLoggedIn !== undefined) {
            this.isLoggedIn = params.isLoggedIn;
        }
        if (params.userMode !== undefined) {
            this.userMode = params.userMode;
        }
        if (params.currentView !== undefined) {
            this.currentView = params.currentView;
        }
        if (params.username !== undefined) {
            this.username = params.username;
        }
        if (params.password !== undefined) {
            this.password = params.password;
        }
        if (params.confirmPassword !== undefined) {
            this.confirmPassword = params.confirmPassword;
        }
        if (params.email !== undefined) {
            this.email = params.email;
        }
        if (params.phone !== undefined) {
            this.phone = params.phone;
        }
        if (params.isLoading !== undefined) {
            this.isLoading = params.isLoading;
        }
        if (params.errorMessage !== undefined) {
            this.errorMessage = params.errorMessage;
        }
        if (params.successMessage !== undefined) {
            this.successMessage = params.successMessage;
        }
        if (params.userProfile !== undefined) {
            this.userProfile = params.userProfile;
        }
        if (params.controlDevices !== undefined) {
            this.controlDevices = params.controlDevices;
        }
        if (params.activeDeviceCount !== undefined) {
            this.activeDeviceCount = params.activeDeviceCount;
        }
        if (params.onlineDeviceCount !== undefined) {
            this.onlineDeviceCount = params.onlineDeviceCount;
        }
        if (params.mqttStatus !== undefined) {
            this.mqttStatus = params.mqttStatus;
        }
        if (params.mqttStatusText !== undefined) {
            this.mqttStatusText = params.mqttStatusText;
        }
        if (params.bemfaUID !== undefined) {
            this.bemfaUID = params.bemfaUID;
        }
        if (params.showEditNameDialog !== undefined) {
            this.showEditNameDialog = params.showEditNameDialog;
        }
        if (params.editingDevice !== undefined) {
            this.editingDevice = params.editingDevice;
        }
        if (params.newDeviceName !== undefined) {
            this.newDeviceName = params.newDeviceName;
        }
        if (params.sensorDataList !== undefined) {
            this.sensorDataList = params.sensorDataList;
        }
        if (params.aiMessages !== undefined) {
            this.aiMessages = params.aiMessages;
        }
        if (params.aiInputText !== undefined) {
            this.aiInputText = params.aiInputText;
        }
        if (params.isAILoading !== undefined) {
            this.isAILoading = params.isAILoading;
        }
        if (params.aiQuickQuestions !== undefined) {
            this.aiQuickQuestions = params.aiQuickQuestions;
        }
        if (params.aiChatScroller !== undefined) {
            this.aiChatScroller = params.aiChatScroller;
        }
        if (params.pendingImageUri !== undefined) {
            this.pendingImageUri = params.pendingImageUri;
        }
        if (params.analysisData !== undefined) {
            this.analysisData = params.analysisData;
        }
        if (params.selectedDataType !== undefined) {
            this.selectedDataType = params.selectedDataType;
        }
        if (params.menuItems !== undefined) {
            this.menuItems = params.menuItems;
        }
        if (params.dateTimerID !== undefined) {
            this.dateTimerID = params.dateTimerID;
        }
        if (params.dataRefreshTimerID !== undefined) {
            this.dataRefreshTimerID = params.dataRefreshTimerID;
        }
        if (params.sensorDataRefreshTimerID !== undefined) {
            this.sensorDataRefreshTimerID = params.sensorDataRefreshTimerID;
        }
    }
    updateStateVars(params: Index_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__soilHumidity.purgeDependencyOnElmtId(rmElmtId);
        this.__temperature.purgeDependencyOnElmtId(rmElmtId);
        this.__lightIntensity.purgeDependencyOnElmtId(rmElmtId);
        this.__lastTempValue.purgeDependencyOnElmtId(rmElmtId);
        this.__lastHumValue.purgeDependencyOnElmtId(rmElmtId);
        this.__lastLightValue.purgeDependencyOnElmtId(rmElmtId);
        this.__date.purgeDependencyOnElmtId(rmElmtId);
        this.__lastUpdateTime.purgeDependencyOnElmtId(rmElmtId);
        this.__todayMaxTemp.purgeDependencyOnElmtId(rmElmtId);
        this.__todayMinTemp.purgeDependencyOnElmtId(rmElmtId);
        this.__todayMaxHumidity.purgeDependencyOnElmtId(rmElmtId);
        this.__todayMinHumidity.purgeDependencyOnElmtId(rmElmtId);
        this.__currentIndex.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoggedIn.purgeDependencyOnElmtId(rmElmtId);
        this.__userMode.purgeDependencyOnElmtId(rmElmtId);
        this.__currentView.purgeDependencyOnElmtId(rmElmtId);
        this.__username.purgeDependencyOnElmtId(rmElmtId);
        this.__password.purgeDependencyOnElmtId(rmElmtId);
        this.__confirmPassword.purgeDependencyOnElmtId(rmElmtId);
        this.__email.purgeDependencyOnElmtId(rmElmtId);
        this.__phone.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
        this.__errorMessage.purgeDependencyOnElmtId(rmElmtId);
        this.__successMessage.purgeDependencyOnElmtId(rmElmtId);
        this.__userProfile.purgeDependencyOnElmtId(rmElmtId);
        this.__controlDevices.purgeDependencyOnElmtId(rmElmtId);
        this.__activeDeviceCount.purgeDependencyOnElmtId(rmElmtId);
        this.__onlineDeviceCount.purgeDependencyOnElmtId(rmElmtId);
        this.__mqttStatus.purgeDependencyOnElmtId(rmElmtId);
        this.__mqttStatusText.purgeDependencyOnElmtId(rmElmtId);
        this.__bemfaUID.purgeDependencyOnElmtId(rmElmtId);
        this.__showEditNameDialog.purgeDependencyOnElmtId(rmElmtId);
        this.__editingDevice.purgeDependencyOnElmtId(rmElmtId);
        this.__newDeviceName.purgeDependencyOnElmtId(rmElmtId);
        this.__sensorDataList.purgeDependencyOnElmtId(rmElmtId);
        this.__aiMessages.purgeDependencyOnElmtId(rmElmtId);
        this.__aiInputText.purgeDependencyOnElmtId(rmElmtId);
        this.__isAILoading.purgeDependencyOnElmtId(rmElmtId);
        this.__aiQuickQuestions.purgeDependencyOnElmtId(rmElmtId);
        this.__pendingImageUri.purgeDependencyOnElmtId(rmElmtId);
        this.__analysisData.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedDataType.purgeDependencyOnElmtId(rmElmtId);
        this.__menuItems.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__soilHumidity.aboutToBeDeleted();
        this.__temperature.aboutToBeDeleted();
        this.__lightIntensity.aboutToBeDeleted();
        this.__lastTempValue.aboutToBeDeleted();
        this.__lastHumValue.aboutToBeDeleted();
        this.__lastLightValue.aboutToBeDeleted();
        this.__date.aboutToBeDeleted();
        this.__lastUpdateTime.aboutToBeDeleted();
        this.__todayMaxTemp.aboutToBeDeleted();
        this.__todayMinTemp.aboutToBeDeleted();
        this.__todayMaxHumidity.aboutToBeDeleted();
        this.__todayMinHumidity.aboutToBeDeleted();
        this.__currentIndex.aboutToBeDeleted();
        this.__isLoggedIn.aboutToBeDeleted();
        this.__userMode.aboutToBeDeleted();
        this.__currentView.aboutToBeDeleted();
        this.__username.aboutToBeDeleted();
        this.__password.aboutToBeDeleted();
        this.__confirmPassword.aboutToBeDeleted();
        this.__email.aboutToBeDeleted();
        this.__phone.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
        this.__errorMessage.aboutToBeDeleted();
        this.__successMessage.aboutToBeDeleted();
        this.__userProfile.aboutToBeDeleted();
        this.__controlDevices.aboutToBeDeleted();
        this.__activeDeviceCount.aboutToBeDeleted();
        this.__onlineDeviceCount.aboutToBeDeleted();
        this.__mqttStatus.aboutToBeDeleted();
        this.__mqttStatusText.aboutToBeDeleted();
        this.__bemfaUID.aboutToBeDeleted();
        this.__showEditNameDialog.aboutToBeDeleted();
        this.__editingDevice.aboutToBeDeleted();
        this.__newDeviceName.aboutToBeDeleted();
        this.__sensorDataList.aboutToBeDeleted();
        this.__aiMessages.aboutToBeDeleted();
        this.__aiInputText.aboutToBeDeleted();
        this.__isAILoading.aboutToBeDeleted();
        this.__aiQuickQuestions.aboutToBeDeleted();
        this.__pendingImageUri.aboutToBeDeleted();
        this.__analysisData.aboutToBeDeleted();
        this.__selectedDataType.aboutToBeDeleted();
        this.__menuItems.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    // ========== 传感器数据状态 ==========
    // 这些状态变量用于存储从传感器获取的实时数据
    private __soilHumidity: ObservedPropertySimplePU<number>; // 土壤湿度（百分比）
    get soilHumidity() {
        return this.__soilHumidity.get();
    }
    set soilHumidity(newValue: number) {
        this.__soilHumidity.set(newValue);
    }
    private __temperature: ObservedPropertySimplePU<number>; // 环境温度（摄氏度）
    get temperature() {
        return this.__temperature.get();
    }
    set temperature(newValue: number) {
        this.__temperature.set(newValue);
    }
    private __lightIntensity: ObservedPropertySimplePU<number>; // 光照强度（勒克斯）
    get lightIntensity() {
        return this.__lightIntensity.get();
    }
    set lightIntensity(newValue: number) {
        this.__lightIntensity.set(newValue);
    }
    private __lastTempValue: ObservedPropertySimplePU<number>; // 上次温度值（用于比较变化）
    get lastTempValue() {
        return this.__lastTempValue.get();
    }
    set lastTempValue(newValue: number) {
        this.__lastTempValue.set(newValue);
    }
    private __lastHumValue: ObservedPropertySimplePU<number>; // 上次湿度值（用于比较变化）
    get lastHumValue() {
        return this.__lastHumValue.get();
    }
    set lastHumValue(newValue: number) {
        this.__lastHumValue.set(newValue);
    }
    private __lastLightValue: ObservedPropertySimplePU<number>; // 上次光照值（用于比较变化）
    get lastLightValue() {
        return this.__lastLightValue.get();
    }
    set lastLightValue(newValue: number) {
        this.__lastLightValue.set(newValue);
    }
    private __date: ObservedPropertySimplePU<string>; // 当前日期
    get date() {
        return this.__date.get();
    }
    set date(newValue: string) {
        this.__date.set(newValue);
    }
    private __lastUpdateTime: ObservedPropertySimplePU<string>; // 最后更新时间
    get lastUpdateTime() {
        return this.__lastUpdateTime.get();
    }
    set lastUpdateTime(newValue: string) {
        this.__lastUpdateTime.set(newValue);
    }
    private __todayMaxTemp: ObservedPropertySimplePU<number>; // 今日最高温度
    get todayMaxTemp() {
        return this.__todayMaxTemp.get();
    }
    set todayMaxTemp(newValue: number) {
        this.__todayMaxTemp.set(newValue);
    }
    private __todayMinTemp: ObservedPropertySimplePU<number>; // 今日最低温度
    get todayMinTemp() {
        return this.__todayMinTemp.get();
    }
    set todayMinTemp(newValue: number) {
        this.__todayMinTemp.set(newValue);
    }
    private __todayMaxHumidity: ObservedPropertySimplePU<number>; // 今日最高湿度
    get todayMaxHumidity() {
        return this.__todayMaxHumidity.get();
    }
    set todayMaxHumidity(newValue: number) {
        this.__todayMaxHumidity.set(newValue);
    }
    private __todayMinHumidity: ObservedPropertySimplePU<number>; // 今日最低湿度
    get todayMinHumidity() {
        return this.__todayMinHumidity.get();
    }
    set todayMinHumidity(newValue: number) {
        this.__todayMinHumidity.set(newValue);
    }
    // ========== 用户认证状态 ==========
    // 管理用户的登录状态和相关信息
    private __currentIndex: ObservedPropertySimplePU<number>; // 当前选中的Tab索引（0=首页，1=控制，2=分析，3=我的）
    get currentIndex() {
        return this.__currentIndex.get();
    }
    set currentIndex(newValue: number) {
        this.__currentIndex.set(newValue);
    }
    private __isLoggedIn: ObservedPropertySimplePU<boolean>; // 用户是否已登录
    get isLoggedIn() {
        return this.__isLoggedIn.get();
    }
    set isLoggedIn(newValue: boolean) {
        this.__isLoggedIn.set(newValue);
    }
    private __userMode: ObservedPropertySimplePU<string>; // 用户模式：not_logged_in/logged_in/guest
    get userMode() {
        return this.__userMode.get();
    }
    set userMode(newValue: string) {
        this.__userMode.set(newValue);
    }
    private __currentView: ObservedPropertySimplePU<string>; // 当前视图：login/register/main
    get currentView() {
        return this.__currentView.get();
    }
    set currentView(newValue: string) {
        this.__currentView.set(newValue);
    }
    private __username: ObservedPropertySimplePU<string>; // 登录用户名
    get username() {
        return this.__username.get();
    }
    set username(newValue: string) {
        this.__username.set(newValue);
    }
    private __password: ObservedPropertySimplePU<string>; // 登录密码
    get password() {
        return this.__password.get();
    }
    set password(newValue: string) {
        this.__password.set(newValue);
    }
    private __confirmPassword: ObservedPropertySimplePU<string>; // 注册确认密码
    get confirmPassword() {
        return this.__confirmPassword.get();
    }
    set confirmPassword(newValue: string) {
        this.__confirmPassword.set(newValue);
    }
    private __email: ObservedPropertySimplePU<string>; // 用户邮箱
    get email() {
        return this.__email.get();
    }
    set email(newValue: string) {
        this.__email.set(newValue);
    }
    private __phone: ObservedPropertySimplePU<string>; // 用户手机号
    get phone() {
        return this.__phone.get();
    }
    set phone(newValue: string) {
        this.__phone.set(newValue);
    }
    private __isLoading: ObservedPropertySimplePU<boolean>; // 是否正在加载（用于显示加载状态）
    get isLoading() {
        return this.__isLoading.get();
    }
    set isLoading(newValue: boolean) {
        this.__isLoading.set(newValue);
    }
    private __errorMessage: ObservedPropertySimplePU<string>; // 错误提示信息
    get errorMessage() {
        return this.__errorMessage.get();
    }
    set errorMessage(newValue: string) {
        this.__errorMessage.set(newValue);
    }
    private __successMessage: ObservedPropertySimplePU<string>; // 成功提示信息
    get successMessage() {
        return this.__successMessage.get();
    }
    set successMessage(newValue: string) {
        this.__successMessage.set(newValue);
    }
    private __userProfile: ObservedPropertyObjectPU<UserProfile>;
    get userProfile() {
        return this.__userProfile.get();
    }
    set userProfile(newValue: UserProfile) {
        this.__userProfile.set(newValue);
    }
    // ========== 设备控制状态 ==========
    // 管理农场设备的控制状态和连接信息
    private __controlDevices: ObservedPropertyObjectPU<ControlDevice[]>; // 控制设备列表
    get controlDevices() {
        return this.__controlDevices.get();
    }
    set controlDevices(newValue: ControlDevice[]) {
        this.__controlDevices.set(newValue);
    }
    private __activeDeviceCount: ObservedPropertySimplePU<number>; // 活跃设备数量（开启状态）
    get activeDeviceCount() {
        return this.__activeDeviceCount.get();
    }
    set activeDeviceCount(newValue: number) {
        this.__activeDeviceCount.set(newValue);
    }
    private __onlineDeviceCount: ObservedPropertySimplePU<number>; // 在线设备数量（网络连接正常）
    get onlineDeviceCount() {
        return this.__onlineDeviceCount.get();
    }
    set onlineDeviceCount(newValue: number) {
        this.__onlineDeviceCount.set(newValue);
    }
    private __mqttStatus: ObservedPropertySimplePU<MqttStatus>; // MQTT连接状态
    get mqttStatus() {
        return this.__mqttStatus.get();
    }
    set mqttStatus(newValue: MqttStatus) {
        this.__mqttStatus.set(newValue);
    }
    private __mqttStatusText: ObservedPropertySimplePU<string>; // MQTT状态文本
    get mqttStatusText() {
        return this.__mqttStatusText.get();
    }
    set mqttStatusText(newValue: string) {
        this.__mqttStatusText.set(newValue);
    }
    private __bemfaUID: ObservedPropertySimplePU<string>; // 巴法云用户ID
    get bemfaUID() {
        return this.__bemfaUID.get();
    }
    set bemfaUID(newValue: string) {
        this.__bemfaUID.set(newValue);
    }
    private __showEditNameDialog: ObservedPropertySimplePU<boolean>; // 是否显示编辑设备名称对话框
    get showEditNameDialog() {
        return this.__showEditNameDialog.get();
    }
    set showEditNameDialog(newValue: boolean) {
        this.__showEditNameDialog.set(newValue);
    }
    private __editingDevice: ObservedPropertyObjectPU<ControlDevice | null>; // 正在编辑的设备
    get editingDevice() {
        return this.__editingDevice.get();
    }
    set editingDevice(newValue: ControlDevice | null) {
        this.__editingDevice.set(newValue);
    }
    private __newDeviceName: ObservedPropertySimplePU<string>; // 新的设备名称
    get newDeviceName() {
        return this.__newDeviceName.get();
    }
    set newDeviceName(newValue: string) {
        this.__newDeviceName.set(newValue);
    }
    private __sensorDataList: ObservedPropertyObjectPU<SensorData[]>; // 传感器数据列表（用于控制页面）
    get sensorDataList() {
        return this.__sensorDataList.get();
    }
    set sensorDataList(newValue: SensorData[]) {
        this.__sensorDataList.set(newValue);
    }
    // ========== AI聊天状态 ==========
    // 管理AI助手的聊天状态和数据
    private __aiMessages: ObservedPropertyObjectPU<AIMessage[]>; // AI消息列表
    get aiMessages() {
        return this.__aiMessages.get();
    }
    set aiMessages(newValue: AIMessage[]) {
        this.__aiMessages.set(newValue);
    }
    private __aiInputText: ObservedPropertySimplePU<string>; // AI输入框文本
    get aiInputText() {
        return this.__aiInputText.get();
    }
    set aiInputText(newValue: string) {
        this.__aiInputText.set(newValue);
    }
    private __isAILoading: ObservedPropertySimplePU<boolean>; // AI是否正在回复
    get isAILoading() {
        return this.__isAILoading.get();
    }
    set isAILoading(newValue: boolean) {
        this.__isAILoading.set(newValue);
    }
    private __aiQuickQuestions: ObservedPropertyObjectPU<string[]>; // AI快速提问列表
    get aiQuickQuestions() {
        return this.__aiQuickQuestions.get();
    }
    set aiQuickQuestions(newValue: string[]) {
        this.__aiQuickQuestions.set(newValue);
    }
    private aiChatScroller: Scroller; // AI聊天滚动控制器
    private __pendingImageUri: ObservedPropertySimplePU<string>; // 待发送的图片附件URI（挂载后与文本一起发送）
    get pendingImageUri() {
        return this.__pendingImageUri.get();
    }
    set pendingImageUri(newValue: string) {
        this.__pendingImageUri.set(newValue);
    }
    // ========== 分析数据状态 ==========
    // 存储历史分析数据
    private __analysisData: ObservedPropertyObjectPU<AnalysisData[]>; // 分析数据数组
    get analysisData() {
        return this.__analysisData.get();
    }
    set analysisData(newValue: AnalysisData[]) {
        this.__analysisData.set(newValue);
    }
    private __selectedDataType: ObservedPropertySimplePU<string>; // 当前选中的数据类型
    get selectedDataType() {
        return this.__selectedDataType.get();
    }
    set selectedDataType(newValue: string) {
        this.__selectedDataType.set(newValue);
    }
    // ========== 用户菜单 ==========
    // 个人中心的菜单项配置
    private __menuItems: ObservedPropertyObjectPU<ProfileMenuItem[]>;
    get menuItems() {
        return this.__menuItems.get();
    }
    set menuItems(newValue: ProfileMenuItem[]) {
        this.__menuItems.set(newValue);
    }
    // 定时器（用于定时刷新数据）
    private dateTimerID: number; // 日期刷新定时器
    private dataRefreshTimerID: number; // 设备状态刷新定时器
    private sensorDataRefreshTimerID: number; // 传感器数据刷新定时器
    /**
       * 组件生命周期 - 即将显示
       * 当组件即将显示时调用，进行初始化操作
       * 主要功能：
       * 1. 设置API服务上下文
       * 2. 加载巴法云用户ID
       * 3. 启动各种定时器（日期、设备状态、传感器数据）
       * 4. 初始化AI服务
       * 5. 延迟获取初始数据
       */
    aboutToAppear() {
        console.info('[Index] 页面即将显示');
        apiService.setContext(this.getUIContext().getHostContext() as common.UIAbilityContext);
        this.loadBemfaUID();
        this.updateDateTime();
        // 启动定时器
        this.dateTimerID = setInterval((): void => { this.updateDateTime(); }, 60000);
        this.dataRefreshTimerID = setInterval((): void => {
            if (this.controlDevices.length > 0) {
                this.refreshDeviceOnlineStatus();
            }
        }, 30000);
        this.sensorDataRefreshTimerID = setInterval((): void => {
            // 刷新首页和控制页的传感器数据（缩短到5秒更新一次，更实时）
            this.refreshSensorData();
            this.fetchSensorDataFromBemfa();
        }, 5000);
        this.initAIService();
        // 延迟1秒后首次获取传感器数据（同时刷新首页和控制页）
        setTimeout((): void => {
            this.refreshSensorData();
            this.fetchSensorDataFromBemfa();
        }, 1000);
    }
    /**
     * 组件生命周期 - 即将销毁
     * 当组件即将销毁时调用，进行清理操作
     * 主要功能：
     * 1. 清除所有定时器
     * 2. 断开MQTT连接
     */
    aboutToDisappear() {
        console.info('[Index] 页面即将销毁');
        if (this.dateTimerID !== -1)
            clearInterval(this.dateTimerID);
        if (this.dataRefreshTimerID !== -1)
            clearInterval(this.dataRefreshTimerID);
        if (this.sensorDataRefreshTimerID !== -1)
            clearInterval(this.sensorDataRefreshTimerID);
        mqttService.disconnect();
    }
    /**
       * UI构建方法 - 构建整个应用界面
       * 使用Stack布局，根据用户登录状态显示不同内容
       */
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width('100%');
            Stack.height('100%');
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // ========== 未登录状态 ==========
            if (this.userMode === 'not_logged_in') {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        // 未登录：显示登录或注册页面
                        if (this.currentView === 'login') {
                            this.ifElseBranchUpdateFunction(0, () => {
                                {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        if (isInitialRender) {
                                            let componentCall = new LoginPage(this, {
                                                username: this.__username,
                                                password: this.__password,
                                                errorMessage: this.__errorMessage,
                                                successMessage: this.__successMessage,
                                                isLoading: this.__isLoading,
                                                handleLogin: () => this.handleLogin(),
                                                handleGuestMode: () => this.handleGuestMode(),
                                                switchToRegister: () => this.switchToRegister()
                                            }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 236, col: 11 });
                                            ViewPU.create(componentCall);
                                            let paramsLambda = () => {
                                                return {
                                                    username: this.username,
                                                    password: this.password,
                                                    errorMessage: this.errorMessage,
                                                    successMessage: this.successMessage,
                                                    isLoading: this.isLoading,
                                                    handleLogin: () => this.handleLogin(),
                                                    handleGuestMode: () => this.handleGuestMode(),
                                                    switchToRegister: () => this.switchToRegister()
                                                };
                                            };
                                            componentCall.paramsGenerator_ = paramsLambda;
                                        }
                                        else {
                                            this.updateStateVarsOfChildByElmtId(elmtId, {});
                                        }
                                    }, { name: "LoginPage" });
                                }
                            });
                        }
                        else if (this.currentView === 'register') {
                            this.ifElseBranchUpdateFunction(1, () => {
                                {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        if (isInitialRender) {
                                            let componentCall = new RegisterPage(this, {
                                                username: this.__username,
                                                password: this.__password,
                                                confirmPassword: this.__confirmPassword,
                                                email: this.__email,
                                                phone: this.__phone,
                                                errorMessage: this.__errorMessage,
                                                successMessage: this.__successMessage,
                                                isLoading: this.__isLoading,
                                                handleRegister: () => this.handleRegister(),
                                                switchToLogin: () => this.switchToLogin()
                                            }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 247, col: 11 });
                                            ViewPU.create(componentCall);
                                            let paramsLambda = () => {
                                                return {
                                                    username: this.username,
                                                    password: this.password,
                                                    confirmPassword: this.confirmPassword,
                                                    email: this.email,
                                                    phone: this.phone,
                                                    errorMessage: this.errorMessage,
                                                    successMessage: this.successMessage,
                                                    isLoading: this.isLoading,
                                                    handleRegister: () => this.handleRegister(),
                                                    switchToLogin: () => this.switchToLogin()
                                                };
                                            };
                                            componentCall.paramsGenerator_ = paramsLambda;
                                        }
                                        else {
                                            this.updateStateVarsOfChildByElmtId(elmtId, {});
                                        }
                                    }, { name: "RegisterPage" });
                                }
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(2, () => {
                            });
                        }
                    }, If);
                    If.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // ========== 已登录或游客模式 ==========
                        // 已登录或游客模式：显示主应用界面（底部Tab导航）
                        Tabs.create({ barPosition: BarPosition.End, index: this.currentIndex });
                        // ========== 已登录或游客模式 ==========
                        // 已登录或游客模式：显示主应用界面（底部Tab导航）
                        Tabs.onChange((index: number) => { this.currentIndex = index; });
                        // ========== 已登录或游客模式 ==========
                        // 已登录或游客模式：显示主应用界面（底部Tab导航）
                        Tabs.width('100%');
                        // ========== 已登录或游客模式 ==========
                        // 已登录或游客模式：显示主应用界面（底部Tab导航）
                        Tabs.height('100%');
                        // ========== 已登录或游客模式 ==========
                        // 已登录或游客模式：显示主应用界面（底部Tab导航）
                        Tabs.backgroundColor(AppColors.APP_BG);
                    }, Tabs);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        TabContent.create(() => {
                            {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    if (isInitialRender) {
                                        let componentCall = new HomePage(this, {
                                            soilHumidity: this.__soilHumidity,
                                            temperature: this.__temperature,
                                            lightIntensity: this.__lightIntensity,
                                            date: this.__date,
                                            lastUpdateTime: this.__lastUpdateTime,
                                            todayMaxTemp: this.__todayMaxTemp,
                                            todayMinTemp: this.__todayMinTemp,
                                            todayMaxHumidity: this.__todayMaxHumidity,
                                            todayMinHumidity: this.__todayMinHumidity,
                                            controlDevices: this.__controlDevices,
                                            activeDeviceCount: this.__activeDeviceCount,
                                            onlineDeviceCount: this.__onlineDeviceCount,
                                            mqttStatusText: this.__mqttStatusText,
                                            getMqttStatusIcon: (): string => this.getMqttStatusIcon(),
                                            getMqttStatusColor: (): string => this.getMqttStatusColor(),
                                            refreshSensorData: (): Promise<void> => this.refreshSensorData()
                                        }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 266, col: 13 });
                                        ViewPU.create(componentCall);
                                        let paramsLambda = () => {
                                            return {
                                                soilHumidity: this.soilHumidity,
                                                temperature: this.temperature,
                                                lightIntensity: this.lightIntensity,
                                                date: this.date,
                                                lastUpdateTime: this.lastUpdateTime,
                                                todayMaxTemp: this.todayMaxTemp,
                                                todayMinTemp: this.todayMinTemp,
                                                todayMaxHumidity: this.todayMaxHumidity,
                                                todayMinHumidity: this.todayMinHumidity,
                                                controlDevices: this.controlDevices,
                                                activeDeviceCount: this.activeDeviceCount,
                                                onlineDeviceCount: this.onlineDeviceCount,
                                                mqttStatusText: this.mqttStatusText,
                                                getMqttStatusIcon: (): string => this.getMqttStatusIcon(),
                                                getMqttStatusColor: (): string => this.getMqttStatusColor(),
                                                refreshSensorData: (): Promise<void> => this.refreshSensorData()
                                            };
                                        };
                                        componentCall.paramsGenerator_ = paramsLambda;
                                    }
                                    else {
                                        this.updateStateVarsOfChildByElmtId(elmtId, {});
                                    }
                                }, { name: "HomePage" });
                            }
                        });
                        TabContent.tabBar({ builder: () => {
                                this.TabBuilder.call(this, '首页', 0);
                            } });
                    }, TabContent);
                    TabContent.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        TabContent.create(() => {
                            {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    if (isInitialRender) {
                                        let componentCall = new ControlPage(this, {
                                            controlDevices: this.__controlDevices,
                                            mqttStatus: this.__mqttStatus,
                                            mqttStatusText: this.__mqttStatusText,
                                            bemfaUID: this.__bemfaUID,
                                            onlineDeviceCount: this.__onlineDeviceCount,
                                            activeDeviceCount: this.__activeDeviceCount,
                                            sensorDataList: this.__sensorDataList,
                                            getMqttStatusIcon: (): string => this.getMqttStatusIcon(),
                                            getMqttStatusColor: (): string => this.getMqttStatusColor(),
                                            getMaskedUID: (): string => this.getMaskedUID(),
                                            toggleAllDevicesMQTT: async (isActive: boolean): Promise<void> => { await this.toggleAllDevicesMQTT(isActive); },
                                            refreshDeviceOnlineStatus: (): void => { this.refreshDeviceOnlineStatus(); },
                                            refreshSensorData: (): void => { this.fetchSensorDataFromBemfa(); },
                                            syncDevicesFromBemfa: (): void => { this.syncDevicesFromBemfa(); },
                                            onToggleDevice: async (id: number, isOn: boolean): Promise<void> => { await this.toggleDeviceMQTT(id, isOn); },
                                            onEditDeviceName: (device: ControlDevice) => {
                                                this.editingDevice = device;
                                                this.newDeviceName = device.name;
                                                this.showEditNameDialog = true;
                                            }
                                        }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 288, col: 13 });
                                        ViewPU.create(componentCall);
                                        let paramsLambda = () => {
                                            return {
                                                controlDevices: this.controlDevices,
                                                mqttStatus: this.mqttStatus,
                                                mqttStatusText: this.mqttStatusText,
                                                bemfaUID: this.bemfaUID,
                                                onlineDeviceCount: this.onlineDeviceCount,
                                                activeDeviceCount: this.activeDeviceCount,
                                                sensorDataList: this.sensorDataList,
                                                getMqttStatusIcon: (): string => this.getMqttStatusIcon(),
                                                getMqttStatusColor: (): string => this.getMqttStatusColor(),
                                                getMaskedUID: (): string => this.getMaskedUID(),
                                                toggleAllDevicesMQTT: async (isActive: boolean): Promise<void> => { await this.toggleAllDevicesMQTT(isActive); },
                                                refreshDeviceOnlineStatus: (): void => { this.refreshDeviceOnlineStatus(); },
                                                refreshSensorData: (): void => { this.fetchSensorDataFromBemfa(); },
                                                syncDevicesFromBemfa: (): void => { this.syncDevicesFromBemfa(); },
                                                onToggleDevice: async (id: number, isOn: boolean): Promise<void> => { await this.toggleDeviceMQTT(id, isOn); },
                                                onEditDeviceName: (device: ControlDevice) => {
                                                    this.editingDevice = device;
                                                    this.newDeviceName = device.name;
                                                    this.showEditNameDialog = true;
                                                }
                                            };
                                        };
                                        componentCall.paramsGenerator_ = paramsLambda;
                                    }
                                    else {
                                        this.updateStateVarsOfChildByElmtId(elmtId, {});
                                    }
                                }, { name: "ControlPage" });
                            }
                        });
                        TabContent.tabBar({ builder: () => {
                                this.TabBuilder.call(this, '控制', 1);
                            } });
                    }, TabContent);
                    TabContent.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        TabContent.create(() => {
                            {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    if (isInitialRender) {
                                        let componentCall = new AnalysisPage(this, {
                                            temperature: this.__temperature,
                                            soilHumidity: this.__soilHumidity,
                                            lightIntensity: this.__lightIntensity,
                                            aiMessages: this.__aiMessages,
                                            aiInputText: this.__aiInputText,
                                            isAILoading: this.__isAILoading,
                                            aiQuickQuestions: this.__aiQuickQuestions,
                                            pendingImageUri: this.__pendingImageUri,
                                            aiChatScroller: this.aiChatScroller,
                                            getWeatherDescription: (): string => this.getWeatherDescription(),
                                            getWeatherIcon: (): string => this.getWeatherIcon(),
                                            sendAIMessage: (msg: string): void => { this.sendAIMessage(msg); },
                                            addWelcomeMessage: (): void => { this.addWelcomeMessage(); },
                                            uploadImage: (): void => { this.pickAndUploadImage(); },
                                            transcribeAudio: (): void => { this.pickAndTranscribeAudio(); }
                                        }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 314, col: 11 });
                                        ViewPU.create(componentCall);
                                        let paramsLambda = () => {
                                            return {
                                                temperature: this.temperature,
                                                soilHumidity: this.soilHumidity,
                                                lightIntensity: this.lightIntensity,
                                                aiMessages: this.aiMessages,
                                                aiInputText: this.aiInputText,
                                                isAILoading: this.isAILoading,
                                                aiQuickQuestions: this.aiQuickQuestions,
                                                pendingImageUri: this.pendingImageUri,
                                                aiChatScroller: this.aiChatScroller,
                                                getWeatherDescription: (): string => this.getWeatherDescription(),
                                                getWeatherIcon: (): string => this.getWeatherIcon(),
                                                sendAIMessage: (msg: string): void => { this.sendAIMessage(msg); },
                                                addWelcomeMessage: (): void => { this.addWelcomeMessage(); },
                                                uploadImage: (): void => { this.pickAndUploadImage(); },
                                                transcribeAudio: (): void => { this.pickAndTranscribeAudio(); }
                                            };
                                        };
                                        componentCall.paramsGenerator_ = paramsLambda;
                                    }
                                    else {
                                        this.updateStateVarsOfChildByElmtId(elmtId, {});
                                    }
                                }, { name: "AnalysisPage" });
                            }
                        });
                        TabContent.tabBar({ builder: () => {
                                this.TabBuilder.call(this, '分析', 2);
                            } });
                    }, TabContent);
                    TabContent.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        TabContent.create(() => {
                            {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    if (isInitialRender) {
                                        let componentCall = new ProfilePage(this, {
                                            userMode: this.__userMode,
                                            userProfile: this.__userProfile,
                                            menuItems: this.__menuItems,
                                            getMenuItemsForCurrentMode: (): ProfileMenuItem[] => this.getMenuItemsForCurrentMode(),
                                            handleMenuItemClick: (id: string): void => { this.handleMenuItemClick(id); },
                                            switchToLogin: () => {
                                                this.userMode = 'not_logged_in';
                                                this.currentView = 'login';
                                            }
                                        }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 335, col: 13 });
                                        ViewPU.create(componentCall);
                                        let paramsLambda = () => {
                                            return {
                                                userMode: this.userMode,
                                                userProfile: this.userProfile,
                                                menuItems: this.menuItems,
                                                getMenuItemsForCurrentMode: (): ProfileMenuItem[] => this.getMenuItemsForCurrentMode(),
                                                handleMenuItemClick: (id: string): void => { this.handleMenuItemClick(id); },
                                                switchToLogin: () => {
                                                    this.userMode = 'not_logged_in';
                                                    this.currentView = 'login';
                                                }
                                            };
                                        };
                                        componentCall.paramsGenerator_ = paramsLambda;
                                    }
                                    else {
                                        this.updateStateVarsOfChildByElmtId(elmtId, {});
                                    }
                                }, { name: "ProfilePage" });
                            }
                        });
                        TabContent.tabBar({ builder: () => {
                                this.TabBuilder.call(this, '我的', 3);
                            } });
                    }, TabContent);
                    TabContent.pop();
                    // ========== 已登录或游客模式 ==========
                    // 已登录或游客模式：显示主应用界面（底部Tab导航）
                    Tabs.pop();
                });
            }
        }, If);
        If.pop();
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new 
                    // 编辑设备名称对话框（浮动层）
                    EditDeviceNameDialog(this, {
                        showDialog: this.__showEditNameDialog,
                        editingDevice: this.__editingDevice,
                        newDeviceName: this.__newDeviceName,
                        onConfirm: (): void => { this.confirmEditDeviceName(); }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 355, col: 7 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            showDialog: this.showEditNameDialog,
                            editingDevice: this.editingDevice,
                            newDeviceName: this.newDeviceName,
                            onConfirm: (): void => { this.confirmEditDeviceName(); }
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {});
                }
            }, { name: "EditDeviceNameDialog" });
        }
        Stack.pop();
    }
    /**
       * 底部Tab构建器 - 构建底部导航栏的每个Tab
       * @param title Tab标题
       * @param index Tab索引（0=首页，1=控制，2=分析，3=我的）
       */
    TabBuilder(title: string, index: number, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding({ top: 8, bottom: 8 });
            Column.justifyContent(FlexAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // Tab图标 - 根据当前选中状态显示不同样式
            if (this.currentIndex === index) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 选中状态：图标更大，颜色更亮
                        Image.create(index === 0 ? { "id": 0, "type": 30000, params: ['首页.png'], "bundleName": "com.example.myapplication", "moduleName": "entry" } :
                            index === 1 ? { "id": 0, "type": 30000, params: ['控制.png'], "bundleName": "com.example.myapplication", "moduleName": "entry" } :
                                index === 2 ? { "id": 0, "type": 30000, params: ['分析.png'], "bundleName": "com.example.myapplication", "moduleName": "entry" } : { "id": 0, "type": 30000, params: ['我的.png'], "bundleName": "com.example.myapplication", "moduleName": "entry" });
                        // 选中状态：图标更大，颜色更亮
                        Image.width(28);
                        // 选中状态：图标更大，颜色更亮
                        Image.height(28);
                        // 选中状态：图标更大，颜色更亮
                        Image.fillColor(AppColors.PRIMARY_COLOR);
                    }, Image);
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 未选中状态：图标较小，颜色较暗
                        Image.create(index === 0 ? { "id": 0, "type": 30000, params: ['首页.png'], "bundleName": "com.example.myapplication", "moduleName": "entry" } :
                            index === 1 ? { "id": 0, "type": 30000, params: ['控制.png'], "bundleName": "com.example.myapplication", "moduleName": "entry" } :
                                index === 2 ? { "id": 0, "type": 30000, params: ['分析.png'], "bundleName": "com.example.myapplication", "moduleName": "entry" } : { "id": 0, "type": 30000, params: ['我的.png'], "bundleName": "com.example.myapplication", "moduleName": "entry" });
                        // 未选中状态：图标较小，颜色较暗
                        Image.width(24);
                        // 未选中状态：图标较小，颜色较暗
                        Image.height(24);
                        // 未选中状态：图标较小，颜色较暗
                        Image.fillColor('#999999');
                        // 未选中状态：图标较小，颜色较暗
                        Image.opacity(0.6);
                    }, Image);
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Tab标题 - 根据当前选中状态显示不同样式
            Text.create(title);
            // Tab标题 - 根据当前选中状态显示不同样式
            Text.fontSize(this.currentIndex === index ? 12 : 11);
            // Tab标题 - 根据当前选中状态显示不同样式
            Text.fontColor(this.currentIndex === index ? AppColors.PRIMARY_COLOR : '#999999');
            // Tab标题 - 根据当前选中状态显示不同样式
            Text.fontWeight(this.currentIndex === index ? FontWeight.Bold : FontWeight.Normal);
            // Tab标题 - 根据当前选中状态显示不同样式
            Text.margin({ top: 4 });
        }, Text);
        // Tab标题 - 根据当前选中状态显示不同样式
        Text.pop();
        Column.pop();
    }
    // ========== 核心业务方法（保持原样） ==========
    // 由于篇幅原因，这里包含所有原有的业务逻辑方法
    // 包括：数据处理、MQTT通信、认证逻辑、AI服务等
    updateDateTime() {
        const now = new Date();
        this.date = `${now.getMonth() + 1}月${now.getDate()}日`;
    }
    async loadBemfaUID() {
        try {
            if (BemfaConfig.USER_UID && BemfaConfig.USER_UID.length > 0) {
                this.bemfaUID = BemfaConfig.USER_UID;
                bemfaCloudService.setUID(this.bemfaUID);
                await this.syncDevicesFromBemfa();
                await this.initMQTT();
                return;
            }
            let pref = await preferences.getPreferences(this.getUIContext().getHostContext() as common.UIAbilityContext, 'app_config');
            let savedUID: string = await pref.get(BemfaConfig.STORAGE_KEY_UID, '') as string;
            if (savedUID) {
                this.bemfaUID = savedUID;
                bemfaCloudService.setUID(this.bemfaUID);
                await this.syncDevicesFromBemfa();
                await this.initMQTT();
            }
        }
        catch (error) {
            console.error('[Index] 加载UID失败:', error);
        }
    }
    async initMQTT() {
        if (!this.bemfaUID)
            return;
        mqttService.setClientId(this.bemfaUID);
        mqttService.onStatusChange((status: MqttStatus) => {
            this.mqttStatus = status;
            switch (status) {
                case MqttStatus.DISCONNECTED:
                    this.mqttStatusText = '未连接';
                    break;
                case MqttStatus.CONNECTING:
                    this.mqttStatusText = '连接中...';
                    break;
                case MqttStatus.CONNECTED:
                    this.mqttStatusText = '已连接';
                    this.subscribeAllDevices();
                    break;
                case MqttStatus.RECONNECTING:
                    this.mqttStatusText = '重连中...';
                    break;
                case MqttStatus.ERROR:
                    this.mqttStatusText = '连接失败';
                    break;
            }
        });
        mqttService.onMessage((message: MqttMessage) => {
            this.handleMQTTMessage(message);
        });
        await mqttService.connect();
    }
    subscribeAllDevices(): void {
        this.controlDevices.forEach((device: ControlDevice): void => {
            mqttService.subscribe(device.topic);
        });
        this.refreshDeviceOnlineStatus();
    }
    async syncDevicesFromBemfa() {
        console.info('[设备同步] 开始从巴法云同步设备');
        // 获取所有协议类型的设备（type参数：不传=所有，1=MQTT，3=TCP）
        const result = await bemfaCloudService.getAllTopics(1);
        if (result.code === 0 && result.data?.data) {
            const totalDevices = result.data.data.length;
            console.info('[设备同步] ========== 应用端接收到设备 ==========');
            console.info('[设备同步] ✅ 成功获取', totalDevices, '个MQTT设备');
            result.data.data.forEach((topic: TopicDetail, idx: number) => {
                console.info(`[设备同步] ${idx + 1}. ${topic.name || topic.topic}`);
                console.info(`           主题: ${topic.topic}`);
                console.info(`           类型: ${topic.deviceType || '未知'}`);
                console.info(`           在线: ${topic.online ? '✅' : '❌'}`);
            });
            console.info('[设备同步] =======================================');
            this.controlDevices = result.data.data.map((topic: TopicDetail, index: number): ControlDevice => {
                const isActive = topic.msg === 'on' || topic.msg === '1';
                // 详细日志：显示每个设备的状态
                console.info(`[设备同步] 设备${index + 1}: ${topic.name || topic.topic}`);
                console.info(`  - 主题: ${topic.topic}`);
                console.info(`  - 消息: ${topic.msg}`);
                console.info(`  - 在线: ${topic.online}`);
                console.info(`  - 开关: ${isActive ? '开启' : '关闭'}`);
                return new ControlDevice(index + 1, // id
                topic.name || topic.topic, // name
                topic.topic, // topic
                isActive, // isActive
                topic.online, // isOnline
                topic.room || '未分组', // area
                this.getDeviceTypeName(topic.deviceType) // deviceType
                );
            });
            // 处理传感器数据
            this.controlDevices.forEach((device: ControlDevice): void => {
                if ((device.topic.endsWith('004') || device.deviceType === '传感器')) {
                    const foundTopic = result.data.data.find((t: TopicDetail) => t.topic === device.topic);
                    if (foundTopic && foundTopic.msg) {
                        this.parseSensorData(foundTopic.msg);
                    }
                }
            });
            this.updateDeviceStatistics();
            console.info('[设备同步] 同步完成，在线设备:', this.onlineDeviceCount, '运行设备:', this.activeDeviceCount);
            if (this.mqttStatus === MqttStatus.CONNECTED)
                this.subscribeAllDevices();
        }
        else {
            console.error('[设备同步] ❌ 同步失败 code:', result.code, 'msg:', result.msg);
        }
    }
    /**
     * 刷新设备在线状态和开关状态
     * 从巴法云API获取设备的真实状态（on/off）并同步到界面
     */
    async refreshDeviceOnlineStatus() {
        try {
            console.info('[设备状态] 开始刷新设备状态');
            const result = await bemfaCloudService.getAllTopics(1);
            if (result.code === 0 && result.data?.data) {
                // 创建状态映射表
                const deviceStatusMap = new Map<string, DeviceStatus>();
                result.data.data.forEach((topic: TopicDetail) => {
                    const status: DeviceStatus = {
                        online: topic.online,
                        msg: topic.msg || ''
                    };
                    deviceStatusMap.set(topic.topic, status);
                });
                // 更新每个设备的在线状态和开关状态 - 创建新数组触发响应式更新
                const updatedDevices = this.controlDevices.map((device, index) => {
                    const status = deviceStatusMap.get(device.topic);
                    if (status) {
                        // 更新在线状态
                        device.isOnline = status.online;
                        // 更新开关状态 - 支持所有类型的开关命令
                        // 包括：on, auto_on, pump_on, 1 等
                        const msg = status.msg.toLowerCase();
                        const isActive = msg.includes('on') || msg === '1' || msg === 'true';
                        device.isActive = isActive;
                        console.info(`[设备状态] ${device.name}: 在线=${status.online}, 状态=${status.msg}, 开关=${isActive ? '开启✓' : '关闭✕'}`);
                    }
                    return device;
                });
                this.controlDevices = updatedDevices;
            }
            this.updateDeviceStatistics();
            console.info('[设备状态] 刷新完成');
        }
        catch (error) {
            console.error('[设备状态] 刷新失败:', error);
        }
    }
    async refreshSensorData(): Promise<void> {
        try {
            console.info('[首页] 开始刷新传感器数据');
            // 分别获取三个传感器主题的最新数据
            // 注意：使用巴法云实际主题名称 tem、light、hum
            const sensorTopics: SimpleSensorTopic[] = [
                { topic: 'tem', name: '温度' } as SimpleSensorTopic,
                { topic: 'light', name: '光照' } as SimpleSensorTopic,
                { topic: 'hum', name: '湿度' } as SimpleSensorTopic
            ];
            let hasData = false;
            let latestUpdateTime = '--:--';
            let tempUpdated = false;
            let humUpdated = false;
            let lightUpdated = false;
            for (const sensor of sensorTopics) {
                try {
                    // 获取该主题的最新消息
                    const result = await bemfaCloudService.getMessages(sensor.topic, 1, 1);
                    console.info(`[首页] 查询主题 ${sensor.topic}:`, JSON.stringify(result));
                    if (result.code === 0 && result.data && result.data.length > 0) {
                        const latestData = result.data[0];
                        const value = parseFloat(latestData.msg);
                        console.info(`[首页] ${sensor.name} 原始值: "${latestData.msg}", 解析后: ${value}`);
                        if (!isNaN(value)) {
                            // 根据主题更新对应的状态变量
                            if (sensor.topic === 'tem') {
                                const newValue = Math.round(value * 10) / 10; // 保留1位小数
                                if (this.lastTempValue !== newValue) {
                                    console.info(`[首页] ✅ 温度变化: ${this.lastTempValue}°C -> ${newValue}°C`);
                                    this.lastTempValue = newValue;
                                }
                                this.temperature = newValue;
                                tempUpdated = true;
                            }
                            else if (sensor.topic === 'light') {
                                const newValue = Math.round(value);
                                if (this.lastLightValue !== newValue) {
                                    console.info(`[首页] ✅ 光照变化: ${this.lastLightValue}Lx -> ${newValue}Lx`);
                                    this.lastLightValue = newValue;
                                }
                                this.lightIntensity = newValue;
                                lightUpdated = true;
                            }
                            else if (sensor.topic === 'hum') {
                                const newValue = Math.round(value * 10) / 10; // 保留1位小数
                                if (this.lastHumValue !== newValue) {
                                    console.info(`[首页] ✅ 湿度变化: ${this.lastHumValue}% -> ${newValue}%`);
                                    this.lastHumValue = newValue;
                                }
                                this.soilHumidity = newValue;
                                humUpdated = true;
                            }
                            // 更新时间（直接使用返回的时间字符串）
                            if (latestData.time) {
                                latestUpdateTime = latestData.time;
                            }
                            hasData = true;
                        }
                        else {
                            console.warn(`[首页] ${sensor.name} 数据无效: "${latestData.msg}"`);
                        }
                    }
                    else {
                        console.warn(`[首页] ${sensor.name}：暂无数据或API返回失败 (code: ${result.code})`);
                    }
                }
                catch (error) {
                    console.error(`[首页] 获取${sensor.name}失败:`, error);
                }
            }
            // 更新最后刷新时间
            if (hasData) {
                this.lastUpdateTime = latestUpdateTime;
                console.info(`[首页] 传感器数据刷新完成 - 温度:${tempUpdated} 湿度:${humUpdated} 光照:${lightUpdated}`);
            }
            else {
                console.warn('[首页] 未获取到任何传感器数据');
            }
        }
        catch (error) {
            console.error('[首页] 刷新传感器数据失败:', error);
        }
    }
    /**
     * 从巴法云获取传感器数据（用于控制页面显示）
     * 按照定义顺序依次获取，保证显示顺序固定
     */
    async fetchSensorDataFromBemfa() {
        try {
            console.info('[传感器数据] 开始获取传感器数据');
            // 定义需要获取的传感器主题（固定顺序）
            const sensorTopics: SensorTopicConfig[] = [
                { topic: 'temp', name: '温度', unit: '°C', icon: '🌡️', color: '#FF6B6B' } as SensorTopicConfig,
                { topic: 'light', name: '光照', unit: 'Lx', icon: '☀️', color: '#FFD93D' } as SensorTopicConfig,
                { topic: 'hum', name: '湿度', unit: '%', icon: '💧', color: '#4ECDC4' } as SensorTopicConfig,
                { topic: 'soil', name: '土壤湿度', unit: '%', icon: '🌱', color: '#95E1D3' } as SensorTopicConfig,
                { topic: 'water', name: '水位', unit: 'cm', icon: '🌊', color: '#3D5AFE' } as SensorTopicConfig
            ];
            const newSensorDataList: SensorData[] = [];
            // 按顺序依次获取传感器数据，保证顺序固定
            for (const sensor of sensorTopics) {
                try {
                    const result = await bemfaCloudService.getMessages(sensor.topic, 1, 1);
                    if (result.code === 0 && result.data && result.data.length > 0) {
                        const latestData = result.data[0];
                        const sensorData: SensorData = {
                            name: sensor.name,
                            topic: sensor.topic,
                            value: latestData.msg || '--',
                            unit: sensor.unit,
                            icon: sensor.icon,
                            color: sensor.color,
                            lastUpdateTime: latestData.time || '--'
                        };
                        newSensorDataList.push(sensorData);
                        console.info(`[传感器数据] ${sensor.name}: ${latestData.msg}${sensor.unit} (${latestData.time})`);
                    }
                    else {
                        console.warn(`[传感器数据] ${sensor.name}：暂无数据`);
                    }
                }
                catch (error) {
                    console.error(`[传感器数据] 获取${sensor.name}失败:`, error);
                }
            }
            // 更新传感器数据列表
            this.sensorDataList = newSensorDataList;
            console.info('[传感器数据] 获取完成，共', this.sensorDataList.length, '个传感器');
        }
        catch (error) {
            console.error('[传感器数据] 获取传感器数据异常:', error);
        }
    }
    /**
     * 根据设备主题和状态获取控制命令
     * @param topic 设备主题
     * @param isActive 是否开启
     * @returns 控制命令字符串
     */
    private getDeviceCommand(topic: string, isActive: boolean): string {
        // 特殊设备命令映射（根据巴法云主题名称）
        const specialCommands: Record<string, DeviceCommand> = {
            'auto': { on: 'auto_on', off: 'auto_off' },
            'pump': { on: 'pump_on', off: 'pump_off' },
            'buzzerctrl': { on: 'on', off: 'off' },
            'ledctrl': { on: 'on', off: 'off' },
            'humctrl': { on: 'on', off: 'off' } // 湿度控制
        };
        // 如果是特殊设备，返回对应命令
        if (specialCommands[topic]) {
            const cmd = isActive ? specialCommands[topic].on : specialCommands[topic].off;
            console.info(`[命令映射] 主题=${topic}, 状态=${isActive ? '开' : '关'}, 命令=${cmd}`);
            return cmd;
        }
        // 默认设备统一使用 on/off
        console.info(`[命令映射] 主题=${topic}, 状态=${isActive ? '开' : '关'}, 命令=${isActive ? 'on' : 'off'}`);
        return isActive ? 'on' : 'off';
    }
    /**
     * 控制设备开关（使用官方GET方式API）
     * 遵循官方文档：GET https://apis.bemfa.com/va/sendMessage
     * 支持不同设备类型的特定控制命令
     */
    async toggleDeviceMQTT(deviceId: number, isActive: boolean) {
        const device = this.controlDevices.find(d => d.id === deviceId);
        if (!device) {
            console.error('[设备控制] 未找到设备:', deviceId);
            return;
        }
        // 根据设备主题获取对应的控制命令
        const command = this.getDeviceCommand(device.topic, isActive);
        console.info('[设备控制] 准备控制设备:', device.name, '主题:', device.topic, '命令:', command);
        try {
            // 使用官方GET方式API控制设备
            const result = await bemfaCloudService.sendMessage(device.topic, // topic: 主题名称
            command, // msg: 消息内容（on/off）
            BemfaConfig.PROTOCOL_TYPE_MQTT_V1 // type: 1=MQTT协议
            );
            if (result.code === 0) {
                console.info('[设备控制] ✅ 控制成功:', device.name, '→', command);
                // 更新设备状态 - 重新赋值数组以触发UI更新
                const deviceIndex = this.controlDevices.findIndex(d => d.id === deviceId);
                if (deviceIndex !== -1) {
                    // 创建新数组触发响应式更新
                    const updatedDevices = [...this.controlDevices];
                    updatedDevices[deviceIndex].isActive = isActive;
                    this.controlDevices = updatedDevices;
                    this.updateDeviceStatistics();
                    console.info('[设备控制] UI状态已更新:', device.name, '→', isActive ? '开启' : '关闭');
                }
            }
            else {
                console.error('[设备控制] ❌ 控制失败 code:', result.code, 'message:', result.message);
            }
        }
        catch (error) {
            console.error('[设备控制] ❌ 控制异常:', error);
        }
    }
    /**
     * 批量控制所有设备（使用官方GET方式API）
     * 遵循官方文档：GET https://apis.bemfa.com/va/sendMessage
     * 支持不同设备类型的特定控制命令
     */
    async toggleAllDevicesMQTT(isActive: boolean): Promise<void> {
        console.info('[设备控制] 批量控制所有设备');
        // 使用for循环依次控制每个设备
        for (const device of this.controlDevices) {
            try {
                // 根据设备主题获取对应的控制命令
                const command = this.getDeviceCommand(device.topic, isActive);
                const result = await bemfaCloudService.sendMessage(device.topic, command, BemfaConfig.PROTOCOL_TYPE_MQTT_V1);
                if (result.code === 0) {
                    const deviceIndex = this.controlDevices.findIndex((d: ControlDevice) => d.id === device.id);
                    if (deviceIndex !== -1) {
                        this.controlDevices[deviceIndex].isActive = isActive;
                    }
                    console.info('[设备控制] ✅', device.name, '→', command);
                }
                else {
                    console.error('[设备控制] ❌', device.name, '控制失败 code:', result.code);
                }
                // 避免请求过快，延迟200ms
                await new Promise<void>((resolve: Function) => setTimeout(resolve, 200));
            }
            catch (error) {
                console.error('[设备控制] ❌', device.name, '控制异常:', error);
            }
        }
        this.updateDeviceStatistics();
        console.info('[设备控制] 批量控制完成');
    }
    updateDeviceStatistics(): void {
        this.activeDeviceCount = this.controlDevices.filter((d: ControlDevice) => d.isActive).length;
        this.onlineDeviceCount = this.controlDevices.filter((d: ControlDevice) => d.isOnline).length;
    }
    async confirmEditDeviceName() {
        if (!this.editingDevice || !this.newDeviceName.trim())
            return;
        try {
            const result = await bemfaCloudService.modifyTopicName(this.editingDevice.topic, this.newDeviceName.trim(), BemfaConfig.PROTOCOL_TYPE_MQTT_V1);
            if (result.code === 0) {
                const deviceIndex = this.controlDevices.findIndex(d => d.id === this.editingDevice!.id);
                if (deviceIndex !== -1) {
                    this.controlDevices[deviceIndex].name = this.newDeviceName.trim();
                }
                this.showEditNameDialog = false;
            }
        }
        catch (error) {
            console.error('[控制] 修改昵称异常:', error);
        }
    }
    handleMQTTMessage(message: MqttMessage) {
        const deviceIndex = this.controlDevices.findIndex(d => d.topic === message.topic);
        if (deviceIndex === -1)
            return;
        const payload = message.payload.toLowerCase();
        const device = this.controlDevices[deviceIndex];
        if (message.topic.endsWith('004') || device.deviceType === '传感器') {
            this.parseSensorData(message.payload);
        }
        if (payload === 'on' || payload === '1')
            this.controlDevices[deviceIndex].isActive = true;
        else if (payload === 'off' || payload === '0')
            this.controlDevices[deviceIndex].isActive = false;
        this.controlDevices[deviceIndex].isOnline = true;
        this.updateDeviceStatistics();
    }
    parseSensorData(payload: string) {
        let temperature: number | undefined;
        let humidity: number | undefined;
        let lightIntensity: number | undefined;
        try {
            const data: Record<string, number> = JSON.parse(payload) as Record<string, number>;
            if (data.temperature !== undefined) {
                this.temperature = Math.round(data.temperature);
                temperature = data.temperature;
            }
            if (data.humidity !== undefined) {
                this.soilHumidity = Math.round(data.humidity);
                humidity = data.humidity;
            }
            if (data.light !== undefined) {
                this.lightIntensity = Math.round(data.light);
                lightIntensity = data.light;
            }
        }
        catch (e) {
            const pairs = payload.split(',');
            pairs.forEach(pair => {
                const parts = pair.split(':');
                if (parts.length === 2) {
                    const numValue = parseFloat(parts[1]);
                    if (!isNaN(numValue)) {
                        if (parts[0] === 'temp' || parts[0] === 'temperature') {
                            this.temperature = Math.round(numValue);
                            temperature = numValue;
                        }
                        else if (parts[0] === 'humi' || parts[0] === 'humidity' || parts[0] === 'soil') {
                            this.soilHumidity = Math.round(numValue);
                            humidity = numValue;
                        }
                        else if (parts[0] === 'light' || parts[0] === 'lux') {
                            this.lightIntensity = Math.round(numValue);
                            lightIntensity = numValue;
                        }
                    }
                }
            });
        }
        this.updateAnalysisData();
        this.uploadSensorDataToServer(temperature, humidity, lightIntensity);
    }
    private async uploadSensorDataToServer(temperature?: number, humidity?: number, lightIntensity?: number) {
        if (temperature === undefined && humidity === undefined && lightIntensity === undefined)
            return;
        try {
            const uploadData: SensorDataUploadRequest = {
                device_topic: 'farm001',
                temperature: temperature,
                humidity: humidity,
                light_intensity: lightIntensity
            };
            if (this.userProfile.id > 0)
                uploadData.user_id = this.userProfile.id;
            const response = await apiService.uploadSensorData(uploadData);
            if (response.success) {
                console.info('[传感器上传] ✅ 上传成功');
            }
        }
        catch (error) {
            console.error('[传感器上传] ❌ 上传异常:', error);
        }
    }
    updateAnalysisData() {
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        this.lastUpdateTime = timeStr;
        this.analysisData.unshift({
            date: timeStr,
            temperature: this.temperature,
            humidity: this.soilHumidity,
            soilMoisture: this.lightIntensity,
            yield: 0
        });
        if (this.analysisData.length > 10)
            this.analysisData.pop();
        this.updateTodayStats();
    }
    updateTodayStats() {
        if (this.analysisData.length === 0)
            return;
        const temps = this.analysisData.map(d => d.temperature);
        this.todayMaxTemp = Math.max(...temps);
        this.todayMinTemp = Math.min(...temps);
        const humidities = this.analysisData.map(d => d.humidity);
        this.todayMaxHumidity = Math.max(...humidities);
        this.todayMinHumidity = Math.min(...humidities);
    }
    // 认证相关方法
    private validateLoginForm(): boolean {
        if (!this.username.trim()) {
            this.errorMessage = '请输入用户名';
            return false;
        }
        if (!this.password.trim()) {
            this.errorMessage = '请输入密码';
            return false;
        }
        if (this.password.length < 6) {
            this.errorMessage = '密码长度不能少于6位';
            return false;
        }
        this.errorMessage = '';
        return true;
    }
    private validateRegisterForm(): boolean {
        if (!this.username.trim()) {
            this.errorMessage = '请输入用户名';
            return false;
        }
        if (!this.phone.trim()) {
            this.errorMessage = '请输入手机号';
            return false;
        }
        if (!this.email.trim()) {
            this.errorMessage = '请输入邮箱';
            return false;
        }
        if (!this.password.trim()) {
            this.errorMessage = '请输入密码';
            return false;
        }
        if (this.password.length < 6) {
            this.errorMessage = '密码长度不能少于6位';
            return false;
        }
        if (this.password !== this.confirmPassword) {
            this.errorMessage = '两次输入的密码不一致';
            return false;
        }
        this.errorMessage = '';
        return true;
    }
    private async handleLogin(): Promise<void> {
        if (!this.validateLoginForm())
            return;
        this.isLoading = true;
        this.errorMessage = '';
        this.successMessage = '';
        try {
            const response = await apiService.login({
                login: this.username.trim(),
                password: this.password
            });
            if (response.success && response.data) {
                this.userProfile = {
                    id: response.data.user.id,
                    username: response.data.user.username,
                    email: response.data.user.email,
                    phone: response.data.user.phone || '',
                    avatar: response.data.user.avatar || '👤',
                    bio: response.data.user.bio || '智慧农业用户',
                    user_mode: response.data.user.user_mode,
                    is_admin: response.data.user.is_admin || 0
                };
                this.isLoggedIn = true;
                this.userMode = 'logged_in';
                this.currentView = 'main';
                this.successMessage = '登录成功！';
                this.clearForm();
            }
            else {
                this.errorMessage = response.message || '登录失败';
            }
        }
        catch (error) {
            this.errorMessage = '网络连接失败';
        }
        finally {
            this.isLoading = false;
        }
    }
    private async handleRegister(): Promise<void> {
        if (!this.validateRegisterForm())
            return;
        this.isLoading = true;
        this.errorMessage = '';
        this.successMessage = '';
        try {
            const response = await apiService.register({
                username: this.username.trim(),
                email: this.email.trim(),
                phone: this.phone.trim(),
                password: this.password
            });
            if (response.success && response.data) {
                if (response.data.token)
                    apiService.setToken(response.data.token);
                this.userProfile = {
                    id: response.data.user.id,
                    username: response.data.user.username,
                    email: response.data.user.email,
                    phone: response.data.user.phone || '',
                    avatar: response.data.user.avatar || '👤',
                    bio: response.data.user.bio || '智慧农业用户',
                    user_mode: response.data.user.user_mode,
                    is_admin: response.data.user.is_admin || 0
                };
                this.successMessage = '注册成功！';
                setTimeout(() => {
                    this.isLoggedIn = true;
                    this.userMode = 'logged_in';
                    this.currentView = 'main';
                    this.clearForm();
                    this.successMessage = '';
                }, 1000);
            }
            else {
                this.errorMessage = response.message || '注册失败';
            }
        }
        catch (error) {
            this.errorMessage = '网络连接失败';
        }
        finally {
            this.isLoading = false;
        }
    }
    private async handleLogout(): Promise<void> {
        this.isLoading = true;
        try {
            await apiService.logout();
        }
        catch (error) {
            console.error('登出异常:', error);
        }
        finally {
            this.isLoggedIn = false;
            this.userMode = 'guest';
            this.currentView = 'main';
            this.userProfile = {
                id: 0, username: '', email: '', phone: '', avatar: '👤',
                bio: '智慧农业用户', user_mode: 'guest', is_admin: 0
            };
            this.clearForm();
            this.isLoading = false;
        }
    }
    private handleGuestMode(): void {
        this.isLoggedIn = false;
        this.userMode = 'guest';
        this.currentView = 'main';
        this.clearForm();
    }
    private clearForm(): void {
        this.username = '';
        this.password = '';
        this.confirmPassword = '';
        this.email = '';
        this.phone = '';
        this.errorMessage = '';
        this.successMessage = '';
    }
    private switchToRegister(): void {
        this.currentView = 'register';
        this.clearForm();
    }
    private switchToLogin(): void {
        this.currentView = 'login';
        this.clearForm();
    }
    // AI相关方法
    initAIService() {
        cozeService.init();
        this.aiQuickQuestions = cozeService.getQuickReplies();
        this.addWelcomeMessage();
    }
    addWelcomeMessage() {
        this.aiMessages.push({
            role: 'assistant',
            content: '你好！我是智慧农场AI助手🌾\n\n我可以：\n• 分析实时传感器数据\n• 提供种植建议\n• 回答农业问题\n• 给出优化方案\n\n请告诉我你想了解什么？',
            timestamp: Date.now()
        });
    }
    async sendAIMessage(userText: string) {
        let fullMessage = userText;
        let attachedFileId: string = '';
        if (this.temperature > 0 || this.soilHumidity > 0 || this.lightIntensity > 0) {
            fullMessage += `\n\n【当前环境数据】`;
            if (this.temperature > 0)
                fullMessage += `\n温度: ${this.temperature}°C`;
            if (this.soilHumidity > 0)
                fullMessage += `\n湿度: ${this.soilHumidity}%`;
            if (this.lightIntensity > 0)
                fullMessage += `\n光照: ${this.lightIntensity}Lx`;
        }
        this.aiMessages.push({ role: 'user', content: userText, timestamp: Date.now() });
        setTimeout((): void => { this.aiChatScroller.scrollEdge(Edge.Bottom); }, 100);
        this.isAILoading = true;
        const assistantMsg: AIMessage = { role: 'assistant', content: '', timestamp: Date.now() };
        this.aiMessages.push(assistantMsg);
        const aiMessageIndex = this.aiMessages.length - 1;
        // 如果存在挂载的图片，先上传获取file_id，再与文本一起发送
        if (this.pendingImageUri && this.pendingImageUri.length > 0) {
            hilog.info(DOMAIN, TAG_INDEX, '[sendAIMessage] pending image uri=%{public}s', this.pendingImageUri);
            try {
                cozeService.init();
                const filename = 'image_' + Date.now();
                const upload = await cozeService.uploadImageFromUri(this.pendingImageUri, filename);
                if (upload && upload.success && upload.file_id) {
                    hilog.info(DOMAIN, TAG_INDEX, '[sendAIMessage] upload ok file_id=%{public}s', upload.file_id as string);
                    attachedFileId = upload.file_id;
                    // 在消息体中附加文件ID，确保AI能关联到该图片
                    fullMessage += `\n\n【附件】图片文件ID: ${attachedFileId}`;
                }
                else {
                    hilog.error(DOMAIN, TAG_INDEX, '[sendAIMessage] upload fail msg=%{public}s', String(upload?.message));
                    this.aiMessages.push({ role: 'assistant', content: '图片附件上传失败', timestamp: Date.now() });
                }
            }
            catch (e) {
                hilog.error(DOMAIN, TAG_INDEX, '[sendAIMessage] upload exception %{public}s', JSON.stringify(e));
                this.aiMessages.push({ role: 'assistant', content: '图片附件上传异常', timestamp: Date.now() });
            }
            finally {
                // 清理挂载的附件，避免重复使用
                this.pendingImageUri = '';
            }
        }
        const useWithImage = attachedFileId && attachedFileId.length > 0;
        if (useWithImage) {
            await cozeService.sendMessageWithOptionalImage(fullMessage, attachedFileId, (deltaContent: string): void => {
                this.aiMessages[aiMessageIndex].content += deltaContent;
                this.aiMessages = [...this.aiMessages];
                setTimeout((): void => { this.aiChatScroller.scrollEdge(Edge.Bottom); }, 50);
            }, (fullContent: string): void => {
                this.isAILoading = false;
                if (fullContent && this.aiMessages[aiMessageIndex].content !== fullContent) {
                    this.aiMessages[aiMessageIndex].content = fullContent;
                }
                if (!this.aiMessages[aiMessageIndex].content) {
                    this.aiMessages[aiMessageIndex].content = '抱歉，AI暂时没有回复。';
                }
                this.aiMessages = [...this.aiMessages];
                setTimeout((): void => { this.aiChatScroller.scrollEdge(Edge.Bottom); }, 100);
            }, (error: string): void => {
                this.isAILoading = false;
                this.aiMessages[aiMessageIndex].content = `错误: ${error}`;
                this.aiMessages = [...this.aiMessages];
            });
        }
        else {
            await cozeService.sendMessage(fullMessage, (deltaContent: string): void => {
                this.aiMessages[aiMessageIndex].content += deltaContent;
                this.aiMessages = [...this.aiMessages];
                setTimeout((): void => { this.aiChatScroller.scrollEdge(Edge.Bottom); }, 50);
            }, (fullContent: string): void => {
                this.isAILoading = false;
                if (fullContent && this.aiMessages[aiMessageIndex].content !== fullContent) {
                    this.aiMessages[aiMessageIndex].content = fullContent;
                }
                if (!this.aiMessages[aiMessageIndex].content) {
                    this.aiMessages[aiMessageIndex].content = '抱歉，AI暂时没有回复。';
                }
                this.aiMessages = [...this.aiMessages];
                setTimeout((): void => { this.aiChatScroller.scrollEdge(Edge.Bottom); }, 100);
            }, (error: string): void => {
                this.isAILoading = false;
                this.aiMessages[aiMessageIndex].content = `错误: ${error}`;
                this.aiMessages = [...this.aiMessages];
            });
        }
    }
    async pickAndUploadImage() {
        try {
            const ctx = this.getUIContext().getHostContext() as common.UIAbilityContext;
            const photoPicker = new picker.PhotoViewPicker(ctx);
            const selectOptions = new picker.PhotoSelectOptions();
            selectOptions.MIMEType = picker.PhotoViewMIMETypes.IMAGE_TYPE;
            selectOptions.maxSelectNumber = 1;
            const result: picker.PhotoSelectResult = await photoPicker.select(selectOptions);
            const uris: string[] = result.photoUris;
            if (!uris || uris.length === 0) {
                return;
            }
            const uri = uris[0];
            hilog.info(DOMAIN, TAG_INDEX, '[pickAndUploadImage] selected uri=%{public}s', uri);
            // 仅挂载图片，不立即上传；在用户点击发送时与文本一并处理
            this.pendingImageUri = uri;
            this.aiMessages.push({ role: 'user', content: '已选择图片', timestamp: Date.now(), imageUri: uri });
            setTimeout((): void => { this.aiChatScroller.scrollEdge(Edge.Bottom); }, 50);
        }
        catch (_) {
            hilog.error(DOMAIN, TAG_INDEX, '[pickAndUploadImage] select fail');
            this.aiMessages.push({ role: 'assistant', content: '未选择图片或选择失败', timestamp: Date.now() });
        }
    }
    async pickAndTranscribeAudio() {
        try {
            const ctx = this.getUIContext().getHostContext() as common.UIAbilityContext;
            const docPicker = new picker.DocumentViewPicker(ctx);
            const selectOptions = new picker.DocumentSelectOptions();
            selectOptions.maxSelectNumber = 1;
            const uris: string[] = await docPicker.select(selectOptions) as Array<string>;
            if (!uris || uris.length === 0) {
                return;
            }
            const uri = uris[0];
            hilog.info(DOMAIN, TAG_INDEX, '[pickAndTranscribeAudio] selected uri=%{public}s', uri);
            cozeService.init();
            const filename = 'audio_' + Date.now();
            const resp = await cozeService.transcribeAudioFromUri(uri, filename);
            if (resp && resp.success && resp.text) {
                this.aiInputText = resp.text;
                setTimeout((): void => { this.aiChatScroller.scrollEdge(Edge.Bottom); }, 50);
            }
            else {
                this.aiMessages.push({ role: 'assistant', content: '语音转写失败', timestamp: Date.now() });
            }
        }
        catch (_) {
            hilog.error(DOMAIN, TAG_INDEX, '[pickAndTranscribeAudio] select/transcribe fail');
            this.aiMessages.push({ role: 'assistant', content: '未选择音频或转写异常', timestamp: Date.now() });
        }
    }
    // 用户页面方法
    getMenuItemsForCurrentMode(): ProfileMenuItem[] {
        if (this.userMode === 'guest') {
            return this.menuItems.filter(item => item.id === 'help' || item.id === 'about');
        }
        else if (this.userMode === 'logged_in') {
            return this.menuItems;
        }
        return [];
    }
    handleMenuItemClick(itemId: string) {
        if (this.userMode === 'guest' && itemId === 'settings') {
            this.userMode = 'not_logged_in';
            this.currentView = 'login';
            return;
        }
        if (itemId === 'settings') {
            promptAction.showToast({ message: '该功能已移除', duration: 2000 });
            return;
        }
        if (itemId === 'logout')
            this.handleLogout();
        if (itemId === 'help' || itemId === 'about') {
            promptAction.showToast({ message: '功能开发中', duration: 2000 });
        }
    }
    // 辅助方法
    getMqttStatusIcon(): string {
        switch (this.mqttStatus) {
            case MqttStatus.CONNECTED: return '🟢';
            case MqttStatus.CONNECTING:
            case MqttStatus.RECONNECTING: return '🟡';
            case MqttStatus.ERROR: return '🔴';
            default: return '⚪';
        }
    }
    getMqttStatusColor(): string {
        switch (this.mqttStatus) {
            case MqttStatus.CONNECTED: return '#4CAF50';
            case MqttStatus.CONNECTING:
            case MqttStatus.RECONNECTING: return '#FF9800';
            case MqttStatus.ERROR: return '#F44336';
            default: return '#999999';
        }
    }
    getMaskedUID(): string {
        if (!this.bemfaUID || this.bemfaUID.length < 8)
            return '未配置';
        return this.bemfaUID.substring(0, 4) + '***' + this.bemfaUID.substring(this.bemfaUID.length - 4);
    }
    getDeviceTypeName(deviceType?: string): string {
        const typeMap: Record<string, string> = {
            'outlet': '插座', 'light': '灯泡', 'fan': '风扇', 'sensor': '传感器',
            'aircondition': '空调', 'switch': '开关', 'curtain': '窗帘',
            'thermostat': '温控器', 'waterheater': '热水器', 'television': '电视',
            'airpurifier': '空气净化器'
        };
        return typeMap[deviceType || ''] || '开关';
    }
    getWeatherDescription(): string {
        if (this.temperature === 0 && this.soilHumidity === 0)
            return '等待数据...';
        if (this.temperature > 30)
            return '炎热天气';
        if (this.temperature > 25)
            return '温暖天气';
        if (this.temperature > 18)
            return '舒适天气';
        if (this.temperature > 10)
            return '凉爽天气';
        return '寒冷天气';
    }
    getWeatherIcon(): string {
        if (this.temperature === 0 && this.soilHumidity === 0)
            return '⏳';
        if (this.lightIntensity > 800)
            return '☀️';
        if (this.lightIntensity > 500)
            return '🌤️';
        if (this.lightIntensity > 200)
            return '☁️';
        return '🌧️';
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "Index";
    }
}
registerNamedRoute(() => new Index(undefined, {}), "", { bundleName: "com.example.myapplication", moduleName: "entry", pagePath: "pages/Index", pageFullPath: "entry/src/main/ets/pages/Index", integratedHsp: "false", moduleType: "followWithHap" });
