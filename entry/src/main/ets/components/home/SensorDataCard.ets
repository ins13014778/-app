/**
 * 传感器数据卡片组件 - 首页版本
 * 
 * 功能说明：
 * 1. 显示温度、湿度、光照三个传感器数据
 * 2. 支持数据刷新动画效果
 * 3. 显示最后更新时间
 * 4. 数据无效时显示"--"
 * 
 * 技术特点：
 * - 使用@Link实现双向数据绑定
 * - 使用@Prop接收父组件传递的属性
 * - 使用@State管理组件内部状态
 * - 自定义@Builder构建数据卡片
 * 
 * 使用场景：在首页展示传感器实时数据
 */

/**
 * 传感器数据卡片组件
 * 
 * @Component 装饰器表示这是一个UI组件
 * @Link 装饰器实现父子组件间的双向数据绑定
 * @Prop 装饰器接收父组件传递的属性
 * @State 装饰器管理组件内部状态
 */
@Component
export struct SensorDataCard {
  // ========== 传感器数据状态 ==========
  // 这些状态变量通过@Link与父组件双向绑定，实时更新传感器数据
  @Link temperature: number;      // 温度数据（摄氏度）
  @Link soilHumidity: number;    // 土壤湿度数据（百分比）
  @Link lightIntensity: number;  // 光照强度数据（勒克斯）
  
  // ========== 组件属性 ==========
  // 通过@Prop从父组件接收的属性
  @Prop lastUpdateTime: string;  // 最后更新时间字符串
  
  // ========== 内部状态 ==========
  // 组件内部管理的状态变量
  @State isRefreshing: boolean = false;  // 是否正在刷新数据，用于显示刷新动画

  /**
   * 获取显示值
   * 注意：0是有效值（例如温度可以是0°C）
   */
  private getDisplayValue(value: number): string {
    // 只有明确的无效值才显示 --
    if (value === undefined || value === null) {
      return '--';
    }
    return `${value}`;
  }

  // 监听数据变化，显示刷新动画
  aboutToAppear() {
    // 监听数据变化
  }

  build() {
    Column() {
      // 标题
      Row() {
        Image($rawfile('数据分析.png'))
          .width(20)
          .height(20)
          .fillColor('#00E5FF') // 青色主题色
        
        Text('传感器数据')
          .fontSize(16)
          .fontColor('#FFFFFF')
          .fontWeight(FontWeight.Bold)
          .margin({ left: 8 })

        Blank()

        // 最后更新时间
        Row() {
          if (this.isRefreshing) {
            Text('🔄')
              .fontSize(12)
              .margin({ right: 4 })
              .rotate({ angle: 360 })
              .animation({
                duration: 1000,
                iterations: -1,
                curve: Curve.Linear
              })
          }
          
          if (this.lastUpdateTime && this.lastUpdateTime !== '--:--') {
            Text(this.lastUpdateTime)
              .fontSize(11)
              .fontColor('#AAAAAA')
          } else {
            Text('等待数据...')
              .fontSize(11)
              .fontColor('#FF6B6B')
          }
        }
      }
      .width('100%')
      .margin({ bottom: 16 })

      // 三个传感器卡片
      Row() {
        // 温度
        Column() {
          this.DataCard(
            $rawfile('环境温度.png'),
            this.getDisplayValue(this.temperature),
            '°C',
            '温度',
            '#FF6B6B'
          )
        }
        .layoutWeight(1)

        Blank().width(12)

        // 湿度
        Column() {
          this.DataCard(
            $rawfile('土壤湿度.png'),
            this.getDisplayValue(this.soilHumidity),
            '%',
            '湿度',
            '#4ECDC4'
          )
        }
        .layoutWeight(1)

        Blank().width(12)

        // 光照
        Column() {
          this.DataCard(
            $rawfile('光照强度-copy.png'),
            this.getDisplayValue(this.lightIntensity),
            'Lx',
            '光照',
            '#FFB84D'
          )
        }
        .layoutWeight(1)
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
    .border({
      width: 1,
      color: 'rgba(0, 0, 0, 0.04)'
    })
  }

  @Builder
  DataCard(icon: Resource, value: string, unit: string, label: string, color: string) {
    Column() {
      // 图标
      Image(icon)
        .width(36)
        .height(36)
        .fillColor(color)
        .margin({ bottom: 12 })

      // 数值 - 添加动画效果
      Row({ space: 2 }) {
        Text(value)
          .fontSize(26)
          .fontWeight(FontWeight.Bold)
          .fontColor(color)
          .animation({
            duration: 300,
            curve: Curve.EaseInOut
          })

        Text(unit)
          .fontSize(13)
          .fontColor('#AAAAAA')
          .margin({ top: 8 })
      }

      // 标签
      Text(label)
        .fontSize(13)
        .fontColor('#AAAAAA')
        .margin({ top: 6 })
    }
    .width('100%')
    .height(130)
    .backgroundColor('#F5F5F7')
    .borderRadius(12)
    .justifyContent(FlexAlign.Center)
    .border({
      width: 1,
      color: 'rgba(0, 0, 0, 0.03)'
    })
  }
}

