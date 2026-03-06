if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface SettingsPage_Params {
    locationName?: string;
    relaySettings?: RelaySetting[];
    sensorSettings?: SensorSetting[];
    isSaving?: boolean;
}
import router from "@ohos:router";
import promptAction from "@ohos:promptAction";
import { AppColors } from "@normalized:N&&&entry/src/main/ets/constants/AppConstants&";
interface RelaySetting {
    id: number;
    name: string;
    placeholder: string;
    isVisible: boolean;
}
interface SensorSetting {
    id: number;
    name: string;
    placeholder: string;
    isVisible: boolean;
    maxThreshold: string;
    minThreshold: string;
}
class SettingsPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__locationName = new ObservedPropertySimplePU('光明温室大棚', this, "locationName");
        this.__relaySettings = new ObservedPropertyObjectPU([
            { id: 1, name: '灌溉器', placeholder: '请输入设备名称', isVisible: true },
            { id: 2, name: '卷帘', placeholder: '请输入设备名称', isVisible: true },
            { id: 3, name: '排风扇', placeholder: '请输入设备名称', isVisible: true },
            { id: 4, name: '补光灯', placeholder: '请输入设备名称', isVisible: false }
        ], this, "relaySettings");
        this.__sensorSettings = new ObservedPropertyObjectPU([
            { id: 1, name: '土壤温度', placeholder: '请输入传感器名称', isVisible: true, maxThreshold: '30', minThreshold: '10' },
            { id: 2, name: '土壤湿度', placeholder: '请输入传感器名称', isVisible: true, maxThreshold: '90', minThreshold: '40' },
            { id: 3, name: '默认传感器名', placeholder: '请输入传感器名称', isVisible: false, maxThreshold: '', minThreshold: '' }
        ], this, "sensorSettings");
        this.__isSaving = new ObservedPropertySimplePU(false, this, "isSaving");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: SettingsPage_Params) {
        if (params.locationName !== undefined) {
            this.locationName = params.locationName;
        }
        if (params.relaySettings !== undefined) {
            this.relaySettings = params.relaySettings;
        }
        if (params.sensorSettings !== undefined) {
            this.sensorSettings = params.sensorSettings;
        }
        if (params.isSaving !== undefined) {
            this.isSaving = params.isSaving;
        }
    }
    updateStateVars(params: SettingsPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__locationName.purgeDependencyOnElmtId(rmElmtId);
        this.__relaySettings.purgeDependencyOnElmtId(rmElmtId);
        this.__sensorSettings.purgeDependencyOnElmtId(rmElmtId);
        this.__isSaving.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__locationName.aboutToBeDeleted();
        this.__relaySettings.aboutToBeDeleted();
        this.__sensorSettings.aboutToBeDeleted();
        this.__isSaving.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __locationName: ObservedPropertySimplePU<string>;
    get locationName() {
        return this.__locationName.get();
    }
    set locationName(newValue: string) {
        this.__locationName.set(newValue);
    }
    private __relaySettings: ObservedPropertyObjectPU<RelaySetting[]>;
    get relaySettings() {
        return this.__relaySettings.get();
    }
    set relaySettings(newValue: RelaySetting[]) {
        this.__relaySettings.set(newValue);
    }
    private __sensorSettings: ObservedPropertyObjectPU<SensorSetting[]>;
    get sensorSettings() {
        return this.__sensorSettings.get();
    }
    set sensorSettings(newValue: SensorSetting[]) {
        this.__sensorSettings.set(newValue);
    }
    private __isSaving: ObservedPropertySimplePU<boolean>;
    get isSaving() {
        return this.__isSaving.get();
    }
    set isSaving(newValue: boolean) {
        this.__isSaving.set(newValue);
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor(AppColors.APP_BG);
        }, Column);
        this.buildTopBar.bind(this)();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.layoutWeight(1);
            Scroll.backgroundColor(AppColors.APP_BG);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding({ bottom: 24 });
        }, Column);
        this.buildBaseInfoSection.bind(this)();
        this.buildRelaySection.bind(this)();
        this.buildSensorSection.bind(this)();
        Column.pop();
        Scroll.pop();
        this.buildSaveBar.bind(this)();
        Column.pop();
    }
    private buildTopBar(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.backgroundColor(AppColors.PRIMARY_COLOR);
            Column.borderRadius({ bottomLeft: 24, bottomRight: 24 });
            Column.shadow({ radius: 16, color: 'rgba(52, 199, 89, 0.28)', offsetY: 8 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.height(56);
            Row.padding({ left: 12, right: 16 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width(44);
            Row.height(44);
            Row.justifyContent(FlexAlign.Center);
            Row.onClick(() => {
                router.back();
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('←');
            Text.fontSize(26);
            Text.fontColor('#FFFFFF');
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('设置');
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#FFFFFF');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('⚙️');
            Text.fontSize(20);
            Text.fontColor('#FFFFFF');
            Text.opacity(0.8);
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 颜色过渡条
            Column.create();
            // 颜色过渡条
            Column.width('100%');
            // 颜色过渡条
            Column.height(12);
        }, Column);
        // 颜色过渡条
        Column.pop();
        Column.pop();
    }
    private buildBaseInfoSection(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.margin({ top: 16 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.padding({ left: 20, right: 20, top: 20, bottom: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('基础信息');
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(AppColors.PRIMARY_COLOR);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding({ left: 20, right: 20, top: 16, bottom: 16 });
            Column.backgroundColor('#FFFFFF');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('位置');
            Text.fontSize(15);
            Text.fontColor('#333333');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.locationName);
            Text.fontSize(15);
            Text.fontColor('#555555');
        }, Text);
        Text.pop();
        Row.pop();
        Column.pop();
        Column.pop();
    }
    private buildRelaySection(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.margin({ top: 16 });
        }, Column);
        this.buildSectionHeader.bind(this)('继电器组');
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.backgroundColor('#FFFFFF');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = (_item, index: number) => {
                const item = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create();
                }, Column);
                this.buildRelayRow.bind(this)(item, index + 1);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    If.create();
                    if (index < this.relaySettings.length - 1) {
                        this.ifElseBranchUpdateFunction(0, () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Divider.create();
                                Divider.color('#F0F0F0');
                                Divider.width('100%');
                            }, Divider);
                        });
                    }
                    else {
                        this.ifElseBranchUpdateFunction(1, () => {
                        });
                    }
                }, If);
                If.pop();
                Column.pop();
            };
            this.forEachUpdateFunction(elmtId, this.relaySettings, forEachItemGenFunction, (item: RelaySetting): string => `${item.id}`, true, false);
        }, ForEach);
        ForEach.pop();
        Column.pop();
        Column.pop();
    }
    private buildRelayRow(item: RelaySetting, order: number, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.padding({ left: 20, right: 20, top: 16, bottom: 16 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${order}.`);
            Text.fontSize(15);
            Text.fontColor('#333333');
            Text.margin({ right: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: item.placeholder, text: item.name });
            TextInput.layoutWeight(1);
            TextInput.height(44);
            TextInput.backgroundColor('#FFFFFF');
            TextInput.border({ width: 0 });
            TextInput.onChange((value: string) => {
                this.updateRelayName(item.id, value);
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(item.isVisible ? '显示' : '隐藏');
            Text.fontSize(13);
            Text.fontColor(item.isVisible ? AppColors.PRIMARY_COLOR : '#8A8F99');
            Text.margin({ right: 6 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Toggle.create({ type: ToggleType.Switch, isOn: item.isVisible });
            Toggle.selectedColor(AppColors.PRIMARY_COLOR);
            Toggle.switchPointColor('#FFFFFF');
            Toggle.onChange((isOn: boolean) => {
                this.toggleRelayVisibility(item.id, isOn);
            });
        }, Toggle);
        Toggle.pop();
        Row.pop();
        Row.pop();
        Column.pop();
    }
    private buildSensorSection(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.margin({ top: 16 });
        }, Column);
        this.buildSectionHeader.bind(this)('传感器组');
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.backgroundColor('#FFFFFF');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = (_item, index: number) => {
                const item = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create();
                }, Column);
                this.buildSensorCard.bind(this)(item, index + 1);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    If.create();
                    if (index < this.sensorSettings.length - 1) {
                        this.ifElseBranchUpdateFunction(0, () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Divider.create();
                                Divider.color('#F0F0F0');
                                Divider.width('100%');
                            }, Divider);
                        });
                    }
                    else {
                        this.ifElseBranchUpdateFunction(1, () => {
                        });
                    }
                }, If);
                If.pop();
                Column.pop();
            };
            this.forEachUpdateFunction(elmtId, this.sensorSettings, forEachItemGenFunction, (item: SensorSetting): string => `${item.id}`, true, false);
        }, ForEach);
        ForEach.pop();
        Column.pop();
        Column.pop();
    }
    private buildSensorCard(item: SensorSetting, order: number, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.padding({ left: 20, right: 20, top: 16 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${order}.`);
            Text.fontSize(15);
            Text.fontColor('#333333');
            Text.margin({ right: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: item.placeholder, text: item.name });
            TextInput.layoutWeight(1);
            TextInput.height(44);
            TextInput.backgroundColor('#FFFFFF');
            TextInput.border({ width: 0 });
            TextInput.onChange((value: string) => {
                this.updateSensorName(item.id, value);
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(item.isVisible ? '显示' : '隐藏');
            Text.fontSize(13);
            Text.fontColor(item.isVisible ? AppColors.PRIMARY_COLOR : '#8A8F99');
            Text.margin({ right: 6 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Toggle.create({ type: ToggleType.Switch, isOn: item.isVisible });
            Toggle.selectedColor(AppColors.PRIMARY_COLOR);
            Toggle.switchPointColor('#FFFFFF');
            Toggle.onChange((isOn: boolean) => {
                this.toggleSensorVisibility(item.id, isOn);
            });
        }, Toggle);
        Toggle.pop();
        Row.pop();
        Row.pop();
        this.buildThresholdRow.bind(this)(item, '最高预警值', true);
        this.buildThresholdRow.bind(this)(item, '最低预警值', false);
        Column.pop();
    }
    private buildThresholdRow(item: SensorSetting, label: string, isMax: boolean, parent = null): void {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.padding({ left: 20, right: 20, top: 12, bottom: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.layoutWeight(1);
            Column.alignItems(HorizontalAlign.Start);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(label);
            Text.fontSize(13);
            Text.fontColor('#8A8F99');
            Text.margin({ bottom: 4 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('清除');
            Text.fontSize(12);
            Text.fontColor('#11C26D');
            Text.onClick(() => {
                this.clearThreshold(item.id, isMax);
            });
        }, Text);
        Text.pop();
        Row.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 8 });
        }, Row);
        this.buildStepButton.bind(this)('-', (): void => {
            this.adjustThreshold(item.id, isMax, -1);
        });
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.getThresholdDisplayValue(item, isMax));
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#333333');
            Text.width(48);
            Text.textAlign(TextAlign.Center);
        }, Text);
        Text.pop();
        this.buildStepButton.bind(this)('+', (): void => {
            this.adjustThreshold(item.id, isMax, 1);
        });
        Row.pop();
        Row.pop();
    }
    private buildStepButton(symbol: string, onTap: () => void, parent = null): void {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width(32);
            Column.height(32);
            Column.borderRadius(16);
            Column.border({ width: 1, color: '#11C26D' });
            Column.justifyContent(FlexAlign.Center);
            Column.onClick(() => {
                onTap();
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(symbol);
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#11C26D');
        }, Text);
        Text.pop();
        Column.pop();
    }
    private buildSectionHeader(title: string, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.padding({ left: 20, right: 20, top: 20, bottom: 12 });
            Row.backgroundColor('#F0FDF5');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(title);
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#11C26D');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        Row.pop();
    }
    private buildSaveBar(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.backgroundColor('#FFFFFF');
            Column.borderRadius({ topLeft: 24, topRight: 24 });
            Column.shadow({ radius: 8, color: '#12000000', offsetY: -2 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(this.isSaving ? '保存中...' : '保存');
            Button.width('90%');
            Button.height(48);
            Button.fontSize(18);
            Button.fontColor('#FFFFFF');
            Button.backgroundColor(this.isSaving ? '#97E5C0' : '#11C26D');
            Button.borderRadius(24);
            Button.enabled(!this.isSaving);
            Button.onClick(() => {
                this.handleSave();
            });
            Button.margin({ top: 16, bottom: 24 });
        }, Button);
        Button.pop();
        Column.pop();
    }
    private updateRelayName(id: number, value: string): void {
        const updated: RelaySetting[] = this.createRelayArray();
        for (let i = 0; i < updated.length; i++) {
            if (updated[i].id === id) {
                updated[i].name = value;
            }
        }
        this.relaySettings = updated;
    }
    private toggleRelayVisibility(id: number, isVisible: boolean): void {
        const updated: RelaySetting[] = this.createRelayArray();
        for (let i = 0; i < updated.length; i++) {
            if (updated[i].id === id) {
                updated[i].isVisible = isVisible;
            }
        }
        this.relaySettings = updated;
    }
    private updateSensorName(id: number, value: string): void {
        const updated: SensorSetting[] = this.cloneSensorSettings();
        for (let i = 0; i < updated.length; i++) {
            if (updated[i].id === id) {
                updated[i].name = value;
            }
        }
        this.sensorSettings = updated;
    }
    private toggleSensorVisibility(id: number, isVisible: boolean): void {
        const updated: SensorSetting[] = this.cloneSensorSettings();
        for (let i = 0; i < updated.length; i++) {
            if (updated[i].id === id) {
                updated[i].isVisible = isVisible;
            }
        }
        this.sensorSettings = updated;
    }
    private adjustThreshold(id: number, isMax: boolean, delta: number): void {
        const updated: SensorSetting[] = this.cloneSensorSettings();
        for (let i = 0; i < updated.length; i++) {
            if (updated[i].id === id) {
                const rawValue: string = isMax ? updated[i].maxThreshold : updated[i].minThreshold;
                const baseValue: number = rawValue.length > 0 ? Number.parseFloat(rawValue) : 0;
                const nextValue: number = Math.max(baseValue + delta, 0);
                if (isMax) {
                    updated[i].maxThreshold = String(nextValue);
                }
                else {
                    updated[i].minThreshold = String(nextValue);
                }
            }
        }
        this.sensorSettings = updated;
    }
    private clearThreshold(id: number, isMax: boolean): void {
        const updated: SensorSetting[] = this.cloneSensorSettings();
        for (let i = 0; i < updated.length; i++) {
            if (updated[i].id === id) {
                if (isMax) {
                    updated[i].maxThreshold = '';
                }
                else {
                    updated[i].minThreshold = '';
                }
            }
        }
        this.sensorSettings = updated;
    }
    private createRelayArray(): RelaySetting[] {
        const result: RelaySetting[] = [];
        for (let i = 0; i < this.relaySettings.length; i++) {
            const item: RelaySetting = this.relaySettings[i];
            const clone: RelaySetting = { id: item.id, name: item.name, placeholder: item.placeholder, isVisible: item.isVisible };
            result.push(clone);
        }
        return result;
    }
    private cloneSensorSettings(): SensorSetting[] {
        const result: SensorSetting[] = [];
        for (let i = 0; i < this.sensorSettings.length; i++) {
            const item: SensorSetting = this.sensorSettings[i];
            const clone: SensorSetting = {
                id: item.id,
                name: item.name,
                placeholder: item.placeholder,
                isVisible: item.isVisible,
                maxThreshold: item.maxThreshold,
                minThreshold: item.minThreshold
            };
            result.push(clone);
        }
        return result;
    }
    private getThresholdDisplayValue(item: SensorSetting, isMax: boolean): string {
        const value: string = isMax ? item.maxThreshold : item.minThreshold;
        if (value.length === 0) {
            return '--';
        }
        return value;
    }
    private handleSave(): void {
        if (this.isSaving) {
            return;
        }
        this.isSaving = true;
        console.info('[SettingsPage] 保存配置:', JSON.stringify({
            location: this.locationName,
            relays: this.relaySettings,
            sensors: this.sensorSettings
        }));
        setTimeout(() => {
            this.isSaving = false;
            promptAction.showToast({
                message: '保存成功',
                duration: 2000
            });
        }, 1000);
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "SettingsPage";
    }
}
registerNamedRoute(() => new SettingsPage(undefined, {}), "", { bundleName: "com.example.myapplication", moduleName: "entry", pagePath: "pages/SettingsPage", pageFullPath: "entry/src/main/ets/pages/SettingsPage", integratedHsp: "false", moduleType: "followWithHap" });
