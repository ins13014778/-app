if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface WeatherCard_Params {
    weatherData?: WeatherData | null;
    loading?: boolean;
    errorMsg?: string;
}
import { weatherService } from "@normalized:N&&&entry/src/main/ets/services/WeatherService&";
import type { WeatherData } from '../../types/WeatherTypes';
export class WeatherCard extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__weatherData = new ObservedPropertyObjectPU(null, this, "weatherData");
        this.__loading = new ObservedPropertySimplePU(false, this, "loading");
        this.__errorMsg = new ObservedPropertySimplePU('', this, "errorMsg");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: WeatherCard_Params) {
        if (params.weatherData !== undefined) {
            this.weatherData = params.weatherData;
        }
        if (params.loading !== undefined) {
            this.loading = params.loading;
        }
        if (params.errorMsg !== undefined) {
            this.errorMsg = params.errorMsg;
        }
    }
    updateStateVars(params: WeatherCard_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__weatherData.purgeDependencyOnElmtId(rmElmtId);
        this.__loading.purgeDependencyOnElmtId(rmElmtId);
        this.__errorMsg.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__weatherData.aboutToBeDeleted();
        this.__loading.aboutToBeDeleted();
        this.__errorMsg.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    // ========== 天气数据状态 ==========
    // 存储天气数据的对象，null表示数据未加载
    private __weatherData: ObservedPropertyObjectPU<WeatherData | null>;
    get weatherData() {
        return this.__weatherData.get();
    }
    set weatherData(newValue: WeatherData | null) {
        this.__weatherData.set(newValue);
    }
    // ========== 加载状态管理 ==========
    private __loading: ObservedPropertySimplePU<boolean>; // 是否正在加载数据
    get loading() {
        return this.__loading.get();
    }
    set loading(newValue: boolean) {
        this.__loading.set(newValue);
    }
    private __errorMsg: ObservedPropertySimplePU<string>; // 错误信息，空字符串表示无错误
    get errorMsg() {
        return this.__errorMsg.get();
    }
    set errorMsg(newValue: string) {
        this.__errorMsg.set(newValue);
    }
    aboutToAppear() {
        this.loadWeather();
    }
    /**
     * 加载天气数据
     */
    async loadWeather() {
        this.loading = true;
        this.errorMsg = '';
        try {
            const response = await weatherService.getWeather('郑州');
            if (response.success && response.data) {
                this.weatherData = response.data;
            }
            else {
                this.errorMsg = response.message;
            }
        }
        catch (error) {
            this.errorMsg = '获取天气失败';
            console.error('[WeatherCard] 加载失败:', error);
        }
        finally {
            this.loading = false;
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.backgroundColor('#FFFFFF');
            Column.borderRadius(12);
            Column.padding(16);
            Column.shadow({
                radius: 8,
                color: 'rgba(0, 0, 0, 0.06)',
                offsetX: 0,
                offsetY: 2
            });
            Column.border({
                width: 1,
                color: 'rgba(0, 0, 0, 0.04)'
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.loading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    // 加载中
                    this.LoadingView.bind(this)();
                });
            }
            else if (this.errorMsg) {
                this.ifElseBranchUpdateFunction(1, () => {
                    // 错误状态
                    this.ErrorView.bind(this)();
                });
            }
            else if (this.weatherData) {
                this.ifElseBranchUpdateFunction(2, () => {
                    // 显示天气
                    this.WeatherView.bind(this)();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(3, () => {
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    LoadingView(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.height(100);
            Row.justifyContent(FlexAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            LoadingProgress.create();
            LoadingProgress.width(32);
            LoadingProgress.height(32);
            LoadingProgress.color('#00E5FF');
            LoadingProgress.margin({ top: 10 });
        }, LoadingProgress);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('加载中...');
            Text.fontSize(13);
            Text.fontColor('#AAAAAA');
            Text.margin({ left: 8 });
        }, Text);
        Text.pop();
        Row.pop();
    }
    ErrorView(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.height(100);
            Row.justifyContent(FlexAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('⚠️');
            Text.fontSize(20);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.errorMsg);
            Text.fontSize(13);
            Text.fontColor('#FF0000');
            Text.margin({ left: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('重试');
            Button.fontSize(12);
            Button.height(28);
            Button.margin({ left: 12 });
            Button.onClick(() => this.loadWeather());
        }, Button);
        Button.pop();
        Row.pop();
    }
    WeatherView(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.padding(4);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 左侧：主要信息
            Column.create({ space: 4 });
            // 左侧：主要信息
            Column.alignItems(HorizontalAlign.Start);
            // 左侧：主要信息
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.weatherData!.city);
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#111111');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.weatherData!.date + ' ' + this.weatherData!.week);
            Text.fontSize(11);
            Text.fontColor('#8E8E93');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.margin({ top: 4, bottom: 4 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(weatherService.getWeatherEmoji(this.weatherData!.wea));
            Text.fontSize(32);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.weatherData!.tem);
            Text.fontSize(36);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#FF3B30');
            Text.margin({ left: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('°');
            Text.fontSize(20);
            Text.fontColor('#FF3B30');
            Text.margin({ left: 2 });
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.weatherData!.wea);
            Text.fontSize(13);
            Text.fontColor('#8E8E93');
        }, Text);
        Text.pop();
        // 左侧：主要信息
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 右侧：详细信息
            Column.create({ space: 6 });
            // 右侧：详细信息
            Column.alignItems(HorizontalAlign.Start);
        }, Column);
        this.InfoItem.bind(this)('🌡️', `${this.weatherData!.tem_day}° / ${this.weatherData!.tem_night}°`);
        this.InfoItem.bind(this)('💧', `湿度 ${this.weatherData!.humidity}`);
        this.InfoItem.bind(this)('🌬️', `${this.weatherData!.win} ${this.weatherData!.win_speed}`);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('🌈');
            Text.fontSize(12);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`空气 ${this.weatherData!.air}`);
            Text.fontSize(11);
            Text.fontColor(weatherService.getAirQualityColor(this.weatherData!.air));
            Text.fontWeight(FontWeight.Medium);
            Text.margin({ left: 4 });
        }, Text);
        Text.pop();
        Row.pop();
        // 右侧：详细信息
        Column.pop();
        Row.pop();
    }
    InfoItem(icon: string, text: string, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(icon);
            Text.fontSize(12);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(text);
            Text.fontSize(11);
            Text.fontColor('#666666');
            Text.margin({ left: 4 });
        }, Text);
        Text.pop();
        Row.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
