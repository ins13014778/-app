/**
 * AI聊天区域组件
 */
import { AIMessage } from '../../types/IndexTypes';
import { AppColors } from '../../constants/AppConstants';

@Component
export struct AIChatSection {
  @Link aiMessages: AIMessage[];
  @Link aiInputText: string;
  @Link isAILoading: boolean;
  @Link aiQuickQuestions: string[];
  aiChatScroller: Scroller = new Scroller();
  @Link pendingImageUri: string;
  
  sendAIMessage: (message: string) => void = (message: string): void => {};
  addWelcomeMessage: () => void = (): void => {};
  uploadImage: () => void = (): void => {};
  transcribeAudio: () => void = (): void => {};

  build() {
    Column() {
      // 标题栏
      Row() {
        Row() {
          Image($rawfile('机器人.png'))
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
                .color(AppColors.PRIMARY_COLOR)
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
      .backgroundColor(AppColors.APP_BG)
      .scrollBar(BarState.Off)

      // 快速问题按钮
      if (this.aiMessages.length <= 1 && !this.isAILoading) {
        Scroll() {
          Row() {
            ForEach(this.aiQuickQuestions, (question: string) => {
              Text(question)
                .fontSize(13)
                .fontColor(AppColors.PRIMARY_COLOR)
                .padding({ left: 12, right: 12, top: 8, bottom: 8 })
                .backgroundColor(AppColors.PRIMARY_LIGHT)
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
        if (this.pendingImageUri && this.pendingImageUri.length > 0) {
          Image(this.pendingImageUri)
            .width(40)
            .height(40)
            .borderRadius(6)
            .margin({ right: 8 })
            .objectFit(ImageFit.Cover)
        }
        Button() {
          Text('🖼️')
            .fontSize(20)
        }
        .width(44)
        .height(44)
        .backgroundColor(AppColors.PRIMARY_LIGHT)
        .borderRadius(22)
        .margin({ right: 8 })
        .enabled(!this.isAILoading)
        .onClick(() => {
          this.uploadImage();
        })

        Button() {
          Text('🎤')
            .fontSize(20)
        }
        .width(44)
        .height(44)
        .backgroundColor(AppColors.PRIMARY_LIGHT)
        .borderRadius(22)
        .margin({ right: 8 })
        .enabled(!this.isAILoading)
        .onClick(() => {
          this.transcribeAudio();
        })

        TextInput({ placeholder: '询问AI关于农场数据...', text: this.aiInputText })
          .layoutWeight(1)
          .height(44)
          .fontSize(15)
          .borderRadius(22)
          .backgroundColor(AppColors.SURFACE_ALT)
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
    .borderRadius(0)
    .margin({ left: 0, right: 0, bottom: 0, top: 0 })
  }

  // AI消息组件
  @Builder
  AIMessageItem(msg: AIMessage, index: number) {
    Row() {
      if (msg.role === 'assistant') {
        Image($rawfile('机器人.png'))
          .width(36)
          .height(36)
          .borderRadius(18)
          .margin({ right: 12 })
      } else {
        Blank()
      }

      Column() {
        if (msg.imageUri && msg.imageUri.length > 0) {
          Image(msg.imageUri)
            .width(140)
            .height(140)
            .borderRadius(12)
            .objectFit(ImageFit.Cover)
            .margin({ bottom: 6 })
        }
        Text(msg.content)
          .fontSize(15)
          .fontColor(msg.role === 'user' ? '#FFFFFF' : '#333333')
          .padding({ left: 16, right: 16, top: 12, bottom: 12 })
          .backgroundColor(msg.role === 'user' ? '#667eea' : '#F0F0F0')
          .borderRadius(18)
          .constraintSize({ maxWidth: '75%' })
      }

      if (msg.role === 'user') {
        Image($rawfile('农民头像.png'))
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
