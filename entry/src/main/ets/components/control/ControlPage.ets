/**
 * 控制页面组件 - 设备控制中心
 */
import { ControlDevice } from '../../types/IndexTypes';
import { MqttStatus } from '../../services/MqttService';
import { SensorData } from './SensorDataCard';
import { AppColors } from '../../constants/AppConstants';

@Component
export struct ControlPage {
  @Link controlDevices: ControlDevice[];
  @Link mqttStatus: MqttStatus;
  @Link mqttStatusText: string;
  @Link bemfaUID: string;
  @Link onlineDeviceCount: number;
  @Link activeDeviceCount: number;
  @Link sensorDataList: SensorData[];
  
  // 回调函数
  getMqttStatusIcon: () => string = (): string => '⚪';
  getMqttStatusColor: () => string = (): string => '#999999';
  getMaskedUID: () => string = (): string => '未配置';
  toggleAllDevicesMQTT: (isActive: boolean) => Promise<void> = async (isActive: boolean): Promise<void> => {};
  refreshDeviceOnlineStatus: () => void = (): void => {};
  syncDevicesFromBemfa: () => void = (): void => {};
  refreshSensorData: () => void = (): void => {};
  onToggleDevice: (deviceId: number, isOn: boolean) => Promise<void> = async (deviceId: number, isOn: boolean): Promise<void> => {};
  onEditDeviceName: (device: ControlDevice) => void = (device: ControlDevice): void => {};

