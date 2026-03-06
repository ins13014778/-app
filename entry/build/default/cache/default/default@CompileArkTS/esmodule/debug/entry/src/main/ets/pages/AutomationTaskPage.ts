if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface AutomationTaskPage_Params {
    enableTask?: boolean;
    enableSchedule?: boolean;
    selectedTime?: string;
    weekdays?: WeekDayOption[];
    conditions?: ConditionItem[];
    actions?: ActionItem[];
    delayMinutes?: number;
    executeOnce?: boolean;
    isSaving?: boolean;
}
import router from "@ohos:router";
import promptAction from "@ohos:promptAction";
/**
 * 星期选项接口
 * 用于表示一周中的某一天及其选中状态
 */
interface WeekDayOption {
    id: number; // 星期ID（1-7对应周一到周日）
    label: string; // 显示标签（"一"、"二"等）
    selected: boolean; // 是否被选中
}
/**
 * 条件项接口
 * 表示自动化任务的触发条件
 */
interface ConditionItem {
    id: number; // 条件ID
    description: string; // 条件描述（如"环境温度 > 30℃"）
    location: string; // 条件应用位置（如"光明温室大棚"）
}
/**
 * 动作项接口
 * 表示自动化任务要执行的动作
 */
interface ActionItem {
    id: number; // 动作ID
    description: string; // 动作描述（如"排风扇：打开"）
    location: string; // 动作执行位置（如"光明温室大棚"）
}
class AutomationTaskPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__enableTask = new ObservedPropertySimplePU(true, this, "enableTask");
        this.__enableSchedule = new ObservedPropertySimplePU(true, this, "enableSchedule");
        this.__selectedTime = new ObservedPropertySimplePU('06:30', this, "selectedTime");
        this.__weekdays = new ObservedPropertyObjectPU([
            { id: 1, label: '一', selected: false },
            { id: 2, label: '二', selected: false },
            { id: 3, label: '三', selected: true },
            { id: 4, label: '四', selected: true },
            { id: 5, label: '五', selected: false },
            { id: 6, label: '六', selected: false },
            { id: 7, label: '日', selected: false }
        ], this, "weekdays");
        this.__conditions = new ObservedPropertyObjectPU([
            { id: 1, description: '环境温度 > 30℃', location: '光明温室大棚' }
        ], this, "conditions");
        this.__actions = new ObservedPropertyObjectPU([
            { id: 1, description: '排风扇：打开', location: '光明温室大棚' }
        ], this, "actions");
        this.__delayMinutes = new ObservedPropertySimplePU(10, this, "delayMinutes");
        this.__executeOnce = new ObservedPropertySimplePU(true, this, "executeOnce");
        this.__isSaving = new ObservedPropertySimplePU(false, this, "isSaving");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: AutomationTaskPage_Params) {
        if (params.enableTask !== undefined) {
            this.enableTask = params.enableTask;
        }
        if (params.enableSchedule !== undefined) {
            this.enableSchedule = params.enableSchedule;
        }
        if (params.selectedTime !== undefined) {
            this.selectedTime = params.selectedTime;
        }
        if (params.weekdays !== undefined) {
            this.weekdays = params.weekdays;
        }
        if (params.conditions !== undefined) {
            this.conditions = params.conditions;
        }
        if (params.actions !== undefined) {
            this.actions = params.actions;
        }
        if (params.delayMinutes !== undefined) {
            this.delayMinutes = params.delayMinutes;
        }
        if (params.executeOnce !== undefined) {
            this.executeOnce = params.executeOnce;
        }
        if (params.isSaving !== undefined) {
            this.isSaving = params.isSaving;
        }
    }
    updateStateVars(params: AutomationTaskPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__enableTask.purgeDependencyOnElmtId(rmElmtId);
        this.__enableSchedule.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedTime.purgeDependencyOnElmtId(rmElmtId);
        this.__weekdays.purgeDependencyOnElmtId(rmElmtId);
        this.__conditions.purgeDependencyOnElmtId(rmElmtId);
        this.__actions.purgeDependencyOnElmtId(rmElmtId);
        this.__delayMinutes.purgeDependencyOnElmtId(rmElmtId);
        this.__executeOnce.purgeDependencyOnElmtId(rmElmtId);
        this.__isSaving.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__enableTask.aboutToBeDeleted();
        this.__enableSchedule.aboutToBeDeleted();
        this.__selectedTime.aboutToBeDeleted();
        this.__weekdays.aboutToBeDeleted();
        this.__conditions.aboutToBeDeleted();
        this.__actions.aboutToBeDeleted();
        this.__delayMinutes.aboutToBeDeleted();
        this.__executeOnce.aboutToBeDeleted();
        this.__isSaving.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    // ========== 任务基本状态 ==========
    private __enableTask: ObservedPropertySimplePU<boolean>; // 任务总开关
    get enableTask() {
        return this.__enableTask.get();
    }
    set enableTask(newValue: boolean) {
        this.__enableTask.set(newValue);
    }
    private __enableSchedule: ObservedPropertySimplePU<boolean>; // 定时功能开关
    get enableSchedule() {
        return this.__enableSchedule.get();
    }
    set enableSchedule(newValue: boolean) {
        this.__enableSchedule.set(newValue);
    }
    private __selectedTime: ObservedPropertySimplePU<string>; // 定时时间（默认06:30）
    get selectedTime() {
        return this.__selectedTime.get();
    }
    set selectedTime(newValue: string) {
        this.__selectedTime.set(newValue);
    }
    // ========== 重复周期设置 ==========
    private __weekdays: ObservedPropertyObjectPU<WeekDayOption[]>;
    get weekdays() {
        return this.__weekdays.get();
    }
    set weekdays(newValue: WeekDayOption[]) {
        this.__weekdays.set(newValue);
    }
    // ========== 条件和动作设置 ==========
    private __conditions: ObservedPropertyObjectPU<ConditionItem[]>;
    get conditions() {
        return this.__conditions.get();
    }
    set conditions(newValue: ConditionItem[]) {
        this.__conditions.set(newValue);
    }
    private __actions: ObservedPropertyObjectPU<ActionItem[]>;
    get actions() {
        return this.__actions.get();
    }
    set actions(newValue: ActionItem[]) {
        this.__actions.set(newValue);
    }
    // ========== 高级选项 ==========
    private __delayMinutes: ObservedPropertySimplePU<number>; // 延时执行分钟数
    get delayMinutes() {
        return this.__delayMinutes.get();
    }
    set delayMinutes(newValue: number) {
        this.__delayMinutes.set(newValue);
    }
    private __executeOnce: ObservedPropertySimplePU<boolean>; // 是否仅执行一次
    get executeOnce() {
        return this.__executeOnce.get();
    }
    set executeOnce(newValue: boolean) {
        this.__executeOnce.set(newValue);
    }
    private __isSaving: ObservedPropertySimplePU<boolean>; // 是否正在保存中
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
            Column.backgroundColor('#F5F7F9');
        }, Column);
        this.buildTopBar.bind(this)();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.layoutWeight(1);
            Scroll.backgroundColor('#F5F7F9');
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding({ bottom: 32 });
        }, Column);
        this.buildToggleCard.bind(this)();
        this.buildScheduleCard.bind(this)();
        this.buildConditionCard.bind(this)();
        this.buildActionCard.bind(this)();
        this.buildAdvancedCard.bind(this)();
        Column.pop();
        Scroll.pop();
        this.buildBottomButtons.bind(this)();
        Column.pop();
    }
    private buildTopBar(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.backgroundColor('#11C26D');
            Column.borderRadius({ bottomLeft: 24, bottomRight: 24 });
            Column.shadow({ radius: 16, color: 'rgba(17, 194, 109, 0.35)', offsetY: 8 });
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
            Text.create('新建自动化任务');
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
            Text.create('👁️');
            Text.fontSize(20);
            Text.fontColor('#FFFFFF');
            Text.opacity(0.85);
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height(12);
        }, Column);
        Column.pop();
        Column.pop();
    }
    private buildToggleCard(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('90%');
            Column.padding({ left: 20, right: 20 });
            Column.backgroundColor('#FFFFFF');
            Column.borderRadius(16);
            Column.margin({ top: 16 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.padding({ top: 16, bottom: 16 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('开启任务');
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#333333');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Toggle.create({ type: ToggleType.Switch, isOn: this.enableTask });
            Toggle.selectedColor('#11C26D');
            Toggle.switchPointColor('#FFFFFF');
            Toggle.onChange((isOn: boolean) => {
                this.enableTask = isOn;
            });
        }, Toggle);
        Toggle.pop();
        Row.pop();
        Column.pop();
    }
    private buildScheduleCard(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('90%');
            Column.backgroundColor('#FFFFFF');
            Column.borderRadius(16);
            Column.margin({ top: 16 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.padding({ left: 20, right: 20, top: 16 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('定时');
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#333333');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Toggle.create({ type: ToggleType.Switch, isOn: this.enableSchedule });
            Toggle.selectedColor('#11C26D');
            Toggle.switchPointColor('#FFFFFF');
            Toggle.onChange((isOn: boolean) => {
                this.enableSchedule = isOn;
            });
        }, Toggle);
        Toggle.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('重复');
            Text.fontSize(13);
            Text.fontColor('#8A8F99');
            Text.margin({ left: 20, bottom: 12 });
            Text.alignSelf(ItemAlign.Start);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 8 });
            Row.width('100%');
            Row.padding({ left: 20, right: 20, bottom: 16 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = (_item, index: number) => {
                const item = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create();
                    Column.width(28);
                    Column.height(28);
                    Column.borderRadius(14);
                    Column.backgroundColor(item.selected ? '#11C26D' : '#ECF9F2');
                    Column.justifyContent(FlexAlign.Center);
                    Column.onClick(() => {
                        this.toggleWeekday(index);
                    });
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(item.label);
                    Text.fontSize(13);
                    Text.fontWeight(FontWeight.Bold);
                    Text.fontColor(item.selected ? '#FFFFFF' : '#8A8F99');
                }, Text);
                Text.pop();
                Column.pop();
            };
            this.forEachUpdateFunction(elmtId, this.weekdays, forEachItemGenFunction, (item: WeekDayOption, index: number) => `${item.id}_${index}`, true, true);
        }, ForEach);
        ForEach.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.color('#F0F0F0');
            Divider.width('100%');
        }, Divider);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.padding({ left: 20, right: 20, top: 16, bottom: 16 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('时间');
            Text.fontSize(14);
            Text.fontColor('#666666');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.selectedTime);
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#11C26D');
        }, Text);
        Text.pop();
        Row.pop();
        Column.pop();
    }
    private buildConditionCard(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('90%');
            Column.backgroundColor('#FFFFFF');
            Column.borderRadius(16);
            Column.margin({ top: 16 });
        }, Column);
        this.buildSectionHeader.bind(this)('满足所有条件时');
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const item = _item;
                this.buildItemRow.bind(this)('🌡️', item.description, item.location, () => {
                    promptAction.showToast({ message: '条件编辑开发中', duration: 2000 });
                });
            };
            this.forEachUpdateFunction(elmtId, this.conditions, forEachItemGenFunction, (item: ConditionItem) => `${item.id}`, false, false);
        }, ForEach);
        ForEach.pop();
        this.buildAddRow.bind(this)(() => {
            promptAction.showToast({ message: '新增条件开发中', duration: 2000 });
        });
        Column.pop();
    }
    private buildActionCard(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('90%');
            Column.backgroundColor('#FFFFFF');
            Column.borderRadius(16);
            Column.margin({ top: 16 });
        }, Column);
        this.buildSectionHeader.bind(this)('执行所有动作并通知我');
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const item = _item;
                this.buildItemRow.bind(this)('🟢', item.description, item.location, () => {
                    promptAction.showToast({ message: '动作编辑开发中', duration: 2000 });
                });
            };
            this.forEachUpdateFunction(elmtId, this.actions, forEachItemGenFunction, (item: ActionItem) => `${item.id}`, false, false);
        }, ForEach);
        ForEach.pop();
        this.buildAddRow.bind(this)(() => {
            promptAction.showToast({ message: '新增动作开发中', duration: 2000 });
        });
        Column.pop();
    }
    private buildAdvancedCard(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('90%');
            Column.backgroundColor('#FFFFFF');
            Column.borderRadius(16);
            Column.margin({ top: 16, bottom: 16 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.padding({ left: 20, right: 20, top: 20, bottom: 12 });
            Row.backgroundColor('#F0FDF5');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('高级选项');
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
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.padding({ left: 20, right: 20, top: 16, bottom: 16 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.layoutWeight(1);
            Column.alignItems(HorizontalAlign.Start);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('延时执行');
            Text.fontSize(14);
            Text.fontColor('#666666');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('当条件满足一段时间');
            Text.fontSize(12);
            Text.fontColor('#8A8F99');
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.onClick(() => {
                promptAction.showToast({ message: '延时设置开发中', duration: 2000 });
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${this.delayMinutes}分钟`);
            Text.fontSize(14);
            Text.fontColor('#11C26D');
        }, Text);
        Text.pop();
        Row.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.color('#F0F0F0');
            Divider.width('100%');
        }, Divider);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.padding({ left: 20, right: 20, top: 16, bottom: 16 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.layoutWeight(1);
            Column.alignItems(HorizontalAlign.Start);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('仅执行一次');
            Text.fontSize(14);
            Text.fontColor('#666666');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('自动化任务仅生效一次');
            Text.fontSize(12);
            Text.fontColor('#8A8F99');
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Toggle.create({ type: ToggleType.Switch, isOn: this.executeOnce });
            Toggle.selectedColor('#11C26D');
            Toggle.switchPointColor('#FFFFFF');
            Toggle.onChange((isOn: boolean) => {
                this.executeOnce = isOn;
            });
        }, Toggle);
        Toggle.pop();
        Row.pop();
        Column.pop();
    }
    private buildBottomButtons(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 16 });
            Row.width('90%');
            Row.padding({ top: 12, bottom: 24 });
            Row.backgroundColor('#FFFFFF');
            Row.borderRadius({ topLeft: 24, topRight: 24 });
            Row.shadow({ radius: 8, color: '#12000000', offsetY: -2 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('删除任务');
            Button.layoutWeight(1);
            Button.height(48);
            Button.fontSize(16);
            Button.fontColor('#FFFFFF');
            Button.backgroundColor('#FF6B6B');
            Button.borderRadius(24);
            Button.onClick(() => {
                promptAction.showToast({ message: '删除任务开发中', duration: 2000 });
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(this.isSaving ? '保存中...' : '保存');
            Button.layoutWeight(1);
            Button.height(48);
            Button.fontSize(16);
            Button.fontColor('#FFFFFF');
            Button.backgroundColor(this.isSaving ? '#97E5C0' : '#11C26D');
            Button.borderRadius(24);
            Button.enabled(!this.isSaving);
            Button.onClick(() => {
                this.handleSave();
            });
        }, Button);
        Button.pop();
        Row.pop();
    }
    private buildSectionHeader(title: string, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.padding({ left: 20, right: 20, top: 18, bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(title);
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#333333');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        Row.pop();
    }
    private buildItemRow(iconText: string, description: string, location: string, onTap: () => void, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.padding({ left: 20, right: 20, top: 16, bottom: 16 });
            Row.onClick(() => {
                onTap();
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(iconText);
            Text.fontSize(20);
            Text.margin({ right: 12 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.alignItems(HorizontalAlign.Start);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(description);
            Text.fontSize(14);
            Text.fontColor('#333333');
            Text.margin({ bottom: 4 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(location);
            Text.fontSize(12);
            Text.fontColor('#8A8F99');
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('➔');
            Text.fontSize(14);
            Text.fontColor('#C5D1CA');
        }, Text);
        Text.pop();
        Row.pop();
        Column.pop();
    }
    private buildAddRow(onTap: () => void, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.padding({ left: 20, right: 20, top: 12, bottom: 18 });
            Row.onClick(() => {
                onTap();
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('+ 添加');
            Text.fontSize(14);
            Text.fontColor('#11C26D');
            Text.fontWeight(FontWeight.Medium);
        }, Text);
        Text.pop();
        Row.pop();
        Column.pop();
    }
    private toggleWeekday(index: number): void {
        const updated: WeekDayOption[] = [];
        for (let i = 0; i < this.weekdays.length; i++) {
            const item: WeekDayOption = this.weekdays[i];
            const clone: WeekDayOption = { id: item.id, label: item.label, selected: item.selected };
            if (i === index) {
                clone.selected = !clone.selected;
            }
            updated.push(clone);
        }
        this.weekdays = updated;
    }
    private handleSave(): void {
        if (this.isSaving) {
            return;
        }
        this.isSaving = true;
        console.info('[AutomationTask] 保存自动化任务', JSON.stringify({
            enableTask: this.enableTask,
            enableSchedule: this.enableSchedule,
            time: this.selectedTime,
            weekdays: this.weekdays,
            conditions: this.conditions,
            actions: this.actions,
            delayMinutes: this.delayMinutes,
            executeOnce: this.executeOnce
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
        return "AutomationTaskPage";
    }
}
registerNamedRoute(() => new AutomationTaskPage(undefined, {}), "", { bundleName: "com.example.myapplication", moduleName: "entry", pagePath: "pages/AutomationTaskPage", pageFullPath: "entry/src/main/ets/pages/AutomationTaskPage", integratedHsp: "false", moduleType: "followWithHap" });
