if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface AnalysisPage_Params {
    temperature?: number;
    soilHumidity?: number;
    lightIntensity?: number;
    aiMessages?: AIMessage[];
    aiInputText?: string;
    isAILoading?: boolean;
    aiQuickQuestions?: string[];
    pendingImageUri?: string;
    aiChatScroller?: Scroller;
    // 回调函数
    getWeatherDescription?: () => string;
    getWeatherIcon?: () => string;
    sendAIMessage?: (message: string) => void;
    addWelcomeMessage?: () => void;
    uploadImage?: () => void;
    transcribeAudio?: () => void;
}
import type { AIMessage } from '../../types/IndexTypes';
import { AIChatSection } from "@normalized:N&&&entry/src/main/ets/components/analysis/AIChatSection&";
import { AppColors } from "@normalized:N&&&entry/src/main/ets/constants/AppConstants&";
export class AnalysisPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__temperature = new SynchedPropertySimpleTwoWayPU(params.temperature, this, "temperature");
        this.__soilHumidity = new SynchedPropertySimpleTwoWayPU(params.soilHumidity, this, "soilHumidity");
        this.__lightIntensity = new SynchedPropertySimpleTwoWayPU(params.lightIntensity, this, "lightIntensity");
        this.__aiMessages = new SynchedPropertyObjectTwoWayPU(params.aiMessages, this, "aiMessages");
        this.__aiInputText = new SynchedPropertySimpleTwoWayPU(params.aiInputText, this, "aiInputText");
        this.__isAILoading = new SynchedPropertySimpleTwoWayPU(params.isAILoading, this, "isAILoading");
        this.__aiQuickQuestions = new SynchedPropertyObjectTwoWayPU(params.aiQuickQuestions, this, "aiQuickQuestions");
        this.__pendingImageUri = new SynchedPropertySimpleTwoWayPU(params.pendingImageUri, this, "pendingImageUri");
        this.aiChatScroller = new Scroller();
        this.getWeatherDescription = (): string => '等待数据...';
        this.getWeatherIcon = (): string => '⏳';
        this.sendAIMessage = (message: string): void => { };
        this.addWelcomeMessage = (): void => { };
        this.uploadImage = (): void => { };
        this.transcribeAudio = (): void => { };
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: AnalysisPage_Params) {
        if (params.aiChatScroller !== undefined) {
            this.aiChatScroller = params.aiChatScroller;
        }
        if (params.getWeatherDescription !== undefined) {
            this.getWeatherDescription = params.getWeatherDescription;
        }
        if (params.getWeatherIcon !== undefined) {
            this.getWeatherIcon = params.getWeatherIcon;
        }
        if (params.sendAIMessage !== undefined) {
            this.sendAIMessage = params.sendAIMessage;
        }
        if (params.addWelcomeMessage !== undefined) {
            this.addWelcomeMessage = params.addWelcomeMessage;
        }
        if (params.uploadImage !== undefined) {
            this.uploadImage = params.uploadImage;
        }
        if (params.transcribeAudio !== undefined) {
            this.transcribeAudio = params.transcribeAudio;
        }
    }
    updateStateVars(params: AnalysisPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__temperature.purgeDependencyOnElmtId(rmElmtId);
        this.__soilHumidity.purgeDependencyOnElmtId(rmElmtId);
        this.__lightIntensity.purgeDependencyOnElmtId(rmElmtId);
        this.__aiMessages.purgeDependencyOnElmtId(rmElmtId);
        this.__aiInputText.purgeDependencyOnElmtId(rmElmtId);
        this.__isAILoading.purgeDependencyOnElmtId(rmElmtId);
        this.__aiQuickQuestions.purgeDependencyOnElmtId(rmElmtId);
        this.__pendingImageUri.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__temperature.aboutToBeDeleted();
        this.__soilHumidity.aboutToBeDeleted();
        this.__lightIntensity.aboutToBeDeleted();
        this.__aiMessages.aboutToBeDeleted();
        this.__aiInputText.aboutToBeDeleted();
        this.__isAILoading.aboutToBeDeleted();
        this.__aiQuickQuestions.aboutToBeDeleted();
        this.__pendingImageUri.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    // 传感器数据（保留供AI使用，但不再显示）
    private __temperature: SynchedPropertySimpleTwoWayPU<number>;
    get temperature() {
        return this.__temperature.get();
    }
    set temperature(newValue: number) {
        this.__temperature.set(newValue);
    }
    private __soilHumidity: SynchedPropertySimpleTwoWayPU<number>;
    get soilHumidity() {
        return this.__soilHumidity.get();
    }
    set soilHumidity(newValue: number) {
        this.__soilHumidity.set(newValue);
    }
    private __lightIntensity: SynchedPropertySimpleTwoWayPU<number>;
    get lightIntensity() {
        return this.__lightIntensity.get();
    }
    set lightIntensity(newValue: number) {
        this.__lightIntensity.set(newValue);
    }
    // AI相关
    private __aiMessages: SynchedPropertySimpleOneWayPU<AIMessage[]>;
    get aiMessages() {
        return this.__aiMessages.get();
    }
    set aiMessages(newValue: AIMessage[]) {
        this.__aiMessages.set(newValue);
    }
    private __aiInputText: SynchedPropertySimpleTwoWayPU<string>;
    get aiInputText() {
        return this.__aiInputText.get();
    }
    set aiInputText(newValue: string) {
        this.__aiInputText.set(newValue);
    }
    private __isAILoading: SynchedPropertySimpleTwoWayPU<boolean>;
    get isAILoading() {
        return this.__isAILoading.get();
    }
    set isAILoading(newValue: boolean) {
        this.__isAILoading.set(newValue);
    }
    private __aiQuickQuestions: SynchedPropertySimpleOneWayPU<string[]>;
    get aiQuickQuestions() {
        return this.__aiQuickQuestions.get();
    }
    set aiQuickQuestions(newValue: string[]) {
        this.__aiQuickQuestions.set(newValue);
    }
    private __pendingImageUri: SynchedPropertySimpleTwoWayPU<string>;
    get pendingImageUri() {
        return this.__pendingImageUri.get();
    }
    set pendingImageUri(newValue: string) {
        this.__pendingImageUri.set(newValue);
    }
    private aiChatScroller: Scroller;
    // 回调函数
    private getWeatherDescription: () => string;
    private getWeatherIcon: () => string;
    private sendAIMessage: (message: string) => void;
    private addWelcomeMessage: () => void;
    private uploadImage: () => void;
    private transcribeAudio: () => void;
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor(AppColors.APP_BG);
        }, Column);
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new 
                    // AI智能分析聊天区域 - 全屏显示
                    AIChatSection(this, {
                        aiMessages: this.__aiMessages,
                        aiInputText: this.__aiInputText,
                        isAILoading: this.__isAILoading,
                        aiQuickQuestions: this.__aiQuickQuestions,
                        pendingImageUri: this.__pendingImageUri,
                        aiChatScroller: this.aiChatScroller,
                        sendAIMessage: this.sendAIMessage,
                        addWelcomeMessage: this.addWelcomeMessage,
                        uploadImage: this.uploadImage,
                        transcribeAudio: this.transcribeAudio
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/components/analysis/AnalysisPage.ets", line: 34, col: 7 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            aiMessages: this.aiMessages,
                            aiInputText: this.aiInputText,
                            isAILoading: this.isAILoading,
                            aiQuickQuestions: this.aiQuickQuestions,
                            pendingImageUri: this.pendingImageUri,
                            aiChatScroller: this.aiChatScroller,
                            sendAIMessage: this.sendAIMessage,
                            addWelcomeMessage: this.addWelcomeMessage,
                            uploadImage: this.uploadImage,
                            transcribeAudio: this.transcribeAudio
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {});
                }
            }, { name: "AIChatSection" });
        }
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
