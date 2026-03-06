if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface EditProfile_Params {
    username?: string;
    email?: string;
    phone?: string;
    bio?: string;
    selectedAvatar?: string;
    isLoading?: boolean;
    errorMessage?: string;
    successMessage?: string;
    showAvatarPicker?: boolean;
    avatarEmojis?: string[];
}
import router from "@ohos:router";
import { apiService } from "@normalized:N&&&entry/src/main/ets/services/ApiService&";
import type common from "@ohos:app.ability.common";
class EditProfile extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__username = new ObservedPropertySimplePU('', this, "username");
        this.__email = new ObservedPropertySimplePU('', this, "email");
        this.__phone = new ObservedPropertySimplePU('', this, "phone");
        this.__bio = new ObservedPropertySimplePU('', this, "bio");
        this.__selectedAvatar = new ObservedPropertySimplePU('👤', this, "selectedAvatar");
        this.__isLoading = new ObservedPropertySimplePU(false, this, "isLoading");
        this.__errorMessage = new ObservedPropertySimplePU('', this, "errorMessage");
        this.__successMessage = new ObservedPropertySimplePU('', this, "successMessage");
        this.__showAvatarPicker = new ObservedPropertySimplePU(false, this, "showAvatarPicker");
        this.avatarEmojis = [
            '👤', '👨‍🌾', '👩‍🌾', '🧑‍🌾', '👨‍💼', '👩‍💼',
            '🌾', '🚜', '🌱', '🌿', '🍀', '🌻',
            '🌸', '🌺', '🌼', '🌷', '🪴', '🌳'
        ];
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: EditProfile_Params) {
        if (params.username !== undefined) {
            this.username = params.username;
        }
        if (params.email !== undefined) {
            this.email = params.email;
        }
        if (params.phone !== undefined) {
            this.phone = params.phone;
        }
        if (params.bio !== undefined) {
            this.bio = params.bio;
        }
        if (params.selectedAvatar !== undefined) {
            this.selectedAvatar = params.selectedAvatar;
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
        if (params.showAvatarPicker !== undefined) {
            this.showAvatarPicker = params.showAvatarPicker;
        }
        if (params.avatarEmojis !== undefined) {
            this.avatarEmojis = params.avatarEmojis;
        }
    }
    updateStateVars(params: EditProfile_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__username.purgeDependencyOnElmtId(rmElmtId);
        this.__email.purgeDependencyOnElmtId(rmElmtId);
        this.__phone.purgeDependencyOnElmtId(rmElmtId);
        this.__bio.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedAvatar.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
        this.__errorMessage.purgeDependencyOnElmtId(rmElmtId);
        this.__successMessage.purgeDependencyOnElmtId(rmElmtId);
        this.__showAvatarPicker.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__username.aboutToBeDeleted();
        this.__email.aboutToBeDeleted();
        this.__phone.aboutToBeDeleted();
        this.__bio.aboutToBeDeleted();
        this.__selectedAvatar.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
        this.__errorMessage.aboutToBeDeleted();
        this.__successMessage.aboutToBeDeleted();
        this.__showAvatarPicker.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __username: ObservedPropertySimplePU<string>;
    get username() {
        return this.__username.get();
    }
    set username(newValue: string) {
        this.__username.set(newValue);
    }
    private __email: ObservedPropertySimplePU<string>;
    get email() {
        return this.__email.get();
    }
    set email(newValue: string) {
        this.__email.set(newValue);
    }
    private __phone: ObservedPropertySimplePU<string>;
    get phone() {
        return this.__phone.get();
    }
    set phone(newValue: string) {
        this.__phone.set(newValue);
    }
    private __bio: ObservedPropertySimplePU<string>;
    get bio() {
        return this.__bio.get();
    }
    set bio(newValue: string) {
        this.__bio.set(newValue);
    }
    private __selectedAvatar: ObservedPropertySimplePU<string>;
    get selectedAvatar() {
        return this.__selectedAvatar.get();
    }
    set selectedAvatar(newValue: string) {
        this.__selectedAvatar.set(newValue);
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
    private __showAvatarPicker: ObservedPropertySimplePU<boolean>;
    get showAvatarPicker() {
        return this.__showAvatarPicker.get();
    }
    set showAvatarPicker(newValue: boolean) {
        this.__showAvatarPicker.set(newValue);
    }
    // 预设头像Emoji列表
    private avatarEmojis: string[];
    aboutToAppear() {
        // 设置API服务的context
        apiService.setContext(this.getUIContext().getHostContext() as common.UIAbilityContext);
        // 从路由参数获取用户信息
        const params = router.getParams() as Record<string, string>;
        if (params) {
            this.username = params['username'] || '';
            this.email = params['email'] || '';
            this.phone = params['phone'] || '';
            this.bio = params['bio'] || '';
            this.selectedAvatar = params['avatar'] || '👤';
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#F5F5F5');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 顶部导航栏
            Row.create();
            // 顶部导航栏
            Row.width('100%');
            // 顶部导航栏
            Row.height(56);
            // 顶部导航栏
            Row.padding({ left: 16, right: 16 });
            // 顶部导航栏
            Row.backgroundColor('#FFFFFF');
            // 顶部导航栏
            Row.shadow({ radius: 2, color: '#10000000', offsetY: 1 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 取消按钮
            Text.create('取消');
            // 取消按钮
            Text.fontSize(16);
            // 取消按钮
            Text.fontColor('#666666');
            // 取消按钮
            Text.onClick(() => {
                router.back();
            });
        }, Text);
        // 取消按钮
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('编辑资料');
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#333333');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 保存按钮
            Text.create('保存');
            // 保存按钮
            Text.fontSize(16);
            // 保存按钮
            Text.fontColor('#2196F3');
            // 保存按钮
            Text.fontWeight(FontWeight.Medium);
            // 保存按钮
            Text.onClick(() => {
                this.saveProfile();
            });
        }, Text);
        // 保存按钮
        Text.pop();
        // 顶部导航栏
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.layoutWeight(1);
            Scroll.backgroundColor('#F5F5F5');
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 头像选择区域
            Column.create();
            // 头像选择区域
            Column.width('100%');
            // 头像选择区域
            Column.padding(16);
            // 头像选择区域
            Column.margin({ bottom: 8 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('头像');
            Text.fontSize(14);
            Text.fontColor('#666666');
            Text.alignSelf(ItemAlign.Start);
            Text.margin({ bottom: 12 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 当前头像显示
            Row.create();
            // 当前头像显示
            Row.width('100%');
            // 当前头像显示
            Row.padding(16);
            // 当前头像显示
            Row.backgroundColor('#F5F5F5');
            // 当前头像显示
            Row.borderRadius(12);
            // 当前头像显示
            Row.onClick(() => {
                this.showAvatarPicker = !this.showAvatarPicker;
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.selectedAvatar);
            Text.fontSize(48);
            Text.margin({ right: 16 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.alignItems(HorizontalAlign.Start);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('点击更换头像');
            Text.fontSize(14);
            Text.fontColor('#333333');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('从下方选择您喜欢的头像');
            Text.fontSize(12);
            Text.fontColor('#999999');
            Text.margin({ top: 4 });
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        // 当前头像显示
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 头像选择器
            if (this.showAvatarPicker) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Grid.create();
                        Grid.columnsTemplate('1fr 1fr 1fr 1fr 1fr 1fr');
                        Grid.rowsGap(12);
                        Grid.columnsGap(12);
                        Grid.width('100%');
                        Grid.padding(16);
                        Grid.backgroundColor('#FAFAFA');
                        Grid.borderRadius(12);
                        Grid.margin({ top: 12 });
                    }, Grid);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const emoji = _item;
                            {
                                const itemCreation2 = (elmtId, isInitialRender) => {
                                    GridItem.create(() => { }, false);
                                    GridItem.onClick(() => {
                                        this.selectedAvatar = emoji;
                                        this.showAvatarPicker = false;
                                    });
                                };
                                const observedDeepRender = () => {
                                    this.observeComponentCreation2(itemCreation2, GridItem);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(emoji);
                                        Text.fontSize(32);
                                        Text.padding(8);
                                        Text.backgroundColor(this.selectedAvatar === emoji ? '#E3F2FD' : '#FFFFFF');
                                        Text.borderRadius(8);
                                        Text.border({
                                            width: 2,
                                            color: this.selectedAvatar === emoji ? '#2196F3' : '#F0F0F0'
                                        });
                                    }, Text);
                                    Text.pop();
                                    GridItem.pop();
                                };
                                observedDeepRender();
                            }
                        };
                        this.forEachUpdateFunction(elmtId, this.avatarEmojis, forEachItemGenFunction);
                    }, ForEach);
                    ForEach.pop();
                    Grid.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        // 头像选择区域
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 用户名（只读）
            Column.create();
            // 用户名（只读）
            Column.width('100%');
            // 用户名（只读）
            Column.padding(16);
            // 用户名（只读）
            Column.margin({ bottom: 8 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('用户名');
            Text.fontSize(14);
            Text.fontColor('#666666');
            Text.alignSelf(ItemAlign.Start);
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ text: this.username });
            TextInput.width('100%');
            TextInput.height(48);
            TextInput.backgroundColor('#F5F5F5');
            TextInput.borderRadius(8);
            TextInput.enabled(false);
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('用户名不可修改');
            Text.fontSize(12);
            Text.fontColor('#999999');
            Text.margin({ top: 4 });
        }, Text);
        Text.pop();
        // 用户名（只读）
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 邮箱（只读）
            Column.create();
            // 邮箱（只读）
            Column.width('100%');
            // 邮箱（只读）
            Column.padding(16);
            // 邮箱（只读）
            Column.margin({ bottom: 8 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('邮箱');
            Text.fontSize(14);
            Text.fontColor('#666666');
            Text.alignSelf(ItemAlign.Start);
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ text: this.email });
            TextInput.width('100%');
            TextInput.height(48);
            TextInput.backgroundColor('#F5F5F5');
            TextInput.borderRadius(8);
            TextInput.enabled(false);
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('邮箱不可修改');
            Text.fontSize(12);
            Text.fontColor('#999999');
            Text.margin({ top: 4 });
        }, Text);
        Text.pop();
        // 邮箱（只读）
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 手机号
            Column.create();
            // 手机号
            Column.width('100%');
            // 手机号
            Column.padding(16);
            // 手机号
            Column.margin({ bottom: 8 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('手机号');
            Text.fontSize(14);
            Text.fontColor('#666666');
            Text.alignSelf(ItemAlign.Start);
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '请输入手机号', text: this.phone });
            TextInput.width('100%');
            TextInput.height(48);
            TextInput.backgroundColor('#FFFFFF');
            TextInput.borderRadius(8);
            TextInput.border({ width: 1, color: '#E0E0E0' });
            TextInput.type(InputType.PhoneNumber);
            TextInput.maxLength(11);
            TextInput.onChange((value: string) => {
                this.phone = value;
            });
        }, TextInput);
        // 手机号
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 个人简介
            Column.create();
            // 个人简介
            Column.width('100%');
            // 个人简介
            Column.padding(16);
            // 个人简介
            Column.margin({ bottom: 8 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('个人简介');
            Text.fontSize(14);
            Text.fontColor('#666666');
            Text.alignSelf(ItemAlign.Start);
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextArea.create({ placeholder: '请输入个人简介', text: this.bio });
            TextArea.width('100%');
            TextArea.height(120);
            TextArea.backgroundColor('#FFFFFF');
            TextArea.borderRadius(8);
            TextArea.border({ width: 1, color: '#E0E0E0' });
            TextArea.maxLength(200);
            TextArea.onChange((value: string) => {
                this.bio = value;
            });
        }, TextArea);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${this.bio.length}/200`);
            Text.fontSize(12);
            Text.fontColor('#999999');
            Text.alignSelf(ItemAlign.End);
            Text.margin({ top: 4 });
        }, Text);
        Text.pop();
        // 个人简介
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 错误信息
            if (this.errorMessage) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.errorMessage);
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
            // 保存按钮
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 保存按钮
            Button.createWithLabel(this.isLoading ? '保存中...' : '保存修改');
            // 保存按钮
            Button.width('90%');
            // 保存按钮
            Button.height(48);
            // 保存按钮
            Button.fontSize(16);
            // 保存按钮
            Button.fontColor('#FFFFFF');
            // 保存按钮
            Button.backgroundColor(this.isLoading ? '#CCCCCC' : '#4CAF50');
            // 保存按钮
            Button.borderRadius(24);
            // 保存按钮
            Button.enabled(!this.isLoading);
            // 保存按钮
            Button.margin({ top: 16, bottom: 32 });
            // 保存按钮
            Button.onClick(() => {
                this.saveProfile();
            });
        }, Button);
        // 保存按钮
        Button.pop();
        Column.pop();
        Scroll.pop();
        Column.pop();
    }
    // 保存用户资料
    private async saveProfile() {
        // 清除之前的消息
        this.errorMessage = '';
        this.successMessage = '';
        // 验证手机号
        if (this.phone && !this.validatePhone(this.phone)) {
            this.errorMessage = '手机号格式不正确';
            return;
        }
        this.isLoading = true;
        try {
            console.info('[EditProfile] 开始保存用户资料');
            const response = await apiService.updateProfile({
                phone: this.phone,
                avatar: this.selectedAvatar,
                bio: this.bio
            });
            if (response.success) {
                console.info('[EditProfile] ✅ 资料保存成功');
                this.successMessage = '保存成功！';
                // 延迟1秒后返回
                setTimeout(() => {
                    router.back();
                }, 1000);
            }
            else {
                console.error('[EditProfile] ❌ 资料保存失败:', response.message);
                this.errorMessage = response.message || '保存失败，请重试';
            }
        }
        catch (error) {
            console.error('[EditProfile] ❌ 保存异常:', JSON.stringify(error));
            this.errorMessage = '网络连接失败，请检查网络设置';
        }
        finally {
            this.isLoading = false;
        }
    }
    // 验证手机号格式
    private validatePhone(phone: string): boolean {
        const phoneRegex = /^1[3-9]\d{9}$/;
        return phoneRegex.test(phone);
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "EditProfile";
    }
}
registerNamedRoute(() => new EditProfile(undefined, {}), "", { bundleName: "com.example.myapplication", moduleName: "entry", pagePath: "pages/EditProfile", pageFullPath: "entry/src/main/ets/pages/EditProfile", integratedHsp: "false", moduleType: "followWithHap" });
