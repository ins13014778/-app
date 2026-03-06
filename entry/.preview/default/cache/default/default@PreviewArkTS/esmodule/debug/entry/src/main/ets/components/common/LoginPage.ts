if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface LoginPage_Params {
    username?: string;
    password?: string;
    errorMessage?: string;
    successMessage?: string;
    isLoading?: boolean;
    // 回调函数
    handleLogin?: () => void;
    handleGuestMode?: () => void;
    switchToRegister?: () => void;
}
import promptAction from "@ohos:promptAction";
export class LoginPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__username = new SynchedPropertySimpleTwoWayPU(params.username, this, "username");
        this.__password = new SynchedPropertySimpleTwoWayPU(params.password, this, "password");
        this.__errorMessage = new SynchedPropertySimpleTwoWayPU(params.errorMessage, this, "errorMessage");
        this.__successMessage = new SynchedPropertySimpleTwoWayPU(params.successMessage, this, "successMessage");
        this.__isLoading = new SynchedPropertySimpleTwoWayPU(params.isLoading, this, "isLoading");
        this.handleLogin = (): void => { };
        this.handleGuestMode = (): void => { };
        this.switchToRegister = (): void => { };
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: LoginPage_Params) {
        if (params.handleLogin !== undefined) {
            this.handleLogin = params.handleLogin;
        }
        if (params.handleGuestMode !== undefined) {
            this.handleGuestMode = params.handleGuestMode;
        }
        if (params.switchToRegister !== undefined) {
            this.switchToRegister = params.switchToRegister;
        }
    }
    updateStateVars(params: LoginPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__username.purgeDependencyOnElmtId(rmElmtId);
        this.__password.purgeDependencyOnElmtId(rmElmtId);
        this.__errorMessage.purgeDependencyOnElmtId(rmElmtId);
        this.__successMessage.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__username.aboutToBeDeleted();
        this.__password.aboutToBeDeleted();
        this.__errorMessage.aboutToBeDeleted();
        this.__successMessage.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __username: SynchedPropertySimpleTwoWayPU<string>;
    get username() {
        return this.__username.get();
    }
    set username(newValue: string) {
        this.__username.set(newValue);
    }
    private __password: SynchedPropertySimpleTwoWayPU<string>;
    get password() {
        return this.__password.get();
    }
    set password(newValue: string) {
        this.__password.set(newValue);
    }
    private __errorMessage: SynchedPropertySimpleTwoWayPU<string>;
    get errorMessage() {
        return this.__errorMessage.get();
    }
    set errorMessage(newValue: string) {
        this.__errorMessage.set(newValue);
    }
    private __successMessage: SynchedPropertySimpleTwoWayPU<string>;
    get successMessage() {
        return this.__successMessage.get();
    }
    set successMessage(newValue: string) {
        this.__successMessage.set(newValue);
    }
    private __isLoading: SynchedPropertySimpleTwoWayPU<boolean>;
    get isLoading() {
        return this.__isLoading.get();
    }
    set isLoading(newValue: boolean) {
        this.__isLoading.set(newValue);
    }
    // 回调函数
    private handleLogin: () => void;
    private handleGuestMode: () => void;
    private switchToRegister: () => void;
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/components/common/LoginPage.ets(19:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.linearGradient({
                angle: 180,
                colors: [['#FFFFFF', 0.0], ['#F8FCFF', 0.5], ['#EBF4FF', 1.0]]
            });
            Column.justifyContent(FlexAlign.Start);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 顶部标题区域
            Column.create();
            Column.debugLine("entry/src/main/ets/components/common/LoginPage.ets(21:7)", "entry");
            // 顶部标题区域
            Column.width('100%');
            // 顶部标题区域
            Column.alignItems(HorizontalAlign.Center);
            // 顶部标题区域
            Column.margin({ top: 80, bottom: 32 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Logo图标
            Image.create({ "id": 0, "type": 30000, params: ['登录.png'], "bundleName": "com.example.myapplication", "moduleName": "entry" });
            Image.debugLine("entry/src/main/ets/components/common/LoginPage.ets(23:9)", "entry");
            // Logo图标
            Image.width(80);
            // Logo图标
            Image.height(80);
            // Logo图标
            Image.fillColor('#007AFF');
            // Logo图标
            Image.margin({ bottom: 16 });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('欢迎回来');
            Text.debugLine("entry/src/main/ets/components/common/LoginPage.ets(29:9)", "entry");
            Text.fontSize(32);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#1a1a1a');
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('登录智慧农业管理系统');
            Text.debugLine("entry/src/main/ets/components/common/LoginPage.ets(35:9)", "entry");
            Text.fontSize(16);
            Text.fontColor('#666666');
            Text.margin({ bottom: 48 });
        }, Text);
        Text.pop();
        // 顶部标题区域
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 登录表单区域
            Column.create();
            Column.debugLine("entry/src/main/ets/components/common/LoginPage.ets(45:7)", "entry");
            // 登录表单区域
            Column.width('100%');
            // 登录表单区域
            Column.padding({ left: 32, right: 32 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 用户名输入框
            Column.create();
            Column.debugLine("entry/src/main/ets/components/common/LoginPage.ets(47:9)", "entry");
            // 用户名输入框
            Column.width('100%');
            // 用户名输入框
            Column.margin({ bottom: 20 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('用户名');
            Text.debugLine("entry/src/main/ets/components/common/LoginPage.ets(48:11)", "entry");
            Text.fontSize(14);
            Text.fontColor('#666666');
            Text.fontWeight(FontWeight.Medium);
            Text.alignSelf(ItemAlign.Start);
            Text.margin({ bottom: 8, left: 4 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '请输入用户名', text: this.username });
            TextInput.debugLine("entry/src/main/ets/components/common/LoginPage.ets(55:11)", "entry");
            TextInput.width('100%');
            TextInput.height(52);
            TextInput.backgroundColor('#FFFFFF');
            TextInput.borderRadius(26);
            TextInput.padding({ left: 20, right: 20 });
            TextInput.fontSize(16);
            TextInput.placeholderColor('#BBBBBB');
            TextInput.border({ width: 1, color: '#E5E5E5' });
            TextInput.shadow({
                radius: 8,
                color: 'rgba(0, 0, 0, 0.04)',
                offsetX: 0,
                offsetY: 2
            });
            TextInput.onChange((value: string) => {
                this.username = value;
            });
        }, TextInput);
        // 用户名输入框
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 密码输入框
            Column.create();
            Column.debugLine("entry/src/main/ets/components/common/LoginPage.ets(78:9)", "entry");
            // 密码输入框
            Column.width('100%');
            // 密码输入框
            Column.margin({ bottom: 32 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('密码');
            Text.debugLine("entry/src/main/ets/components/common/LoginPage.ets(79:11)", "entry");
            Text.fontSize(14);
            Text.fontColor('#666666');
            Text.fontWeight(FontWeight.Medium);
            Text.alignSelf(ItemAlign.Start);
            Text.margin({ bottom: 8, left: 4 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '请输入密码', text: this.password });
            TextInput.debugLine("entry/src/main/ets/components/common/LoginPage.ets(86:11)", "entry");
            TextInput.width('100%');
            TextInput.height(52);
            TextInput.backgroundColor('#FFFFFF');
            TextInput.borderRadius(26);
            TextInput.padding({ left: 20, right: 20 });
            TextInput.fontSize(16);
            TextInput.placeholderColor('#BBBBBB');
            TextInput.type(InputType.Password);
            TextInput.border({ width: 1, color: '#E5E5E5' });
            TextInput.shadow({
                radius: 8,
                color: 'rgba(0, 0, 0, 0.04)',
                offsetX: 0,
                offsetY: 2
            });
            TextInput.onChange((value: string) => {
                this.password = value;
            });
        }, TextInput);
        // 密码输入框
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 错误信息显示
            if (this.errorMessage) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.debugLine("entry/src/main/ets/components/common/LoginPage.ets(111:11)", "entry");
                        Row.width('100%');
                        Row.padding(12);
                        Row.backgroundColor('#FFF5F5');
                        Row.borderRadius(12);
                        Row.margin({ bottom: 20 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('⚠️');
                        Text.debugLine("entry/src/main/ets/components/common/LoginPage.ets(112:13)", "entry");
                        Text.fontSize(16);
                        Text.margin({ right: 6 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.errorMessage);
                        Text.debugLine("entry/src/main/ets/components/common/LoginPage.ets(115:13)", "entry");
                        Text.fontSize(14);
                        Text.fontColor('#FF4444');
                    }, Text);
                    Text.pop();
                    Row.pop();
                });
            }
            // 成功信息显示
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 成功信息显示
            if (this.successMessage) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.debugLine("entry/src/main/ets/components/common/LoginPage.ets(128:11)", "entry");
                        Row.width('100%');
                        Row.padding(12);
                        Row.backgroundColor('#F0FFF4');
                        Row.borderRadius(12);
                        Row.margin({ bottom: 20 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('✓');
                        Text.debugLine("entry/src/main/ets/components/common/LoginPage.ets(129:13)", "entry");
                        Text.fontSize(16);
                        Text.fontColor('#00AA00');
                        Text.margin({ right: 6 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.successMessage);
                        Text.debugLine("entry/src/main/ets/components/common/LoginPage.ets(133:13)", "entry");
                        Text.fontSize(14);
                        Text.fontColor('#00AA00');
                    }, Text);
                    Text.pop();
                    Row.pop();
                });
            }
            // 登录按钮
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 登录按钮
            Stack.create();
            Stack.debugLine("entry/src/main/ets/components/common/LoginPage.ets(145:9)", "entry");
            // 登录按钮
            Stack.margin({ bottom: 16 });
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (!this.isLoading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/components/common/LoginPage.ets(147:13)", "entry");
                        Column.width('100%');
                        Column.height(56);
                        Column.borderRadius(28);
                        Column.linearGradient({
                            angle: 135,
                            colors: [['#4facfe', 0.0], ['#00f2fe', 1.0]]
                        });
                        Column.shadow({
                            radius: 16,
                            color: 'rgba(79, 172, 254, 0.4)',
                            offsetX: 0,
                            offsetY: 8
                        });
                    }, Column);
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/components/common/LoginPage.ets(162:13)", "entry");
                        Column.width('100%');
                        Column.height(56);
                        Column.borderRadius(28);
                        Column.backgroundColor('#CCCCCC');
                    }, Column);
                    Column.pop();
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild({ type: ButtonType.Normal });
            Button.debugLine("entry/src/main/ets/components/common/LoginPage.ets(169:11)", "entry");
            Button.width('100%');
            Button.height(56);
            Button.backgroundColor('transparent');
            Button.borderRadius(28);
            Button.enabled(!this.isLoading);
            Button.onClick(() => {
                this.handleLogin();
            });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/components/common/LoginPage.ets(170:13)", "entry");
            Row.justifyContent(FlexAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (!this.isLoading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 0, "type": 30000, params: ['登录.png'], "bundleName": "com.example.myapplication", "moduleName": "entry" });
                        Image.debugLine("entry/src/main/ets/components/common/LoginPage.ets(172:17)", "entry");
                        Image.width(22);
                        Image.height(22);
                        Image.fillColor('#FFFFFF');
                        Image.margin({ right: 8 });
                    }, Image);
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.isLoading ? '登录中...' : '立即登录');
            Text.debugLine("entry/src/main/ets/components/common/LoginPage.ets(178:15)", "entry");
            Text.fontSize(17);
            Text.fontColor('#FFFFFF');
            Text.fontWeight(FontWeight.Medium);
        }, Text);
        Text.pop();
        Row.pop();
        Button.pop();
        // 登录按钮
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 注册链接
            Row.create();
            Row.debugLine("entry/src/main/ets/components/common/LoginPage.ets(199:9)", "entry");
            // 注册链接
            Row.justifyContent(FlexAlign.Center);
            // 注册链接
            Row.padding(12);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('还没有账号？');
            Text.debugLine("entry/src/main/ets/components/common/LoginPage.ets(200:11)", "entry");
            Text.fontSize(15);
            Text.fontColor('#999999');
            Text.margin({ right: 4 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('立即注册');
            Text.debugLine("entry/src/main/ets/components/common/LoginPage.ets(205:11)", "entry");
            Text.fontSize(15);
            Text.fontColor('#4facfe');
            Text.fontWeight(FontWeight.Medium);
            Text.onClick(() => {
                promptAction.showToast({ message: '请联系管理员分发账号权限，谢谢' });
            });
        }, Text);
        Text.pop();
        // 注册链接
        Row.pop();
        // 登录表单区域
        Column.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