  // 获取当前时间
  private getCurrentTime(): string {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  build() {
    Scroll() {
      Column() {
        // 顶部大卡片
        Column() {
          // 温室标题行
          Row() {
            Text('智慧农业小屋')
              .fontSize(20)
              .fontWeight(FontWeight.Bold)
              .fontColor('#111111')

            Blank()

            // 在线状态
            Row() {
              Text('●')
                .fontSize(12)
                .fontColor(this.mqttStatus === MqttStatus.CONNECTED ? AppColors.PRIMARY_COLOR : '#666666')
                .margin({ right: 4 })
              Text(this.mqttStatus === MqttStatus.CONNECTED ? '在线' : '离线')
                .fontSize(13)
                .fontColor(this.mqttStatus === MqttStatus.CONNECTED ? AppColors.PRIMARY_COLOR : '#999999')
            }
            .padding({ left: 10, right: 10, top: 4, bottom: 4 })
            .backgroundColor(this.mqttStatus === MqttStatus.CONNECTED ? 'rgba(52, 199, 89, 0.12)' : '#E5E5EA')
            .borderRadius(12)
            .border({ width: 1, color: this.mqttStatus === MqttStatus.CONNECTED ? 'rgba(52, 199, 89, 0.28)' : 'transparent' })

            // 时间
            Text(this.getCurrentTime())
              .fontSize(13)
              .fontColor('#B0BEC5') // 浅灰
              .margin({ left: 12 })

            // 展开按钮
            Text('∧')
              .fontSize(16)
              .fontColor(AppColors.PRIMARY_COLOR)
              .margin({ left: 8 })
          }
          .width('100%')
          .margin({ bottom: 16 })
        }
        .width('100%')
        .padding(16)
        .backgroundColor('#FFFFFF')
        .borderRadius(16)
        .shadow({
          radius: 12,
          color: 'rgba(0, 0, 0, 0.06)',
          offsetX: 0,
          offsetY: 3
        })
        .margin({ top: 16, bottom: 16 })

        // 设备控制按钮 - 优化为GridRow布局
        if (this.controlDevices.length > 0) {
          Column() {
            Text('设备控制')
              .fontSize(16)
              .fontWeight(FontWeight.Bold)
              .fontColor(AppColors.PRIMARY_COLOR)
              .width('100%')
              .margin({ bottom: 12 })

            GridRow({ columns: 4, gutter: 12 }) {
              ForEach(this.controlDevices, (device: ControlDevice, index: number) => {
                GridCol() {
                  this.DeviceControlButton(device)
                }
              })
            }
            .width('100%')
          }
          .width('100%')
          .padding(16)
          .backgroundColor('#FFFFFF')
          .borderRadius(16)
          .shadow({
            radius: 8,
            color: 'rgba(0, 0, 0, 0.06)',
            offsetX: 0,
            offsetY: 2
          })
          .margin({ bottom: 16 })
        }

        // 传感器数据网格（2列布局）
        if (this.sensorDataList.length > 0) {
          Column() {
            Text('环境监测')
              .fontSize(16)
              .fontWeight(FontWeight.Bold)
              .fontColor(AppColors.PRIMARY_COLOR)
              .width('100%')
              .margin({ bottom: 12 })

            GridRow({ columns: 2, gutter: 12 }) {
              ForEach(this.sensorDataList, (sensorData: SensorData) => {
                GridCol() {
                  this.SensorDataCard(sensorData)
                }
              })
            }
          }
          .width('100%')
          .padding(16)
          .backgroundColor('#FFFFFF')
          .borderRadius(16)
          .shadow({
            radius: 8,
            color: 'rgba(0, 0, 0, 0.06)',
            offsetX: 0,
            offsetY: 2
          })
          .margin({ bottom: 16 })
        }

        // 底部空状态
        if (this.controlDevices.length === 0) {
          Column() {
            Text('📱')
              .fontSize(64)
              .margin({ bottom: 16 })

            Text('暂无设备')
              .fontSize(18)
              .fontColor('#666666')
              .margin({ bottom: 8 })

            Text('系统正在从巴法云同步设备...')
              .fontSize(14)
              .fontColor('#999999')
              .margin({ bottom: 24 })

            Button('手动同步')
              .fontSize(16)
              .fontColor('#FFFFFF')
              .backgroundColor(AppColors.PRIMARY_COLOR)
              .borderRadius(8)
              .height(44)
              .padding({ left: 32, right: 32 })
              .onClick(() => {
                this.syncDevicesFromBemfa();
              })
          }
          .width('90%')
          .padding({ top: 40, bottom: 40 })
          .justifyContent(FlexAlign.Center)
        }
      }
      .width('100%')
      .padding({ left: 16, right: 16, top: 0, bottom: 20 })
    }
    .scrollable(ScrollDirection.Vertical)
    .scrollBar(BarState.Auto)
    .edgeEffect(EdgeEffect.Spring)
    .width('100%')
    .height('100%')
    .backgroundColor(AppColors.APP_BG)
  }

  /**
   * 根据设备主题获取对应的图标
   */
  private getDeviceIcon(topic: string): string {
    const iconMap: Record<string, string> = {
      'auto': '智能灌溉.png',           // 自动水泵
      'buzzerctrl': '蜂鸣器.png',       // 蜂鸣
      'choushui': '抽水.png',           // 抽水
      'hum': '土壤湿度.png',            // 湿度传感器
      'lcd1602': 'LCD屏幕.png',         // LCD屏幕
      'ledctrl': 'LED灯.png',           // LED灯
      'light': '光照传感器.png',        // 光照传感器
      'pump': '操作-手动.png',          // 手动水泵
      'soil': '土壤温度.png',           // 土壤温度
      'tem': '温度传感器.png',          // 温度传感器
      'water': '水深.png'               // 水深
    };
    
    return iconMap[topic] || '控制.png';  // 默认图标
  }

  /**
   * 设备控制按钮
   */
  @Builder
  DeviceControlButton(device: ControlDevice) {
      Column() {
        // 圆形按钮
        Column() {
          // 显示设备对应的图标
          Image($rawfile(this.getDeviceIcon(device.topic)))
            .width(36)
            .height(36)
            .fillColor(device.isActive ? '#FFFFFF' : '#8E8E93')
            .animation({
              duration: 200,
              curve: Curve.EaseInOut
            })
        }
        .width(64)
        .height(64)
        .backgroundColor(device.isActive ? '#34C759' : '#F2F2F7')
        .borderRadius(32)
        .justifyContent(FlexAlign.Center)
        .border({
          width: device.isActive ? 0 : 2,
          color: device.isActive ? 'transparent' : '#D1D1D6'
        })
        .shadow({
          radius: device.isActive ? 12 : 4,
          color: device.isActive ? 'rgba(52, 199, 89, 0.45)' : 'rgba(0, 0, 0, 0.06)',
          offsetX: 0,
          offsetY: 2
        })
      .animation({
        duration: 300,
        curve: Curve.EaseInOut
      })
      .onClick(async () => {
        console.info(`[ControlPage] 点击设备: ${device.name}`);
        
        // 立即更新UI状态（乐观更新）
        const targetState = !device.isActive;
        
        // 调用控制命令
        try {
          await this.onToggleDevice(device.id, targetState);
        } catch (error) {
          console.error(`[ControlPage] ❌ 控制失败:`, error);
        }
      })

      // 设备名称
      Text(device.name)
        .fontSize(13)
        .fontColor('#111111')
        .fontWeight(FontWeight.Medium)
        .margin({ top: 8 })
        .maxLines(1)
        .textOverflow({ overflow: TextOverflow.Ellipsis })
      
      // 状态标签
      Text(device.isActive ? '运行中' : '已关闭')
        .fontSize(10)
        .fontColor(device.isActive ? '#34C759' : '#8E8E93')
        .margin({ top: 2 })
    }
    .width('100%')
  }

  /**
   * 传感器数据卡片
   */
  @Builder
  SensorDataCard(sensorData: SensorData) {
    Column() {
      // 标题
      Text(sensorData.name)
        .fontSize(14)
        .fontColor('#B0BEC5') // 浅灰
        .width('100%')
        .margin({ bottom: 12 })

      // 数值和图标
      Row() {
        Column() {
          Row({ space: 4 }) {
            Text(sensorData.value)
              .fontSize(24)
              .fontWeight(FontWeight.Bold)
              .fontColor(this.getSensorColor(sensorData.topic))

            Text(sensorData.unit)
              .fontSize(13)
              .fontColor('#B0BEC5') // 浅灰
              .margin({ top: 8 })
          }

          // 更新时间
          if (sensorData.lastUpdateTime) {
            Text(sensorData.lastUpdateTime)
              .fontSize(10)
              .fontColor('#666666') // 深灰
              .margin({ top: 4 })
          }
        }
        .alignItems(HorizontalAlign.Start)
        .layoutWeight(1)

        // 图标
        Image(this.getSensorIcon(sensorData.topic))
          .width(40)
          .height(40)
          .fillColor('#666666') // 灰色图标
      }
      .width('100%')
    }
    .width('100%')
    .padding(14)
    .backgroundColor('#F5F5F7')
    .borderRadius(12)
    .border({
      width: 1,
      color: '#E0E0E0'
    })
  }

  /**
   * 获取传感器颜色
   */
  private getSensorColor(topic: string): string {
    const colorMap: Record<string, string> = {
      'tem': '#FF4081', // 荧光粉
      'temp': '#FF4081', // 荧光粉
      'hum': AppColors.PRIMARY_COLOR,
      'light': '#FFAB40', // 荧光橙
      'co2': '#B0BEC5',  // 浅灰
      'pm25': '#B0BEC5'  // 浅灰
    };
    return colorMap[topic] || '#666666';
  }

  /**
   * 获取传感器图标
   */
  private getSensorIcon(topic: string): Resource {
    const iconMap: Record<string, Resource> = {
      'tem': $rawfile('环境温度.png'),
      'temp': $rawfile('环境温度.png'),
      'hum': $rawfile('土壤湿度.png'),
      'light': $rawfile('光照强度-copy.png')
    };
    return iconMap[topic] || $rawfile('数据分析.png');
  }
}
