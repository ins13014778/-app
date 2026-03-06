/**
 * 首页组件 - 显示实时农场数据和设备状态
 */
import { router } from '@kit.ArkUI';
import { ControlDevice } from '../../types/IndexTypes';

@Component
export struct HomePage {
  // 传感器数据
  @Link soilHumidity: number;
  @Link temperature: number;
  @Link lightIntensity: number;
  @Link date: string;
  @Link lastUpdateTime: string;
  
  // 今日统计
  @Link todayMaxTemp: number;
  @Link todayMinTemp: number;
  @Link todayMaxHumidity: number;
  @Link todayMinHumidity: number;
  
  // 设备状态
  @Link controlDevices: ControlDevice[];
  @Link activeDeviceCount: number;
  @Link onlineDeviceCount: number;
  @Link mqttStatusText: string;
  
  // 方法引用
  getMqttStatusIcon: () => string = () => '⚪';
  getMqttStatusColor: () => string = () => '#999999';

  build() {
    Flex({ direction: FlexDirection.Column, justifyContent: FlexAlign.Start }) {
      // 顶部导航栏
      Row() {
        Text('智慧农场监测')
          .fontSize(18)
          .fontWeight(FontWeight.Bold)
          .fontColor('#1F2329')
          .layoutWeight(1)

        // AI聊天按钮
        Button({ type: ButtonType.Normal }) {
          Row() {
            Image($rawfile('deepseek-copy-copy-copy.png'))
              .width(16)
              .height(16)
              .fillColor('#666666')
              .margin({ right: 4 })
            Text('AI')
              .fontSize(13)
              .fontColor('#666666')
          }
        }
        .backgroundColor('#F5F5F5')
        .borderRadius(16)
        .height(32)
        .padding({ left: 12, right: 12 })
        .margin({ right: 6 })
        .onClick(() => {
          router.pushUrl({
            url: 'pages/AIChat'
          }).catch((err: Error) => {
            console.error('[Index] 跳转AI聊天失败:', JSON.stringify(err));
          });
        })
      }
      .width('100%')
      .height(50)
      .padding({ left: 12, right: 12 })
      .backgroundColor('#FFFFFF')
      .flexShrink(0)

      // 内容区域
      Scroll() {
        Column() {
          // 实时数据标题栏
          Row() {
            Text('实时数据')
              .fontSize(16)
              .fontWeight(FontWeight.Bold)
              .fontColor('#1F2329')
              .layoutWeight(1)

            if (this.lastUpdateTime !== '--:--') {
              Text(`更新于 ${this.lastUpdateTime}`)
                .fontSize(11)
                .fontColor('#8A8F99')
            }
          }
          .width('100%')
          .padding({ left: 12, right: 12, top: 0, bottom: 4 })
          .margin({ top: 0 })

          // 数据卡片
          Row() {
            // 土壤湿度
            this.SensorCard(
              $rawfile('土壤湿度.png'),
              '#00B75E',
              this.soilHumidity > 0 ? `${this.soilHumidity}%` : '--',
              '土壤湿度',
              this.soilHumidity > 0
            )

            // 环境温度
            this.SensorCard(
              $rawfile('环境温度.png'),
              '#E34607',
              this.temperature > 0 ? `${this.temperature}°C` : '--',
              '环境温度',
              this.temperature > 0
            ).margin({ left: 8, right: 8 })

            // 光照强度
            this.SensorCard(
              $rawfile('光照强度-copy.png'),
              '#FFA726',
              this.lightIntensity > 0 ? `${this.lightIntensity}Lx` : '--',
              '光照强度',
              this.lightIntensity > 0
            )
          }
          .width('100%')
          .padding({ left: 12, right: 12 })
          .margin({ top: 0, bottom: 8 })

          // 今日数据统计
          this.TodayStatsCard()

          // 设备运行状态
          this.DeviceStatsCard()

          // 系统状态提示
          Column() {
            Row() {
              Text(this.getMqttStatusIcon())
                .fontSize(16)
                .margin({ right: 6 })
              Text('控制系统')
                .fontSize(14)
                .fontColor('#666666')
                .layoutWeight(1)
              Text(this.mqttStatusText)
                .fontSize(14)
                .fontWeight(FontWeight.Bold)
                .fontColor(this.getMqttStatusColor())
            }
            .width('100%')
            .padding(12)
            .backgroundColor('#FFFFFF')
            .borderRadius(8)
          }
          .width('100%')
          .padding({ left: 12, right: 12, bottom: 12 })
        }
        .width('100%')
      }
      .flexGrow(1)
      .flexShrink(1)
      .backgroundColor('#F1F1F1')
      .width('100%')
      .height('100%')
      .scrollBar(BarState.Off)
      .edgeEffect(EdgeEffect.Spring)
      .scrollable(ScrollDirection.Vertical)
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F1F1F1')
  }

  // 传感器卡片
  @Builder
  SensorCard(icon: Resource, color: string, value: string, label: string, hasData: boolean) {
    Column() {
      Image(icon)
        .width(32)
        .height(32)
        .fillColor(color)

      Text(value)
        .fontSize(22)
        .fontWeight(FontWeight.Bold)
        .fontColor(hasData ? color : '#CCCCCC')
        .margin({ top: 6 })

      Text(label)
        .fontSize(12)
        .fontColor('#8A8F99')
        .margin({ top: 4 })
    }
    .layoutWeight(1)
    .alignItems(HorizontalAlign.Center)
    .padding(16)
    .backgroundColor('#FFFFFF')
    .borderRadius(12)
  }

  // 今日统计卡片
  @Builder
  TodayStatsCard() {
    Column() {
      Row() {
        Text('今日数据统计')
          .fontSize(16)
          .fontWeight(FontWeight.Bold)
          .fontColor('#1F2329')
          .layoutWeight(1)

        Text(this.date)
          .fontSize(12)
          .fontColor('#8A8F99')
      }
      .width('100%')
      .margin({ bottom: 12 })

      // 温度统计
      Row() {
        this.StatItem('最高温度', this.todayMaxTemp > 0 ? `${this.todayMaxTemp}°C` : '--', '#FF5722')
        this.StatItem('当前温度', this.temperature > 0 ? `${this.temperature}°C` : '--', '#FF6B35')
        this.StatItem('最低温度', this.todayMinTemp > 0 ? `${this.todayMinTemp}°C` : '--', '#2196F3')
      }
      .width('100%')
      .padding(12)
      .backgroundColor('#FFF3E0')
      .borderRadius(8)
      .margin({ bottom: 10 })

      // 湿度统计
      Row() {
        this.StatItem('最高湿度', this.todayMaxHumidity > 0 ? `${this.todayMaxHumidity}%` : '--', '#4CAF50')
        this.StatItem('当前湿度', this.soilHumidity > 0 ? `${this.soilHumidity}%` : '--', '#66BB6A')
        this.StatItem('最低湿度', this.todayMinHumidity > 0 ? `${this.todayMinHumidity}%` : '--', '#81C784')
      }
      .width('100%')
      .padding(12)
      .backgroundColor('#E8F5E9')
      .borderRadius(8)
    }
    .width('100%')
    .padding(16)
    .backgroundColor('#FFFFFF')
    .borderRadius(12)
    .margin({ left: 12, right: 12, top: 0, bottom: 8 })
  }

  // 统计项
  @Builder
  StatItem(label: string, value: string, color: string) {
    Column() {
      Text(label)
        .fontSize(12)
        .fontColor('#666666')
        .margin({ bottom: 4 })
      Text(value)
        .fontSize(18)
        .fontWeight(FontWeight.Bold)
        .fontColor(value !== '--' ? color : '#CCCCCC')
    }
    .layoutWeight(1)
    .alignItems(HorizontalAlign.Center)
  }

  // 设备统计卡片
  @Builder
  DeviceStatsCard() {
    Column() {
      Text('设备运行状态')
        .fontSize(16)
        .fontWeight(FontWeight.Bold)
        .fontColor('#1F2329')
        .margin({ bottom: 12 })

      Row() {
        // 总设备数
        this.DeviceStatItem($rawfile('总设备.png'), '#333333', `${this.controlDevices.length}`, '总设备')
        // 在线设备数
        this.DeviceStatItem($rawfile('在线.png'), '#4CAF50', `${this.onlineDeviceCount}`, '在线')
        // 运行设备数
        this.DeviceStatItem($rawfile('运行中.png'), '#FF9800', `${this.activeDeviceCount}`, '运行中')
        // 在线率
        Column() {
          Image($rawfile('数据分析.png'))
            .width(28)
            .height(28)
            .fillColor('#2196F3')
            .margin({ bottom: 6 })
          Text(this.controlDevices.length > 0 ?
            `${Math.round((this.onlineDeviceCount / this.controlDevices.length) * 100)}%` : '0%')
            .fontSize(20)
            .fontWeight(FontWeight.Bold)
            .fontColor('#2196F3')
            .margin({ bottom: 2 })
          Text('在线率')
            .fontSize(11)
            .fontColor('#666666')
        }
        .layoutWeight(1)
        .alignItems(HorizontalAlign.Center)
      }
      .width('100%')
    }
    .width('100%')
    .padding(16)
    .backgroundColor('#FFFFFF')
    .borderRadius(12)
    .margin({ left: 12, right: 12, top: 0, bottom: 8 })
  }

  // 设备统计项
  @Builder
  DeviceStatItem(icon: Resource, color: string, value: string, label: string) {
    Column() {
      Image(icon)
        .width(28)
        .height(28)
        .fillColor(color)
        .margin({ bottom: 6 })
      Text(value)
        .fontSize(20)
        .fontWeight(FontWeight.Bold)
        .fontColor(color)
        .margin({ bottom: 2 })
      Text(label)
        .fontSize(11)
        .fontColor('#666666')
    }
    .layoutWeight(1)
    .alignItems(HorizontalAlign.Center)
  }
}

