if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface GrowthSilhouette_Params {
    url?: string;
    webController?: webview.WebviewController;
}
import router from "@ohos:router";
import webview from "@ohos:web.webview";
import { AppColors } from "@normalized:N&&&entry/src/main/ets/constants/AppConstants&";
class GrowthSilhouette extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__url = new ObservedPropertySimplePU('http://bbs.zy991.cn/', this, "url");
        this.webController = new webview.WebviewController();
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: GrowthSilhouette_Params) {
        if (params.url !== undefined) {
            this.url = params.url;
        }
        if (params.webController !== undefined) {
            this.webController = params.webController;
        }
    }
    updateStateVars(params: GrowthSilhouette_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__url.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__url.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __url: ObservedPropertySimplePU<string>;
    get url() {
        return this.__url.get();
    }
    set url(newValue: string) {
        this.__url.set(newValue);
    }
    private webController: webview.WebviewController;
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor(AppColors.APP_BG);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.height(56);
            Row.padding({ left: 12, right: 16 });
            Row.backgroundColor('#FFFFFF');
            Row.shadow({ radius: 2, color: '#10000000', offsetY: 1 });
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
            Text.fontSize(24);
            Text.fontColor('#333333');
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('生长剪影');
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#333333');
            Text.margin({ left: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Web.create({ src: this.url, controller: this.webController });
            Web.width('100%');
            Web.layoutWeight(1);
            Web.backgroundColor(AppColors.APP_BG);
        }, Web);
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "GrowthSilhouette";
    }
}
registerNamedRoute(() => new GrowthSilhouette(undefined, {}), "", { bundleName: "com.example.myapplication", moduleName: "entry", pagePath: "pages/GrowthSilhouette", pageFullPath: "entry/src/main/ets/pages/GrowthSilhouette", integratedHsp: "false", moduleType: "followWithHap" });
