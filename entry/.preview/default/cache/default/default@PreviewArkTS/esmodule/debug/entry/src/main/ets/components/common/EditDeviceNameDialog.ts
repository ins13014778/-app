if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface EditDeviceNameDialog_Params {
    showDialog?: boolean;
    editingDevice?: ControlDevice | null;
    newDeviceName?: string;
    // ========== 回调函数 ==========
    // 用户点击确认按钮时的回调函数，由父组件传入
    onConfirm?: () => void;
}
import type { ControlDevice } from '../../types/IndexTypes';
export class EditDeviceNameDialog extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__showDialog = new SynchedPropertySimpleTwoWayPU(params.showDialog, this, "showDialog");
        this.__editingDevice = new SynchedPropertyObjectTwoWayPU(params.editingDevice, this, "editingDevice");
        this.__newDeviceName = new SynchedPropertySimpleTwoWayPU(params.newDeviceName, this, "newDeviceName");
        this.onConfirm = (): void => { };
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: EditDeviceNameDialog_Params) {
        if (params.onConfirm !== undefined) {
            this.onConfirm = params.onConfirm;
        }
    }
    updateStateVars(params: EditDeviceNameDialog_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__showDialog.purgeDependencyOnElmtId(rmElmtId);
        this.__editingDevice.purgeDependencyOnElmtId(rmElmtId);
        this.__newDeviceName.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__showDialog.aboutToBeDeleted();
        this.__editingDevice.aboutToBeDeleted();
        this.__newDeviceName.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    // ========== 状态变量 ==========
    // 这些变量通过@Link与父组件双向绑定，控制对话框的显示状态和内容
    private __showDialog: SynchedPropertySimpleTwoWayPU<boolean>; // 控制对话框显示/隐藏
    get showDialog() {
        return this.__showDialog.get();
    }
    set showDialog(newValue: boolean) {
        this.__showDialog.set(newValue);
    }
    private __editingDevice: SynchedPropertySimpleOneWayPU<ControlDevice | null>; // 当前正在编辑的设备信息
    get editingDevice() {
        return this.__editingDevice.get();
    }
    set editingDevice(newValue: ControlDevice | null) {
        this.__editingDevice.set(newValue);
    }
    private __newDeviceName: SynchedPropertySimpleTwoWayPU<string>; // 用户输入的新设备名称
    get newDeviceName() {
        return this.__newDeviceName.get();
    }
    set newDeviceName(newValue: string) {
        this.__newDeviceName.set(newValue);
    }
    // ========== 回调函数 ==========
    // 用户点击确认按钮时的回调函数，由父组件传入
    private onConfirm: () => void;
    /**
     * 构建对话框UI界面
     *
     * 界面结构说明：
     * 1. 遮罩层 - 半透明黑色背景，点击可关闭对话框
     * 2. 对话框内容区域 - 包含标题、设备信息、输入框和按钮组
     * 3. 响应式布局 - 适配不同屏幕尺寸
     */
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 只有当showDialog为true时才显示对话框
            if (this.showDialog) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/components/common/EditDeviceNameDialog.ets(48:7)", "entry");
                        Column.width('100%');
                        Column.height('100%');
                        Column.position({ x: 0, y: 0 });
                        Column.zIndex(1000);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // ========== 遮罩层 ==========
                        // 半透明黑色背景，覆盖整个屏幕
                        // 点击遮罩层可以关闭对话框
                        Column.create();
                        Column.debugLine("entry/src/main/ets/components/common/EditDeviceNameDialog.ets(52:9)", "entry");
                        // ========== 遮罩层 ==========
                        // 半透明黑色背景，覆盖整个屏幕
                        // 点击遮罩层可以关闭对话框
                        Column.width('100%');
                        // ========== 遮罩层 ==========
                        // 半透明黑色背景，覆盖整个屏幕
                        // 点击遮罩层可以关闭对话框
                        Column.height('100%');
                        // ========== 遮罩层 ==========
                        // 半透明黑色背景，覆盖整个屏幕
                        // 点击遮罩层可以关闭对话框
                        Column.backgroundColor('#80000000');
                        // ========== 遮罩层 ==========
                        // 半透明黑色背景，覆盖整个屏幕
                        // 点击遮罩层可以关闭对话框
                        Column.onClick(() => {
                            this.showDialog = false; // 点击遮罩层关闭对话框
                        });
                    }, Column);
                    // ========== 遮罩层 ==========
                    // 半透明黑色背景，覆盖整个屏幕
                    // 点击遮罩层可以关闭对话框
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // ========== 对话框内容区域 ==========
                        // 白色背景的对话框，包含所有交互元素
                        Column.create();
                        Column.debugLine("entry/src/main/ets/components/common/EditDeviceNameDialog.ets(62:9)", "entry");
                        // ========== 对话框内容区域 ==========
                        // 白色背景的对话框，包含所有交互元素
                        Column.width('85%');
                        // ========== 对话框内容区域 ==========
                        // 白色背景的对话框，包含所有交互元素
                        Column.padding(24);
                        // ========== 对话框内容区域 ==========
                        // 白色背景的对话框，包含所有交互元素
                        Column.backgroundColor('#FFFFFF');
                        // ========== 对话框内容区域 ==========
                        // 白色背景的对话框，包含所有交互元素
                        Column.borderRadius(16);
                        // ========== 对话框内容区域 ==========
                        // 白色背景的对话框，包含所有交互元素
                        Column.position({ x: '7.5%', y: '30%' });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 对话框标题
                        Text.create('修改设备昵称');
                        Text.debugLine("entry/src/main/ets/components/common/EditDeviceNameDialog.ets(64:11)", "entry");
                        // 对话框标题
                        Text.fontSize(18);
                        // 对话框标题
                        Text.fontWeight(FontWeight.Bold);
                        // 对话框标题
                        Text.margin({ bottom: 20 });
                    }, Text);
                    // 对话框标题
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        // ========== 设备信息展示 ==========
                        // 显示当前设备的主题和类型信息
                        if (this.editingDevice) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Column.create();
                                    Column.debugLine("entry/src/main/ets/components/common/EditDeviceNameDialog.ets(72:13)", "entry");
                                    Column.alignItems(HorizontalAlign.Start);
                                }, Column);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    // 设备主题信息行
                                    Row.create();
                                    Row.debugLine("entry/src/main/ets/components/common/EditDeviceNameDialog.ets(74:15)", "entry");
                                    // 设备主题信息行
                                    Row.width('100%');
                                    // 设备主题信息行
                                    Row.margin({ bottom: 8 });
                                }, Row);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('主题:');
                                    Text.debugLine("entry/src/main/ets/components/common/EditDeviceNameDialog.ets(75:17)", "entry");
                                    Text.fontSize(14);
                                    Text.fontColor('#666666');
                                    Text.width(60);
                                }, Text);
                                Text.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(this.editingDevice.topic);
                                    Text.debugLine("entry/src/main/ets/components/common/EditDeviceNameDialog.ets(79:17)", "entry");
                                    Text.fontSize(14);
                                    Text.fontColor('#333333');
                                }, Text);
                                Text.pop();
                                // 设备主题信息行
                                Row.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    // 设备类型信息行
                                    Row.create();
                                    Row.debugLine("entry/src/main/ets/components/common/EditDeviceNameDialog.ets(87:15)", "entry");
                                    // 设备类型信息行
                                    Row.width('100%');
                                    // 设备类型信息行
                                    Row.margin({ bottom: 16 });
                                }, Row);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('类型:');
                                    Text.debugLine("entry/src/main/ets/components/common/EditDeviceNameDialog.ets(88:17)", "entry");
                                    Text.fontSize(14);
                                    Text.fontColor('#666666');
                                    Text.width(60);
                                }, Text);
                                Text.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(this.editingDevice.deviceType);
                                    Text.debugLine("entry/src/main/ets/components/common/EditDeviceNameDialog.ets(92:17)", "entry");
                                    Text.fontSize(14);
                                    Text.fontColor('#333333');
                                }, Text);
                                Text.pop();
                                // 设备类型信息行
                                Row.pop();
                                Column.pop();
                            });
                        }
                        // ========== 输入框区域 ==========
                        // 用户输入新设备名称的区域
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                            });
                        }
                    }, If);
                    If.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // ========== 输入框区域 ==========
                        // 用户输入新设备名称的区域
                        Column.create();
                        Column.debugLine("entry/src/main/ets/components/common/EditDeviceNameDialog.ets(104:11)", "entry");
                        // ========== 输入框区域 ==========
                        // 用户输入新设备名称的区域
                        Column.margin({ bottom: 24 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('新昵称');
                        Text.debugLine("entry/src/main/ets/components/common/EditDeviceNameDialog.ets(105:13)", "entry");
                        Text.fontSize(14);
                        Text.fontColor('#666666');
                        Text.alignSelf(ItemAlign.Start);
                        Text.margin({ bottom: 8 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 文本输入框
                        TextInput.create({ text: this.newDeviceName });
                        TextInput.debugLine("entry/src/main/ets/components/common/EditDeviceNameDialog.ets(112:13)", "entry");
                        // 文本输入框
                        TextInput.width('100%');
                        // 文本输入框
                        TextInput.height(44);
                        // 文本输入框
                        TextInput.fontSize(16);
                        // 文本输入框
                        TextInput.borderRadius(8);
                        // 文本输入框
                        TextInput.backgroundColor('#F5F5F5');
                        // 文本输入框
                        TextInput.onChange((value: string) => {
                            this.newDeviceName = value; // 实时更新输入值
                        });
                    }, TextInput);
                    // ========== 输入框区域 ==========
                    // 用户输入新设备名称的区域
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // ========== 按钮组 ==========
                        // 取消和确认操作按钮
                        Row.create();
                        Row.debugLine("entry/src/main/ets/components/common/EditDeviceNameDialog.ets(126:11)", "entry");
                        // ========== 按钮组 ==========
                        // 取消和确认操作按钮
                        Row.width('100%');
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 取消按钮
                        Button.createWithLabel('取消');
                        Button.debugLine("entry/src/main/ets/components/common/EditDeviceNameDialog.ets(128:13)", "entry");
                        // 取消按钮
                        Button.fontSize(16);
                        // 取消按钮
                        Button.fontColor('#666666');
                        // 取消按钮
                        Button.backgroundColor('#F5F5F5');
                        // 取消按钮
                        Button.borderRadius(8);
                        // 取消按钮
                        Button.layoutWeight(1);
                        // 取消按钮
                        Button.height(44);
                        // 取消按钮
                        Button.onClick(() => {
                            this.showDialog = false; // 关闭对话框，不保存修改
                        });
                    }, Button);
                    // 取消按钮
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 确认按钮
                        Button.createWithLabel('确定');
                        Button.debugLine("entry/src/main/ets/components/common/EditDeviceNameDialog.ets(140:13)", "entry");
                        // 确认按钮
                        Button.fontSize(16);
                        // 确认按钮
                        Button.fontColor('#FFFFFF');
                        // 确认按钮
                        Button.backgroundColor('#007DFF');
                        // 确认按钮
                        Button.borderRadius(8);
                        // 确认按钮
                        Button.layoutWeight(1);
                        // 确认按钮
                        Button.height(44);
                        // 确认按钮
                        Button.margin({ left: 12 });
                        // 确认按钮
                        Button.onClick(() => {
                            this.onConfirm(); // 执行确认回调函数
                        });
                    }, Button);
                    // 确认按钮
                    Button.pop();
                    // ========== 按钮组 ==========
                    // 取消和确认操作按钮
                    Row.pop();
                    // ========== 对话框内容区域 ==========
                    // 白色背景的对话框，包含所有交互元素
                    Column.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
