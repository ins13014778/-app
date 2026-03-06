/**
 * 天气卡片组件
 */
@Component
export struct WeatherCard {
  @Link temperature: number;
  @Link soilHumidity: number;
  @Link lightIntensity: number;
  
  getWeatherDescription: () => string = (): string => '等待数据...';
  getWeatherIcon: () => string = (): string => '⏳';

  build() {
    Column() {
      // 天气卡片
      Column() {
        Row() {
          Column() {
            // 主要天气信息
            Text(this.getWeatherDescription())
              .fontSize(20)
              .fontWeight(FontWeight.Bold)
              .fontColor('#2c5fb3')
              .margin({ bottom: 4 })

            Text(`${this.temperature > 0 ? this.temperature : '--'}°C`)
              .fontSize(48)
              .fontWeight(FontWeight.Bold)
              .fontColor('#1a4596')
              .margin({ bottom: 8 })

            Text(`湿度 ${this.soilHumidity > 0 ? this.soilHumidity : '--'}% | 光照 ${this.lightIntensity > 0 ?
              this.lightIntensity : '--'}Lx`)
              .fontSize(14)
              .fontColor('#666666')
          }
          .alignItems(HorizontalAlign.Start)
          .layoutWeight(1)

          // 天气图标
          if (this.temperature === 0 && this.soilHumidity === 0) {
            Image($rawfile('倒计时.png'))
              .width(64)
              .height(64)
          } else {
            Text(this.getWeatherIcon())
              .fontSize(64)
          }
        }
        .width('100%')
        .alignItems(VerticalAlign.Center)

        // 三日数据卡片
        Row() {
          // 温度卡片
          Column() {
            this.DataItem(
              $rawfile('环境温度.png'),
              this.temperature > 0 ? `${this.temperature}°C` : '--',
              '温度'
            )
          }
          .layoutWeight(1)
          .margin({ right: 6 })

          // 湿度卡片
          Column() {
            this.DataItem(
              $rawfile('土壤湿度.png'),
              this.soilHumidity > 0 ? `${this.soilHumidity}%` : '--',
              '湿度'
            )
          }
          .layoutWeight(1)
          .margin({ left: 3, right: 3 })

          // 光照卡片
          Column() {
            this.DataItem(
              $rawfile('光照强度-copy.png'),
              this.lightIntensity > 0 ? `${this.lightIntensity}` : '--',
              '光照(Lx)'
            )
          }
          .layoutWeight(1)
          .margin({ left: 6 })
        }
        .width('100%')
        .margin({ top: 16 })
      }
      .width('100%')
      .padding(20)
      .linearGradient({
        angle: 135,
        colors: [['#EBF4FF', 0.0], ['#F5F9FF', 0.5], ['#FFFFFF', 1.0]]
      })
      .borderRadius(24)
      .shadow({
        radius: 12,
        color: 'rgba(79, 143, 248, 0.12)',
        offsetX: 0,
        offsetY: 4
      })
      .margin(16)
    }
    .width('100%')
  }

  // 数据项
  @Builder
  DataItem(icon: Resource, value: string, label: string) {
    Column() {
      Image(icon)
        .width(28)
        .height(28)
        .margin({ bottom: 8 })
      Text(value)
        .fontSize(18)
        .fontWeight(FontWeight.Bold)
        .fontColor('#2c5fb3')
      Text(label)
        .fontSize(12)
        .fontColor('#6b8dc9')
        .margin({ top: 4 })
    }
    .width('100%')
    .padding(16)
    .backgroundColor('rgba(255, 255, 255, 0.85)')
    .borderRadius(20)
    .shadow({
      radius: 6,
      color: 'rgba(79, 143, 248, 0.08)',
      offsetX: 0,
      offsetY: 2
    })
  }
}

