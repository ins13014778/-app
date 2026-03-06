if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface ChangePassword_Params {
    oldPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
    isLoading?: boolean;
    errorMessage?: string;
    successMessage?: string;
    showOldPassword?: boolean;
    showNewPassword?: boolean;
    showConfirmPassword?: boolean;
}
import router from "@ohos:router";
import { apiService } from "@normalized:N&&&entry/src/main/ets/services/ApiService&";
import type common from "@ohos:app.ability.common";
class ChangePassword extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__oldPassword = new ObservedPropertySimplePU('', this, "oldPassword");
        this.__newPassword = new ObservedPropertySimplePU('', this, "newPassword");
        this.__confirmPassword = new ObservedPropertySimplePU('', this, "confirmPassword");
        this.__isLoading = new ObservedPropertySimplePU(false, this, "isLoading");
        this.__errorMessage = new ObservedPropertySimplePU('', this, "errorMessage");
        this.__successMessage = new ObservedPropertySimplePU('', this, "successMessage");
        this.__showOldPassword = new ObservedPropertySimplePU(false, this, "showOldPassword");
        this.__showNewPassword = new ObservedPropertySimplePU(false, this, "showNewPassword");
        this.__showConfirmPassword = new ObservedPropertySimplePU(false, this, "showConfirmPassword");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: ChangePassword_Params) {
        if (params.oldPassword !== undefined) {
            this.oldPassword = params.oldPassword;
        }
        if (params.newPassword !== undefined) {
            this.newPassword = params.newPassword;
        }
        if (params.confirmPassword !== undefined) {
            this.confirmPassword = params.confirmPassword;
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
        if (params.showOldPassword !== undefined) {
            this.showOldPassword = params.showOldPassword;
        }
        if (params.showNewPassword !== undefined) {
            this.showNewPassword = params.showNewPassword;
        }
        if (params.showConfirmPassword !== undefined) {
            this.showConfirmPassword = params.showConfirmPassword;
        }
    }
    updateStateVars(params: ChangePassword_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__oldPassword.purgeDependencyOnElmtId(rmElmtId);
        this.__newPassword.purgeDependencyOnElmtId(rmElmtId);
        this.__confirmPassword.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
        this.__errorMessage.purgeDependencyOnElmtId(rmElmtId);
        this.__successMessage.purgeDependencyOnElmtId(rmElmtId);
        this.__showOldPassword.purgeDependencyOnElmtId(rmElmtId);
        this.__showNewPassword.purgeDependencyOnElmtId(rmElmtId);
        this.__showConfirmPassword.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__oldPassword.aboutToBeDeleted();
        this.__newPassword.aboutToBeDeleted();
        this.__confirmPassword.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
        this.__errorMessage.aboutToBeDeleted();
        this.__successMessage.aboutToBeDeleted();
        this.__showOldPassword.aboutToBeDeleted();
        this.__showNewPassword.aboutToBeDeleted();
        this.__showConfirmPassword.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __oldPassword: ObservedPropertySimplePU<string>;
    get oldPassword() {
        return this.__oldPassword.get();
    }
    set oldPassword(newValue: string) {
        this.__oldPassword.set(newValue);
    }
    private __newPassword: ObservedPropertySimplePU<string>;
    get newPassword() {
        return this.__newPassword.get();
    }
    set newPassword(newValue: string) {
        this.__newPassword.set(newValue);
    }
    private __confirmPassword: ObservedPropertySimplePU<string>;
    get confirmPassword() {
        return this.__confirmPassword.get();
    }
    set confirmPassword(newValue: string) {
        this.__confirmPassword.set(newValue);
    }
    private __isLoading: ObservedPropertySimplePU<boolean>;
    get isLoading() {
        return this.__isLoading.get();
    }
    set isLoading(newValue: boolean) {
        this.__isLoading.set(newValue);
    }
    private __errorMessage: ObservedPropertySimplePU<string>;
    get errorMessage() {
        return this.__errorMessage.get();
    }
    set errorMessage(newValue: string) {
        this.__errorMessage.set(newValue);
    }
    private __successMessage: ObservedPropertySimplePU<string>;
    get successMessage() {
        return this.__successMessage.get();
    }
    set successMessage(newValue: string) {
        this.__successMessage.set(newValue);
    }
    private __showOldPassword: ObservedPropertySimplePU<boolean>;
    get showOldPassword() {
        return this.__showOldPassword.get();
    }
    set showOldPassword(newValue: boolean) {
        this.__showOldPassword.set(newValue);
    }
    private __showNewPassword: ObservedPropertySimplePU<boolean>;
    get showNewPassword() {
        return this.__showNewPassword.get();
    }
    set showNewPassword(newValue: boolean) {
        this.__showNewPassword.set(newValue);
    }
    private __showConfirmPassword: ObservedPropertySimplePU<boolean>;
    get showConfirmPassword() {
        return this.__showConfirmPassword.get();
    }
    set showConfirmPassword(newValue: boolean) {
        this.__showConfirmPassword.set(newValue);
    }
    aboutToAppear() {
        // 设置API服务的context
        apiService.setContext(this.getUIContext().getHostContext() as common.UIAbilityContext);
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/ChangePassword.ets(24:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#F5F5F5');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 顶部导航栏
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/ChangePassword.ets(26:7)", "entry");
            // 顶部导航栏
            Row.width('100%');
            // 顶部导航栏
            Row.height(56);
            // 顶部导航栏
            Row.padding({ left: 12, right: 16 });
            // 顶部导航栏
            Row.backgroundColor('#FFFFFF');
            // 顶部导航栏
            Row.shadow({ radius: 2, color: '#10000000', offsetY: 1 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 返回按钮
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/ChangePassword.ets(28:9)", "entry");
            // 返回按钮
            Row.width(44);
            // 返回按钮
            Row.height(44);
            // 返回按钮
            Row.justifyContent(FlexAlign.Center);
            // 返回按钮
            Row.onClick(() => {
                router.back();
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('←');
            Text.debugLine("entry/src/main/ets/pages/ChangePassword.ets(29:11)", "entry");
            Text.fontSize(24);
            Text.fontColor('#333333');
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        // 返回按钮
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('修改密码');
            Text.debugLine("entry/src/main/ets/pages/ChangePassword.ets(41:9)", "entry");
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#333333');
            Text.margin({ left: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/pages/ChangePassword.ets(47:9)", "entry");
        }, Blank);
        Blank.pop();
        // 顶部导航栏
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.debugLine("entry/src/main/ets/pages/ChangePassword.ets(55:7)", "entry");
            Scroll.layoutWeight(1);
            Scroll.backgroundColor('#F5F5F5');
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/ChangePassword.ets(56:9)", "entry");
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 安全提示
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/ChangePassword.ets(58:11)", "entry");
            // 安全提示
            Column.width('100%');
            // 安全提示
            Column.padding(16);
            // 安全提示
            Column.backgroundColor('#FFF3E0');
            // 安全提示
            Column.borderRadius(12);
            // 安全提示
            Column.margin({ top: 16, bottom: 24, left: 16, right: 16 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/ChangePassword.ets(59:13)", "entry");
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('🔒');
            Text.debugLine("entry/src/main/ets/pages/ChangePassword.ets(60:15)", "entry");
            Text.fontSize(24);
            Text.margin({ right: 12 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/ChangePassword.ets(64:15)", "entry");
            Column.alignItems(HorizontalAlign.Start);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('安全提示');
            Text.debugLine("entry/src/main/ets/pages/ChangePassword.ets(65:17)", "entry");
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#333333');
            Text.margin({ bottom: 4 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('为了您的账号安全，建议定期修改密码');
            Text.debugLine("entry/src/main/ets/pages/ChangePassword.ets(71:17)", "entry");
            Text.fontSize(12);
            Text.fontColor('#666666');
        }, Text);
        Text.pop();
        Column.pop();
        Row.pop();
        // 安全提示
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 旧密码输入
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/ChangePassword.ets(86:11)", "entry");
            // 旧密码输入
            Column.width('100%');
            // 旧密码输入
            Column.padding({ left: 16, right: 16 });
            // 旧密码输入
            Column.margin({ bottom: 16 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('旧密码');
            Text.debugLine("entry/src/main/ets/pages/ChangePassword.ets(87:13)", "entry");
            Text.fontSize(14);
            Text.fontColor('#666666');
            Text.alignSelf(ItemAlign.Start);
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/ChangePassword.ets(93:13)", "entry");
            Row.width('100%');
            Row.borderRadius(8);
            Row.border({ width: 1, color: '#E0E0E0' });
            Row.backgroundColor('#FFFFFF');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '请输入旧密码', text: this.oldPassword });
            TextInput.debugLine("entry/src/main/ets/pages/ChangePassword.ets(94:15)", "entry");
            TextInput.layoutWeight(1);
            TextInput.height(48);
            TextInput.backgroundColor('#FFFFFF');
            TextInput.border({ width: 0 });
            TextInput.type(this.showOldPassword ? InputType.Normal : InputType.Password);
            TextInput.onChange((value: string) => {
                this.oldPassword = value;
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.showOldPassword ? '👁️' : '👁️‍🗨️');
            Text.debugLine("entry/src/main/ets/pages/ChangePassword.ets(104:15)", "entry");
            Text.fontSize(20);
            Text.padding(8);
            Text.onClick(() => {
                this.showOldPassword = !this.showOldPassword;
            });
        }, Text);
        Text.pop();
        Row.pop();
        // 旧密码输入
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 新密码输入
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/ChangePassword.ets(121:11)", "entry");
            // 新密码输入
            Column.width('100%');
            // 新密码输入
            Column.padding({ left: 16, right: 16 });
            // 新密码输入
            Column.margin({ bottom: 16 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('新密码');
            Text.debugLine("entry/src/main/ets/pages/ChangePassword.ets(122:13)", "entry");
            Text.fontSize(14);
            Text.fontColor('#666666');
            Text.alignSelf(ItemAlign.Start);
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/ChangePassword.ets(128:13)", "entry");
            Row.width('100%');
            Row.borderRadius(8);
            Row.border({ width: 1, color: '#E0E0E0' });
            Row.backgroundColor('#FFFFFF');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '请输入新密码（6-20位）', text: this.newPassword });
            TextInput.debugLine("entry/src/main/ets/pages/ChangePassword.ets(129:15)", "entry");
            TextInput.layoutWeight(1);
            TextInput.height(48);
            TextInput.backgroundColor('#FFFFFF');
            TextInput.border({ width: 0 });
            TextInput.type(this.showNewPassword ? InputType.Normal : InputType.Password);
            TextInput.maxLength(20);
            TextInput.onChange((value: string) => {
                this.newPassword = value;
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.showNewPassword ? '👁️' : '👁️‍🗨️');
            Text.debugLine("entry/src/main/ets/pages/ChangePassword.ets(140:15)", "entry");
            Text.fontSize(20);
            Text.padding(8);
            Text.onClick(() => {
                this.showNewPassword = !this.showNewPassword;
            });
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 密码强度提示
            if (this.newPassword.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.debugLine("entry/src/main/ets/pages/ChangePassword.ets(154:15)", "entry");
                        Row.margin({ top: 8 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('密码强度：');
                        Text.debugLine("entry/src/main/ets/pages/ChangePassword.ets(155:17)", "entry");
                        Text.fontSize(12);
                        Text.fontColor('#666666');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.getPasswordStrength());
                        Text.debugLine("entry/src/main/ets/pages/ChangePassword.ets(159:17)", "entry");
                        Text.fontSize(12);
                        Text.fontColor(this.getPasswordStrengthColor());
                        Text.fontWeight(FontWeight.Bold);
                    }, Text);
                    Text.pop();
                    Row.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        // 新密码输入
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 确认密码输入
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/ChangePassword.ets(172:11)", "entry");
            // 确认密码输入
            Column.width('100%');
            // 确认密码输入
            Column.padding({ left: 16, right: 16 });
            // 确认密码输入
            Column.margin({ bottom: 24 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('确认密码');
            Text.debugLine("entry/src/main/ets/pages/ChangePassword.ets(173:13)", "entry");
            Text.fontSize(14);
            Text.fontColor('#666666');
            Text.alignSelf(ItemAlign.Start);
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/ChangePassword.ets(179:13)", "entry");
            Row.width('100%');
            Row.borderRadius(8);
            Row.border({ width: 1, color: '#E0E0E0' });
            Row.backgroundColor('#FFFFFF');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '请再次输入新密码', text: this.confirmPassword });
            TextInput.debugLine("entry/src/main/ets/pages/ChangePassword.ets(180:15)", "entry");
            TextInput.layoutWeight(1);
            TextInput.height(48);
            TextInput.backgroundColor('#FFFFFF');
            TextInput.border({ width: 0 });
            TextInput.type(this.showConfirmPassword ? InputType.Normal : InputType.Password);
            TextInput.maxLength(20);
            TextInput.onChange((value: string) => {
                this.confirmPassword = value;
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.showConfirmPassword ? '👁️' : '👁️‍🗨️');
            Text.debugLine("entry/src/main/ets/pages/ChangePassword.ets(191:15)", "entry");
            Text.fontSize(20);
            Text.padding(8);
            Text.onClick(() => {
                this.showConfirmPassword = !this.showConfirmPassword;
            });
        }, Text);
        Text.pop();
        Row.pop();
        // 确认密码输入
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 密码要求说明
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/ChangePassword.ets(208:11)", "entry");
            // 密码要求说明
            Column.width('100%');
            // 密码要求说明
            Column.padding(16);
            // 密码要求说明
            Column.backgroundColor('#F5F5F5');
            // 密码要求说明
            Column.borderRadius(12);
            // 密码要求说明
            Column.margin({ left: 16, right: 16, bottom: 24 });
            // 密码要求说明
            Column.alignItems(HorizontalAlign.Start);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('密码要求：');
            Text.debugLine("entry/src/main/ets/pages/ChangePassword.ets(209:13)", "entry");
            Text.fontSize(14);
            Text.fontColor('#666666');
            Text.fontWeight(FontWeight.Bold);
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('• 长度为6-20个字符');
            Text.debugLine("entry/src/main/ets/pages/ChangePassword.ets(215:13)", "entry");
            Text.fontSize(12);
            Text.fontColor('#999999');
            Text.margin({ bottom: 4 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('• 建议包含字母和数字');
            Text.debugLine("entry/src/main/ets/pages/ChangePassword.ets(220:13)", "entry");
            Text.fontSize(12);
            Text.fontColor('#999999');
            Text.margin({ bottom: 4 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('• 不要使用过于简单的密码');
            Text.debugLine("entry/src/main/ets/pages/ChangePassword.ets(225:13)", "entry");
            Text.fontSize(12);
            Text.fontColor('#999999');
        }, Text);
        Text.pop();
        // 密码要求说明
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 错误信息
            if (this.errorMessage) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.errorMessage);
                        Text.debugLine("entry/src/main/ets/pages/ChangePassword.ets(238:13)", "entry");
                        Text.fontSize(14);
                        Text.fontColor('#FF4444');
                        Text.width('100%');
                        Text.textAlign(TextAlign.Center);
                        Text.padding(12);
                        Text.margin({ bottom: 8 });
                    }, Text);
                    Text.pop();
                });
            }
            // 成功信息
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 成功信息
            if (this.successMessage) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.successMessage);
                        Text.debugLine("entry/src/main/ets/pages/ChangePassword.ets(249:13)", "entry");
                        Text.fontSize(14);
                        Text.fontColor('#4CAF50');
                        Text.width('100%');
                        Text.textAlign(TextAlign.Center);
                        Text.padding(12);
                        Text.margin({ bottom: 8 });
                    }, Text);
                    Text.pop();
                });
            }
            // 提交按钮
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 提交按钮
            Button.createWithLabel(this.isLoading ? '提交中...' : '确认修改');
            Button.debugLine("entry/src/main/ets/pages/ChangePassword.ets(259:11)", "entry");
            // 提交按钮
            Button.width('90%');
            // 提交按钮
            Button.height(48);
            // 提交按钮
            Button.fontSize(16);
            // 提交按钮
            Button.fontColor('#FFFFFF');
            // 提交按钮
            Button.backgroundColor(this.isLoading ? '#CCCCCC' : '#2196F3');
            // 提交按钮
            Button.borderRadius(24);
            // 提交按钮
            Button.enabled(!this.isLoading);
            // 提交按钮
            Button.margin({ bottom: 32 });
            // 提交按钮
            Button.onClick(() => {
                this.handleChangePassword();
            });
        }, Button);
        // 提交按钮
        Button.pop();
        Column.pop();
        Scroll.pop();
        Column.pop();
    }
    // 处理修改密码
    private async handleChangePassword() {
        // 清除之前的消息
        this.errorMessage = '';
        this.successMessage = '';
        // 验证输入
        if (!this.oldPassword) {
            this.errorMessage = '请输入旧密码';
            return;
        }
        if (!this.newPassword) {
            this.errorMessage = '请输入新密码';
            return;
        }
        if (this.newPassword.length < 6) {
            this.errorMessage = '新密码长度不能少于6位';
            return;
        }
        if (this.newPassword.length > 20) {
            this.errorMessage = '新密码长度不能超过20位';
            return;
        }
        if (this.newPassword === this.oldPassword) {
            this.errorMessage = '新密码不能与旧密码相同';
            return;
        }
        if (this.newPassword !== this.confirmPassword) {
            this.errorMessage = '两次输入的新密码不一致';
            return;
        }
        this.isLoading = true;
        try {
            console.info('[ChangePassword] 开始修改密码');
            console.info('[ChangePassword] 当前Token:', apiService.getToken() || '无Token');
            const response = await apiService.changePassword({
                old_password: this.oldPassword,
                new_password: this.newPassword
            });
            console.info('[ChangePassword] API响应:', JSON.stringify(response));
            if (response.success) {
                console.info('[ChangePassword] ✅ 密码修改成功');
                this.successMessage = '密码修改成功！即将返回...';
                // 延迟2秒后返回
                setTimeout(() => {
                    router.back();
                }, 2000);
            }
            else {
                console.error('[ChangePassword] ❌ 密码修改失败:', response.message);
                this.errorMessage = response.message || '密码修改失败，请检查旧密码是否正确';
            }
        }
        catch (error) {
            console.error('[ChangePassword] ❌ 修改异常:', JSON.stringify(error));
            this.errorMessage = '网络连接失败，请检查网络设置';
        }
        finally {
            this.isLoading = false;
        }
    }
    // 获取密码强度
    private getPasswordStrength(): string {
        const password = this.newPassword;
        if (password.length === 0)
            return '';
        if (password.length < 6)
            return '弱';
        if (password.length < 10)
            return '中';
        // 检查是否包含字母和数字
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        if (hasLetter && hasNumber) {
            return '强';
        }
        return '中';
    }
    // 获取密码强度颜色
    private getPasswordStrengthColor(): string {
        const strength = this.getPasswordStrength();
        if (strength === '弱')
            return '#FF4444';
        if (strength === '中')
            return '#FF9800';
        if (strength === '强')
            return '#4CAF50';
        return '#999999';
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "ChangePassword";
    }
}
registerNamedRoute(() => new ChangePassword(undefined, {}), "", { bundleName: "com.example.myapplication", moduleName: "entry", pagePath: "pages/ChangePassword", pageFullPath: "entry/src/main/ets/pages/ChangePassword", integratedHsp: "false", moduleType: "followWithHap" });
