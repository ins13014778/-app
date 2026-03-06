if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface RegisterPage_Params {
    username?: string;
    password?: string;
    confirmPassword?: string;
    email?: string;
    phone?: string;
    errorMessage?: string;
    successMessage?: string;
    isLoading?: boolean;
    // 回调函数
    handleRegister?: () => void;
    switchToLogin?: () => void;
}
export class RegisterPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__username = new SynchedPropertySimpleTwoWayPU(params.username, this, "username");
        this.__password = new SynchedPropertySimpleTwoWayPU(params.password, this, "password");
        this.__confirmPassword = new SynchedPropertySimpleTwoWayPU(params.confirmPassword, this, "confirmPassword");
        this.__email = new SynchedPropertySimpleTwoWayPU(params.email, this, "email");
        this.__phone = new SynchedPropertySimpleTwoWayPU(params.phone, this, "phone");
        this.__errorMessage = new SynchedPropertySimpleTwoWayPU(params.errorMessage, this, "errorMessage");
        this.__successMessage = new SynchedPropertySimpleTwoWayPU(params.successMessage, this, "successMessage");
        this.__isLoading = new SynchedPropertySimpleTwoWayPU(params.isLoading, this, "isLoading");
        this.handleRegister = (): void => { };
        this.switchToLogin = (): void => { };
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: RegisterPage_Params) {
        if (params.handleRegister !== undefined) {
            this.handleRegister = params.handleRegister;
        }
        if (params.switchToLogin !== undefined) {
            this.switchToLogin = params.switchToLogin;
        }
    }
    updateStateVars(params: RegisterPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__username.purgeDependencyOnElmtId(rmElmtId);
        this.__password.purgeDependencyOnElmtId(rmElmtId);
        this.__confirmPassword.purgeDependencyOnElmtId(rmElmtId);
        this.__email.purgeDependencyOnElmtId(rmElmtId);
        this.__phone.purgeDependencyOnElmtId(rmElmtId);
        this.__errorMessage.purgeDependencyOnElmtId(rmElmtId);
        this.__successMessage.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__username.aboutToBeDeleted();
        this.__password.aboutToBeDeleted();
        this.__confirmPassword.aboutToBeDeleted();
        this.__email.aboutToBeDeleted();
        this.__phone.aboutToBeDeleted();
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
    private __confirmPassword: SynchedPropertySimpleTwoWayPU<string>;
    get confirmPassword() {
        return this.__confirmPassword.get();
    }
    set confirmPassword(newValue: string) {
        this.__confirmPassword.set(newValue);
    }
    private __email: SynchedPropertySimpleTwoWayPU<string>;
    get email() {
        return this.__email.get();
    }
    set email(newValue: string) {
        this.__email.set(newValue);
    }
    private __phone: SynchedPropertySimpleTwoWayPU<string>;
    get phone() {
        return this.__phone.get();
    }
    set phone(newValue: string) {
        this.__phone.set(newValue);
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
    private handleRegister: () => void;
    private switchToLogin: () => void;
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.linearGradient({
                angle: 180,
                colors: [['#FFFFFF', 0.0], ['#F8FFF5', 0.5], ['#EBF5E8', 1.0]]
            });
            Column.justifyContent(FlexAlign.Start);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 顶部返回按钮
            Row.create();
            // 顶部返回按钮
            Row.width('100%');
            // 顶部返回按钮
            Row.padding({ left: 20, right: 20, top: 24 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild();
            Button.backgroundColor(Color.Transparent);
            Button.onClick(() => {
                this.switchToLogin();
            });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('←');
            Text.fontSize(20);
            Text.fontColor('#4facfe');
            Text.margin({ right: 4 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('返回登录');
            Text.fontSize(16);
            Text.fontColor('#4facfe');
            Text.fontWeight(FontWeight.Medium);
        }, Text);
        Text.pop();
        Row.pop();
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        // 顶部返回按钮
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 顶部标题区域
            Column.create();
            // 顶部标题区域
            Column.width('100%');
            // 顶部标题区域
            Column.alignItems(HorizontalAlign.Center);
            // 顶部标题区域
            Column.margin({ top: 32, bottom: 24 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 0, "type": 30000, params: ['注册.png'], "bundleName": "com.example.myapplication", "moduleName": "entry" });
            Image.width(60);
            Image.height(60);
            Image.fillColor('#007AFF');
            Image.margin({ bottom: 12 });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('创建账户');
            Text.fontSize(30);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#1a1a1a');
            Text.margin({ bottom: 6 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('加入智慧农业管理系统');
            Text.fontSize(15);
            Text.fontColor('#666666');
            Text.margin({ bottom: 36 });
        }, Text);
        Text.pop();
        // 顶部标题区域
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 注册表单区域
            Scroll.create();
            // 注册表单区域
            Scroll.layoutWeight(1);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding({ left: 32, right: 32 });
        }, Column);
        // 用户名输入框
        this.InputField.bind(this)('用户名', '请输入用户名', InputType.Normal, this.username, (value: string) => {
            this.username = value;
        });
        // 手机号输入框
        this.InputField.bind(this)('手机号', '请输入手机号', InputType.PhoneNumber, this.phone, (value: string) => {
            this.phone = value;
        });
        // 邮箱输入框
        this.InputField.bind(this)('邮箱', '请输入邮箱地址', InputType.Email, this.email, (value: string) => {
            this.email = value;
        });
        // 密码输入框
        this.InputField.bind(this)('密码', '请输入密码（至少6位）', InputType.Password, this.password, (value: string) => {
            this.password = value;
        });
        // 确认密码输入框
        this.InputField.bind(this)('确认密码', '请再次输入密码', InputType.Password, this.confirmPassword, (value: string) => {
            this.confirmPassword = value;
        });
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 错误信息显示
            if (this.errorMessage) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.errorMessage);
                        Text.fontSize(14);
                        Text.fontColor('#FF4444');
                        Text.margin({ bottom: 20 });
                    }, Text);
                    Text.pop();
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
                        Column.create();
                        Column.width('100%');
                        Column.margin({ bottom: 20 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.successMessage);
                        Text.fontSize(14);
                        Text.fontColor('#00AA00');
                        Text.margin({ bottom: 12 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 返回登录按钮
                        Button.createWithLabel('返回登录');
                        // 返回登录按钮
                        Button.width('100%');
                        // 返回登录按钮
                        Button.height(48);
                        // 返回登录按钮
                        Button.backgroundColor('#00AA00');
                        // 返回登录按钮
                        Button.borderRadius(8);
                        // 返回登录按钮
                        Button.fontSize(16);
                        // 返回登录按钮
                        Button.fontColor('#FFFFFF');
                        // 返回登录按钮
                        Button.onClick(() => {
                            this.switchToLogin();
                        });
                    }, Button);
                    // 返回登录按钮
                    Button.pop();
                    Column.pop();
                });
            }
            // 注册按钮
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 注册按钮
            if (!this.successMessage) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Stack.create();
                        Stack.margin({ bottom: 20 });
                    }, Stack);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (!this.isLoading) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Column.create();
                                    Column.width('100%');
                                    Column.height(54);
                                    Column.borderRadius(27);
                                    Column.linearGradient({
                                        angle: 135,
                                        colors: [['#a8e063', 0.0], ['#56ab2f', 1.0]]
                                    });
                                    Column.shadow({
                                        radius: 16,
                                        color: 'rgba(86, 171, 47, 0.4)',
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
                                    Column.width('100%');
                                    Column.height(54);
                                    Column.borderRadius(27);
                                    Column.backgroundColor('#CCCCCC');
                                }, Column);
                                Column.pop();
                            });
                        }
                    }, If);
                    If.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithChild({ type: ButtonType.Normal });
                        Button.width('100%');
                        Button.height(54);
                        Button.backgroundColor('transparent');
                        Button.borderRadius(27);
                        Button.enabled(!this.isLoading);
                        Button.onClick(() => {
                            this.handleRegister();
                        });
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.justifyContent(FlexAlign.Center);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (!this.isLoading) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Image.create({ "id": 0, "type": 30000, params: ['注册.png'], "bundleName": "com.example.myapplication", "moduleName": "entry" });
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
                        Text.create(this.isLoading ? '注册中...' : '立即注册');
                        Text.fontSize(17);
                        Text.fontColor('#FFFFFF');
                        Text.fontWeight(FontWeight.Medium);
                    }, Text);
                    Text.pop();
                    Row.pop();
                    Button.pop();
                    Stack.pop();
                });
            }
            // 登录链接
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 登录链接
            Row.create();
            // 登录链接
            Row.justifyContent(FlexAlign.Center);
            // 登录链接
            Row.padding(12);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('已有账号？');
            Text.fontSize(15);
            Text.fontColor('#999999');
            Text.margin({ right: 4 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('立即登录');
            Text.fontSize(15);
            Text.fontColor('#56ab2f');
            Text.fontWeight(FontWeight.Medium);
            Text.onClick(() => {
                this.switchToLogin();
            });
        }, Text);
        Text.pop();
        // 登录链接
        Row.pop();
        Column.pop();
        // 注册表单区域
        Scroll.pop();
        Column.pop();
    }
    // 输入框组件
    InputField(label: string, placeholder: string, type: InputType, value: string, onChange: (value: string) => void, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.margin({ bottom: 16 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(label);
            Text.fontSize(14);
            Text.fontColor('#666666');
            Text.fontWeight(FontWeight.Medium);
            Text.alignSelf(ItemAlign.Start);
            Text.margin({ bottom: 8, left: 4 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: placeholder, text: value });
            TextInput.width('100%');
            TextInput.height(50);
            TextInput.backgroundColor('#FFFFFF');
            TextInput.borderRadius(25);
            TextInput.padding({ left: 20, right: 20 });
            TextInput.fontSize(15);
            TextInput.placeholderColor('#BBBBBB');
            TextInput.type(type);
            TextInput.border({ width: 1, color: '#E5E5E5' });
            TextInput.shadow({
                radius: 8,
                color: 'rgba(0, 0, 0, 0.04)',
                offsetX: 0,
                offsetY: 2
            });
            TextInput.onChange(onChange);
        }, TextInput);
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
