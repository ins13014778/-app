if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface SplashScreen_Params {
}
import router from "@ohos:router";
class SplashScreen extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: SplashScreen_Params) {
    }
    updateStateVars(params: SplashScreen_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
    }
    aboutToBeDeleted() {
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    aboutToAppear() {
        // 2秒后自动跳转到主页面
        setTimeout(() => {
            router.replaceUrl({
                url: 'pages/Index'
            });
        }, 2000);
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/SplashScreen.ets(16:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#FFFFFF');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 显示开屏图
            Image.create({ "id": 0, "type": 30000, params: ['开屏页.jpg'], "bundleName": "com.example.myapplication", "moduleName": "entry" });
            Image.debugLine("entry/src/main/ets/pages/SplashScreen.ets(18:7)", "entry");
            // 显示开屏图
            Image.width('100%');
            // 显示开屏图
            Image.height('100%');
            // 显示开屏图
            Image.objectFit(ImageFit.Cover);
        }, Image);
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "SplashScreen";
    }
}
registerNamedRoute(() => new SplashScreen(undefined, {}), "", { bundleName: "com.example.myapplication", moduleName: "entry", pagePath: "pages/SplashScreen", pageFullPath: "entry/src/main/ets/pages/SplashScreen", integratedHsp: "false", moduleType: "followWithHap" });
