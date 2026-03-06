/**
 * 编辑设备名称对话框组件
 * 
 * 功能说明：
 * 1. 提供设备名称修改的弹窗界面
 * 2. 显示设备主题和类型信息
 * 3. 支持用户输入新的设备昵称
 * 4. 提供取消和确认操作按钮
 * 
 * 使用场景：在设备控制页面点击编辑按钮时弹出
 * 
 * 技术特点：
 * - 使用@Link装饰器实现父子组件双向数据绑定
 * - 模态对话框设计，包含遮罩层和对话框内容
 * - 响应式布局，适配不同屏幕尺寸
 */
import { ControlDevice } from '../../types/IndexTypes';

/**
 * 编辑设备名称对话框组件
 * 
 * @Component 装饰器表示这是一个UI组件
 * @Link 装饰器实现父子组件间的双向数据绑定
 */
@Component
export struct EditDeviceNameDialog {
  // ========== 状态变量 ==========
  // 这些变量通过@Link与父组件双向绑定，控制对话框的显示状态和内容
  @Link showDialog: boolean;                    // 控制对话框显示/隐藏
  @Link editingDevice: ControlDevice | null;   // 当前正在编辑的设备信息
  @Link newDeviceName: string;                 // 用户输入的新设备名称
  
  // ========== 回调函数 ==========
  // 用户点击确认按钮时的回调函数，由父组件传入
  onConfirm: () => void = (): void => {};

  /**
   * 构建对话框UI界面
   * 
   * 界面结构说明：
   * 1. 遮罩层 - 半透明黑色背景，点击可关闭对话框
   * 2. 对话框内容区域 - 包含标题、设备信息、输入框和按钮组
   * 3. 响应式布局 - 适配不同屏幕尺寸
   */
  build() {
    // 只有当showDialog为true时才显示对话框
    if (this.showDialog) {
      Column() {
        // ========== 遮罩层 ==========
        // 半透明黑色背景，覆盖整个屏幕
        // 点击遮罩层可以关闭对话框
        Column()
          .width('100%')
          .height('100%')
          .backgroundColor('#80000000')  // 80%透明度的黑色
          .onClick(() => {
            this.showDialog = false;  // 点击遮罩层关闭对话框
          })

        // ========== 对话框内容区域 ==========
        // 白色背景的对话框，包含所有交互元素
        Column() {
          // 对话框标题
          Text('修改设备昵称')
            .fontSize(18)
            .fontWeight(FontWeight.Bold)
            .margin({ bottom: 20 })

          // ========== 设备信息展示 ==========
          // 显示当前设备的主题和类型信息
          if (this.editingDevice) {
            Column() {
              // 设备主题信息行
              Row() {
                Text('主题:')
                  .fontSize(14)
                  .fontColor('#666666')
                  .width(60)
                Text(this.editingDevice.topic)
                  .fontSize(14)
                  .fontColor('#333333')
              }
              .width('100%')
              .margin({ bottom: 8 })

              // 设备类型信息行
              Row() {
                Text('类型:')
                  .fontSize(14)
                  .fontColor('#666666')
                  .width(60)
                Text(this.editingDevice.deviceType)
                  .fontSize(14)
                  .fontColor('#333333')
              }
              .width('100%')
              .margin({ bottom: 16 })
            }
            .alignItems(HorizontalAlign.Start)  // 左对齐
          }

          // ========== 输入框区域 ==========
          // 用户输入新设备名称的区域
          Column() {
            Text('新昵称')
              .fontSize(14)
              .fontColor('#666666')
              .alignSelf(ItemAlign.Start)
              .margin({ bottom: 8 })

            // 文本输入框
            TextInput({ text: this.newDeviceName })
              .width('100%')
              .height(44)
              .fontSize(16)
              .borderRadius(8)
              .backgroundColor('#F5F5F5')
              .onChange((value: string) => {
                this.newDeviceName = value;  // 实时更新输入值
              })
          }
          .margin({ bottom: 24 })

          // ========== 按钮组 ==========
          // 取消和确认操作按钮
          Row() {
            // 取消按钮
            Button('取消')
              .fontSize(16)
              .fontColor('#666666')
              .backgroundColor('#F5F5F5')
              .borderRadius(8)
              .layoutWeight(1)  // 平均分配宽度
              .height(44)
              .onClick(() => {
                this.showDialog = false;  // 关闭对话框，不保存修改
              })

            // 确认按钮
            Button('确定')
              .fontSize(16)
              .fontColor('#FFFFFF')
              .backgroundColor('#007DFF')  // 蓝色主题色
              .borderRadius(8)
              .layoutWeight(1)  // 平均分配宽度
              .height(44)
              .margin({ left: 12 })
              .onClick(() => {
                this.onConfirm();  // 执行确认回调函数
              })
          }
          .width('100%')
        }
        .width('85%')  // 占屏幕宽度的85%
        .padding(24)   // 内边距24
        .backgroundColor('#FFFFFF')  // 白色背景
        .borderRadius(16)  // 圆角边框
        .position({ x: '7.5%', y: '30%' })  // 居中偏上位置
      }
      .width('100%')
      .height('100%')
      .position({ x: 0, y: 0 })
      .zIndex(1000)  // 确保在最上层显示
    }
  }
}

