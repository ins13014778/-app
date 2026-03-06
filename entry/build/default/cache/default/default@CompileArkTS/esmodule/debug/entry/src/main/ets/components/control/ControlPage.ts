if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface ControlPage_Params {
    controlDevices?: ControlDevice[];
    mqttStatus?: MqttStatus;
    mqttStatusText?: string;
    bemfaUID?: string;
    onlineDeviceCount?: number;
    activeDeviceCount?: number;
    sensorDataList?: SensorData[];
    // 回调函数
    getMqttStatusIcon?: () => string;
    getMqttStatusColor?: () => string;
    getMaskedUID?: () => string;
    toggleAllDevicesMQTT?: (isActive: boolean) => Promise<void>;
    refreshDeviceOnlineStatus?: () => void;
    syncDevicesFromBemfa?: () => void;
    refreshSensorData?: () => void;
    onToggleDevice?: (deviceId: number, isOn: boolean) => Promise<void>;
    onEditDeviceName?: (device: ControlDevice) => void;
}
import type { ControlDevice } from '../../types/IndexTypes';
import { MqttStatus } from "@normalized:N&&&entry/src/main/ets/services/MqttService&";
import type { SensorData } from './SensorDataCard';
import { AppColors } from "@normalized:N&&&entry/src/main/ets/constants/AppConstants&";
export class ControlPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__controlDevices = new SynchedPropertyObjectTwoWayPU(params.controlDevices, this, "controlDevices");
        this.__mqttStatus = new SynchedPropertySimpleTwoWayPU(params.mqttStatus, this, "mqttStatus");
        this.__mqttStatusText = new SynchedPropertySimpleTwoWayPU(params.mqttStatusText, this, "mqttStatusText");
        this.__bemfaUID = new SynchedPropertySimpleTwoWayPU(params.bemfaUID, this, "bemfaUID");
        this.__onlineDeviceCount = new SynchedPropertySimpleTwoWayPU(params.onlineDeviceCount, this, "onlineDeviceCount");
        this.__activeDeviceCount = new SynchedPropertySimpleTwoWayPU(params.activeDeviceCount, this, "activeDeviceCount");
        this.__sensorDataList = new SynchedPropertyObjectTwoWayPU(params.sensorDataList, this, "sensorDataList");
        this.getMqttStatusIcon = (): string => '⚪';
        this.getMqttStatusColor = (): string => '#999999';
        this.getMaskedUID = (): string => '未配置';
        this.toggleAllDevicesMQTT = async (isActive: boolean): Promise<void> => { };
        this.refreshDeviceOnlineStatus = (): void => { };
        this.syncDevicesFromBemfa = (): void => { };
        this.refreshSensorData = (): void => { };
        this.onToggleDevice = async (deviceId: number, isOn: boolean): Promise<void> => { };
        this.onEditDeviceName = (device: ControlDevice): void => { };
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: ControlPage_Params) {
        if (params.getMqttStatusIcon !== undefined) {
            this.getMqttStatusIcon = params.getMqttStatusIcon;
        }
        if (params.getMqttStatusColor !== undefined) {
            this.getMqttStatusColor = params.getMqttStatusColor;
        }
        if (params.getMaskedUID !== undefined) {
            this.getMaskedUID = params.getMaskedUID;
        }
        if (params.toggleAllDevicesMQTT !== undefined) {
            this.toggleAllDevicesMQTT = params.toggleAllDevicesMQTT;
        }
        if (params.refreshDeviceOnlineStatus !== undefined) {
            this.refreshDeviceOnlineStatus = params.refreshDeviceOnlineStatus;
        }
        if (params.syncDevicesFromBemfa !== undefined) {
            this.syncDevicesFromBemfa = params.syncDevicesFromBemfa;
        }
        if (params.refreshSensorData !== undefined) {
            this.refreshSensorData = params.refreshSensorData;
        }
        if (params.onToggleDevice !== undefined) {
            this.onToggleDevice = params.onToggleDevice;
        }
        if (params.onEditDeviceName !== undefined) {
            this.onEditDeviceName = params.onEditDeviceName;
        }
    }
    updateStateVars(params: ControlPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__controlDevices.purgeDependencyOnElmtId(rmElmtId);
        this.__mqttStatus.purgeDependencyOnElmtId(rmElmtId);
        this.__mqttStatusText.purgeDependencyOnElmtId(rmElmtId);
        this.__bemfaUID.purgeDependencyOnElmtId(rmElmtId);
        this.__onlineDeviceCount.purgeDependencyOnElmtId(rmElmtId);
        this.__activeDeviceCount.purgeDependencyOnElmtId(rmElmtId);
        this.__sensorDataList.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__controlDevices.aboutToBeDeleted();
        this.__mqttStatus.aboutToBeDeleted();
        this.__mqttStatusText.aboutToBeDeleted();
        this.__bemfaUID.aboutToBeDeleted();
        this.__onlineDeviceCount.aboutToBeDeleted();
        this.__activeDeviceCount.aboutToBeDeleted();
        this.__sensorDataList.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __controlDevices: SynchedPropertySimpleOneWayPU<ControlDevice[]>;
    get controlDevices() {
        return this.__controlDevices.get();
    }
    set controlDevices(newValue: ControlDevice[]) {
        this.__controlDevices.set(newValue);
    }
    private __mqttStatus: SynchedPropertySimpleTwoWayPU<MqttStatus>;
    get mqttStatus() {
        return this.__mqttStatus.get();
    }
    set mqttStatus(newValue: MqttStatus) {
        this.__mqttStatus.set(newValue);
    }
    private __mqttStatusText: SynchedPropertySimpleTwoWayPU<string>;
    get mqttStatusText() {
        return this.__mqttStatusText.get();
    }
    set mqttStatusText(newValue: string) {
        this.__mqttStatusText.set(newValue);
    }
    private __bemfaUID: SynchedPropertySimpleTwoWayPU<string>;
    get bemfaUID() {
        return this.__bemfaUID.get();
    }
    set bemfaUID(newValue: string) {
        this.__bemfaUID.set(newValue);
    }
    private __onlineDeviceCount: SynchedPropertySimpleTwoWayPU<number>;
    get onlineDeviceCount() {
        return this.__onlineDeviceCount.get();
    }
    set onlineDeviceCount(newValue: number) {
        this.__onlineDeviceCount.set(newValue);
    }
    private __activeDeviceCount: SynchedPropertySimpleTwoWayPU<number>;
    get activeDeviceCount() {
        return this.__activeDeviceCount.get();
    }
    set activeDeviceCount(newValue: number) {
        this.__activeDeviceCount.set(newValue);
    }
    private __sensorDataList: SynchedPropertySimpleOneWayPU<SensorData[]>;
    get sensorDataList() {
        return this.__sensorDataList.get();
    }
    set sensorDataList(newValue: SensorData[]) {
        this.__sensorDataList.set(newValue);
    }
    // 回调函数
    private getMqttStatusIcon: () => string;
    private getMqttStatusColor: () => string;
    private getMaskedUID: () => string;
    private toggleAllDevicesMQTT: (isActive: boolean) => Promise<void>;
    private refreshDeviceOnlineStatus: () => void;
    private syncDevicesFromBemfa: () => void;
    private refreshSensorData: () => void;
    private onToggleDevice: (deviceId: number, isOn: boolean) => Promise<void>;
    private onEditDeviceName: (device: ControlDevice) => void;
    // 获取当前时间
    private getCurrentTime(): string {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.scrollable(ScrollDirection.Vertical);
            Scroll.scrollBar(BarState.Auto);
            Scroll.edgeEffect(EdgeEffect.Spring);
            Scroll.width('100%');
            Scroll.height('100%');
            Scroll.backgroundColor(AppColors.APP_BG);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding({ left: 16, right: 16, top: 0, bottom: 20 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 顶部大卡片
            Column.create();
            // 顶部大卡片
            Column.width('100%');
            // 顶部大卡片
            Column.padding(16);
            // 顶部大卡片
            Column.backgroundColor('#FFFFFF');
            // 顶部大卡片
            Column.borderRadius(16);
            // 顶部大卡片
            Column.shadow({
                radius: 12,
                color: 'rgba(0, 0, 0, 0.06)',
                offsetX: 0,
                offsetY: 3
            });
            // 顶部大卡片
            Column.margin({ top: 16, bottom: 16 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 温室标题行
            Row.create();
            // 温室标题行
            Row.width('100%');
            // 温室标题行
            Row.margin({ bottom: 16 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('智慧农业小屋');
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#111111');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 在线状态
            Row.create();
            // 在线状态
            Row.padding({ left: 10, right: 10, top: 4, bottom: 4 });
            // 在线状态
            Row.backgroundColor(this.mqttStatus === MqttStatus.CONNECTED ? 'rgba(52, 199, 89, 0.12)' : '#E5E5EA');
            // 在线状态
            Row.borderRadius(12);
            // 在线状态
            Row.border({ width: 1, color: this.mqttStatus === MqttStatus.CONNECTED ? 'rgba(52, 199, 89, 0.28)' : 'transparent' });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('●');
            Text.fontSize(12);
            Text.fontColor(this.mqttStatus === MqttStatus.CONNECTED ? AppColors.PRIMARY_COLOR : '#666666');
            Text.margin({ right: 4 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.mqttStatus === MqttStatus.CONNECTED ? '在线' : '离线');
            Text.fontSize(13);
            Text.fontColor(this.mqttStatus === MqttStatus.CONNECTED ? AppColors.PRIMARY_COLOR : '#999999');
        }, Text);
        Text.pop();
        // 在线状态
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 时间
            Text.create(this.getCurrentTime());
            // 时间
            Text.fontSize(13);
            // 时间
            Text.fontColor('#B0BEC5');
            // 时间
            Text.margin({ left: 12 });
        }, Text);
        // 时间
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 展开按钮
            Text.create('∧');
            // 展开按钮
            Text.fontSize(16);
            // 展开按钮
            Text.fontColor(AppColors.PRIMARY_COLOR);
            // 展开按钮
            Text.margin({ left: 8 });
        }, Text);
        // 展开按钮
        Text.pop();
        // 温室标题行
        Row.pop();
        // 顶部大卡片
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 设备控制按钮 - 优化为GridRow布局
            if (this.controlDevices.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.padding(16);
                        Column.backgroundColor('#FFFFFF');
                        Column.borderRadius(16);
                        Column.shadow({
                            radius: 8,
                            color: 'rgba(0, 0, 0, 0.06)',
                            offsetX: 0,
                            offsetY: 2
                        });
                        Column.margin({ bottom: 16 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('设备控制');
                        Text.fontSize(16);
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontColor(AppColors.PRIMARY_COLOR);
                        Text.width('100%');
                        Text.margin({ bottom: 12 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        GridRow.create({ columns: 4, gutter: 12 });
                        GridRow.width('100%');
                    }, GridRow);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = (_item, index: number) => {
                            const device = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                GridCol.create();
                            }, GridCol);
                            this.DeviceControlButton.bind(this)(device);
                            GridCol.pop();
                        };
                        this.forEachUpdateFunction(elmtId, this.controlDevices, forEachItemGenFunction, undefined, true, false);
                    }, ForEach);
                    ForEach.pop();
                    GridRow.pop();
                    Column.pop();
                });
            }
            // 传感器数据网格（2列布局）
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 传感器数据网格（2列布局）
            if (this.sensorDataList.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.padding(16);
                        Column.backgroundColor('#FFFFFF');
                        Column.borderRadius(16);
                        Column.shadow({
                            radius: 8,
                            color: 'rgba(0, 0, 0, 0.06)',
                            offsetX: 0,
                            offsetY: 2
                        });
                        Column.margin({ bottom: 16 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('环境监测');
                        Text.fontSize(16);
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontColor(AppColors.PRIMARY_COLOR);
                        Text.width('100%');
                        Text.margin({ bottom: 12 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        GridRow.create({ columns: 2, gutter: 12 });
                    }, GridRow);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const sensorData = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                GridCol.create();
                            }, GridCol);
                            this.SensorDataCard.bind(this)(sensorData);
                            GridCol.pop();
                        };
                        this.forEachUpdateFunction(elmtId, this.sensorDataList, forEachItemGenFunction);
                    }, ForEach);
                    ForEach.pop();
                    GridRow.pop();
                    Column.pop();
                });
            }
            // 底部空状态
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 底部空状态
            if (this.controlDevices.length === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('90%');
                        Column.padding({ top: 40, bottom: 40 });
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('📱');
                        Text.fontSize(64);
                        Text.margin({ bottom: 16 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('暂无设备');
                        Text.fontSize(18);
                        Text.fontColor('#666666');
                        Text.margin({ bottom: 8 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('系统正在从巴法云同步设备...');
                        Text.fontSize(14);
                        Text.fontColor('#999999');
                        Text.margin({ bottom: 24 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('手动同步');
                        Button.fontSize(16);
                        Button.fontColor('#FFFFFF');
                        Button.backgroundColor(AppColors.PRIMARY_COLOR);
                        Button.borderRadius(8);
                        Button.height(44);
                        Button.padding({ left: 32, right: 32 });
                        Button.onClick(() => {
                            this.syncDevicesFromBemfa();
                        });
                    }, Button);
                    Button.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Column.pop();
        Scroll.pop();
    }
    /**
     * 根据设备主题获取对应的图标
     */
    private getDeviceIcon(topic: string): string {
        const iconMap: Record<string, string> = {
            'auto': '智能灌溉.png',
            'buzzerctrl': '蜂鸣器.png',
            'choushui': '抽水.png',
            'hum': '土壤湿度.png',
            'lcd1602': 'LCD屏幕.png',
            'ledctrl': 'LED灯.png',
            'light': '光照传感器.png',
            'pump': '操作-手动.png',
            'soil': '土壤温度.png',
            'tem': '温度传感器.png',
            'water': '水深.png' // 水深
        };
        return iconMap[topic] || '控制.png'; // 默认图标
    }
    /**
     * 设备控制按钮
     */
    DeviceControlButton(device: ControlDevice, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 圆形按钮
            Column.create();
            Context.animation({
                duration: 300,
                curve: Curve.EaseInOut
            });
            // 圆形按钮
            Column.width(64);
            // 圆形按钮
            Column.height(64);
            // 圆形按钮
            Column.backgroundColor(device.isActive ? '#34C759' : '#F2F2F7');
            // 圆形按钮
            Column.borderRadius(32);
            // 圆形按钮
            Column.justifyContent(FlexAlign.Center);
            // 圆形按钮
            Column.border({
                width: device.isActive ? 0 : 2,
                color: device.isActive ? 'transparent' : '#D1D1D6'
            });
            // 圆形按钮
            Column.shadow({
                radius: device.isActive ? 12 : 4,
                color: device.isActive ? 'rgba(52, 199, 89, 0.45)' : 'rgba(0, 0, 0, 0.06)',
                offsetX: 0,
                offsetY: 2
            });
            Context.animation(null);
            // 圆形按钮
            Column.onClick(async () => {
                console.info(`[ControlPage] 点击设备: ${device.name}`);
                // 立即更新UI状态（乐观更新）
                const targetState = !device.isActive;
                // 调用控制命令
                try {
                    await this.onToggleDevice(device.id, targetState);
                }
                catch (error) {
                    console.error(`[ControlPage] ❌ 控制失败:`, error);
                }
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 显示设备对应的图标
            Image.create({ "id": -1, "type": 30000, params: [this.getDeviceIcon(device.topic)], "bundleName": "com.example.myapplication", "moduleName": "entry" });
            Context.animation({
                duration: 200,
                curve: Curve.EaseInOut
            });
            // 显示设备对应的图标
            Image.width(36);
            // 显示设备对应的图标
            Image.height(36);
            // 显示设备对应的图标
            Image.fillColor(device.isActive ? '#FFFFFF' : '#8E8E93');
            Context.animation(null);
        }, Image);
        // 圆形按钮
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 设备名称
            Text.create(device.name);
            // 设备名称
            Text.fontSize(13);
            // 设备名称
            Text.fontColor('#111111');
            // 设备名称
            Text.fontWeight(FontWeight.Medium);
            // 设备名称
            Text.margin({ top: 8 });
            // 设备名称
            Text.maxLines(1);
            // 设备名称
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
        }, Text);
        // 设备名称
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 状态标签
            Text.create(device.isActive ? '运行中' : '已关闭');
            // 状态标签
            Text.fontSize(10);
            // 状态标签
            Text.fontColor(device.isActive ? '#34C759' : '#8E8E93');
            // 状态标签
            Text.margin({ top: 2 });
        }, Text);
        // 状态标签
        Text.pop();
        Column.pop();
    }
    /**
     * 传感器数据卡片
     */
    SensorDataCard(sensorData: SensorData, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding(14);
            Column.backgroundColor('#F5F5F7');
            Column.borderRadius(12);
            Column.border({
                width: 1,
                color: '#E0E0E0'
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 标题
            Text.create(sensorData.name);
            // 标题
            Text.fontSize(14);
            // 标题
            Text.fontColor('#B0BEC5');
            // 标题
            Text.width('100%');
            // 标题
            Text.margin({ bottom: 12 });
        }, Text);
        // 标题
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 数值和图标
            Row.create();
            // 数值和图标
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.alignItems(HorizontalAlign.Start);
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 4 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(sensorData.value);
            Text.fontSize(24);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(this.getSensorColor(sensorData.topic));
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(sensorData.unit);
            Text.fontSize(13);
            Text.fontColor('#B0BEC5');
            Text.margin({ top: 8 });
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 更新时间
            if (sensorData.lastUpdateTime) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(sensorData.lastUpdateTime);
                        Text.fontSize(10);
                        Text.fontColor('#666666');
                        Text.margin({ top: 4 });
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 图标
            Image.create(this.getSensorIcon(sensorData.topic));
            // 图标
            Image.width(40);
            // 图标
            Image.height(40);
            // 图标
            Image.fillColor('#666666');
        }, Image);
        // 数值和图标
        Row.pop();
        Column.pop();
    }
    /**
     * 获取传感器颜色
     */
    private getSensorColor(topic: string): string {
        const colorMap: Record<string, string> = {
            'tem': '#FF4081',
            'temp': '#FF4081',
            'hum': AppColors.PRIMARY_COLOR,
            'light': '#FFAB40',
            'co2': '#B0BEC5',
            'pm25': '#B0BEC5' // 浅灰
        };
        return colorMap[topic] || '#666666';
    }
    /**
     * 获取传感器图标
     */
    private getSensorIcon(topic: string): Resource {
        const iconMap: Record<string, Resource> = {
            'tem': { "id": 0, "type": 30000, params: ['环境温度.png'], "bundleName": "com.example.myapplication", "moduleName": "entry" },
            'temp': { "id": 0, "type": 30000, params: ['环境温度.png'], "bundleName": "com.example.myapplication", "moduleName": "entry" },
            'hum': { "id": 0, "type": 30000, params: ['土壤湿度.png'], "bundleName": "com.example.myapplication", "moduleName": "entry" },
            'light': { "id": 0, "type": 30000, params: ['光照强度-copy.png'], "bundleName": "com.example.myapplication", "moduleName": "entry" }
        };
        return iconMap[topic] || { "id": 0, "type": 30000, params: ['数据分析.png'], "bundleName": "com.example.myapplication", "moduleName": "entry" };
    }
    rerender() {
        this.updateDirtyElements();
    }
}
