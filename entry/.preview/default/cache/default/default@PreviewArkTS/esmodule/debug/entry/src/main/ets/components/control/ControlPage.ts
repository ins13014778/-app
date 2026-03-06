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
    quickActions?: QuickActionItem[];
}
import type { ControlDevice } from '../../types/IndexTypes';
import { MqttStatus } from "@normalized:N&&&entry/src/main/ets/services/MqttService&";
import type { SensorData } from './SensorDataCard';
import promptAction from "@ohos:promptAction";
import router from "@ohos:router";
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
        this.quickActions = [
            { name: '自动化', icon: { "id": 0, "type": 30000, params: ['控制.png'], "bundleName": "com.example.myapplication", "moduleName": "entry" }, color: '#00E5FF' },
            { name: '数据分析', icon: { "id": 0, "type": 30000, params: ['分析.png'], "bundleName": "com.example.myapplication", "moduleName": "entry" }, color: '#FF4081' },
            { name: '设置', icon: { "id": 0, "type": 30000, params: ['首页.png'], "bundleName": "com.example.myapplication", "moduleName": "entry" }, color: '#FFAB40' } // 荧光橙
        ];
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
        if (params.quickActions !== undefined) {
            this.quickActions = params.quickActions;
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
    // 快捷功能按钮数据
    private quickActions: QuickActionItem[];
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
            Scroll.debugLine("entry/src/main/ets/components/control/ControlPage.ets(46:5)", "entry");
            Scroll.scrollable(ScrollDirection.Vertical);
            Scroll.scrollBar(BarState.Auto);
            Scroll.edgeEffect(EdgeEffect.Spring);
            Scroll.width('100%');
            Scroll.height('100%');
            Scroll.linearGradient({
                angle: 180,
                colors: [[0x121212, 0.0], [0x1E1E1E, 0.5], [0x2D2D2D, 1.0]]
            });
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/components/control/ControlPage.ets(47:7)", "entry");
            Column.width('100%');
            Column.padding({ top: 0, bottom: 20 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 顶部大卡片
            Column.create();
            Column.debugLine("entry/src/main/ets/components/control/ControlPage.ets(49:9)", "entry");
            // 顶部大卡片
            Column.width('92%');
            // 顶部大卡片
            Column.padding(16);
            // 顶部大卡片
            Column.backgroundColor('#1E1E1E');
            // 顶部大卡片
            Column.borderRadius(16);
            // 顶部大卡片
            Column.shadow({
                radius: 12,
                color: 'rgba(0, 229, 255, 0.1)',
                offsetX: 0,
                offsetY: 3
            });
            // 顶部大卡片
            Column.margin({ top: 16, bottom: 16 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 温室标题行
            Row.create();
            Row.debugLine("entry/src/main/ets/components/control/ControlPage.ets(51:11)", "entry");
            // 温室标题行
            Row.width('100%');
            // 温室标题行
            Row.margin({ bottom: 16 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('光明温室大棚');
            Text.debugLine("entry/src/main/ets/components/control/ControlPage.ets(52:13)", "entry");
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#FFFFFF');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/components/control/ControlPage.ets(57:13)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 在线状态
            Row.create();
            Row.debugLine("entry/src/main/ets/components/control/ControlPage.ets(60:13)", "entry");
            // 在线状态
            Row.padding({ left: 10, right: 10, top: 4, bottom: 4 });
            // 在线状态
            Row.backgroundColor(this.mqttStatus === MqttStatus.CONNECTED ? 'rgba(0, 229, 255, 0.1)' : '#2D2D2D');
            // 在线状态
            Row.borderRadius(12);
            // 在线状态
            Row.border({ width: 1, color: this.mqttStatus === MqttStatus.CONNECTED ? 'rgba(0, 229, 255, 0.3)' : 'transparent' });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('●');
            Text.debugLine("entry/src/main/ets/components/control/ControlPage.ets(61:15)", "entry");
            Text.fontSize(12);
            Text.fontColor(this.mqttStatus === MqttStatus.CONNECTED ? '#00E5FF' : '#666666');
            Text.margin({ right: 4 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.mqttStatus === MqttStatus.CONNECTED ? '在线' : '离线');
            Text.debugLine("entry/src/main/ets/components/control/ControlPage.ets(65:15)", "entry");
            Text.fontSize(13);
            Text.fontColor(this.mqttStatus === MqttStatus.CONNECTED ? '#00E5FF' : '#999999');
        }, Text);
        Text.pop();
        // 在线状态
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 时间
            Text.create(this.getCurrentTime());
            Text.debugLine("entry/src/main/ets/components/control/ControlPage.ets(75:13)", "entry");
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
            Text.debugLine("entry/src/main/ets/components/control/ControlPage.ets(81:13)", "entry");
            // 展开按钮
            Text.fontSize(16);
            // 展开按钮
            Text.fontColor('#00E5FF');
            // 展开按钮
            Text.margin({ left: 8 });
        }, Text);
        // 展开按钮
        Text.pop();
        // 温室标题行
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 快捷功能按钮
            Row.create();
            Row.debugLine("entry/src/main/ets/components/control/ControlPage.ets(90:11)", "entry");
            // 快捷功能按钮
            Row.width('100%');
            // 快捷功能按钮
            Row.justifyContent(FlexAlign.SpaceEvenly);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const item = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create();
                    Column.debugLine("entry/src/main/ets/components/control/ControlPage.ets(92:15)", "entry");
                    Column.layoutWeight(1);
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create();
                    Column.debugLine("entry/src/main/ets/components/control/ControlPage.ets(93:17)", "entry");
                    Column.width(48);
                    Column.height(48);
                    Column.backgroundColor(item.color);
                    Column.borderRadius(24);
                    Column.justifyContent(FlexAlign.Center);
                    Column.margin({ bottom: 6 });
                    Column.shadow({ radius: 8, color: item.color + '4D', offsetY: 2 });
                    Column.onClick(() => {
                        if (item.name === '自动化') {
                            router.pushUrl({
                                url: 'pages/AutomationTaskPage'
                            }).catch((err: Error) => {
                                console.error('[ControlPage] 自动化页面跳转失败:', err);
                                promptAction.showToast({
                                    message: '页面跳转失败',
                                    duration: 2000
                                });
                            });
                        }
                        else if (item.name === '数据分析') {
                            router.pushUrl({
                                url: 'pages/DataAnalysisPage'
                            }).catch((err: Error) => {
                                console.error('[ControlPage] 跳转失败:', err);
                                promptAction.showToast({
                                    message: '页面跳转失败',
                                    duration: 2000
                                });
                            });
                        }
                        else if (item.name === '设置') {
                            router.pushUrl({
                                url: 'pages/SettingsPage'
                            }).catch((err: Error) => {
                                console.error('[ControlPage] 设置页面跳转失败:', err);
                                promptAction.showToast({
                                    message: '页面跳转失败',
                                    duration: 2000
                                });
                            });
                        }
                        else {
                            promptAction.showToast({
                                message: `${item.name}功能开发中...`,
                                duration: 2000
                            });
                        }
                    });
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Image.create(item.icon);
                    Image.debugLine("entry/src/main/ets/components/control/ControlPage.ets(94:19)", "entry");
                    Image.width(24);
                    Image.height(24);
                    Image.fillColor('#FFFFFF');
                }, Image);
                Column.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(item.name);
                    Text.debugLine("entry/src/main/ets/components/control/ControlPage.ets(145:17)", "entry");
                    Text.fontSize(12);
                    Text.fontColor('#B0BEC5');
                }, Text);
                Text.pop();
                Column.pop();
            };
            this.forEachUpdateFunction(elmtId, this.quickActions, forEachItemGenFunction);
        }, ForEach);
        ForEach.pop();
        // 快捷功能按钮
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
                        Column.debugLine("entry/src/main/ets/components/control/ControlPage.ets(169:11)", "entry");
                        Column.width('92%');
                        Column.padding(16);
                        Column.backgroundColor('#1E1E1E');
                        Column.borderRadius(16);
                        Column.shadow({
                            radius: 8,
                            color: 'rgba(0, 229, 255, 0.1)',
                            offsetX: 0,
                            offsetY: 2
                        });
                        Column.margin({ bottom: 16 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('设备控制');
                        Text.debugLine("entry/src/main/ets/components/control/ControlPage.ets(170:13)", "entry");
                        Text.fontSize(16);
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontColor('#00E5FF');
                        Text.width('100%');
                        Text.margin({ bottom: 12 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        GridRow.create({ columns: 4, gutter: 12 });
                        GridRow.debugLine("entry/src/main/ets/components/control/ControlPage.ets(177:13)", "entry");
                        GridRow.width('100%');
                    }, GridRow);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = (_item, index: number) => {
                            const device = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                GridCol.create();
                                GridCol.debugLine("entry/src/main/ets/components/control/ControlPage.ets(179:17)", "entry");
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
                        Column.debugLine("entry/src/main/ets/components/control/ControlPage.ets(201:11)", "entry");
                        Column.width('92%');
                        Column.padding(16);
                        Column.backgroundColor('#1E1E1E');
                        Column.borderRadius(16);
                        Column.shadow({
                            radius: 8,
                            color: 'rgba(0, 229, 255, 0.1)',
                            offsetX: 0,
                            offsetY: 2
                        });
                        Column.margin({ bottom: 16 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('环境监测');
                        Text.debugLine("entry/src/main/ets/components/control/ControlPage.ets(202:13)", "entry");
                        Text.fontSize(16);
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontColor('#00E5FF');
                        Text.width('100%');
                        Text.margin({ bottom: 12 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        GridRow.create({ columns: 2, gutter: 12 });
                        GridRow.debugLine("entry/src/main/ets/components/control/ControlPage.ets(209:13)", "entry");
                    }, GridRow);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const sensorData = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                GridCol.create();
                                GridCol.debugLine("entry/src/main/ets/components/control/ControlPage.ets(211:17)", "entry");
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
                        Column.debugLine("entry/src/main/ets/components/control/ControlPage.ets(232:11)", "entry");
                        Column.width('90%');
                        Column.padding({ top: 40, bottom: 40 });
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('📱');
                        Text.debugLine("entry/src/main/ets/components/control/ControlPage.ets(233:13)", "entry");
                        Text.fontSize(64);
                        Text.margin({ bottom: 16 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('暂无设备');
                        Text.debugLine("entry/src/main/ets/components/control/ControlPage.ets(237:13)", "entry");
                        Text.fontSize(18);
                        Text.fontColor('#666666');
                        Text.margin({ bottom: 8 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('系统正在从巴法云同步设备...');
                        Text.debugLine("entry/src/main/ets/components/control/ControlPage.ets(242:13)", "entry");
                        Text.fontSize(14);
                        Text.fontColor('#999999');
                        Text.margin({ bottom: 24 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('手动同步');
                        Button.debugLine("entry/src/main/ets/components/control/ControlPage.ets(247:13)", "entry");
                        Button.fontSize(16);
                        Button.fontColor('#FFFFFF');
                        Button.backgroundColor('#00E5FF');
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
            Column.debugLine("entry/src/main/ets/components/control/ControlPage.ets(303:5)", "entry");
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 圆形按钮
            Column.create();
            Column.debugLine("entry/src/main/ets/components/control/ControlPage.ets(305:7)", "entry");
            Context.animation({
                duration: 300,
                curve: Curve.EaseInOut
            });
            // 圆形按钮
            Column.width(64);
            // 圆形按钮
            Column.height(64);
            // 圆形按钮
            Column.backgroundColor(device.isActive ? '#00E5FF' : '#2D2D2D');
            // 圆形按钮
            Column.borderRadius(32);
            // 圆形按钮
            Column.justifyContent(FlexAlign.Center);
            // 圆形按钮
            Column.border({
                width: device.isActive ? 0 : 2,
                color: '#333333' // 深色边框
            });
            // 圆形按钮
            Column.shadow({
                radius: device.isActive ? 12 : 4,
                color: device.isActive ? 'rgba(0, 229, 255, 0.5)' : 'rgba(0, 0, 0, 0.2)',
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
            Image.debugLine("entry/src/main/ets/components/control/ControlPage.ets(307:9)", "entry");
            Context.animation({
                duration: 200,
                curve: Curve.EaseInOut
            });
            // 显示设备对应的图标
            Image.width(36);
            // 显示设备对应的图标
            Image.height(36);
            // 显示设备对应的图标
            Image.fillColor(device.isActive ? '#FFFFFF' : '#666666');
            Context.animation(null);
        }, Image);
        // 圆形按钮
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 设备名称
            Text.create(device.name);
            Text.debugLine("entry/src/main/ets/components/control/ControlPage.ets(350:7)", "entry");
            // 设备名称
            Text.fontSize(13);
            // 设备名称
            Text.fontColor('#FFFFFF');
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
            Text.debugLine("entry/src/main/ets/components/control/ControlPage.ets(359:7)", "entry");
            // 状态标签
            Text.fontSize(10);
            // 状态标签
            Text.fontColor(device.isActive ? '#00E5FF' : '#666666');
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
            Column.debugLine("entry/src/main/ets/components/control/ControlPage.ets(372:5)", "entry");
            Column.width('100%');
            Column.padding(14);
            Column.backgroundColor('#2D2D2D');
            Column.borderRadius(12);
            Column.border({
                width: 1,
                color: '#333333' // 深色边框
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 标题
            Text.create(sensorData.name);
            Text.debugLine("entry/src/main/ets/components/control/ControlPage.ets(374:7)", "entry");
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
            Row.debugLine("entry/src/main/ets/components/control/ControlPage.ets(381:7)", "entry");
            // 数值和图标
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/components/control/ControlPage.ets(382:9)", "entry");
            Column.alignItems(HorizontalAlign.Start);
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 4 });
            Row.debugLine("entry/src/main/ets/components/control/ControlPage.ets(383:11)", "entry");
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(sensorData.value);
            Text.debugLine("entry/src/main/ets/components/control/ControlPage.ets(384:13)", "entry");
            Text.fontSize(24);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(this.getSensorColor(sensorData.topic));
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(sensorData.unit);
            Text.debugLine("entry/src/main/ets/components/control/ControlPage.ets(389:13)", "entry");
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
                        Text.debugLine("entry/src/main/ets/components/control/ControlPage.ets(397:13)", "entry");
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
            Image.debugLine("entry/src/main/ets/components/control/ControlPage.ets(407:9)", "entry");
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
            'temp': '#FF4081',
            'hum': '#00E5FF',
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
/**
 * 快捷功能按钮项接口
 */
interface QuickActionItem {
    name: string;
    icon: Resource;
    color: string;
}
