/**
 * 注册页面组件
 */
@Component
export struct RegisterPage {
  @Link username: string;
  @Link password: string;
  @Link confirmPassword: string;
  @Link email: string;
  @Link phone: string;
  @Link errorMessage: string;
  @Link successMessage: string;
  @Link isLoading: boolean;
  
  // 回调函数
  handleRegister: () => void = (): void => {};
  switchToLogin: () => void = (): void => {};

  build() {
    Column() {
      // 顶部返回按钮
      Row() {
        Button() {
          Row() {
            Text('←')
              .fontSize(20)
              .fontColor('#4facfe')
              .margin({ right: 4 })
            Text('返回登录')
              .fontSize(16)
              .fontColor('#4facfe')
              .fontWeight(FontWeight.Medium)
          }
        }
        .backgroundColor(Color.Transparent)
        .onClick(() => {
          this.switchToLogin();
        })

        Blank()
      }
      .width('100%')
      .padding({ left: 20, right: 20, top: 24 })

      // 顶部标题区域
      Column() {
        Image($rawfile('注册.png'))
          .width(60)
          .height(60)
          .fillColor('#007AFF')
          .margin({ bottom: 12 })

        Text('创建账户')
          .fontSize(30)
          .fontWeight(FontWeight.Bold)
          .fontColor('#1a1a1a')
          .margin({ bottom: 6 })

        Text('加入智慧农业管理系统')
          .fontSize(15)
          .fontColor('#666666')
          .margin({ bottom: 36 })
      }
      .width('100%')
      .alignItems(HorizontalAlign.Center)
      .margin({ top: 32, bottom: 24 })

      // 注册表单区域
      Scroll() {
        Column() {
          // 用户名输入框
          this.InputField('用户名', '请输入用户名', InputType.Normal, this.username, (value: string) => {
            this.username = value;
          })

          // 手机号输入框
          this.InputField('手机号', '请输入手机号', InputType.PhoneNumber, this.phone, (value: string) => {
            this.phone = value;
          })

          // 邮箱输入框
          this.InputField('邮箱', '请输入邮箱地址', InputType.Email, this.email, (value: string) => {
            this.email = value;
          })

          // 密码输入框
          this.InputField('密码', '请输入密码（至少6位）', InputType.Password, this.password, (value: string) => {
            this.password = value;
          })

          // 确认密码输入框
          this.InputField('确认密码', '请再次输入密码', InputType.Password, this.confirmPassword, (value: string) => {
            this.confirmPassword = value;
          })

          // 错误信息显示
          if (this.errorMessage) {
            Text(this.errorMessage)
              .fontSize(14)
              .fontColor('#FF4444')
              .margin({ bottom: 20 })
          }

          // 成功信息显示
          if (this.successMessage) {
            Column() {
              Text(this.successMessage)
                .fontSize(14)
                .fontColor('#00AA00')
                .margin({ bottom: 12 })

              // 返回登录按钮
              Button('返回登录')
                .width('100%')
                .height(48)
                .backgroundColor('#00AA00')
                .borderRadius(8)
                .fontSize(16)
                .fontColor('#FFFFFF')
                .onClick(() => {
                  this.switchToLogin();
                })
            }
            .width('100%')
            .margin({ bottom: 20 })
          }

          // 注册按钮
          if (!this.successMessage) {
            Stack() {
              if (!this.isLoading) {
                Column()
                  .width('100%')
                  .height(54)
                  .borderRadius(27)
                  .linearGradient({
                    angle: 135,
                    colors: [['#a8e063', 0.0], ['#56ab2f', 1.0]]
                  })
                  .shadow({
                    radius: 16,
                    color: 'rgba(86, 171, 47, 0.4)',
                    offsetX: 0,
                    offsetY: 8
                  })
              } else {
                Column()
                  .width('100%')
                  .height(54)
                  .borderRadius(27)
                  .backgroundColor('#CCCCCC')
              }
              
              Button({ type: ButtonType.Normal }) {
                Row() {
                  if (!this.isLoading) {
                    Image($rawfile('注册.png'))
                      .width(22)
                      .height(22)
                      .fillColor('#FFFFFF')
                      .margin({ right: 8 })
                  }
                  Text(this.isLoading ? '注册中...' : '立即注册')
                    .fontSize(17)
                    .fontColor('#FFFFFF')
                    .fontWeight(FontWeight.Medium)
                }
                .justifyContent(FlexAlign.Center)
              }
              .width('100%')
              .height(54)
              .backgroundColor('transparent')
              .borderRadius(27)
              .enabled(!this.isLoading)
              .onClick(() => {
                this.handleRegister();
              })
            }
            .margin({ bottom: 20 })
          }

          // 登录链接
          Row() {
            Text('已有账号？')
              .fontSize(15)
              .fontColor('#999999')
              .margin({ right: 4 })

            Text('立即登录')
              .fontSize(15)
              .fontColor('#56ab2f')
              .fontWeight(FontWeight.Medium)
              .onClick(() => {
                this.switchToLogin();
              })
          }
          .justifyContent(FlexAlign.Center)
          .padding(12)
        }
        .width('100%')
        .padding({ left: 32, right: 32 })
      }
      .layoutWeight(1)
    }
    .width('100%')
    .height('100%')
    .linearGradient({
      angle: 180,
      colors: [['#FFFFFF', 0.0], ['#F8FFF5', 0.5], ['#EBF5E8', 1.0]]
    })
    .justifyContent(FlexAlign.Start)
  }

  // 输入框组件
  @Builder
  InputField(label: string, placeholder: string, type: InputType, value: string, onChange: (value: string) => void) {
    Column() {
      Text(label)
        .fontSize(14)
        .fontColor('#666666')
        .fontWeight(FontWeight.Medium)
        .alignSelf(ItemAlign.Start)
        .margin({ bottom: 8, left: 4 })

      TextInput({ placeholder: placeholder, text: value })
        .width('100%')
        .height(50)
        .backgroundColor('#FFFFFF')
        .borderRadius(25)
        .padding({ left: 20, right: 20 })
        .fontSize(15)
        .placeholderColor('#BBBBBB')
        .type(type)
        .border({ width: 1, color: '#E5E5E5' })
        .shadow({
          radius: 8,
          color: 'rgba(0, 0, 0, 0.04)',
          offsetX: 0,
          offsetY: 2
        })
        .onChange(onChange)
    }
    .width('100%')
    .margin({ bottom: 16 })
  }
}

