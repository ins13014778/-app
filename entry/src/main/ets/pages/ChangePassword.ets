import { router } from '@kit.ArkUI';
import { apiService } from '../services/ApiService';
import { common } from '@kit.AbilityKit';

@Entry
@Component
struct ChangePassword {
  @State oldPassword: string = '';
  @State newPassword: string = '';
  @State confirmPassword: string = '';
  @State isLoading: boolean = false;
  @State errorMessage: string = '';
  @State successMessage: string = '';
  @State showOldPassword: boolean = false;
  @State showNewPassword: boolean = false;
  @State showConfirmPassword: boolean = false;

  aboutToAppear() {
    // 设置API服务的context
    apiService.setContext(this.getUIContext().getHostContext() as common.UIAbilityContext);
  }

  build() {
    Column() {
      // 顶部导航栏
      Row() {
        // 返回按钮
        Row() {
          Text('←')
            .fontSize(24)
            .fontColor('#333333')
            .fontWeight(FontWeight.Bold)
        }
        .width(44)
        .height(44)
        .justifyContent(FlexAlign.Center)
        .onClick(() => {
          router.back();
        })

        Text('修改密码')
          .fontSize(18)
          .fontWeight(FontWeight.Bold)
          .fontColor('#333333')
          .margin({ left: 8 })

        Blank()
      }
      .width('100%')
      .height(56)
      .padding({ left: 12, right: 16 })
      .backgroundColor('#FFFFFF')
      .shadow({ radius: 2, color: '#10000000', offsetY: 1 })

      Scroll() {
        Column() {
          // 安全提示
          Column() {
            Row() {
              Text('🔒')
                .fontSize(24)
                .margin({ right: 12 })

              Column() {
                Text('安全提示')
                  .fontSize(16)
                  .fontWeight(FontWeight.Bold)
                  .fontColor('#333333')
                  .margin({ bottom: 4 })

                Text('为了您的账号安全，建议定期修改密码')
                  .fontSize(12)
                  .fontColor('#666666')
              }
              .alignItems(HorizontalAlign.Start)
            }
            .width('100%')
          }
          .width('100%')
          .padding(16)
          .backgroundColor('#FFF3E0')
          .borderRadius(12)
          .margin({ top: 16, bottom: 24, left: 16, right: 16 })

          // 旧密码输入
          Column() {
            Text('旧密码')
              .fontSize(14)
              .fontColor('#666666')
              .alignSelf(ItemAlign.Start)
              .margin({ bottom: 8 })

            Row() {
              TextInput({ placeholder: '请输入旧密码', text: this.oldPassword })
                .layoutWeight(1)
                .height(48)
                .backgroundColor('#FFFFFF')
                .border({ width: 0 })
                .type(this.showOldPassword ? InputType.Normal : InputType.Password)
                .onChange((value: string) => {
                  this.oldPassword = value;
                })

              Text(this.showOldPassword ? '👁️' : '👁️‍🗨️')
                .fontSize(20)
                .padding(8)
                .onClick(() => {
                  this.showOldPassword = !this.showOldPassword;
                })
            }
            .width('100%')
            .borderRadius(8)
            .border({ width: 1, color: '#E0E0E0' })
            .backgroundColor('#FFFFFF')
          }
          .width('100%')
          .padding({ left: 16, right: 16 })
          .margin({ bottom: 16 })

          // 新密码输入
          Column() {
            Text('新密码')
              .fontSize(14)
              .fontColor('#666666')
              .alignSelf(ItemAlign.Start)
              .margin({ bottom: 8 })

            Row() {
              TextInput({ placeholder: '请输入新密码（6-20位）', text: this.newPassword })
                .layoutWeight(1)
                .height(48)
                .backgroundColor('#FFFFFF')
                .border({ width: 0 })
                .type(this.showNewPassword ? InputType.Normal : InputType.Password)
                .maxLength(20)
                .onChange((value: string) => {
                  this.newPassword = value;
                })

              Text(this.showNewPassword ? '👁️' : '👁️‍🗨️')
                .fontSize(20)
                .padding(8)
                .onClick(() => {
                  this.showNewPassword = !this.showNewPassword;
                })
            }
            .width('100%')
            .borderRadius(8)
            .border({ width: 1, color: '#E0E0E0' })
            .backgroundColor('#FFFFFF')

            // 密码强度提示
            if (this.newPassword.length > 0) {
              Row() {
                Text('密码强度：')
                  .fontSize(12)
                  .fontColor('#666666')

                Text(this.getPasswordStrength())
                  .fontSize(12)
                  .fontColor(this.getPasswordStrengthColor())
                  .fontWeight(FontWeight.Bold)
              }
              .margin({ top: 8 })
            }
          }
          .width('100%')
          .padding({ left: 16, right: 16 })
          .margin({ bottom: 16 })

          // 确认密码输入
          Column() {
            Text('确认密码')
              .fontSize(14)
              .fontColor('#666666')
              .alignSelf(ItemAlign.Start)
              .margin({ bottom: 8 })

            Row() {
              TextInput({ placeholder: '请再次输入新密码', text: this.confirmPassword })
                .layoutWeight(1)
                .height(48)
                .backgroundColor('#FFFFFF')
                .border({ width: 0 })
                .type(this.showConfirmPassword ? InputType.Normal : InputType.Password)
                .maxLength(20)
                .onChange((value: string) => {
                  this.confirmPassword = value;
                })

              Text(this.showConfirmPassword ? '👁️' : '👁️‍🗨️')
                .fontSize(20)
                .padding(8)
                .onClick(() => {
                  this.showConfirmPassword = !this.showConfirmPassword;
                })
            }
            .width('100%')
            .borderRadius(8)
            .border({ width: 1, color: '#E0E0E0' })
            .backgroundColor('#FFFFFF')
          }
          .width('100%')
          .padding({ left: 16, right: 16 })
          .margin({ bottom: 24 })

          // 密码要求说明
          Column() {
            Text('密码要求：')
              .fontSize(14)
              .fontColor('#666666')
              .fontWeight(FontWeight.Bold)
              .margin({ bottom: 8 })

            Text('• 长度为6-20个字符')
              .fontSize(12)
              .fontColor('#999999')
              .margin({ bottom: 4 })

            Text('• 建议包含字母和数字')
              .fontSize(12)
              .fontColor('#999999')
              .margin({ bottom: 4 })

            Text('• 不要使用过于简单的密码')
              .fontSize(12)
              .fontColor('#999999')
          }
          .width('100%')
          .padding(16)
          .backgroundColor('#F5F5F5')
          .borderRadius(12)
          .margin({ left: 16, right: 16, bottom: 24 })
          .alignItems(HorizontalAlign.Start)

          // 错误信息
          if (this.errorMessage) {
            Text(this.errorMessage)
              .fontSize(14)
              .fontColor('#FF4444')
              .width('100%')
              .textAlign(TextAlign.Center)
              .padding(12)
              .margin({ bottom: 8 })
          }

          // 成功信息
          if (this.successMessage) {
            Text(this.successMessage)
              .fontSize(14)
              .fontColor('#4CAF50')
              .width('100%')
              .textAlign(TextAlign.Center)
              .padding(12)
              .margin({ bottom: 8 })
          }

          // 提交按钮
          Button(this.isLoading ? '提交中...' : '确认修改')
            .width('90%')
            .height(48)
            .fontSize(16)
            .fontColor('#FFFFFF')
            .backgroundColor(this.isLoading ? '#CCCCCC' : '#2196F3')
            .borderRadius(24)
            .enabled(!this.isLoading)
            .margin({ bottom: 32 })
            .onClick(() => {
              this.handleChangePassword();
            })
        }
        .width('100%')
      }
      .layoutWeight(1)
      .backgroundColor('#F5F5F5')
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F5F5')
  }

  // 处理修改密码
  private async handleChangePassword() {
    // 清除之前的消息
    this.errorMessage = '';
    this.successMessage = '';

    // 验证输入
    if (!this.oldPassword) {
      this.errorMessage = '请输入旧密码';
      return;
    }

    if (!this.newPassword) {
      this.errorMessage = '请输入新密码';
      return;
    }

    if (this.newPassword.length < 6) {
      this.errorMessage = '新密码长度不能少于6位';
      return;
    }

    if (this.newPassword.length > 20) {
      this.errorMessage = '新密码长度不能超过20位';
      return;
    }

    if (this.newPassword === this.oldPassword) {
      this.errorMessage = '新密码不能与旧密码相同';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = '两次输入的新密码不一致';
      return;
    }

    this.isLoading = true;

    try {
      console.info('[ChangePassword] 开始修改密码');
      console.info('[ChangePassword] 当前Token:', apiService.getToken() || '无Token');
      
      const response = await apiService.changePassword({
        old_password: this.oldPassword,
        new_password: this.newPassword
      });
      
      console.info('[ChangePassword] API响应:', JSON.stringify(response));

      if (response.success) {
        console.info('[ChangePassword] ✅ 密码修改成功');
        this.successMessage = '密码修改成功！即将返回...';
        
        // 延迟2秒后返回
        setTimeout(() => {
          router.back();
        }, 2000);
      } else {
        console.error('[ChangePassword] ❌ 密码修改失败:', response.message);
        this.errorMessage = response.message || '密码修改失败，请检查旧密码是否正确';
      }
    } catch (error) {
      console.error('[ChangePassword] ❌ 修改异常:', JSON.stringify(error));
      this.errorMessage = '网络连接失败，请检查网络设置';
    } finally {
      this.isLoading = false;
    }
  }

  // 获取密码强度
  private getPasswordStrength(): string {
    const password = this.newPassword;
    
    if (password.length === 0) return '';
    if (password.length < 6) return '弱';
    if (password.length < 10) return '中';
    
    // 检查是否包含字母和数字
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    
    if (hasLetter && hasNumber) {
      return '强';
    }
    
    return '中';
  }

  // 获取密码强度颜色
  private getPasswordStrengthColor(): string {
    const strength = this.getPasswordStrength();
    
    if (strength === '弱') return '#FF4444';
    if (strength === '中') return '#FF9800';
    if (strength === '强') return '#4CAF50';
    
    return '#999999';
  }
}

