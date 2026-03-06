/**
 * 传感器数据卡片组件
 * 显示来自巴法云的实时传感器数据
 */

export interface SensorData {
  name: string;           // 传感器名称
  topic: string;          // 主题
  value: string;          // 当前值
  unit: string;           // 单位
  icon: string;           // 图标
  color: string;          // 颜色
  lastUpdateTime: string; // 最后更新时间
}

@Component
export struct SensorDataCard {
  @Prop sensorData: SensorData;

  build() {
    Column() {
      Row() {
        // 左侧图标和名称
        Row() {
          Text(this.sensorData.icon)
            .fontSize(32)
            .margin({ right: 12 })

          Column() {
            Text(this.sensorData.name)
              .fontSize(14)
              .fontColor('#666666')
              .margin({ bottom: 4 })

            Text(this.sensorData.lastUpdateTime)
              .fontSize(11)
              .fontColor('#999999')
          }
          .alignItems(HorizontalAlign.Start)
        }
        .layoutWeight(1)

        // 右侧数值
        Row() {
          Text(this.sensorData.value)
            .fontSize(28)
            .fontWeight(FontWeight.Bold)
            .fontColor(this.sensorData.color)

          Text(this.sensorData.unit)
            .fontSize(16)
            .fontColor('#999999')
            .margin({ left: 4 })
        }
      }
      .width('100%')
      .padding(16)
    }
    .width('100%')
    .backgroundColor('#FFFFFF')
    .borderRadius(12)
  }
}

