if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface ProfilePage_Params {
    userMode?: string;
    userProfile?: UserProfile;
    menuItems?: ProfileMenuItem[];
    // 回调函数
    getMenuItemsForCurrentMode?: () => ProfileMenuItem[];
    handleMenuItemClick?: (itemId: string) => void;
    switchToLogin?: () => void;
}
import router from "@ohos:router";
import type { UserProfile, ProfileMenuItem } from '../../types/IndexTypes';
export class ProfilePage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__userMode = new SynchedPropertySimpleTwoWayPU(params.userMode, this, "userMode");
        this.__userProfile = new SynchedPropertyObjectTwoWayPU(params.userProfile, this, "userProfile");
        this.__menuItems = new SynchedPropertyObjectTwoWayPU(params.menuItems, this, "menuItems");
        this.getMenuItemsForCurrentMode = (): ProfileMenuItem[] => [];
        this.handleMenuItemClick = (itemId: string): void => { };
        this.switchToLogin = (): void => { };
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: ProfilePage_Params) {
        if (params.getMenuItemsForCurrentMode !== undefined) {
            this.getMenuItemsForCurrentMode = params.getMenuItemsForCurrentMode;
        }
        if (params.handleMenuItemClick !== undefined) {
            this.handleMenuItemClick = params.handleMenuItemClick;
        }
        if (params.switchToLogin !== undefined) {
            this.switchToLogin = params.switchToLogin;
        }
    }
    updateStateVars(params: ProfilePage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__userMode.purgeDependencyOnElmtId(rmElmtId);
        this.__userProfile.purgeDependencyOnElmtId(rmElmtId);
        this.__menuItems.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__userMode.aboutToBeDeleted();
        this.__userProfile.aboutToBeDeleted();
        this.__menuItems.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __userMode: SynchedPropertySimpleTwoWayPU<string>;
    get userMode() {
        return this.__userMode.get();
    }
    set userMode(newValue: string) {
        this.__userMode.set(newValue);
    }
    private __userProfile: SynchedPropertySimpleOneWayPU<UserProfile>;
    get userProfile() {
        return this.__userProfile.get();
    }
    set userProfile(newValue: UserProfile) {
        this.__userProfile.set(newValue);
    }
    private __menuItems: SynchedPropertySimpleOneWayPU<ProfileMenuItem[]>;
    get menuItems() {
        return this.__menuItems.get();
    }
    set menuItems(newValue: ProfileMenuItem[]) {
        this.__menuItems.set(newValue);
    }
    // 回调函数
    private getMenuItemsForCurrentMode: () => ProfileMenuItem[];
    private handleMenuItemClick: (itemId: string) => void;
    private switchToLogin: () => void;
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/components/profile/ProfilePage.ets(19:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.padding(16);
            Column.linearGradient({
                angle: 180,
                colors: [[0xE8F5E9, 0.0], [0xF1F8E9, 0.5], [0xF9FBE7, 1.0]] // 调整背景色为更柔和的绿色
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 用户信息头部
            Column.create();
            Column.debugLine("entry/src/main/ets/components/profile/ProfilePage.ets(21:7)", "entry");
            // 用户信息头部
            Column.width('100%');
            // 用户信息头部
            Column.backgroundColor('#FFFFFF');
            // 用户信息头部
            Column.borderRadius(12);
            // 用户信息头部
            Column.margin({ top: 16, bottom: 16 });
            // 用户信息头部
            Column.shadow({ radius: 8, color: 'rgba(0,0,0,0.05)', offsetY: 2 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.userMode === 'guest') {
                this.ifElseBranchUpdateFunction(0, () => {
                    // 游客模式显示
                    this.GuestHeader.bind(this)();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    // 已登录用户显示
                    this.UserHeader.bind(this)();
                });
            }
        }, If);
        If.pop();
        // 用户信息头部
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 快捷操作按钮（仅登录用户可见）
            if (this.userMode === 'logged_in') {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.QuickActions.bind(this)();
                });
            }
            // 功能菜单列表
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 功能菜单列表
            Column.create();
            Column.debugLine("entry/src/main/ets/components/profile/ProfilePage.ets(42:7)", "entry");
            // 功能菜单列表
            Column.width('100%');
            // 功能菜单列表
            Column.backgroundColor('#FFFFFF');
            // 功能菜单列表
            Column.borderRadius(12);
            // 功能菜单列表
            Column.margin({ bottom: 16 });
            // 功能菜单列表
            Column.shadow({ radius: 8, color: 'rgba(0,0,0,0.05)', offsetY: 2 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            List.create();
            List.debugLine("entry/src/main/ets/components/profile/ProfilePage.ets(43:9)", "entry");
            List.width('100%');
            List.height('auto');
            List.divider({ strokeWidth: 1, color: '#F0F0F0' });
        }, List);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = (_item, index: number) => {
                const item = _item;
                {
                    const itemCreation = (elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        ListItem.create(deepRenderFunction, true);
                        if (!isInitialRender) {
                            ListItem.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    };
                    const itemCreation2 = (elmtId, isInitialRender) => {
                        ListItem.create(deepRenderFunction, true);
                        ListItem.margin({ bottom: index < this.getMenuItemsForCurrentMode().length - 1 ? 1 : 0 });
                        ListItem.debugLine("entry/src/main/ets/components/profile/ProfilePage.ets(45:13)", "entry");
                    };
                    const deepRenderFunction = (elmtId, isInitialRender) => {
                        itemCreation(elmtId, isInitialRender);
                        this.MenuItemCard.bind(this)(item);
                        ListItem.pop();
                    };
                    this.observeComponentCreation2(itemCreation2, ListItem);
                    ListItem.pop();
                }
            };
            this.forEachUpdateFunction(elmtId, this.getMenuItemsForCurrentMode(), forEachItemGenFunction, undefined, true, false);
        }, ForEach);
        ForEach.pop();
        List.pop();
        // 功能菜单列表
        Column.pop();
        Column.pop();
    }
    // 游客头部
    GuestHeader(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/components/profile/ProfilePage.ets(73:5)", "entry");
            Column.alignItems(HorizontalAlign.Center);
            Column.padding({ top: 32, bottom: 24 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 0, "type": 30000, params: ['农民头像.png'], "bundleName": "com.example.myapplication", "moduleName": "entry" });
            Image.debugLine("entry/src/main/ets/components/profile/ProfilePage.ets(74:7)", "entry");
            Image.width(80);
            Image.height(80);
            Image.borderRadius(40);
            Image.margin({ bottom: 12 });
            Image.border({ width: 2, color: '#00C853' });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('游客用户');
            Text.debugLine("entry/src/main/ets/components/profile/ProfilePage.ets(81:7)", "entry");
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#333333');
            Text.margin({ bottom: 4 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('登录后享受更多个性化服务');
            Text.debugLine("entry/src/main/ets/components/profile/ProfilePage.ets(87:7)", "entry");
            Text.fontSize(14);
            Text.fontColor('#666666');
            Text.margin({ bottom: 16 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 登录按钮 - 优化为主题色
            Button.createWithLabel('立即登录');
            Button.debugLine("entry/src/main/ets/components/profile/ProfilePage.ets(93:7)", "entry");
            // 登录按钮 - 优化为主题色
            Button.width(120);
            // 登录按钮 - 优化为主题色
            Button.height(36);
            // 登录按钮 - 优化为主题色
            Button.backgroundColor('#00C853');
            // 登录按钮 - 优化为主题色
            Button.borderRadius(18);
            // 登录按钮 - 优化为主题色
            Button.fontSize(14);
            // 登录按钮 - 优化为主题色
            Button.fontColor('#FFFFFF');
            // 登录按钮 - 优化为主题色
            Button.onClick(() => {
                this.switchToLogin();
            });
            // 登录按钮 - 优化为主题色
            Button.shadow({ radius: 4, color: 'rgba(0, 200, 83, 0.3)', offsetY: 2 });
        }, Button);
        // 登录按钮 - 优化为主题色
        Button.pop();
        Column.pop();
    }
    // 用户头部
    UserHeader(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/components/profile/ProfilePage.ets(112:5)", "entry");
            Column.alignItems(HorizontalAlign.Center);
            Column.padding({ top: 32, bottom: 24 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 0, "type": 30000, params: ['农民头像.png'], "bundleName": "com.example.myapplication", "moduleName": "entry" });
            Image.debugLine("entry/src/main/ets/components/profile/ProfilePage.ets(113:7)", "entry");
            Image.width(80);
            Image.height(80);
            Image.borderRadius(40);
            Image.margin({ bottom: 12 });
            Image.border({ width: 2, color: '#00C853' });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 用户名和管理员标识
            Row.create();
            Row.debugLine("entry/src/main/ets/components/profile/ProfilePage.ets(121:7)", "entry");
            // 用户名和管理员标识
            Row.margin({ bottom: 4 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.userProfile.username);
            Text.debugLine("entry/src/main/ets/components/profile/ProfilePage.ets(122:9)", "entry");
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#333333');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 管理员标识徽章
            if (this.userProfile.is_admin === 1) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('👑 管理员');
                        Text.debugLine("entry/src/main/ets/components/profile/ProfilePage.ets(129:11)", "entry");
                        Text.fontSize(14);
                        Text.fontColor('#FFFFFF');
                        Text.backgroundColor('#FF6B35');
                        Text.padding({ left: 8, right: 8, top: 4, bottom: 4 });
                        Text.borderRadius(12);
                        Text.margin({ left: 8 });
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
        // 用户名和管理员标识
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.userProfile.bio);
            Text.debugLine("entry/src/main/ets/components/profile/ProfilePage.ets(140:7)", "entry");
            Text.fontSize(14);
            Text.fontColor('#666666');
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.userProfile.phone);
            Text.debugLine("entry/src/main/ets/components/profile/ProfilePage.ets(145:7)", "entry");
            Text.fontSize(14);
            Text.fontColor('#999999');
        }, Text);
        Text.pop();
        Column.pop();
    }
    // 快捷操作
    QuickActions(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/components/profile/ProfilePage.ets(156:5)", "entry");
            Row.width('100%');
            Row.margin({ bottom: 16 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 编辑资料按钮
            Button.createWithChild();
            Button.debugLine("entry/src/main/ets/components/profile/ProfilePage.ets(158:7)", "entry");
            // 编辑资料按钮
            Button.layoutWeight(1);
            // 编辑资料按钮
            Button.height(80);
            // 编辑资料按钮
            Button.backgroundColor('#FFFFFF');
            // 编辑资料按钮
            Button.borderRadius(12);
            // 编辑资料按钮
            Button.onClick(() => {
                console.info('[Profile] 跳转到编辑资料页面');
                router.pushUrl({
                    url: 'pages/EditProfile',
                    params: {
                        username: this.userProfile.username,
                        email: this.userProfile.email,
                        phone: this.userProfile.phone || '',
                        bio: this.userProfile.bio,
                        avatar: this.userProfile.avatar
                    }
                }).catch((err: Error) => {
                    console.error('[Profile] 跳转编辑资料失败:', JSON.stringify(err));
                });
            });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/components/profile/ProfilePage.ets(159:9)", "entry");
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 0, "type": 30000, params: ['编辑资料.png'], "bundleName": "com.example.myapplication", "moduleName": "entry" });
            Image.debugLine("entry/src/main/ets/components/profile/ProfilePage.ets(160:11)", "entry");
            Image.width(24);
            Image.height(24);
            Image.fillColor('#00C853');
            Image.margin({ bottom: 4 });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('编辑资料');
            Text.debugLine("entry/src/main/ets/components/profile/ProfilePage.ets(165:11)", "entry");
            Text.fontSize(14);
            Text.fontColor('#333333');
        }, Text);
        Text.pop();
        Column.pop();
        // 编辑资料按钮
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/components/profile/ProfilePage.ets(190:7)", "entry");
            Blank.width(12);
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 修改密码按钮
            Button.createWithChild();
            Button.debugLine("entry/src/main/ets/components/profile/ProfilePage.ets(193:7)", "entry");
            // 修改密码按钮
            Button.layoutWeight(1);
            // 修改密码按钮
            Button.height(80);
            // 修改密码按钮
            Button.backgroundColor('#FFFFFF');
            // 修改密码按钮
            Button.borderRadius(12);
            // 修改密码按钮
            Button.onClick(() => {
                console.info('[Profile] 跳转到修改密码页面');
                router.pushUrl({
                    url: 'pages/ChangePassword'
                }).catch((err: Error) => {
                    console.error('[Profile] 跳转修改密码失败:', JSON.stringify(err));
                });
            });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/components/profile/ProfilePage.ets(194:9)", "entry");
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 0, "type": 30000, params: ['修改密码.png'], "bundleName": "com.example.myapplication", "moduleName": "entry" });
            Image.debugLine("entry/src/main/ets/components/profile/ProfilePage.ets(195:11)", "entry");
            Image.width(24);
            Image.height(24);
            Image.fillColor('#00C853');
            Image.margin({ bottom: 4 });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('修改密码');
            Text.debugLine("entry/src/main/ets/components/profile/ProfilePage.ets(200:11)", "entry");
            Text.fontSize(14);
            Text.fontColor('#333333');
        }, Text);
        Text.pop();
        Column.pop();
        // 修改密码按钮
        Button.pop();
        Row.pop();
    }
    // 菜单项卡片
    MenuItemCard(item: ProfileMenuItem, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/components/profile/ProfilePage.ets(225:5)", "entry");
            Row.width('100%');
            Row.padding({ left: 16, right: 16, top: 16, bottom: 16 });
            Row.backgroundColor('#FFFFFF');
            Row.onClick(() => {
                this.handleMenuItemClick(item.id);
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 判断是否为图片路径
            if (item.icon.endsWith('.png')) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": -1, "type": 30000, params: [item.icon], "bundleName": "com.example.myapplication", "moduleName": "entry" });
                        Image.debugLine("entry/src/main/ets/components/profile/ProfilePage.ets(228:9)", "entry");
                        Image.width(20);
                        Image.height(20);
                        Image.fillColor('#666666');
                        Image.margin({ right: 12 });
                    }, Image);
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(item.icon);
                        Text.debugLine("entry/src/main/ets/components/profile/ProfilePage.ets(234:9)", "entry");
                        Text.fontSize(20);
                        Text.margin({ right: 12 });
                    }, Text);
                    Text.pop();
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(item.title);
            Text.debugLine("entry/src/main/ets/components/profile/ProfilePage.ets(239:7)", "entry");
            Text.fontSize(16);
            Text.fontColor('#333333');
            Text.layoutWeight(1);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (item.hasArrow) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 0, "type": 30000, params: ['右箭头.png'], "bundleName": "com.example.myapplication", "moduleName": "entry" });
                        Image.debugLine("entry/src/main/ets/components/profile/ProfilePage.ets(245:9)", "entry");
                        Image.width(16);
                        Image.height(16);
                        Image.fillColor('#CCCCCC');
                    }, Image);
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Row.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
