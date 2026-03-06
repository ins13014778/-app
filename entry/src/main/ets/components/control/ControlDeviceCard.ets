/**
 * 控制设备卡片组件
 */
import { ControlDevice } from '../../types/IndexTypes';
import { MqttStatus } from '../../services/MqttService';

@Component
export struct ControlDeviceCard {
  @ObjectLink device: ControlDevice;
  @Link mqttStatus: MqttStatus;
  
  // 回调函数
  onToggle: (deviceId: number, isOn: boolean) => Promise<void> = async (deviceId: number, isOn: boolean): Promise<void> => {};
  onEditName: (device: ControlDevice) => void = (device: ControlDevice): void => {};

  build() {
    Column() {
      Row() {
        // 设备图标和信息
        Row() {
          Image(this.device.isActive ? $rawfile('开启.png') : $rawfile('关闭.png'))
            .width(32)
            .height(32)
            .fillColor(this.device.isActive ? '#00B75E' : '#8A8F99')
            .margin({ right: 12 })

          Column() {
            // 设备名称（带编辑按钮）
            Row() {
              Text(this.device.name)
                .fontSize(18)
                .fontWeight(FontWeight.Bold)
                .fontColor('#333333')

              // 编辑昵称按钮
              Text('✏️')
                .fontSize(14)
                .margin({ left: 8 })
                .onClick(() => {
                  this.onEditName(this.device);
                })
            }
            .margin({ bottom: 4 })

            // 设备区域
            Text(this.device.area)
              .fontSize(14)
              .fontColor('#666666')
              .margin({ bottom: 4 })

            // 主题名称
            Text(`主题: ${this.device.topic}`)
              .fontSize(12)
              .fontColor('#999999')
          }
          .alignItems(HorizontalAlign.Start)
        }
        .layoutWeight(1)

        // 开关控制
        Toggle({ type: ToggleType.Switch, isOn: this.device.isActive })
          .selectedColor('#00B75E')
          .switchPointColor('#FFFFFF')
          .enabled(this.mqttStatus === MqttStatus.CONNECTED && this.device.isOnline)
          .onChange((isOn: boolean) => {
            this.onToggle(this.device.id, isOn);
          })
      }
      .width('100%')
      .margin({ bottom: 12 })

      // 设备状态信息
      Row() {
        // 运行状态
        Row() {
          Text('状态:')
            .fontSize(13)
            .fontColor('#8A8F99')

          Text(this.device.isActive ? '运行中' : '已停止')
            .fontSize(13)
            .fontWeight(FontWeight.Medium)
            .fontColor(this.device.isActive ? '#00B75E' : '#8A8F99')
            .margin({ left: 4 })
        }

        Blank()

        // 在线状态标签
        Row() {
          Text(this.device.isOnline ? '●' : '●')
            .fontSize(11)
            .fontColor(this.device.isOnline ? '#00B75E' : '#CCCCCC')
          Text(this.device.isOnline ? '在线' : '离线')
            .fontSize(12)
            .fontColor(this.device.isOnline ? '#00B75E' : '#8A8F99')
            .margin({ left: 3 })
        }
        .padding({ left: 10, right: 10, top: 4, bottom: 4 })
        .backgroundColor(this.device.isOnline ? '#F0FDF5' : '#F1F1F1')
        .borderRadius(12)
      }
      .width('100%')
    }
    .width('100%')
    .padding(14)
    .backgroundColor('#FFFFFF')
    .borderRadius(12)
    .shadow({ radius: 2, color: '#08000000', offsetY: 1 })
  }
}

