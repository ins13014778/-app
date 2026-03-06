if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface HomePage_Params {
    soilHumidity?: number;
    temperature?: number;
    lightIntensity?: number;
    date?: string;
    lastUpdateTime?: string;
    todayMaxTemp?: number;
    todayMinTemp?: number;
    todayMaxHumidity?: number;
    todayMinHumidity?: number;
    controlDevices?: ControlDevice[];
    activeDeviceCount?: number;
    onlineDeviceCount?: number;
    mqttStatusText?: string;
    // 回调函数（从父组件传入）
    getMqttStatusIcon?: () => string;
    getMqttStatusColor?: () => string;
    refreshSensorData?: () => Promise<void>;
    isDataStatExpanded?: boolean;
    iotTemperature?: number;
    iotHumidity?: number;
    iotLight?: number;
    iotSoilMoisture?: number;
    iotLoading?: boolean;
    iotError?: string;
    iotDebug?: string;
    signAuthorization?: string;
    signContentSha256?: string;
    signSecurityToken?: string;
    signLanguage?: string;
    signProjectId?: string;
    signSdkDate?: string;
    signHost?: string;
    signInstanceId?: string;
}
import type { ControlDevice } from '../../types/IndexTypes';
import promptAction from "@ohos:promptAction";
import { WeatherCard } from "@normalized:N&&&entry/src/main/ets/components/home/WeatherCard&";
import http from "@ohos:net.http";
import fs from "@ohos:file.fs";
import util from "@ohos:util";
import { AppConfig } from "@normalized:N&&&entry/src/main/ets/config/AppConfig&";
interface IAMDomain {
    name: string;
}
interface IAMUser {
    name: string;
    password: string;
    domain: IAMDomain;
}
interface IAMPassword {
    user: IAMUser;
}
interface IAMIdentity {
    methods: string[];
    password: IAMPassword;
}
interface IAMProject {
    id: string;
}
interface IAMScope {
    project: IAMProject;
}
interface IAMAuth {
    identity: IAMIdentity;
    scope: IAMScope;
}
interface IAMBody {
    auth: IAMAuth;
}
interface IotShadowProperties {
    temperature?: number;
    humidity?: number;
    illumination?: number;
    soil_moisture?: number;
    pump_status?: string;
    auto_mode?: boolean;
    buzzer_status?: string;
    heartbeat?: number;
}
interface IotShadowReported {
    properties?: IotShadowProperties;
    event_time?: string;
}
interface IotShadowService {
    service_id?: string;
    desired?: Object;
    reported?: IotShadowReported;
    version?: number;
}
interface IotShadowResponse {
    device_id?: string;
    shadow?: IotShadowService[];
}
interface IotErrorBody {
    error_code?: string;
    error_msg?: string;
}
interface ConfigFile {
    token?: string;
    XSubjectToken?: string;
    Authorization?: string;
    XSdkContentSha256?: string;
    XSecurityToken?: string;
    UserAgent?: string;
    Host?: string;
    InstanceId?: string;
    XLanguage?: string;
    XProjectId?: string;
    XSdkDate?: string;
}
interface HttpHeaders {
    'X-Auth-Token'?: string;
    'Content-Type': string;
    'Instance-Id'?: string;
    'Authorization'?: string;
    'X-Sdk-Content-Sha256'?: string;
    'X-Security-Token'?: string;
    'X-Language'?: string;
    'X-Project-Id'?: string;
    'X-Sdk-Date'?: string;
    'Host'?: string;
}
export class HomePage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__soilHumidity = new SynchedPropertySimpleTwoWayPU(params.soilHumidity, this, "soilHumidity");
        this.__temperature = new SynchedPropertySimpleTwoWayPU(params.temperature, this, "temperature");
        this.__lightIntensity = new SynchedPropertySimpleTwoWayPU(params.lightIntensity, this, "lightIntensity");
        this.__date = new SynchedPropertySimpleTwoWayPU(params.date, this, "date");
        this.__lastUpdateTime = new SynchedPropertySimpleTwoWayPU(params.lastUpdateTime, this, "lastUpdateTime");
        this.__todayMaxTemp = new SynchedPropertySimpleTwoWayPU(params.todayMaxTemp, this, "todayMaxTemp");
        this.__todayMinTemp = new SynchedPropertySimpleTwoWayPU(params.todayMinTemp, this, "todayMinTemp");
        this.__todayMaxHumidity = new SynchedPropertySimpleTwoWayPU(params.todayMaxHumidity, this, "todayMaxHumidity");
        this.__todayMinHumidity = new SynchedPropertySimpleTwoWayPU(params.todayMinHumidity, this, "todayMinHumidity");
        this.__controlDevices = new SynchedPropertyObjectTwoWayPU(params.controlDevices, this, "controlDevices");
        this.__activeDeviceCount = new SynchedPropertySimpleTwoWayPU(params.activeDeviceCount, this, "activeDeviceCount");
        this.__onlineDeviceCount = new SynchedPropertySimpleTwoWayPU(params.onlineDeviceCount, this, "onlineDeviceCount");
        this.__mqttStatusText = new SynchedPropertySimpleTwoWayPU(params.mqttStatusText, this, "mqttStatusText");
        this.getMqttStatusIcon = (): string => '⚪';
        this.getMqttStatusColor = (): string => '#999999';
        this.refreshSensorData = async (): Promise<void> => { };
        this.__isDataStatExpanded = new ObservedPropertySimplePU(true, this, "isDataStatExpanded");
        this.__iotTemperature = new ObservedPropertySimplePU(0, this, "iotTemperature");
        this.__iotHumidity = new ObservedPropertySimplePU(0, this, "iotHumidity");
        this.__iotLight = new ObservedPropertySimplePU(0, this, "iotLight");
        this.__iotSoilMoisture = new ObservedPropertySimplePU(0, this, "iotSoilMoisture");
        this.__iotLoading = new ObservedPropertySimplePU(false, this, "iotLoading");
        this.__iotError = new ObservedPropertySimplePU('', this, "iotError");
        this.__iotDebug = new ObservedPropertySimplePU('', this, "iotDebug");
        this.__signAuthorization = new ObservedPropertySimplePU('', this, "signAuthorization");
        this.__signContentSha256 = new ObservedPropertySimplePU('', this, "signContentSha256");
        this.__signSecurityToken = new ObservedPropertySimplePU('', this, "signSecurityToken");
        this.__signLanguage = new ObservedPropertySimplePU('', this, "signLanguage");
        this.__signProjectId = new ObservedPropertySimplePU('', this, "signProjectId");
        this.__signSdkDate = new ObservedPropertySimplePU('', this, "signSdkDate");
        this.__signHost = new ObservedPropertySimplePU('', this, "signHost");
        this.__signInstanceId = new ObservedPropertySimplePU('', this, "signInstanceId");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: HomePage_Params) {
        if (params.getMqttStatusIcon !== undefined) {
            this.getMqttStatusIcon = params.getMqttStatusIcon;
        }
        if (params.getMqttStatusColor !== undefined) {
            this.getMqttStatusColor = params.getMqttStatusColor;
        }
        if (params.refreshSensorData !== undefined) {
            this.refreshSensorData = params.refreshSensorData;
        }
        if (params.isDataStatExpanded !== undefined) {
            this.isDataStatExpanded = params.isDataStatExpanded;
        }
        if (params.iotTemperature !== undefined) {
            this.iotTemperature = params.iotTemperature;
        }
        if (params.iotHumidity !== undefined) {
            this.iotHumidity = params.iotHumidity;
        }
        if (params.iotLight !== undefined) {
            this.iotLight = params.iotLight;
        }
        if (params.iotSoilMoisture !== undefined) {
            this.iotSoilMoisture = params.iotSoilMoisture;
        }
        if (params.iotLoading !== undefined) {
            this.iotLoading = params.iotLoading;
        }
        if (params.iotError !== undefined) {
            this.iotError = params.iotError;
        }
        if (params.iotDebug !== undefined) {
            this.iotDebug = params.iotDebug;
        }
        if (params.signAuthorization !== undefined) {
            this.signAuthorization = params.signAuthorization;
        }
        if (params.signContentSha256 !== undefined) {
            this.signContentSha256 = params.signContentSha256;
        }
        if (params.signSecurityToken !== undefined) {
            this.signSecurityToken = params.signSecurityToken;
        }
        if (params.signLanguage !== undefined) {
            this.signLanguage = params.signLanguage;
        }
        if (params.signProjectId !== undefined) {
            this.signProjectId = params.signProjectId;
        }
        if (params.signSdkDate !== undefined) {
            this.signSdkDate = params.signSdkDate;
        }
        if (params.signHost !== undefined) {
            this.signHost = params.signHost;
        }
        if (params.signInstanceId !== undefined) {
            this.signInstanceId = params.signInstanceId;
        }
    }
    updateStateVars(params: HomePage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__soilHumidity.purgeDependencyOnElmtId(rmElmtId);
        this.__temperature.purgeDependencyOnElmtId(rmElmtId);
        this.__lightIntensity.purgeDependencyOnElmtId(rmElmtId);
        this.__date.purgeDependencyOnElmtId(rmElmtId);
        this.__lastUpdateTime.purgeDependencyOnElmtId(rmElmtId);
        this.__todayMaxTemp.purgeDependencyOnElmtId(rmElmtId);
        this.__todayMinTemp.purgeDependencyOnElmtId(rmElmtId);
        this.__todayMaxHumidity.purgeDependencyOnElmtId(rmElmtId);
        this.__todayMinHumidity.purgeDependencyOnElmtId(rmElmtId);
        this.__controlDevices.purgeDependencyOnElmtId(rmElmtId);
        this.__activeDeviceCount.purgeDependencyOnElmtId(rmElmtId);
        this.__onlineDeviceCount.purgeDependencyOnElmtId(rmElmtId);
        this.__mqttStatusText.purgeDependencyOnElmtId(rmElmtId);
        this.__isDataStatExpanded.purgeDependencyOnElmtId(rmElmtId);
        this.__iotTemperature.purgeDependencyOnElmtId(rmElmtId);
        this.__iotHumidity.purgeDependencyOnElmtId(rmElmtId);
        this.__iotLight.purgeDependencyOnElmtId(rmElmtId);
        this.__iotSoilMoisture.purgeDependencyOnElmtId(rmElmtId);
        this.__iotLoading.purgeDependencyOnElmtId(rmElmtId);
        this.__iotError.purgeDependencyOnElmtId(rmElmtId);
        this.__iotDebug.purgeDependencyOnElmtId(rmElmtId);
        this.__signAuthorization.purgeDependencyOnElmtId(rmElmtId);
        this.__signContentSha256.purgeDependencyOnElmtId(rmElmtId);
        this.__signSecurityToken.purgeDependencyOnElmtId(rmElmtId);
        this.__signLanguage.purgeDependencyOnElmtId(rmElmtId);
        this.__signProjectId.purgeDependencyOnElmtId(rmElmtId);
        this.__signSdkDate.purgeDependencyOnElmtId(rmElmtId);
        this.__signHost.purgeDependencyOnElmtId(rmElmtId);
        this.__signInstanceId.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__soilHumidity.aboutToBeDeleted();
        this.__temperature.aboutToBeDeleted();
        this.__lightIntensity.aboutToBeDeleted();
        this.__date.aboutToBeDeleted();
        this.__lastUpdateTime.aboutToBeDeleted();
        this.__todayMaxTemp.aboutToBeDeleted();
        this.__todayMinTemp.aboutToBeDeleted();
        this.__todayMaxHumidity.aboutToBeDeleted();
        this.__todayMinHumidity.aboutToBeDeleted();
        this.__controlDevices.aboutToBeDeleted();
        this.__activeDeviceCount.aboutToBeDeleted();
        this.__onlineDeviceCount.aboutToBeDeleted();
        this.__mqttStatusText.aboutToBeDeleted();
        this.__isDataStatExpanded.aboutToBeDeleted();
        this.__iotTemperature.aboutToBeDeleted();
        this.__iotHumidity.aboutToBeDeleted();
        this.__iotLight.aboutToBeDeleted();
        this.__iotSoilMoisture.aboutToBeDeleted();
        this.__iotLoading.aboutToBeDeleted();
        this.__iotError.aboutToBeDeleted();
        this.__iotDebug.aboutToBeDeleted();
        this.__signAuthorization.aboutToBeDeleted();
        this.__signContentSha256.aboutToBeDeleted();
        this.__signSecurityToken.aboutToBeDeleted();
        this.__signLanguage.aboutToBeDeleted();
        this.__signProjectId.aboutToBeDeleted();
        this.__signSdkDate.aboutToBeDeleted();
        this.__signHost.aboutToBeDeleted();
        this.__signInstanceId.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    // ========== 父组件传入的参数 ==========
    // 这些参数通过@Link装饰器与父组件双向绑定，实现数据同步
    private __soilHumidity: SynchedPropertySimpleTwoWayPU<number>; // 土壤湿度（从传感器获取）
    get soilHumidity() {
        return this.__soilHumidity.get();
    }
    set soilHumidity(newValue: number) {
        this.__soilHumidity.set(newValue);
    }
    private __temperature: SynchedPropertySimpleTwoWayPU<number>; // 环境温度（从传感器获取）
    get temperature() {
        return this.__temperature.get();
    }
    set temperature(newValue: number) {
        this.__temperature.set(newValue);
    }
    private __lightIntensity: SynchedPropertySimpleTwoWayPU<number>; // 光照强度（从传感器获取）
    get lightIntensity() {
        return this.__lightIntensity.get();
    }
    set lightIntensity(newValue: number) {
        this.__lightIntensity.set(newValue);
    }
    private __date: SynchedPropertySimpleTwoWayPU<string>; // 当前日期
    get date() {
        return this.__date.get();
    }
    set date(newValue: string) {
        this.__date.set(newValue);
    }
    private __lastUpdateTime: SynchedPropertySimpleTwoWayPU<string>; // 最后更新时间
    get lastUpdateTime() {
        return this.__lastUpdateTime.get();
    }
    set lastUpdateTime(newValue: string) {
        this.__lastUpdateTime.set(newValue);
    }
    private __todayMaxTemp: SynchedPropertySimpleTwoWayPU<number>; // 今日最高温度
    get todayMaxTemp() {
        return this.__todayMaxTemp.get();
    }
    set todayMaxTemp(newValue: number) {
        this.__todayMaxTemp.set(newValue);
    }
    private __todayMinTemp: SynchedPropertySimpleTwoWayPU<number>; // 今日最低温度
    get todayMinTemp() {
        return this.__todayMinTemp.get();
    }
    set todayMinTemp(newValue: number) {
        this.__todayMinTemp.set(newValue);
    }
    private __todayMaxHumidity: SynchedPropertySimpleTwoWayPU<number>; // 今日最高湿度
    get todayMaxHumidity() {
        return this.__todayMaxHumidity.get();
    }
    set todayMaxHumidity(newValue: number) {
        this.__todayMaxHumidity.set(newValue);
    }
    private __todayMinHumidity: SynchedPropertySimpleTwoWayPU<number>; // 今日最低湿度
    get todayMinHumidity() {
        return this.__todayMinHumidity.get();
    }
    set todayMinHumidity(newValue: number) {
        this.__todayMinHumidity.set(newValue);
    }
    private __controlDevices: SynchedPropertySimpleOneWayPU<ControlDevice[]>; // 控制设备列表
    get controlDevices() {
        return this.__controlDevices.get();
    }
    set controlDevices(newValue: ControlDevice[]) {
        this.__controlDevices.set(newValue);
    }
    private __activeDeviceCount: SynchedPropertySimpleTwoWayPU<number>; // 活跃设备数量
    get activeDeviceCount() {
        return this.__activeDeviceCount.get();
    }
    set activeDeviceCount(newValue: number) {
        this.__activeDeviceCount.set(newValue);
    }
    private __onlineDeviceCount: SynchedPropertySimpleTwoWayPU<number>; // 在线设备数量
    get onlineDeviceCount() {
        return this.__onlineDeviceCount.get();
    }
    set onlineDeviceCount(newValue: number) {
        this.__onlineDeviceCount.set(newValue);
    }
    private __mqttStatusText: SynchedPropertySimpleTwoWayPU<string>; // MQTT连接状态文本
    get mqttStatusText() {
        return this.__mqttStatusText.get();
    }
    set mqttStatusText(newValue: string) {
        this.__mqttStatusText.set(newValue);
    }
    // 回调函数（从父组件传入）
    private getMqttStatusIcon: () => string; // 获取MQTT状态图标
    private getMqttStatusColor: () => string; // 获取MQTT状态颜色
    private refreshSensorData: () => Promise<void>; // 刷新传感器数据
    // ========== 组件内部状态 ==========
    // 数据统计区域的折叠展开状态
    private __isDataStatExpanded: ObservedPropertySimplePU<boolean>; // 数据统计是否展开（默认展开）
    get isDataStatExpanded() {
        return this.__isDataStatExpanded.get();
    }
    set isDataStatExpanded(newValue: boolean) {
        this.__isDataStatExpanded.set(newValue);
    }
    // 华为云IoT设备数据（从华为云平台获取）
    private __iotTemperature: ObservedPropertySimplePU<number>; // 华为云IoT温度数据
    get iotTemperature() {
        return this.__iotTemperature.get();
    }
    set iotTemperature(newValue: number) {
        this.__iotTemperature.set(newValue);
    }
    private __iotHumidity: ObservedPropertySimplePU<number>; // 华为云IoT湿度数据
    get iotHumidity() {
        return this.__iotHumidity.get();
    }
    set iotHumidity(newValue: number) {
        this.__iotHumidity.set(newValue);
    }
    private __iotLight: ObservedPropertySimplePU<number>; // 华为云IoT光照数据
    get iotLight() {
        return this.__iotLight.get();
    }
    set iotLight(newValue: number) {
        this.__iotLight.set(newValue);
    }
    private __iotSoilMoisture: ObservedPropertySimplePU<number>; // 华为云IoT土壤湿度数据
    get iotSoilMoisture() {
        return this.__iotSoilMoisture.get();
    }
    set iotSoilMoisture(newValue: number) {
        this.__iotSoilMoisture.set(newValue);
    }
    private __iotLoading: ObservedPropertySimplePU<boolean>; // IoT数据加载状态
    get iotLoading() {
        return this.__iotLoading.get();
    }
    set iotLoading(newValue: boolean) {
        this.__iotLoading.set(newValue);
    }
    private __iotError: ObservedPropertySimplePU<string>; // IoT数据错误信息
    get iotError() {
        return this.__iotError.get();
    }
    set iotError(newValue: string) {
        this.__iotError.set(newValue);
    }
    private __iotDebug: ObservedPropertySimplePU<string>; // IoT调试信息
    get iotDebug() {
        return this.__iotDebug.get();
    }
    set iotDebug(newValue: string) {
        this.__iotDebug.set(newValue);
    }
    // 华为云API签名认证参数
    private __signAuthorization: ObservedPropertySimplePU<string>;
    get signAuthorization() {
        return this.__signAuthorization.get();
    }
    set signAuthorization(newValue: string) {
        this.__signAuthorization.set(newValue);
    }
    private __signContentSha256: ObservedPropertySimplePU<string>;
    get signContentSha256() {
        return this.__signContentSha256.get();
    }
    set signContentSha256(newValue: string) {
        this.__signContentSha256.set(newValue);
    }
    private __signSecurityToken: ObservedPropertySimplePU<string>;
    get signSecurityToken() {
        return this.__signSecurityToken.get();
    }
    set signSecurityToken(newValue: string) {
        this.__signSecurityToken.set(newValue);
    }
    private __signLanguage: ObservedPropertySimplePU<string>;
    get signLanguage() {
        return this.__signLanguage.get();
    }
    set signLanguage(newValue: string) {
        this.__signLanguage.set(newValue);
    }
    private __signProjectId: ObservedPropertySimplePU<string>;
    get signProjectId() {
        return this.__signProjectId.get();
    }
    set signProjectId(newValue: string) {
        this.__signProjectId.set(newValue);
    }
    private __signSdkDate: ObservedPropertySimplePU<string>;
    get signSdkDate() {
        return this.__signSdkDate.get();
    }
    set signSdkDate(newValue: string) {
        this.__signSdkDate.set(newValue);
    }
    private __signHost: ObservedPropertySimplePU<string>;
    get signHost() {
        return this.__signHost.get();
    }
    set signHost(newValue: string) {
        this.__signHost.set(newValue);
    }
    private __signInstanceId: ObservedPropertySimplePU<string>;
    get signInstanceId() {
        return this.__signInstanceId.get();
    }
    set signInstanceId(newValue: string) {
        this.__signInstanceId.set(newValue);
    }
    /**
       * UI构建方法 - 构建首页界面
       * 使用Scroll布局，支持上下滚动
       * 主要包含4个模块：天气卡片、数据统计、华为云IoT数据、传感器监测
       */
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.debugLine("entry/src/main/ets/components/home/HomePage.ets(170:5)", "entry");
            Scroll.width('100%');
            Scroll.height('100%');
            Scroll.linearGradient({
                angle: 180,
                colors: [[0x121212, 0.0], [0x1E1E1E, 0.5], [0x2D2D2D, 1.0]] // 黑色到深灰
            });
            Scroll.edgeEffect(EdgeEffect.Spring);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/components/home/HomePage.ets(171:7)", "entry");
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // ========== 天气大卡片 ==========
            // 使用易客天气API获取天气数据
            Column.create();
            Column.debugLine("entry/src/main/ets/components/home/HomePage.ets(174:9)", "entry");
            // ========== 天气大卡片 ==========
            // 使用易客天气API获取天气数据
            Column.width('92%');
            // ========== 天气大卡片 ==========
            // 使用易客天气API获取天气数据
            Column.margin({ top: 16, bottom: 16 });
        }, Column);
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new WeatherCard(this, {}, undefined, elmtId, () => { }, { page: "entry/src/main/ets/components/home/HomePage.ets", line: 175, col: 11 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {};
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {});
                }
            }, { name: "WeatherCard" });
        }
        // ========== 天气大卡片 ==========
        // 使用易客天气API获取天气数据
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // ========== 数据统计模块 ==========
            // 可折叠的数据统计区域，显示设备、报警、任务统计
            Column.create();
            Column.debugLine("entry/src/main/ets/components/home/HomePage.ets(182:9)", "entry");
            // ========== 数据统计模块 ==========
            // 可折叠的数据统计区域，显示设备、报警、任务统计
            Column.width('92%');
            // ========== 数据统计模块 ==========
            // 可折叠的数据统计区域，显示设备、报警、任务统计
            Column.padding(16);
            // ========== 数据统计模块 ==========
            // 可折叠的数据统计区域，显示设备、报警、任务统计
            Column.backgroundColor('#1E1E1E');
            // ========== 数据统计模块 ==========
            // 可折叠的数据统计区域，显示设备、报警、任务统计
            Column.borderRadius(16);
            // ========== 数据统计模块 ==========
            // 可折叠的数据统计区域，显示设备、报警、任务统计
            Column.shadow({
                radius: 8,
                color: 'rgba(0, 229, 255, 0.1)',
                offsetX: 0,
                offsetY: 2 // Y轴偏移
            });
            // ========== 数据统计模块 ==========
            // 可折叠的数据统计区域，显示设备、报警、任务统计
            Column.margin({ bottom: 16 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 标题行 - 包含标题和折叠/展开图标
            Row.create();
            Row.debugLine("entry/src/main/ets/components/home/HomePage.ets(184:11)", "entry");
            // 标题行 - 包含标题和折叠/展开图标
            Row.width('100%');
            // 标题行 - 包含标题和折叠/展开图标
            Row.onClick(() => {
                // 点击标题行切换折叠状态
                this.isDataStatExpanded = !this.isDataStatExpanded;
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('数据统计');
            Text.debugLine("entry/src/main/ets/components/home/HomePage.ets(185:13)", "entry");
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#00E5FF');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/components/home/HomePage.ets(190:13)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 折叠/展开图标：∨表示展开，∧表示折叠
            Text.create(this.isDataStatExpanded ? '∨' : '∧');
            Text.debugLine("entry/src/main/ets/components/home/HomePage.ets(193:13)", "entry");
            // 折叠/展开图标：∨表示展开，∧表示折叠
            Text.fontSize(16);
            // 折叠/展开图标：∨表示展开，∧表示折叠
            Text.fontColor('#00E5FF');
        }, Text);
        // 折叠/展开图标：∨表示展开，∧表示折叠
        Text.pop();
        // 标题行 - 包含标题和折叠/展开图标
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 统计内容（可折叠）
            if (this.isDataStatExpanded) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create({ space: 12 });
                        Column.debugLine("entry/src/main/ets/components/home/HomePage.ets(205:13)", "entry");
                        Column.width('100%');
                        Column.margin({ top: 12 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 第一行：设备统计
                        Row.create();
                        Row.debugLine("entry/src/main/ets/components/home/HomePage.ets(207:15)", "entry");
                        // 第一行：设备统计
                        Row.width('100%');
                        // 第一行：设备统计
                        Row.justifyContent(FlexAlign.SpaceBetween);
                    }, Row);
                    this.StatItem.bind(this)('设备总数', `${this.controlDevices.length}`, '#00E5FF') // 青色
                    ;
                    this.StatItem.bind(this)('在线设备', `${this.onlineDeviceCount}`, '#69F0AE') // 荧光绿
                    ;
                    this.StatItem.bind(this)('离线设备', `${this.controlDevices.length - this.onlineDeviceCount}`, '#FF4081') // 荧光粉
                    ;
                    // 第一行：设备统计
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 第二行：报警统计
                        Row.create();
                        Row.debugLine("entry/src/main/ets/components/home/HomePage.ets(216:15)", "entry");
                        // 第二行：报警统计
                        Row.width('100%');
                        // 第二行：报警统计
                        Row.justifyContent(FlexAlign.SpaceBetween);
                    }, Row);
                    this.StatItem.bind(this)('报警总数', '33', '#FFAB40') // 荧光橙
                    ;
                    this.StatItem.bind(this)('今日报警数', '10', '#69F0AE') // 荧光绿
                    ;
                    this.StatItem.bind(this)('未处理报警数', '23', '#FF4081') // 荧光粉
                    ;
                    // 第二行：报警统计
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 第三行：任务统计
                        Row.create();
                        Row.debugLine("entry/src/main/ets/components/home/HomePage.ets(225:15)", "entry");
                        // 第三行：任务统计
                        Row.width('100%');
                        // 第三行：任务统计
                        Row.justifyContent(FlexAlign.SpaceBetween);
                    }, Row);
                    this.StatItem.bind(this)('任务总数', '652', '#B0BEC5') // 浅灰
                    ;
                    this.StatItem.bind(this)('今日任务数', '18', '#69F0AE') // 荧光绿
                    ;
                    this.StatItem.bind(this)('未完成数量', '102', '#FFAB40') // 荧光橙
                    ;
                    // 第三行：任务统计
                    Row.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        // ========== 数据统计模块 ==========
        // 可折叠的数据统计区域，显示设备、报警、任务统计
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // ========== 华为云设备数据 ==========
            // 从华为云IoT平台获取的设备数据
            Column.create();
            Column.debugLine("entry/src/main/ets/components/home/HomePage.ets(251:9)", "entry");
            // ========== 华为云设备数据 ==========
            // 从华为云IoT平台获取的设备数据
            Column.width('92%');
            // ========== 华为云设备数据 ==========
            // 从华为云IoT平台获取的设备数据
            Column.padding(16);
            // ========== 华为云设备数据 ==========
            // 从华为云IoT平台获取的设备数据
            Column.backgroundColor('#1E1E1E');
            // ========== 华为云设备数据 ==========
            // 从华为云IoT平台获取的设备数据
            Column.borderRadius(16);
            // ========== 华为云设备数据 ==========
            // 从华为云IoT平台获取的设备数据
            Column.shadow({
                radius: 8,
                color: 'rgba(0, 229, 255, 0.1)',
                offsetX: 0,
                offsetY: 2
            });
            // ========== 华为云设备数据 ==========
            // 从华为云IoT平台获取的设备数据
            Column.margin({ bottom: 16 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 标题行 - 包含标题和状态信息
            Row.create();
            Row.debugLine("entry/src/main/ets/components/home/HomePage.ets(253:11)", "entry");
            // 标题行 - 包含标题和状态信息
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('华为云设备数据');
            Text.debugLine("entry/src/main/ets/components/home/HomePage.ets(254:13)", "entry");
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#00E5FF');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/components/home/HomePage.ets(259:13)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 根据加载状态显示不同信息
            if (this.iotLoading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('加载中');
                        Text.debugLine("entry/src/main/ets/components/home/HomePage.ets(263:15)", "entry");
                        Text.fontSize(14);
                        Text.fontColor('#B0BEC5');
                    }, Text);
                    Text.pop();
                });
            }
            else if (this.iotError) {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.iotError);
                        Text.debugLine("entry/src/main/ets/components/home/HomePage.ets(267:15)", "entry");
                        Text.fontSize(14);
                        Text.fontColor('#FF4081');
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.iotDebug);
                        Text.debugLine("entry/src/main/ets/components/home/HomePage.ets(271:15)", "entry");
                        Text.fontSize(12);
                        Text.fontColor('#B0BEC5');
                    }, Text);
                    Text.pop();
                });
            }
        }, If);
        If.pop();
        // 标题行 - 包含标题和状态信息
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 传感器数据卡片（垂直排列）
            Column.create({ space: 12 });
            Column.debugLine("entry/src/main/ets/components/home/HomePage.ets(279:11)", "entry");
            // 传感器数据卡片（垂直排列）
            Column.width('100%');
        }, Column);
        this.SensorWarningCard.bind(this)({ "id": 0, "type": 30000, params: ['环境温度.png'], "bundleName": "com.example.myapplication", "moduleName": "entry" }, // 温度图标
        '温度', () => this.iotTemperature, // 温度值获取函数
        '°C', // 单位
        '#FF4081', // 颜色（荧光粉）
        18, // 最低阈值
        35, // 最高阈值
        '温度正常' // 正常状态文本
        );
        this.SensorWarningCard.bind(this)({ "id": 0, "type": 30000, params: ['土壤湿度.png'], "bundleName": "com.example.myapplication", "moduleName": "entry" }, // 湿度图标
        '湿度', () => this.iotHumidity, // 湿度值获取函数
        '%', // 单位
        '#00E5FF', // 颜色（青色）
        30, // 最低阈值
        80, // 最高阈值
        '湿度正常' // 正常状态文本
        );
        this.SensorWarningCard.bind(this)({ "id": 0, "type": 30000, params: ['光照强度-copy.png'], "bundleName": "com.example.myapplication", "moduleName": "entry" }, // 光照图标
        '光照', () => this.iotLight, // 光照值获取函数
        'Lx', // 单位
        '#FFAB40', // 颜色（荧光橙）
        0, // 最低阈值（0表示无最低限制）
        0, // 最高阈值（0表示无最高限制）
        '光照正常' // 正常状态文本
        );
        // 传感器数据卡片（垂直排列）
        Column.pop();
        // ========== 华为云设备数据 ==========
        // 从华为云IoT平台获取的设备数据
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // ========== 传感器监测区域 ==========
            // 本地传感器数据监测（带预警功能）
            Column.create();
            Column.debugLine("entry/src/main/ets/components/home/HomePage.ets(329:9)", "entry");
            // ========== 传感器监测区域 ==========
            // 本地传感器数据监测（带预警功能）
            Column.width('92%');
            // ========== 传感器监测区域 ==========
            // 本地传感器数据监测（带预警功能）
            Column.padding(16);
            // ========== 传感器监测区域 ==========
            // 本地传感器数据监测（带预警功能）
            Column.backgroundColor('#1E1E1E');
            // ========== 传感器监测区域 ==========
            // 本地传感器数据监测（带预警功能）
            Column.borderRadius(16);
            // ========== 传感器监测区域 ==========
            // 本地传感器数据监测（带预警功能）
            Column.shadow({
                radius: 8,
                color: 'rgba(0, 229, 255, 0.1)',
                offsetX: 0,
                offsetY: 2
            });
            // ========== 传感器监测区域 ==========
            // 本地传感器数据监测（带预警功能）
            Column.margin({ bottom: 20 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 标题行 - 带预警图标
            Row.create();
            Row.debugLine("entry/src/main/ets/components/home/HomePage.ets(331:11)", "entry");
            // 标题行 - 带预警图标
            Row.alignSelf(ItemAlign.Start);
            // 标题行 - 带预警图标
            Row.margin({ bottom: 16 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('⚠️');
            Text.debugLine("entry/src/main/ets/components/home/HomePage.ets(332:13)", "entry");
            Text.fontSize(16);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('传感器监测');
            Text.debugLine("entry/src/main/ets/components/home/HomePage.ets(335:13)", "entry");
            Text.fontSize(16);
            Text.fontColor('#00E5FF');
            Text.fontWeight(FontWeight.Bold);
            Text.margin({ left: 6 });
        }, Text);
        Text.pop();
        // 标题行 - 带预警图标
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 传感器数据卡片（垂直排列）
            Column.create({ space: 12 });
            Column.debugLine("entry/src/main/ets/components/home/HomePage.ets(345:11)", "entry");
            // 传感器数据卡片（垂直排列）
            Column.width('100%');
        }, Column);
        this.SensorWarningCard.bind(this)({ "id": 0, "type": 30000, params: ['环境温度.png'], "bundleName": "com.example.myapplication", "moduleName": "entry" }, // 温度图标
        '温度', () => this.temperature, // 温度值获取函数（本地传感器）
        '°C', // 单位
        '#FF4081', // 颜色（荧光粉）
        18, // 最低阈值
        35, // 最高阈值
        '温度正常' // 正常状态文本
        );
        this.SensorWarningCard.bind(this)({ "id": 0, "type": 30000, params: ['土壤湿度.png'], "bundleName": "com.example.myapplication", "moduleName": "entry" }, // 湿度图标
        '湿度', () => this.soilHumidity, // 湿度值获取函数（本地传感器）
        '%', // 单位
        '#00E5FF', // 颜色（青色）
        30, // 最低阈值
        80, // 最高阈值
        '湿度正常' // 正常状态文本
        );
        this.SensorWarningCard.bind(this)({ "id": 0, "type": 30000, params: ['光照强度-copy.png'], "bundleName": "com.example.myapplication", "moduleName": "entry" }, // 光照图标
        '光照', () => this.lightIntensity, // 光照值获取函数（本地传感器）
        'Lx', // 单位
        '#FFAB40', // 颜色（荧光橙）
        300, // 最低阈值
        2000, // 最高阈值
        '光照正常' // 正常状态文本
        );
        // 传感器数据卡片（垂直排列）
        Column.pop();
        // ========== 传感器监测区域 ==========
        // 本地传感器数据监测（带预警功能）
        Column.pop();
        Column.pop();
        Scroll.pop();
    }
    async aboutToAppear() {
        const t = this.loadConfig();
        const tok1: string = t && t.token ? (t.token as string) : '';
        const tok2: string = t && t.XSubjectToken ? (t.XSubjectToken as string) : '';
        const tok: string = tok1.length > 0 ? tok1 : tok2;
        if (tok.length > 0 && t) {
            AppStorage.setOrCreate('token', tok);
            this.signAuthorization = t.Authorization ?? '';
            this.signContentSha256 = t.XSdkContentSha256 ?? '';
            this.signSecurityToken = t.XSecurityToken ?? '';
            this.signLanguage = t.XLanguage ?? '';
            this.signProjectId = t.XProjectId ?? '';
            this.signSdkDate = t.XSdkDate ?? '';
            this.signHost = t.Host ?? '';
            this.signInstanceId = t.InstanceId ?? '';
            this.fetchIotShadow();
        }
        else {
            this.getToken();
        }
    }
    private getHeaderToken(headers: Object | undefined): string {
        if (!headers) {
            return '';
        }
        const keys = Object.keys(headers as Object);
        for (let i = 0; i < keys.length; i++) {
            const k = keys[i];
            if (k && typeof k === 'string' && k.toLowerCase() === 'x-subject-token') {
                const v = Reflect.get(headers as Object, k) as Object | undefined;
                if (v && typeof v === 'string') {
                    return v as string;
                }
            }
        }
        return '';
    }
    getToken() {
        const url = `${AppConfig.IAM_ENDPOINT}/v3/auth/tokens`;
        const body: IAMBody = {
            auth: {
                identity: {
                    methods: ['password'],
                    password: {
                        user: {
                            name: AppConfig.IAM_USER_NAME,
                            password: AppConfig.IAM_PASSWORD,
                            domain: { name: AppConfig.IAM_DOMAIN_NAME }
                        }
                    }
                },
                scope: {
                    project: { id: AppConfig.IAM_PROJECT_ID }
                }
            }
        };
        let httpRequest: http.HttpRequest = http.createHttp();
        httpRequest.request(url, {
            method: http.RequestMethod.POST,
            header: { 'Content-Type': 'application/json' },
            connectTimeout: AppConfig.REQUEST_TIMEOUT,
            readTimeout: AppConfig.REQUEST_TIMEOUT,
            extraData: JSON.stringify(body)
        }).then((data) => {
            console.info('httpRequest login:' + JSON.stringify(data));
            if (data.responseCode === 201) {
                const h = (data as http.HttpResponse).header as Object | undefined;
                const token: string = this.getHeaderToken(h);
                if (token && token.length > 0) {
                    AppStorage.setOrCreate('token', token);
                    this.saveConfig(token);
                    promptAction.showToast({ message: '获取成功' });
                    this.fetchIotShadow();
                }
                else {
                    promptAction.showToast({ message: '获取权限失败' });
                }
            }
            else {
                promptAction.showToast({ message: '获取权限失败' });
            }
        }).catch((err: Object) => {
            console.info('httpRequest err:' + JSON.stringify(err));
            promptAction.showToast({ message: '获取失败' });
        }).finally(() => {
            httpRequest.destroy();
        });
    }
    private saveConfig(token: string): void {
        const ctx = getContext(this);
        const p: string = ctx.filesDir + '/cofing.json';
        const content: string = '{' +
            '"token":"' + token + '",' +
            '"endpoint":"' + AppConfig.IAM_ENDPOINT + '",' +
            '"domain":"' + AppConfig.IAM_DOMAIN_NAME + '",' +
            '"user":"' + AppConfig.IAM_USER_NAME + '",' +
            '"region":"' + AppConfig.IAM_REGION_NAME + '",' +
            '"projectId":"' + AppConfig.IAM_PROJECT_ID + '",' +
            '"savedAt":"' + new Date().toISOString() + '"' +
            '}';
        try {
            const file = fs.openSync(p, fs.OpenMode.CREATE | fs.OpenMode.TRUNC | fs.OpenMode.WRITE_ONLY);
            const encoder = new util.TextEncoder();
            const bytes = encoder.encode(content);
            fs.writeSync(file.fd, bytes);
            fs.closeSync(file.fd);
        }
        catch (_) { }
    }
    private loadConfig(): ConfigFile | undefined {
        const ctx = getContext(this);
        const p: string = ctx.filesDir + '/cofing.json';
        try {
            const file = fs.openSync(p, fs.OpenMode.READ_ONLY);
            const buf = new ArrayBuffer(16384);
            const n = fs.readSync(file.fd, buf, { offset: 0 });
            fs.closeSync(file.fd);
            if (n > 0) {
                const dec = util.TextDecoder.create('utf-8');
                const s = dec.decode(new Uint8Array(buf.slice(0, n)));
                const j = JSON.parse(s) as Object;
                const cfg: ConfigFile = {
                    token: Reflect.get(j, 'token') as string | undefined,
                    XSubjectToken: Reflect.get(j, 'X-Subject-Token') as string | undefined,
                    Authorization: Reflect.get(j, 'Authorization') as string | undefined,
                    XSdkContentSha256: Reflect.get(j, 'X-Sdk-Content-Sha256') as string | undefined,
                    XSecurityToken: Reflect.get(j, 'X-Security-Token') as string | undefined,
                    UserAgent: Reflect.get(j, 'User-Agent') as string | undefined,
                    Host: Reflect.get(j, 'Host') as string | undefined,
                    InstanceId: Reflect.get(j, 'Instance-Id') as string | undefined,
                    XLanguage: Reflect.get(j, 'X-Language') as string | undefined,
                    XProjectId: Reflect.get(j, 'X-Project-Id') as string | undefined,
                    XSdkDate: Reflect.get(j, 'X-Sdk-Date') as string | undefined,
                };
                return cfg;
            }
        }
        catch (_) { }
        return undefined;
    }
    /**
     * 获取设备影子数据
     */
    private fetchIotShadow(): void {
        const token = AppStorage.get('token') as string;
        if (!token) {
            this.iotDebug = 'Token 空';
            return;
        }
        /* ====== ① 选择域名：优先签名Host，其次配置Endpoint ====== */
        const projectId = (this.signProjectId.length > 0) ? this.signProjectId : AppConfig.IOTDA_PROJECT_ID;
        const deviceId = AppConfig.IOTDA_DEBUG_DEVICE_ID;
        const base = (this.signHost.length > 0) ? ('https://' + this.signHost) : AppConfig.IOTDA_ENDPOINT;
        const url = `${base}/v5/iot/${projectId}/devices/${deviceId}/shadow`;
        this.iotLoading = true;
        this.iotError = '';
        this.iotDebug = '请求中...';
        const httpRequest = http.createHttp();
        const iidBase: string = '' + (this.signInstanceId.length > 0 ? this.signInstanceId : AppConfig.IOTDA_INSTANCE_ID);
        const iid: string = '' + iidBase;
        const useSigned: boolean = (this.signAuthorization.length > 0);
        const headers: HttpHeaders = useSigned
            ? {
                'Authorization': this.signAuthorization,
                'X-Sdk-Content-Sha256': (this.signContentSha256.length > 0) ? this.signContentSha256 : 'UNSIGNED-PAYLOAD',
                'X-Security-Token': this.signSecurityToken,
                'X-Language': (this.signLanguage.length > 0) ? this.signLanguage : 'zh-cn',
                'X-Project-Id': projectId,
                'X-Sdk-Date': (this.signSdkDate.length > 0) ? this.signSdkDate : '',
                'Instance-Id': iid,
                'Host': this.signHost,
                'Content-Type': 'application/json'
            }
            : (iid
                ? { 'X-Auth-Token': token, 'Content-Type': 'application/json', 'Instance-Id': iid }
                : { 'X-Auth-Token': token, 'Content-Type': 'application/json' });
        console.info('IoTDA GET url:' + url);
        console.info('IoTDA headers:' + JSON.stringify(headers));
        httpRequest.request(url, {
            method: http.RequestMethod.GET,
            header: headers,
            connectTimeout: 3000,
            readTimeout: 3000
        }).then((data: http.HttpResponse) => {
            console.info('IoTDA response:' + JSON.stringify(data));
            if (data.responseCode === 200 && data.result) {
                try {
                    const json = JSON.parse(data.result as string) as IotShadowResponse;
                    let props: IotShadowProperties | undefined = undefined;
                    if (json.shadow && json.shadow.length > 0) {
                        for (let i = 0; i < json.shadow.length; i++) {
                            const s = json.shadow[i];
                            if (s && s.service_id === 'environment' && s.reported && s.reported.properties) {
                                props = s.reported.properties as IotShadowProperties;
                                break;
                            }
                        }
                    }
                    if (props) {
                        if (typeof props.temperature === 'number') {
                            this.iotTemperature = props.temperature as number;
                        }
                        if (typeof props.humidity === 'number') {
                            this.iotHumidity = props.humidity as number;
                        }
                        if (typeof props.illumination === 'number') {
                            this.iotLight = props.illumination as number;
                        }
                        this.iotDebug = '更新于 ' + new Date().toLocaleTimeString();
                        console.info('iot values:' + JSON.stringify({
                            temperature: this.iotTemperature,
                            humidity: this.iotHumidity,
                            illumination: this.iotLight
                        }));
                        return; // 成功直接返回
                    }
                    this.iotDebug = 'properties 为空';
                }
                catch (_) {
                    this.iotDebug = 'JSON 解析失败';
                }
            }
            else {
                let extra: string = '';
                try {
                    const err = JSON.parse(data.result as string) as IotErrorBody;
                    if (err && err.error_code) {
                        extra = `${err.error_code} ${err.error_msg ?? ''}`;
                    }
                }
                catch (_) { }
                this.iotDebug = data.responseCode === 401
                    ? 'HTTP401 未授权/Token失效'
                    : (data.responseCode === 403
                        ? `HTTP403 ${extra || '权限不足/项目或实例不匹配'}`
                        : `HTTP${data.responseCode}`);
            }
        }).catch(() => {
            console.error('IoTDA request error');
            this.iotDebug = '网络/超时错误';
        }).finally(() => {
            this.iotLoading = false;
            httpRequest.destroy();
        });
    }
    /**
     * 统计数据项
     */
    StatItem(title: string, value: string, color: string, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/components/home/HomePage.ets(654:5)", "entry");
            Column.layoutWeight(1);
            Column.padding(12);
            Column.backgroundColor('#2D2D2D');
            Column.borderRadius(12);
            Column.margin({ right: 6, left: 6 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(title);
            Text.debugLine("entry/src/main/ets/components/home/HomePage.ets(655:7)", "entry");
            Text.fontSize(12);
            Text.fontColor('#B0BEC5');
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(value);
            Text.debugLine("entry/src/main/ets/components/home/HomePage.ets(660:7)", "entry");
            Text.fontSize(22);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(color);
        }, Text);
        Text.pop();
        Column.pop();
    }
    /**
     * 传感器预警卡片
     */
    SensorWarningCard(icon: Resource, name: string, valueGetter: () => number, unit: string, color: string, minThreshold: number, maxThreshold: number, normalMsg: string, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/components/home/HomePage.ets(686:5)", "entry");
            Row.width('100%');
            Row.padding(16);
            Row.backgroundColor('#2D2D2D');
            Row.borderRadius(12);
            Row.border({
                width: 1,
                color: (valueGetter() > 0 && (valueGetter() < minThreshold || valueGetter() > maxThreshold))
                    ? '#FFAB40' // 异常时荧光橙
                    : '#333333' // 正常时深灰色
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 左侧图标和名称
            Row.create();
            Row.debugLine("entry/src/main/ets/components/home/HomePage.ets(688:7)", "entry");
            // 左侧图标和名称
            Row.layoutWeight(1);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create(icon);
            Image.debugLine("entry/src/main/ets/components/home/HomePage.ets(689:9)", "entry");
            Image.width(32);
            Image.height(32);
            Image.fillColor(color);
            Image.margin({ right: 12 });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/components/home/HomePage.ets(695:9)", "entry");
            Column.alignItems(HorizontalAlign.Start);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(name);
            Text.debugLine("entry/src/main/ets/components/home/HomePage.ets(696:11)", "entry");
            Text.fontSize(14);
            Text.fontColor('#FFFFFF');
            Text.fontWeight(FontWeight.Medium);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.lastUpdateTime || '等待更新...');
            Text.debugLine("entry/src/main/ets/components/home/HomePage.ets(701:11)", "entry");
            Text.fontSize(11);
            Text.fontColor('#B0BEC5');
            Text.margin({ top: 2 });
        }, Text);
        Text.pop();
        Column.pop();
        // 左侧图标和名称
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 右侧数值和状态
            Column.create();
            Column.debugLine("entry/src/main/ets/components/home/HomePage.ets(711:7)", "entry");
            // 右侧数值和状态
            Column.alignItems(HorizontalAlign.End);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 4 });
            Row.debugLine("entry/src/main/ets/components/home/HomePage.ets(712:9)", "entry");
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.formatNumber(valueGetter(), unit));
            Text.debugLine("entry/src/main/ets/components/home/HomePage.ets(713:11)", "entry");
            Text.fontSize(22);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(color);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(unit);
            Text.debugLine("entry/src/main/ets/components/home/HomePage.ets(718:11)", "entry");
            Text.fontSize(13);
            Text.fontColor('#B0BEC5');
            Text.margin({ top: 6 });
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 状态提示
            Text.create(this.getSensorStatus(valueGetter(), minThreshold, maxThreshold, normalMsg));
            Text.debugLine("entry/src/main/ets/components/home/HomePage.ets(725:9)", "entry");
            // 状态提示
            Text.fontSize(11);
            // 状态提示
            Text.fontColor(this.getSensorStatusColor(valueGetter(), minThreshold, maxThreshold));
            // 状态提示
            Text.margin({ top: 4 });
        }, Text);
        // 状态提示
        Text.pop();
        // 右侧数值和状态
        Column.pop();
        Row.pop();
    }
    /**
     * 获取传感器状态文本
     */
    private getSensorStatus(value: number, minThreshold: number, maxThreshold: number, normalMsg: string): string {
        if (value <= 0) {
            return '等待数据...';
        }
        if (value < minThreshold) {
            return '⚠️ 偏低';
        }
        if (value > maxThreshold) {
            return '⚠️ 偏高';
        }
        return `✅ ${normalMsg}`;
    }
    /**
     * 获取传感器状态颜色
     */
    private getSensorStatusColor(value: number, minThreshold: number, maxThreshold: number): string {
        if (value === 0) {
            return '#999999';
        }
        if (value < minThreshold || value > maxThreshold) {
            return '#FF6B6B';
        }
        return '#52C41A';
    }
    private formatNumber(v: number, unit: string): string {
        if (typeof v !== 'number') {
            return '--';
        }
        const n: number = unit === 'Lx' ? Math.round(v) : Math.round(v * 10) / 10;
        return '' + n;
    }
    rerender() {
        this.updateDirtyElements();
    }
}
