if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface AIChatSection_Params {
    aiMessages?: AIMessage[];
    aiInputText?: string;
    isAILoading?: boolean;
    aiQuickQuestions?: string[];
    aiChatScroller?: Scroller;
    pendingImageUri?: string;
    sendAIMessage?: (message: string) => void;
    addWelcomeMessage?: () => void;
    uploadImage?: () => void;
    transcribeAudio?: () => void;
}
import type { AIMessage } from '../../types/IndexTypes';
export class AIChatSection extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__aiMessages = new SynchedPropertyObjectTwoWayPU(params.aiMessages, this, "aiMessages");
        this.__aiInputText = new SynchedPropertySimpleTwoWayPU(params.aiInputText, this, "aiInputText");
        this.__isAILoading = new SynchedPropertySimpleTwoWayPU(params.isAILoading, this, "isAILoading");
        this.__aiQuickQuestions = new SynchedPropertyObjectTwoWayPU(params.aiQuickQuestions, this, "aiQuickQuestions");
        this.aiChatScroller = new Scroller();
        this.__pendingImageUri = new SynchedPropertySimpleTwoWayPU(params.pendingImageUri, this, "pendingImageUri");
        this.sendAIMessage = (message: string): void => { };
        this.addWelcomeMessage = (): void => { };
        this.uploadImage = (): void => { };
        this.transcribeAudio = (): void => { };
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: AIChatSection_Params) {
        if (params.aiChatScroller !== undefined) {
            this.aiChatScroller = params.aiChatScroller;
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
    updateStateVars(params: AIChatSection_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__aiMessages.purgeDependencyOnElmtId(rmElmtId);
        this.__aiInputText.purgeDependencyOnElmtId(rmElmtId);
        this.__isAILoading.purgeDependencyOnElmtId(rmElmtId);
        this.__aiQuickQuestions.purgeDependencyOnElmtId(rmElmtId);
        this.__pendingImageUri.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__aiMessages.aboutToBeDeleted();
        this.__aiInputText.aboutToBeDeleted();
        this.__isAILoading.aboutToBeDeleted();
        this.__aiQuickQuestions.aboutToBeDeleted();
        this.__pendingImageUri.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
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
    private aiChatScroller: Scroller;
    private __pendingImageUri: SynchedPropertySimpleTwoWayPU<string>;
    get pendingImageUri() {
        return this.__pendingImageUri.get();
    }
    set pendingImageUri(newValue: string) {
        this.__pendingImageUri.set(newValue);
    }
    private sendAIMessage: (message: string) => void;
    private addWelcomeMessage: () => void;
    private uploadImage: () => void;
    private transcribeAudio: () => void;
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/components/analysis/AIChatSection.ets(21:5)", "entry");
            Column.layoutWeight(1);
            Column.backgroundColor('#FFFFFF');
            Column.borderRadius(0);
            Column.margin({ left: 0, right: 0, bottom: 0, top: 0 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 标题栏
            Row.create();
            Row.debugLine("entry/src/main/ets/components/analysis/AIChatSection.ets(23:7)", "entry");
            // 标题栏
            Row.width('100%');
            // 标题栏
            Row.padding({ left: 16, right: 16, top: 16, bottom: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/components/analysis/AIChatSection.ets(24:9)", "entry");
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 0, "type": 30000, params: ['机器人.png'], "bundleName": "com.example.myapplication", "moduleName": "entry" });
            Image.debugLine("entry/src/main/ets/components/analysis/AIChatSection.ets(25:11)", "entry");
            Image.width(24);
            Image.height(24);
            Image.margin({ right: 8 });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('AI智能分析');
            Text.debugLine("entry/src/main/ets/components/analysis/AIChatSection.ets(30:11)", "entry");
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#333333');
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/components/analysis/AIChatSection.ets(36:9)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('清空');
            Button.debugLine("entry/src/main/ets/components/analysis/AIChatSection.ets(38:7)", "entry");
            Button.fontSize(13);
            Button.fontColor('#FF5722');
            Button.backgroundColor('#FFEBEE');
            Button.borderRadius(16);
            Button.height(28);
            Button.padding({ left: 12, right: 12 });
            Button.onClick(() => {
                this.aiMessages = [];
                this.addWelcomeMessage();
            });
        }, Button);
        Button.pop();
        // 标题栏
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 聊天消息列表
            Scroll.create(this.aiChatScroller);
            Scroll.debugLine("entry/src/main/ets/components/analysis/AIChatSection.ets(54:7)", "entry");
            // 聊天消息列表
            Scroll.layoutWeight(1);
            // 聊天消息列表
            Scroll.backgroundColor('#F5F5F5');
            // 聊天消息列表
            Scroll.scrollBar(BarState.Off);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/components/analysis/AIChatSection.ets(55:9)", "entry");
            Column.width('100%');
            Column.justifyContent(FlexAlign.Start);
            Column.padding({ left: 16, right: 16, top: 8, bottom: 8 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = (_item, index: number) => {
                const msg = _item;
                this.AIMessageItem.bind(this)(msg, index);
            };
            this.forEachUpdateFunction(elmtId, this.aiMessages, forEachItemGenFunction, undefined, true, false);
        }, ForEach);
        ForEach.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 加载动画
            if (this.isAILoading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.debugLine("entry/src/main/ets/components/analysis/AIChatSection.ets(62:13)", "entry");
                        Row.margin({ top: 12, bottom: 12 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        LoadingProgress.create();
                        LoadingProgress.debugLine("entry/src/main/ets/components/analysis/AIChatSection.ets(63:15)", "entry");
                        LoadingProgress.width(30);
                        LoadingProgress.height(30);
                        LoadingProgress.color('#667eea');
                    }, LoadingProgress);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('AI分析中...');
                        Text.debugLine("entry/src/main/ets/components/analysis/AIChatSection.ets(67:15)", "entry");
                        Text.fontSize(14);
                        Text.fontColor('#999999');
                        Text.margin({ left: 8 });
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
        Column.pop();
        // 聊天消息列表
        Scroll.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 快速问题按钮
            if (this.aiMessages.length <= 1 && !this.isAILoading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Scroll.create();
                        Scroll.debugLine("entry/src/main/ets/components/analysis/AIChatSection.ets(85:9)", "entry");
                        Scroll.scrollable(ScrollDirection.Horizontal);
                        Scroll.scrollBar(BarState.Off);
                        Scroll.width('100%');
                        Scroll.backgroundColor('#FFFFFF');
                    }, Scroll);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.debugLine("entry/src/main/ets/components/analysis/AIChatSection.ets(86:11)", "entry");
                        Row.padding({ left: 16, right: 16, top: 8, bottom: 8 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const question = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(question);
                                Text.debugLine("entry/src/main/ets/components/analysis/AIChatSection.ets(88:15)", "entry");
                                Text.fontSize(13);
                                Text.fontColor('#667eea');
                                Text.padding({ left: 12, right: 12, top: 8, bottom: 8 });
                                Text.backgroundColor('#EEF2FF');
                                Text.borderRadius(16);
                                Text.margin({ right: 8 });
                                Text.onClick(() => {
                                    this.sendAIMessage(question);
                                });
                            }, Text);
                            Text.pop();
                        };
                        this.forEachUpdateFunction(elmtId, this.aiQuickQuestions, forEachItemGenFunction);
                    }, ForEach);
                    ForEach.pop();
                    Row.pop();
                    Scroll.pop();
                });
            }
            // 底部输入框
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 底部输入框
            Row.create();
            Row.debugLine("entry/src/main/ets/components/analysis/AIChatSection.ets(109:7)", "entry");
            // 底部输入框
            Row.width('100%');
            // 底部输入框
            Row.padding(16);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.pendingImageUri && this.pendingImageUri.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create(this.pendingImageUri);
                        Image.debugLine("entry/src/main/ets/components/analysis/AIChatSection.ets(111:11)", "entry");
                        Image.width(40);
                        Image.height(40);
                        Image.borderRadius(6);
                        Image.margin({ right: 8 });
                        Image.objectFit(ImageFit.Cover);
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
            Button.createWithChild();
            Button.debugLine("entry/src/main/ets/components/analysis/AIChatSection.ets(118:9)", "entry");
            Button.width(44);
            Button.height(44);
            Button.backgroundColor('#EEF2FF');
            Button.borderRadius(22);
            Button.margin({ right: 8 });
            Button.enabled(!this.isAILoading);
            Button.onClick(() => {
                this.uploadImage();
            });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('🖼️');
            Text.debugLine("entry/src/main/ets/components/analysis/AIChatSection.ets(119:11)", "entry");
            Text.fontSize(20);
        }, Text);
        Text.pop();
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild();
            Button.debugLine("entry/src/main/ets/components/analysis/AIChatSection.ets(132:9)", "entry");
            Button.width(44);
            Button.height(44);
            Button.backgroundColor('#EEF2FF');
            Button.borderRadius(22);
            Button.margin({ right: 8 });
            Button.enabled(!this.isAILoading);
            Button.onClick(() => {
                this.transcribeAudio();
            });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('🎤');
            Text.debugLine("entry/src/main/ets/components/analysis/AIChatSection.ets(133:11)", "entry");
            Text.fontSize(20);
        }, Text);
        Text.pop();
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '询问AI关于农场数据...', text: this.aiInputText });
            TextInput.debugLine("entry/src/main/ets/components/analysis/AIChatSection.ets(146:9)", "entry");
            TextInput.layoutWeight(1);
            TextInput.height(44);
            TextInput.fontSize(15);
            TextInput.borderRadius(22);
            TextInput.backgroundColor('#F5F5F5');
            TextInput.padding({ left: 16, right: 16 });
            TextInput.enabled(!this.isAILoading);
            TextInput.onChange((value: string) => {
                this.aiInputText = value;
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild();
            Button.debugLine("entry/src/main/ets/components/analysis/AIChatSection.ets(158:9)", "entry");
            Button.width(44);
            Button.height(44);
            Button.backgroundColor(this.aiInputText.trim().length > 0 ? '#667eea' : '#CCCCCC');
            Button.borderRadius(22);
            Button.margin({ left: 8 });
            Button.enabled(!this.isAILoading && this.aiInputText.trim().length > 0);
            Button.onClick(() => {
                if (this.aiInputText.trim().length > 0) {
                    this.sendAIMessage(this.aiInputText);
                    this.aiInputText = '';
                }
            });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 0, "type": 30000, params: ['发送.png'], "bundleName": "com.example.myapplication", "moduleName": "entry" });
            Image.debugLine("entry/src/main/ets/components/analysis/AIChatSection.ets(159:11)", "entry");
            Image.width(24);
            Image.height(24);
            Image.fillColor(Color.White);
        }, Image);
        Button.pop();
        // 底部输入框
        Row.pop();
        Column.pop();
    }
    // AI消息组件
    AIMessageItem(msg: AIMessage, index: number, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/components/analysis/AIChatSection.ets(189:5)", "entry");
            Row.width('100%');
            Row.alignItems(VerticalAlign.Top);
            Row.margin({ top: 0, bottom: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (msg.role === 'assistant') {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 0, "type": 30000, params: ['机器人.png'], "bundleName": "com.example.myapplication", "moduleName": "entry" });
                        Image.debugLine("entry/src/main/ets/components/analysis/AIChatSection.ets(191:9)", "entry");
                        Image.width(36);
                        Image.height(36);
                        Image.borderRadius(18);
                        Image.margin({ right: 12 });
                    }, Image);
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                        Blank.debugLine("entry/src/main/ets/components/analysis/AIChatSection.ets(197:9)", "entry");
                    }, Blank);
                    Blank.pop();
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/components/analysis/AIChatSection.ets(200:7)", "entry");
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (msg.imageUri && msg.imageUri.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create(msg.imageUri);
                        Image.debugLine("entry/src/main/ets/components/analysis/AIChatSection.ets(202:11)", "entry");
                        Image.width(140);
                        Image.height(140);
                        Image.borderRadius(12);
                        Image.objectFit(ImageFit.Cover);
                        Image.margin({ bottom: 6 });
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
            Text.create(msg.content);
            Text.debugLine("entry/src/main/ets/components/analysis/AIChatSection.ets(209:9)", "entry");
            Text.fontSize(15);
            Text.fontColor(msg.role === 'user' ? '#FFFFFF' : '#333333');
            Text.padding({ left: 16, right: 16, top: 12, bottom: 12 });
            Text.backgroundColor(msg.role === 'user' ? '#667eea' : '#F0F0F0');
            Text.borderRadius(18);
            Text.constraintSize({ maxWidth: '75%' });
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (msg.role === 'user') {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 0, "type": 30000, params: ['农民头像.png'], "bundleName": "com.example.myapplication", "moduleName": "entry" });
                        Image.debugLine("entry/src/main/ets/components/analysis/AIChatSection.ets(219:9)", "entry");
                        Image.width(36);
                        Image.height(36);
                        Image.borderRadius(18);
                        Image.margin({ left: 12 });
                    }, Image);
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                        Blank.debugLine("entry/src/main/ets/components/analysis/AIChatSection.ets(225:9)", "entry");
                    }, Blank);
                    Blank.pop();
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
