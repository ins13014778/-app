/**
 * 分析页面组件 - 天气展示 + AI智能分析
 */
import { AIMessage } from '../../types/IndexTypes';
import { WeatherCard } from './WeatherCard';
import { AIChatSection } from './AIChatSection';

@Component
export struct AnalysisPage {
  // 传感器数据
  @Link temperature: number;
  @Link soilHumidity: number;
  @Link lightIntensity: number;
  
  // AI相关
  @Link aiMessages: AIMessage[];
  @Link aiInputText: string;
  @Link isAILoading: boolean;
  @Link aiQuickQuestions: string[];
  @Link aiChatScroller: Scroller;
  
  // 回调函数
  getWeatherDescription: () => string = () => '等待数据...';
  getWeatherIcon: () => string = () => '⏳';
  sendAIMessage: (message: string) => void = () => {};
  addWelcomeMessage: () => void = () => {};

  build() {
    Column() {
      // 天气展示区域
      WeatherCard({
        temperature: $temperature,
        soilHumidity: $soilHumidity,
        lightIntensity: $lightIntensity,
        getWeatherDescription: this.getWeatherDescription,
        getWeatherIcon: this.getWeatherIcon
      })

      // AI智能分析聊天区域
      AIChatSection({
        aiMessages: $aiMessages,
        aiInputText: $aiInputText,
        isAILoading: $isAILoading,
        aiQuickQuestions: $aiQuickQuestions,
        aiChatScroller: $aiChatScroller,
        sendAIMessage: this.sendAIMessage,
        addWelcomeMessage: this.addWelcomeMessage
      })
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#FAFAFA')
  }
}

