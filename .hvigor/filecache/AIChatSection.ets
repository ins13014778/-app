/**
 * AI聊天区域组件
 */
import { AIMessage } from '../../types/IndexTypes';

@Component
export struct AIChatSection {
  @Link aiMessages: AIMessage[];
  @Link aiInputText: string;
  @Link isAILoading: boolean;
  @Link aiQuickQuestions: string[];
  @Link aiChatScroller: Scroller;
  
  sendAIMessage: (message: string) => void = () => {};
  addWelcomeMessage: () => void = () => {};

  build() {
    Column() {
      // 标题栏
      Row() {
        Row() {
          Image($rawfile('B站狗头.png'))
            .width(24)
            .height(24)
            .margin({ right: 8 })
          
          Text('AI智能分析')
            .fontSize(18)
            .fontWeight(FontWeight.Bold)
            .fontColor('#333333')
        }

        Blank()

        Button('清空')
          .fontSize(13)
          .fontColor('#FF5722')
          .backgroundColor('#FFEBEE')
          .borderRadius(16)
          .height(28)
          .padding({ left: 12, right: 12 })
          .onClick(() => {
            this.aiMessages = [];
            this.addWelcomeMessage();
          })
      }
      .width('100%')
      .padding({ left: 16, right: 16, top: 16, bottom: 12 })

      // 聊天消息列表
      Scroll(this.aiChatScroller) {
        Column() {
          ForEach(this.aiMessages, (msg: AIMessage, index: number) => {
            this.AIMessageItem(msg, index)
          })

          // 加载动画
          if (this.isAILoading) {
            Row() {
              LoadingProgress()
                .width(30)
                .height(30)
                .color('#667eea')
              Text('AI分析中...')
                .fontSize(14)
                .fontColor('#999999')
                .margin({ left: 8 })
            }
            .margin({ top: 12, bottom: 12 })
          }
        }
        .width('100%')
        .justifyContent(FlexAlign.Start)
        .padding({ left: 16, right: 16, top: 8, bottom: 8 })
      }
      .layoutWeight(1)
      .backgroundColor('#F5F5F5')
      .scrollBar(BarState.Off)

      // 快速问题按钮
      if (this.aiMessages.length <= 1 && !this.isAILoading) {
        Scroll() {
          Row() {
            ForEach(this.aiQuickQuestions, (question: string) => {
              Text(question)
                .fontSize(13)
                .fontColor('#667eea')
                .padding({ left: 12, right: 12, top: 8, bottom: 8 })
                .backgroundColor('#EEF2FF')
                .borderRadius(16)
                .margin({ right: 8 })
                .onClick(() => {
                  this.sendAIMessage(question);
                })
            })
          }
          .padding({ left: 16, right: 16, top: 8, bottom: 8 })
        }
        .scrollable(ScrollDirection.Horizontal)
        .scrollBar(BarState.Off)
        .width('100%')
        .backgroundColor('#FFFFFF')
      }

      // 底部输入框
      Row() {
        TextInput({ placeholder: '询问AI关于农场数据...', text: this.aiInputText })
          .layoutWeight(1)
          .height(44)
          .fontSize(15)
          .borderRadius(22)
          .backgroundColor('#F5F5F5')
          .padding({ left: 16, right: 16 })
          .enabled(!this.isAILoading)
          .onChange((value: string) => {
            this.aiInputText = value;
          })

        Button() {
          Image($rawfile('发送.png'))
            .width(24)
            .height(24)
            .fillColor(Color.White)
        }
        .width(44)
        .height(44)
        .backgroundColor(this.aiInputText.trim().length > 0 ? '#667eea' : '#CCCCCC')
        .borderRadius(22)
        .margin({ left: 8 })
        .enabled(!this.isAILoading && this.aiInputText.trim().length > 0)
        .onClick(() => {
          if (this.aiInputText.trim().length > 0) {
            this.sendAIMessage(this.aiInputText);
            this.aiInputText = '';
          }
        })
      }
      .width('100%')
      .padding(16)
    }
    .layoutWeight(1)
    .backgroundColor('#FFFFFF')
    .borderRadius(24)
    .margin({ left: 16, right: 16, bottom: 16, top: 8 })
    .shadow({
      radius: 8,
      color: 'rgba(0, 0, 0, 0.06)',
      offsetX: 0,
      offsetY: 2
    })
  }

  // AI消息组件
  @Builder
  AIMessageItem(msg: AIMessage, index: number) {
    Row() {
      if (msg.role === 'assistant') {
        Image($rawfile('deepseek-copy-copy-copy.png'))
          .width(36)
          .height(36)
          .borderRadius(18)
          .margin({ right: 12 })
      } else {
        Blank()
      }

      Text(msg.content)
        .fontSize(15)
        .fontColor(msg.role === 'user' ? '#FFFFFF' : '#333333')
        .padding({ left: 16, right: 16, top: 12, bottom: 12 })
        .backgroundColor(msg.role === 'user' ? '#667eea' : '#F0F0F0')
        .borderRadius(18)
        .constraintSize({ maxWidth: '75%' })

      if (msg.role === 'user') {
        Image($rawfile('B站狗头.png'))
          .width(36)
          .height(36)
          .borderRadius(18)
          .margin({ left: 12 })
      } else {
        Blank()
      }
    }
    .width('100%')
    .alignItems(VerticalAlign.Top)
    .margin({ top: 0, bottom: 12 })
  }
}

