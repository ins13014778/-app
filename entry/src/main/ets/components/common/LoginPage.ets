import { promptAction } from '@kit.ArkUI';
/**
 * 登录页面组件
 */
@Component
export struct LoginPage {
  @Link username: string;
  @Link password: string;
  @Link errorMessage: string;
  @Link successMessage: string;
  @Link isLoading: boolean;
  
  // 回调函数
  handleLogin: () => void = (): void => {};
  handleGuestMode: () => void = (): void => {};
  switchToRegister: () => void = (): void => {};

  build() {
    Column() {
      // 顶部标题区域
      Column() {
        // Logo图标
        Image($rawfile('登录.png'))
          .width(80)
          .height(80)
          .fillColor('#007AFF')
          .margin({ bottom: 16 })

        Text('欢迎回来')
          .fontSize(32)
          .fontWeight(FontWeight.Bold)
          .fontColor('#1a1a1a')
          .margin({ bottom: 8 })

        Text('登录智慧农业管理系统')
          .fontSize(16)
          .fontColor('#666666')
          .margin({ bottom: 48 })
      }
      .width('100%')
      .alignItems(HorizontalAlign.Center)
      .margin({ top: 80, bottom: 32 })

      // 登录表单区域
      Column() {
        // 用户名输入框
        Column() {
          Text('用户名')
            .fontSize(14)
            .fontColor('#666666')
            .fontWeight(FontWeight.Medium)
            .alignSelf(ItemAlign.Start)
            .margin({ bottom: 8, left: 4 })

          TextInput({ placeholder: '请输入用户名', text: this.username })
            .width('100%')
            .height(52)
            .backgroundColor('#FFFFFF')
            .borderRadius(26)
            .padding({ left: 20, right: 20 })
            .fontSize(16)
            .placeholderColor('#BBBBBB')
            .border({ width: 1, color: '#E5E5E5' })
            .shadow({
              radius: 8,
              color: 'rgba(0, 0, 0, 0.04)',
              offsetX: 0,
              offsetY: 2
            })
            .onChange((value: string) => {
              this.username = value;
            })
        }
        .width('100%')
        .margin({ bottom: 20 })

        // 密码输入框
        Column() {
          Text('密码')
            .fontSize(14)
            .fontColor('#666666')
            .fontWeight(FontWeight.Medium)
            .alignSelf(ItemAlign.Start)
            .margin({ bottom: 8, left: 4 })

          TextInput({ placeholder: '请输入密码', text: this.password })
            .width('100%')
            .height(52)
            .backgroundColor('#FFFFFF')
            .borderRadius(26)
            .padding({ left: 20, right: 20 })
            .fontSize(16)
            .placeholderColor('#BBBBBB')
            .type(InputType.Password)
            .border({ width: 1, color: '#E5E5E5' })
            .shadow({
              radius: 8,
              color: 'rgba(0, 0, 0, 0.04)',
              offsetX: 0,
              offsetY: 2
            })
            .onChange((value: string) => {
              this.password = value;
            })
        }
        .width('100%')
        .margin({ bottom: 32 })

        // 错误信息显示
        if (this.errorMessage) {
          Row() {
            Text('⚠️')
              .fontSize(16)
              .margin({ right: 6 })
            Text(this.errorMessage)
              .fontSize(14)
              .fontColor('#FF4444')
          }
          .width('100%')
          .padding(12)
          .backgroundColor('#FFF5F5')
          .borderRadius(12)
          .margin({ bottom: 20 })
        }

        // 成功信息显示
        if (this.successMessage) {
          Row() {
            Text('✓')
              .fontSize(16)
              .fontColor('#00AA00')
              .margin({ right: 6 })
            Text(this.successMessage)
              .fontSize(14)
              .fontColor('#00AA00')
          }
          .width('100%')
          .padding(12)
          .backgroundColor('#F0FFF4')
          .borderRadius(12)
          .margin({ bottom: 20 })
        }

        // 登录按钮
        Stack() {
          if (!this.isLoading) {
            Column()
              .width('100%')
              .height(56)
              .borderRadius(28)
              .linearGradient({
                angle: 135,
                colors: [['#4facfe', 0.0], ['#00f2fe', 1.0]]
              })
              .shadow({
                radius: 16,
                color: 'rgba(79, 172, 254, 0.4)',
                offsetX: 0,
                offsetY: 8
              })
          } else {
            Column()
              .width('100%')
              .height(56)
              .borderRadius(28)
              .backgroundColor('#CCCCCC')
          }
          
          Button({ type: ButtonType.Normal }) {
            Row() {
              if (!this.isLoading) {
                Image($rawfile('登录.png'))
                  .width(22)
                  .height(22)
                  .fillColor('#FFFFFF')
                  .margin({ right: 8 })
              }
              Text(this.isLoading ? '登录中...' : '立即登录')
                .fontSize(17)
                .fontColor('#FFFFFF')
                .fontWeight(FontWeight.Medium)
            }
            .justifyContent(FlexAlign.Center)
          }
          .width('100%')
          .height(56)
          .backgroundColor('transparent')
          .borderRadius(28)
          .enabled(!this.isLoading)
          .onClick(() => {
            this.handleLogin();
          })
        }
        .margin({ bottom: 16 })

        

        // 注册链接
        Row() {
          Text('还没有账号？')
            .fontSize(15)
            .fontColor('#999999')
            .margin({ right: 4 })

          Text('立即注册')
            .fontSize(15)
            .fontColor('#4facfe')
            .fontWeight(FontWeight.Medium)
            .onClick(() => {
              promptAction.showToast({ message: '请联系管理员分发账号权限，谢谢' });
            })
        }
        .justifyContent(FlexAlign.Center)
        .padding(12)
      }
      .width('100%')
      .padding({ left: 32, right: 32 })
    }
    .width('100%')
    .height('100%')
    .linearGradient({
      angle: 180,
      colors: [['#FFFFFF', 0.0], ['#F8FCFF', 0.5], ['#EBF4FF', 1.0]]
    })
    .justifyContent(FlexAlign.Start)
  }
}

