/**
 * 天气卡片组件
 * 
 * 功能说明：
 * 1. 显示当前城市的天气信息
 * 2. 支持加载中、错误、正常三种状态显示
 * 3. 包含城市、日期、温度、天气状况等基本信息
 * 4. 显示详细天气信息（湿度、风速、空气质量等）
 * 5. 支持错误重试功能
 * 
 * 技术特点：
 * - 使用@State管理组件内部状态
 * - 异步加载天气数据
 * - 状态驱动的UI渲染
 * - 使用@Builder构建不同状态的视图
 * 
 * 使用场景：在首页展示实时天气信息
 */
import { weatherService } from '../../services/WeatherService';
import { WeatherData } from '../../types/WeatherTypes';

/**
 * 天气卡片组件
 * 
 * @Component 装饰器表示这是一个UI组件
 */
@Component
export struct WeatherCard {
  // ========== 天气数据状态 ==========
  // 存储天气数据的对象，null表示数据未加载
  @State weatherData: WeatherData | null = null;
  
  // ========== 加载状态管理 ==========
  @State loading: boolean = false;    // 是否正在加载数据
  @State errorMsg: string = '';        // 错误信息，空字符串表示无错误

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
      } else {
        this.errorMsg = response.message;
      }
    } catch (error) {
      this.errorMsg = '获取天气失败';
      console.error('[WeatherCard] 加载失败:', error);
    } finally {
      this.loading = false;
    }
  }

  build() {
    Column() {
      if (this.loading) {
        // 加载中
        this.LoadingView();
      } else if (this.errorMsg) {
        // 错误状态
        this.ErrorView();
      } else if (this.weatherData) {
        // 显示天气
        this.WeatherView();
      }
    }
    .width('100%')
    .backgroundColor('#FFFFFF')
    .borderRadius(12)
    .padding(16)
    .shadow({
      radius: 8,
      color: 'rgba(0, 0, 0, 0.06)',
      offsetX: 0,
      offsetY: 2
    })
    .border({
      width: 1,
      color: 'rgba(0, 0, 0, 0.04)'
    })
  }

  @Builder
  LoadingView() {
    Row() {
      LoadingProgress()
        .width(32)
        .height(32)
        .color('#00E5FF') // 青色主题色
        .margin({ top: 10 })
      
      Text('加载中...')
        .fontSize(13)
        .fontColor('#AAAAAA')
        .margin({ left: 8 })
    }
    .width('100%')
    .height(100)
    .justifyContent(FlexAlign.Center)
  }

  @Builder
  ErrorView() {
    Row() {
      Text('⚠️')
        .fontSize(20)
      
      Text(this.errorMsg)
        .fontSize(13)
        .fontColor('#FF0000')
        .margin({ left: 8 })
      
      Button('重试')
        .fontSize(12)
        .height(28)
        .margin({ left: 12 })
        .onClick(() => this.loadWeather())
    }
    .width('100%')
    .height(100)
    .justifyContent(FlexAlign.Center)
  }

  @Builder
  WeatherView() {
    Row() {
      // 左侧：主要信息
      Column({ space: 4 }) {
        Text(this.weatherData!.city)
          .fontSize(16)
          .fontWeight(FontWeight.Bold)
          .fontColor('#111111')
        
        Text(this.weatherData!.date + ' ' + this.weatherData!.week)
          .fontSize(11)
          .fontColor('#8E8E93')
        
        Row() {
          Text(weatherService.getWeatherEmoji(this.weatherData!.wea))
            .fontSize(32)
          
          Text(this.weatherData!.tem)
            .fontSize(36)
            .fontWeight(FontWeight.Bold)
            .fontColor('#FF3B30')
            .margin({ left: 8 })
          
          Text('°')
            .fontSize(20)
            .fontColor('#FF3B30')
            .margin({ left: 2 })
        }
        .margin({ top: 4, bottom: 4 })
        
        Text(this.weatherData!.wea)
          .fontSize(13)
          .fontColor('#8E8E93')
      }
      .alignItems(HorizontalAlign.Start)
      .layoutWeight(1)

      // 右侧：详细信息
      Column({ space: 6 }) {
        this.InfoItem('🌡️', `${this.weatherData!.tem_day}° / ${this.weatherData!.tem_night}°`)
        this.InfoItem('💧', `湿度 ${this.weatherData!.humidity}`)
        this.InfoItem('🌬️', `${this.weatherData!.win} ${this.weatherData!.win_speed}`)
        
        Row() {
          Text('🌈')
            .fontSize(12)
          
          Text(`空气 ${this.weatherData!.air}`)
            .fontSize(11)
            .fontColor(weatherService.getAirQualityColor(this.weatherData!.air))
            .fontWeight(FontWeight.Medium)
            .margin({ left: 4 })
        }
      }
      .alignItems(HorizontalAlign.Start)
    }
    .width('100%')
    .padding(4)
  }

  @Builder
  InfoItem(icon: string, text: string) {
    Row() {
      Text(icon)
        .fontSize(12)
      
      Text(text)
        .fontSize(11)
        .fontColor('#666666')
        .margin({ left: 4 })
    }
  }
}

