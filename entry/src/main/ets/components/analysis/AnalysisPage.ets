/**
 * 分析页面组件 - AI智能分析全屏聊天
 */
import { AIMessage } from '../../types/IndexTypes';
import { AIChatSection } from './AIChatSection';
import { AppColors } from '../../constants/AppConstants';

@Component
export struct AnalysisPage {
  // 传感器数据（保留供AI使用，但不再显示）
  @Link temperature: number;
  @Link soilHumidity: number;
  @Link lightIntensity: number;
  
  // AI相关
  @Link aiMessages: AIMessage[];
  @Link aiInputText: string;
  @Link isAILoading: boolean;
  @Link aiQuickQuestions: string[];
  @Link pendingImageUri: string;
  aiChatScroller: Scroller = new Scroller();
  
  // 回调函数
  getWeatherDescription: () => string = (): string => '等待数据...';
  getWeatherIcon: () => string = (): string => '⏳';
  sendAIMessage: (message: string) => void = (message: string): void => {};
  addWelcomeMessage: () => void = (): void => {};
  uploadImage: () => void = (): void => {};
  transcribeAudio: () => void = (): void => {};

  build() {
    Column() {
      // AI智能分析聊天区域 - 全屏显示
      AIChatSection({
        aiMessages: $aiMessages,
        aiInputText: $aiInputText,
        isAILoading: $isAILoading,
        aiQuickQuestions: $aiQuickQuestions,
        pendingImageUri: $pendingImageUri,
        aiChatScroller: this.aiChatScroller,
        sendAIMessage: this.sendAIMessage,
        addWelcomeMessage: this.addWelcomeMessage,
        uploadImage: this.uploadImage,
        transcribeAudio: this.transcribeAudio
      })
    }
    .width('100%')
    .height('100%')
    .backgroundColor(AppColors.APP_BG)
  }
}
