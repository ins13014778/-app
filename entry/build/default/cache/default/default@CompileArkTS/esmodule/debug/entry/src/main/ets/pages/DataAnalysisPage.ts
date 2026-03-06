if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface DataAnalysisPage_Params {
    selectedType?: string;
    dataSeries?: DataSeries[];
    isLoading?: boolean;
    errorMessage?: string;
    temperatureData?: DataPoint[];
    humidityData?: DataPoint[];
    lightData?: DataPoint[];
}
import router from "@ohos:router";
import { bemfaCloudService } from "@normalized:N&&&entry/src/main/ets/services/BemfaCloudService&";
import type { MessageRecord } from "@normalized:N&&&entry/src/main/ets/services/BemfaCloudService&";
import { AppColors } from "@normalized:N&&&entry/src/main/ets/constants/AppConstants&";
// 传感器数据点接口
interface DataPoint {
    time: string; // 时间
    value: number; // 数值
}
// 传感器数据系列接口
interface DataSeries {
    name: string; // 系列名称
    color: string; // 线条颜色
    data: DataPoint[]; // 数据点数组
}
// 统计数据接口
interface StatsData {
    max: number; // 最大值
    min: number; // 最小值
    avg: number; // 平均值
}
// 数据范围接口
interface DataRange {
    max: number; // 最大值
    min: number; // 最小值
    range: number; // 范围
}
class DataAnalysisPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__selectedType = new ObservedPropertySimplePU('温度', this, "selectedType");
        this.__dataSeries = new ObservedPropertyObjectPU([], this, "dataSeries");
        this.__isLoading = new ObservedPropertySimplePU(true, this, "isLoading");
        this.__errorMessage = new ObservedPropertySimplePU('', this, "errorMessage");
        this.temperatureData = [];
        this.humidityData = [];
        this.lightData = [];
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: DataAnalysisPage_Params) {
        if (params.selectedType !== undefined) {
            this.selectedType = params.selectedType;
        }
        if (params.dataSeries !== undefined) {
            this.dataSeries = params.dataSeries;
        }
        if (params.isLoading !== undefined) {
            this.isLoading = params.isLoading;
        }
        if (params.errorMessage !== undefined) {
            this.errorMessage = params.errorMessage;
        }
        if (params.temperatureData !== undefined) {
            this.temperatureData = params.temperatureData;
        }
        if (params.humidityData !== undefined) {
            this.humidityData = params.humidityData;
        }
        if (params.lightData !== undefined) {
            this.lightData = params.lightData;
        }
    }
    updateStateVars(params: DataAnalysisPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__selectedType.purgeDependencyOnElmtId(rmElmtId);
        this.__dataSeries.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
        this.__errorMessage.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__selectedType.aboutToBeDeleted();
        this.__dataSeries.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
        this.__errorMessage.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __selectedType: ObservedPropertySimplePU<string>; // 当前选择的数据类型
    get selectedType() {
        return this.__selectedType.get();
    }
    set selectedType(newValue: string) {
        this.__selectedType.set(newValue);
    }
    private __dataSeries: ObservedPropertyObjectPU<DataSeries[]>; // 所有数据系列
    get dataSeries() {
        return this.__dataSeries.get();
    }
    set dataSeries(newValue: DataSeries[]) {
        this.__dataSeries.set(newValue);
    }
    private __isLoading: ObservedPropertySimplePU<boolean>; // 是否正在加载数据
    get isLoading() {
        return this.__isLoading.get();
    }
    set isLoading(newValue: boolean) {
        this.__isLoading.set(newValue);
    }
    private __errorMessage: ObservedPropertySimplePU<string>; // 错误消息
    get errorMessage() {
        return this.__errorMessage.get();
    }
    set errorMessage(newValue: string) {
        this.__errorMessage.set(newValue);
    }
    // 温度数据
    private temperatureData: DataPoint[];
    // 湿度数据
    private humidityData: DataPoint[];
    // 光照数据
    private lightData: DataPoint[];
    aboutToAppear() {
        // 加载真实数据
        this.loadRealData();
    }
    /**
     * 从巴法云加载真实数据
     */
    private async loadRealData() {
        this.isLoading = true;
        this.errorMessage = '';
        try {
            console.info('[DataAnalysis] 开始加载真实数据...');
            // 并行获取三个传感器的历史数据（最近50条）
            const results = await Promise.all([
                bemfaCloudService.getMessages('tem', 1, 50),
                bemfaCloudService.getMessages('hum', 1, 50),
                bemfaCloudService.getMessages('light', 1, 50) // 光照
            ]);
            const tempResult = results[0];
            const humResult = results[1];
            const lightResult = results[2];
            // 处理温度数据
            if (tempResult.code === 0 && tempResult.data && tempResult.data.length > 0) {
                this.temperatureData = tempResult.data.reverse().map((record: MessageRecord) => {
                    const dataPoint: DataPoint = {
                        time: this.formatTime(record.time),
                        value: parseFloat(record.msg) || 0
                    };
                    return dataPoint;
                });
                console.info('[DataAnalysis] 温度数据加载成功:', this.temperatureData.length, '条');
            }
            else {
                console.warn('[DataAnalysis] 温度数据为空');
                this.generateFallbackData('tem');
            }
            // 处理湿度数据
            if (humResult.code === 0 && humResult.data && humResult.data.length > 0) {
                this.humidityData = humResult.data.reverse().map((record: MessageRecord) => {
                    const dataPoint: DataPoint = {
                        time: this.formatTime(record.time),
                        value: parseFloat(record.msg) || 0
                    };
                    return dataPoint;
                });
                console.info('[DataAnalysis] 湿度数据加载成功:', this.humidityData.length, '条');
            }
            else {
                console.warn('[DataAnalysis] 湿度数据为空');
                this.generateFallbackData('hum');
            }
            // 处理光照数据
            if (lightResult.code === 0 && lightResult.data && lightResult.data.length > 0) {
                this.lightData = lightResult.data.reverse().map((record: MessageRecord) => {
                    const dataPoint: DataPoint = {
                        time: this.formatTime(record.time),
                        value: parseFloat(record.msg) || 0
                    };
                    return dataPoint;
                });
                console.info('[DataAnalysis] 光照数据加载成功:', this.lightData.length, '条');
            }
            else {
                console.warn('[DataAnalysis] 光照数据为空');
                this.generateFallbackData('light');
            }
            // 更新数据系列
            this.updateDataSeries();
            console.info('[DataAnalysis] 数据加载完成');
        }
        catch (error) {
            console.error('[DataAnalysis] 加载数据失败:', error);
            this.errorMessage = '数据加载失败，请检查网络连接';
            // 使用备用数据
            this.generateFallbackData('tem');
            this.generateFallbackData('hum');
            this.generateFallbackData('light');
            this.updateDataSeries();
        }
        finally {
            this.isLoading = false;
        }
    }
    /**
     * 格式化时间字符串
     * 从 "2025-10-31 19:29:38" 转换为 "19:29"
     */
    private formatTime(timeStr: string): string {
        try {
            const parts = timeStr.split(' ');
            if (parts.length === 2) {
                const timePart = parts[1];
                const timeComponents = timePart.split(':');
                if (timeComponents.length >= 2) {
                    return `${timeComponents[0]}:${timeComponents[1]}`;
                }
            }
            return timeStr;
        }
        catch (e) {
            return timeStr;
        }
    }
    /**
     * 生成备用数据（当API无数据时）
     */
    private generateFallbackData(type: string) {
        const now = new Date();
        const dataArray: DataPoint[] = [];
        // 生成最近24小时的备用数据
        for (let i = 23; i >= 0; i--) {
            const time = new Date(now.getTime() - i * 60 * 60 * 1000);
            const timeStr = `${time.getHours().toString().padStart(2, '0')}:00`;
            let value = 0;
            const hour = time.getHours();
            if (type === 'tem') {
                // 温度 18-32°C
                const baseTemp = 25;
                const tempVariation = Math.sin((hour - 6) * Math.PI / 12) * 7;
                value = baseTemp + tempVariation + (Math.random() - 0.5) * 2;
            }
            else if (type === 'hum') {
                // 湿度 40-80%
                const baseHum = 60;
                const humVariation = Math.cos((hour - 6) * Math.PI / 12) * 15;
                value = baseHum + humVariation + (Math.random() - 0.5) * 5;
            }
            else if (type === 'light') {
                // 光照 0-2000 Lx
                if (hour >= 6 && hour <= 18) {
                    const lightBase = 1000;
                    const lightVar = Math.sin((hour - 6) * Math.PI / 12) * 800;
                    value = lightBase + lightVar + (Math.random() - 0.5) * 200;
                }
                else {
                    value = Math.random() * 50;
                }
            }
            dataArray.push({
                time: timeStr,
                value: Math.round(value * 10) / 10
            });
        }
        if (type === 'tem') {
            this.temperatureData = dataArray;
        }
        else if (type === 'hum') {
            this.humidityData = dataArray;
        }
        else if (type === 'light') {
            this.lightData = dataArray;
        }
    }
    /**
     * 更新数据系列
     */
    private updateDataSeries() {
        this.dataSeries = [
            {
                name: '温度',
                color: '#FF4081',
                data: this.temperatureData
            },
            {
                name: '湿度',
                color: '#00E5FF',
                data: this.humidityData
            },
            {
                name: '光照',
                color: '#FFD740',
                data: this.lightData
            }
        ];
    }
    /**
     * 获取当前选中的数据系列
     */
    private getCurrentSeries(): DataSeries {
        const found = this.dataSeries.find(s => s.name === this.selectedType);
        if (found) {
            return found;
        }
        if (this.dataSeries.length > 0) {
            return this.dataSeries[0];
        }
        // 返回一个空的默认系列
        const emptySeries: DataSeries = {
            name: '温度',
            color: '#FF4081',
            data: []
        };
        return emptySeries;
    }
    /**
     * 获取数据统计信息
     */
    private getStats(): StatsData {
        const series = this.getCurrentSeries();
        if (!series || series.data.length === 0) {
            const emptyStats: StatsData = { max: 0, min: 0, avg: 0 };
            return emptyStats;
        }
        const values = series.data.map(d => d.value);
        const max = Math.max(...values);
        const min = Math.min(...values);
        const avg = values.reduce((a, b) => a + b, 0) / values.length;
        const stats: StatsData = {
            max: Math.round(max * 10) / 10,
            min: Math.round(min * 10) / 10,
            avg: Math.round(avg * 10) / 10
        };
        return stats;
    }
    /**
     * 获取单位
     */
    private getUnit(): string {
        switch (this.selectedType) {
            case '温度': return '°C';
            case '湿度': return '%';
            case '光照': return 'Lx';
            default: return '';
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor(AppColors.APP_BG);
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
            Row.backgroundColor(AppColors.SURFACE);
            // 顶部导航栏
            Row.border({ width: 0, color: 'transparent' });
            // 顶部导航栏
            Row.shadow({ radius: 6, color: 'rgba(0, 0, 0, 0.06)', offsetY: 2 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('←');
            Text.fontSize(24);
            Text.fontColor(AppColors.PRIMARY_COLOR);
            Text.width(40);
            Text.textAlign(TextAlign.Center);
            Text.onClick(() => {
                router.back();
            });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('数据分析');
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#111111');
            Text.layoutWeight(1);
            Text.textAlign(TextAlign.Center);
            Text.margin({ right: 40 });
        }, Text);
        Text.pop();
        // 顶部导航栏
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.layoutWeight(1);
            Scroll.scrollBar(BarState.Auto);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding({ left: 16, right: 16 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 加载状态或错误提示
            if (this.isLoading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.height(300);
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('🔄');
                        Text.fontSize(48);
                        Text.margin({ bottom: 16 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('正在加载数据...');
                        Text.fontSize(16);
                        Text.fontColor('#666666');
                    }, Text);
                    Text.pop();
                    Column.pop();
                });
            }
            else if (this.errorMessage) {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.height(200);
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('⚠️');
                        Text.fontSize(48);
                        Text.margin({ bottom: 16 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.errorMessage);
                        Text.fontSize(16);
                        Text.fontColor('#FF4081');
                    }, Text);
                    Text.pop();
                    Column.pop();
                });
            }
            // 数据类型选择器
            else {
                this.ifElseBranchUpdateFunction(2, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 数据类型选择器
            Row.create();
            // 数据类型选择器
            Row.width('100%');
            // 数据类型选择器
            Row.justifyContent(FlexAlign.SpaceAround);
            // 数据类型选择器
            Row.margin({ top: 20, bottom: 20 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const type = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(type);
                    Context.animation({
                        duration: 200,
                        curve: Curve.EaseInOut
                    });
                    Text.fontSize(16);
                    Text.fontColor(this.selectedType === type ? AppColors.PRIMARY_COLOR : AppColors.TEXT_SECONDARY);
                    Text.fontWeight(this.selectedType === type ? FontWeight.Bold : FontWeight.Normal);
                    Text.padding({ left: 20, right: 20, top: 10, bottom: 10 });
                    Text.backgroundColor(this.selectedType === type ? AppColors.PRIMARY_LIGHT : AppColors.SURFACE_ALT);
                    Text.borderRadius(20);
                    Text.onClick(() => {
                        this.selectedType = type;
                    });
                    Context.animation(null);
                }, Text);
                Text.pop();
            };
            this.forEachUpdateFunction(elmtId, ['温度', '湿度', '光照'], forEachItemGenFunction);
        }, ForEach);
        ForEach.pop();
        // 数据类型选择器
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 数据统计卡片
            Row.create();
            // 数据统计卡片
            Row.width('100%');
            // 数据统计卡片
            Row.justifyContent(FlexAlign.SpaceBetween);
            // 数据统计卡片
            Row.margin({ bottom: 20 });
        }, Row);
        this.StatCard.bind(this)('最大值', this.getStats().max, this.getUnit(), '#FF4081');
        this.StatCard.bind(this)('最小值', this.getStats().min, this.getUnit(), AppColors.PRIMARY_COLOR);
        this.StatCard.bind(this)('平均值', this.getStats().avg, this.getUnit(), '#FFD740');
        // 数据统计卡片
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 折线图卡片 - 使用简化的条形图显示
            Column.create();
            // 折线图卡片 - 使用简化的条形图显示
            Column.width('100%');
            // 折线图卡片 - 使用简化的条形图显示
            Column.padding(20);
            // 折线图卡片 - 使用简化的条形图显示
            Column.backgroundColor(AppColors.SURFACE);
            // 折线图卡片 - 使用简化的条形图显示
            Column.borderRadius(16);
            // 折线图卡片 - 使用简化的条形图显示
            Column.shadow({
                radius: 8,
                color: 'rgba(0, 0, 0, 0.06)',
                offsetX: 0,
                offsetY: 2
            });
            // 折线图卡片 - 使用简化的条形图显示
            Column.margin({ bottom: 20 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${this.selectedType}趋势图`);
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#111111');
            Text.margin({ bottom: 16 });
            Text.alignSelf(ItemAlign.Start);
        }, Text);
        Text.pop();
        // 简化的趋势显示
        this.SimpleTrendChart.bind(this)();
        // 折线图卡片 - 使用简化的条形图显示
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 数据列表
            Column.create();
            // 数据列表
            Column.width('100%');
            // 数据列表
            Column.padding(20);
            // 数据列表
            Column.backgroundColor(AppColors.SURFACE);
            // 数据列表
            Column.borderRadius(16);
            // 数据列表
            Column.shadow({
                radius: 8,
                color: 'rgba(0, 0, 0, 0.06)',
                offsetX: 0,
                offsetY: 2
            });
            // 数据列表
            Column.margin({ bottom: 40 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('详细数据');
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#111111');
            Text.margin({ bottom: 12 });
            Text.alignSelf(ItemAlign.Start);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.getCurrentSeries() && this.getCurrentSeries().data && this.getCurrentSeries().data.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = (_item, index: number) => {
                            const point = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Row.create();
                                Row.width('100%');
                                Row.padding({ top: 12, bottom: 12 });
                                Row.borderColor(AppColors.SEPARATOR);
                                Row.borderWidth({ bottom: index < this.getCurrentSeries().data.length - 1 ? 1 : 0 });
                            }, Row);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(point.time);
                                Text.fontSize(14);
                                Text.fontColor(AppColors.TEXT_SECONDARY);
                                Text.layoutWeight(1);
                            }, Text);
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(`${point.value} ${this.getUnit()}`);
                                Text.fontSize(16);
                                Text.fontWeight(FontWeight.Bold);
                                Text.fontColor(this.getCurrentSeries().color);
                            }, Text);
                            Text.pop();
                            Row.pop();
                        };
                        this.forEachUpdateFunction(elmtId, this.getCurrentSeries().data.slice().reverse(), forEachItemGenFunction, (point: DataPoint, index: number) => `${point.time}_${index}`, true, true);
                    }, ForEach);
                    ForEach.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('暂无详细数据');
                        Text.fontSize(14);
                        Text.fontColor('#666666');
                        Text.margin({ top: 20, bottom: 20 });
                    }, Text);
                    Text.pop();
                });
            }
        }, If);
        If.pop();
        // 数据列表
        Column.pop();
        Column.pop();
        Scroll.pop();
        Column.pop();
    }
    /**
     * 统计卡片
     */
    StatCard(label: string, value: number, unit: string, color: string, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('30%');
            Column.padding(16);
            Column.backgroundColor(AppColors.SURFACE);
            Column.borderRadius(12);
            Column.shadow({
                radius: 6,
                color: 'rgba(0, 0, 0, 0.06)',
                offsetX: 0,
                offsetY: 2
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(label);
            Text.fontSize(12);
            Text.fontColor(AppColors.TEXT_SECONDARY);
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${value}`);
            Text.fontSize(24);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(color);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(unit);
            Text.fontSize(14);
            Text.fontColor(color);
            Text.margin({ left: 4, top: 8 });
        }, Text);
        Text.pop();
        Row.pop();
        Column.pop();
    }
    /**
     * 获取显示的数据点
     */
    private getDisplayData(): DataPoint[] {
        const series = this.getCurrentSeries();
        if (!series || series.data.length === 0) {
            return [];
        }
        // 取最近10个数据点显示
        return series.data.slice(-10);
    }
    /**
     * 获取数据范围
     */
    private getDataRange(): DataRange {
        const displayData = this.getDisplayData();
        if (displayData.length === 0) {
            const emptyRange: DataRange = { max: 0, min: 0, range: 1 };
            return emptyRange;
        }
        const values = displayData.map(d => d.value);
        const max = Math.max(...values);
        const min = Math.min(...values);
        const range = max - min || 1;
        const dataRange: DataRange = { max, min, range };
        return dataRange;
    }
    /**
     * 简化的趋势图 - 使用柱状图代替Canvas
     */
    SimpleTrendChart(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.justifyContent(FlexAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.getDisplayData().length === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('暂无数据');
                        Text.fontSize(14);
                        Text.fontColor('#666666');
                        Text.margin({ top: 40, bottom: 40 });
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 简化的柱状图
                        Row.create({ space: 4 });
                        // 简化的柱状图
                        Row.width('100%');
                        // 简化的柱状图
                        Row.height(220);
                        // 简化的柱状图
                        Row.alignItems(VerticalAlign.Bottom);
                        // 简化的柱状图
                        Row.justifyContent(FlexAlign.SpaceAround);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = (_item, index: number) => {
                            const point = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Column.create();
                                Column.alignItems(HorizontalAlign.Center);
                            }, Column);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                // 柱子
                                Column.create();
                                // 柱子
                                Column.width(20);
                                // 柱子
                                Column.height(`${((point.value - this.getDataRange().min) / this.getDataRange().range) * 150 + 20}`);
                                // 柱子
                                Column.backgroundColor(this.getCurrentSeries().color);
                                // 柱子
                                Column.borderRadius(4);
                                // 柱子
                                Column.margin({ bottom: 4 });
                            }, Column);
                            // 柱子
                            Column.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                // 数值
                                Text.create(`${point.value}`);
                                // 数值
                                Text.fontSize(9);
                                // 数值
                                Text.fontColor('#AAAAAA');
                                // 数值
                                Text.margin({ bottom: 2 });
                            }, Text);
                            // 数值
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                // 时间
                                Text.create(point.time);
                                // 时间
                                Text.fontSize(8);
                                // 时间
                                Text.fontColor('#666666');
                                // 时间
                                Text.rotate({ angle: 45 });
                            }, Text);
                            // 时间
                            Text.pop();
                            Column.pop();
                        };
                        this.forEachUpdateFunction(elmtId, this.getDisplayData(), forEachItemGenFunction, (point: DataPoint, index: number) => `${point.time}_${index}`, true, true);
                    }, ForEach);
                    ForEach.pop();
                    // 简化的柱状图
                    Row.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "DataAnalysisPage";
    }
}
registerNamedRoute(() => new DataAnalysisPage(undefined, {}), "", { bundleName: "com.example.myapplication", moduleName: "entry", pagePath: "pages/DataAnalysisPage", pageFullPath: "entry/src/main/ets/pages/DataAnalysisPage", integratedHsp: "false", moduleType: "followWithHap" });
