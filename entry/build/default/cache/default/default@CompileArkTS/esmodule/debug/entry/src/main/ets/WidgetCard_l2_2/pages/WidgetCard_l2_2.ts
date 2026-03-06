if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface AdviceFromWeatherCard1_Params {
    category2?: string;
    textSubTitleG1?: string;
    category3?: string;
    category1?: string;
    categoryImg3?: Resource;
    categoryImg1?: Resource;
    locationIcon?: Resource;
    weatherIcon_current?: Resource;
    categoryImg2?: Resource;
    backgroundImg?: Resource;
    cityName?: string;
    recommend1?: string;
    recommend2?: string;
    recommend3?: string;
    digitTitleFText1?: string;
    textSubTitleG2?: string;
    digitTitleFText2?: string;
    ClickToHome?;
}
let storage2017413441 = new LocalStorage();
export class AdviceFromWeatherCard1 extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.ClickToHome = (): void => {
            postCardAction(this, {
                "action": "router",
                // Configuring the UIAbility name for jumping.
                'abilityName': 'EntryAbility',
                // Configuring the parameters to be transferred.
                "params": {
                    'targetPage': 'page1'
                }
            });
        };
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: AdviceFromWeatherCard1_Params) {
        if (params.ClickToHome !== undefined) {
            this.ClickToHome = params.ClickToHome;
        }
    }
    updateStateVars(params: AdviceFromWeatherCard1_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__category2.purgeDependencyOnElmtId(rmElmtId);
        this.__textSubTitleG1.purgeDependencyOnElmtId(rmElmtId);
        this.__category3.purgeDependencyOnElmtId(rmElmtId);
        this.__category1.purgeDependencyOnElmtId(rmElmtId);
        this.__categoryImg3.purgeDependencyOnElmtId(rmElmtId);
        this.__categoryImg1.purgeDependencyOnElmtId(rmElmtId);
        this.__locationIcon.purgeDependencyOnElmtId(rmElmtId);
        this.__weatherIcon_current.purgeDependencyOnElmtId(rmElmtId);
        this.__categoryImg2.purgeDependencyOnElmtId(rmElmtId);
        this.__backgroundImg.purgeDependencyOnElmtId(rmElmtId);
        this.__cityName.purgeDependencyOnElmtId(rmElmtId);
        this.__recommend1.purgeDependencyOnElmtId(rmElmtId);
        this.__recommend2.purgeDependencyOnElmtId(rmElmtId);
        this.__recommend3.purgeDependencyOnElmtId(rmElmtId);
        this.__digitTitleFText1.purgeDependencyOnElmtId(rmElmtId);
        this.__textSubTitleG2.purgeDependencyOnElmtId(rmElmtId);
        this.__digitTitleFText2.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__category2.aboutToBeDeleted();
        this.__textSubTitleG1.aboutToBeDeleted();
        this.__category3.aboutToBeDeleted();
        this.__category1.aboutToBeDeleted();
        this.__categoryImg3.aboutToBeDeleted();
        this.__categoryImg1.aboutToBeDeleted();
        this.__locationIcon.aboutToBeDeleted();
        this.__weatherIcon_current.aboutToBeDeleted();
        this.__categoryImg2.aboutToBeDeleted();
        this.__backgroundImg.aboutToBeDeleted();
        this.__cityName.aboutToBeDeleted();
        this.__recommend1.aboutToBeDeleted();
        this.__recommend2.aboutToBeDeleted();
        this.__recommend3.aboutToBeDeleted();
        this.__digitTitleFText1.aboutToBeDeleted();
        this.__textSubTitleG2.aboutToBeDeleted();
        this.__digitTitleFText2.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __category2: ObservedPropertyAbstractPU<string> = this.createLocalStorageProp<string>('category2', '钓鱼', "category2");
    get category2() {
        return this.__category2.get();
    }
    set category2(newValue: string) {
        this.__category2.set(newValue);
    }
    private __textSubTitleG1: ObservedPropertyAbstractPU<string> = this.createLocalStorageProp<string>('textSubTitleG1', '晴  空气良好', "textSubTitleG1");
    get textSubTitleG1() {
        return this.__textSubTitleG1.get();
    }
    set textSubTitleG1(newValue: string) {
        this.__textSubTitleG1.set(newValue);
    }
    private __category3: ObservedPropertyAbstractPU<string> = this.createLocalStorageProp<string>('category3', '运动', "category3");
    get category3() {
        return this.__category3.get();
    }
    set category3(newValue: string) {
        this.__category3.set(newValue);
    }
    private __category1: ObservedPropertyAbstractPU<string> = this.createLocalStorageProp<string>('category1', '穿衣', "category1");
    get category1() {
        return this.__category1.get();
    }
    set category1(newValue: string) {
        this.__category1.set(newValue);
    }
    private __categoryImg3: ObservedPropertyAbstractPU<Resource> = this.createLocalStorageProp<Resource>('categoryImg3', { "id": 16777286, "type": 20000, params: [], "bundleName": "com.example.myapplication", "moduleName": "entry" }, "categoryImg3");
    get categoryImg3() {
        return this.__categoryImg3.get();
    }
    set categoryImg3(newValue: Resource) {
        this.__categoryImg3.set(newValue);
    }
    private __categoryImg1: ObservedPropertyAbstractPU<Resource> = this.createLocalStorageProp<Resource>('categoryImg1', { "id": 16777284, "type": 20000, params: [], "bundleName": "com.example.myapplication", "moduleName": "entry" }, "categoryImg1");
    get categoryImg1() {
        return this.__categoryImg1.get();
    }
    set categoryImg1(newValue: Resource) {
        this.__categoryImg1.set(newValue);
    }
    private __locationIcon: ObservedPropertyAbstractPU<Resource> = this.createLocalStorageProp<Resource>('locationIcon', { "id": 16777288, "type": 20000, params: [], "bundleName": "com.example.myapplication", "moduleName": "entry" }, "locationIcon");
    get locationIcon() {
        return this.__locationIcon.get();
    }
    set locationIcon(newValue: Resource) {
        this.__locationIcon.set(newValue);
    }
    private __weatherIcon_current: ObservedPropertyAbstractPU<Resource> = this.createLocalStorageProp<Resource>('weatherIcon_current', { "id": 16777287, "type": 20000, params: [], "bundleName": "com.example.myapplication", "moduleName": "entry" }, "weatherIcon_current");
    get weatherIcon_current() {
        return this.__weatherIcon_current.get();
    }
    set weatherIcon_current(newValue: Resource) {
        this.__weatherIcon_current.set(newValue);
    }
    private __categoryImg2: ObservedPropertyAbstractPU<Resource> = this.createLocalStorageProp<Resource>('categoryImg2', { "id": 16777285, "type": 20000, params: [], "bundleName": "com.example.myapplication", "moduleName": "entry" }, "categoryImg2");
    get categoryImg2() {
        return this.__categoryImg2.get();
    }
    set categoryImg2(newValue: Resource) {
        this.__categoryImg2.set(newValue);
    }
    private __backgroundImg: ObservedPropertyAbstractPU<Resource> = this.createLocalStorageProp<Resource>('backgroundImg', { "id": 16777283, "type": 20000, params: [], "bundleName": "com.example.myapplication", "moduleName": "entry" }, "backgroundImg");
    get backgroundImg() {
        return this.__backgroundImg.get();
    }
    set backgroundImg(newValue: Resource) {
        this.__backgroundImg.set(newValue);
    }
    private __cityName: ObservedPropertyAbstractPU<string> = this.createLocalStorageProp<string>('cityName', '北京', "cityName");
    get cityName() {
        return this.__cityName.get();
    }
    set cityName(newValue: string) {
        this.__cityName.set(newValue);
    }
    private __recommend1: ObservedPropertyAbstractPU<string> = this.createLocalStorageProp<string>('recommend1', '厚外套', "recommend1");
    get recommend1() {
        return this.__recommend1.get();
    }
    set recommend1(newValue: string) {
        this.__recommend1.set(newValue);
    }
    private __recommend2: ObservedPropertyAbstractPU<string> = this.createLocalStorageProp<string>('recommend2', '适宜', "recommend2");
    get recommend2() {
        return this.__recommend2.get();
    }
    set recommend2(newValue: string) {
        this.__recommend2.set(newValue);
    }
    private __recommend3: ObservedPropertyAbstractPU<string> = this.createLocalStorageProp<string>('recommend3', '适宜', "recommend3");
    get recommend3() {
        return this.__recommend3.get();
    }
    set recommend3(newValue: string) {
        this.__recommend3.set(newValue);
    }
    private __digitTitleFText1: ObservedPropertyAbstractPU<string> = this.createLocalStorageProp<string>('digitTitleFText1', '10', "digitTitleFText1");
    get digitTitleFText1() {
        return this.__digitTitleFText1.get();
    }
    set digitTitleFText1(newValue: string) {
        this.__digitTitleFText1.set(newValue);
    }
    private __textSubTitleG2: ObservedPropertyAbstractPU<string> = this.createLocalStorageProp<string>('textSubTitleG2', '3月20日|二月十六', "textSubTitleG2");
    get textSubTitleG2() {
        return this.__textSubTitleG2.get();
    }
    set textSubTitleG2(newValue: string) {
        this.__textSubTitleG2.set(newValue);
    }
    private __digitTitleFText2: ObservedPropertyAbstractPU<string> = this.createLocalStorageProp<string>('digitTitleFText2', '℃', "digitTitleFText2");
    get digitTitleFText2() {
        return this.__digitTitleFText2.get();
    }
    set digitTitleFText2(newValue: string) {
        this.__digitTitleFText2.set(newValue);
    }
    private ClickToHome;
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.backgroundImage(ObservedObject.GetRawObject(this.backgroundImg));
            Column.backgroundImageSize({ width: '100%', height: '100%' });
            Column.padding('12');
            Column.width('100%');
            Column.height('100%');
            Column.onClick(this.ClickToHome);
            Column.justifyContent(FlexAlign.SpaceBetween);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.alignItems(VerticalAlign.Top);
            Row.justifyContent(FlexAlign.SpaceBetween);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.alignItems(HorizontalAlign.Start);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.alignItems(VerticalAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.cityName);
            Text.fontColor(Color.White);
            Text.fontSize('12');
            Text.fontWeight(FontWeight.Medium);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
            Text.lineHeight('14');
            Text.maxLines(1);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create(this.locationIcon);
            Image.width('11');
            Image.height('11');
        }, Image);
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.alignItems(VerticalAlign.Top);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.digitTitleFText1);
            Text.fontColor(Color.White);
            Text.fontSize('40');
            Text.fontWeight(FontWeight.Bold);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
            Text.lineHeight('40');
            Text.maxLines(1);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.digitTitleFText2);
            Text.fontColor(Color.White);
            Text.fontSize('12');
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
            Text.maxLines(1);
        }, Text);
        Text.pop();
        Row.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.alignItems(HorizontalAlign.End);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create(this.weatherIcon_current);
            Image.width('20');
            Image.height('20');
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.textSubTitleG1);
            Text.fontColor(Color.White);
            Text.fontSize('12');
            Text.fontWeight(FontWeight.Regular);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
            Text.lineHeight('16');
            Text.maxLines(1);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.textSubTitleG2);
            Text.fontColor(Color.White);
            Text.fontSize('12');
            Text.fontWeight(FontWeight.Regular);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
            Text.lineHeight('16');
            Text.maxLines(1);
        }, Text);
        Text.pop();
        Column.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.margin({ bottom: '6' });
            Row.width('100%');
            Row.alignItems(VerticalAlign.Bottom);
            Row.justifyContent(FlexAlign.SpaceBetween);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('25%');
            Row.alignItems(VerticalAlign.Center);
            Row.justifyContent(FlexAlign.SpaceBetween);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create(this.categoryImg1);
            Image.width('20');
            Image.height('20');
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('65%');
            Column.alignItems(HorizontalAlign.Start);
            Column.justifyContent(FlexAlign.SpaceBetween);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.recommend1);
            Text.fontColor(Color.White);
            Text.fontSize('12');
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
            Text.maxLines(1);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.category1);
            Text.opacity(0.6);
            Text.fontColor(Color.White);
            Text.fontSize('10');
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
            Text.maxLines(1);
        }, Text);
        Text.pop();
        Column.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('25%');
            Row.alignItems(VerticalAlign.Center);
            Row.justifyContent(FlexAlign.SpaceBetween);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create(this.categoryImg2);
            Image.width('20');
            Image.height('20');
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('65%');
            Column.alignItems(HorizontalAlign.Start);
            Column.justifyContent(FlexAlign.SpaceBetween);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.recommend2);
            Text.fontColor(Color.White);
            Text.fontSize('12');
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
            Text.maxLines(1);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.category2);
            Text.opacity(0.6);
            Text.fontColor(Color.White);
            Text.fontSize('10');
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
            Text.maxLines(1);
        }, Text);
        Text.pop();
        Column.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('25%');
            Row.alignItems(VerticalAlign.Center);
            Row.justifyContent(FlexAlign.SpaceBetween);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create(this.categoryImg3);
            Image.width('20');
            Image.height('20');
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('65%');
            Column.alignItems(HorizontalAlign.Start);
            Column.justifyContent(FlexAlign.SpaceBetween);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.recommend3);
            Text.fontColor(Color.White);
            Text.fontSize('12');
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
            Text.maxLines(1);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.category3);
            Text.opacity(0.6);
            Text.fontColor(Color.White);
            Text.fontSize('10');
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
            Text.maxLines(1);
        }, Text);
        Text.pop();
        Column.pop();
        Row.pop();
        Row.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "AdviceFromWeatherCard1";
    }
}
ViewStackProcessor.StartGetAccessRecordingFor(ViewStackProcessor.AllocateNewElmetIdForNextComponent());
loadEtsCard(new AdviceFromWeatherCard1(undefined, {}, storage2017413441), "com.example.myapplication/entry/ets/WidgetCard_l2_2/pages/WidgetCard_l2_2");
ViewStackProcessor.StopGetAccessRecording();
