import { router } from '@kit.ArkUI';
import { apiService } from '../services/ApiService';
import { common } from '@kit.AbilityKit';

@Entry
@Component
struct EditProfile {
  @State username: string = '';
  @State email: string = '';
  @State phone: string = '';
  @State bio: string = '';
  @State selectedAvatar: string = '👤';
  @State isLoading: boolean = false;
  @State errorMessage: string = '';
  @State successMessage: string = '';
  @State showAvatarPicker: boolean = false;

  // 预设头像Emoji列表
  private avatarEmojis: string[] = [
    '👤', '👨‍🌾', '👩‍🌾', '🧑‍🌾', '👨‍💼', '👩‍💼',
    '🌾', '🚜', '🌱', '🌿', '🍀', '🌻',
    '🌸', '🌺', '🌼', '🌷', '🪴', '🌳'
  ];

  aboutToAppear() {
    // 设置API服务的context
    apiService.setContext(this.getUIContext().getHostContext() as common.UIAbilityContext);
    // 从路由参数获取用户信息
    const params = router.getParams() as Record<string, string>;
    if (params) {
      this.username = params['username'] || '';
      this.email = params['email'] || '';
      this.phone = params['phone'] || '';
      this.bio = params['bio'] || '';
      this.selectedAvatar = params['avatar'] || '👤';
    }
  }

  build() {
    Column() {
      // 顶部导航栏
      Row() {
        // 取消按钮
        Text('取消')
          .fontSize(16)
          .fontColor('#666666')
          .onClick(() => {
            router.back();
          })

        Blank()

        Text('编辑资料')
          .fontSize(18)
          .fontWeight(FontWeight.Bold)
          .fontColor('#333333')

        Blank()

        // 保存按钮
        Text('保存')
          .fontSize(16)
          .fontColor('#2196F3')
          .fontWeight(FontWeight.Medium)
          .onClick(() => {
            this.saveProfile();
          })
      }
      .width('100%')
      .height(56)
      .padding({ left: 16, right: 16 })
      .backgroundColor('#FFFFFF')
      .shadow({ radius: 2, color: '#10000000', offsetY: 1 })

      Scroll() {
        Column() {
          // 头像选择区域
          Column() {
            Text('头像')
              .fontSize(14)
              .fontColor('#666666')
              .alignSelf(ItemAlign.Start)
              .margin({ bottom: 12 })

            // 当前头像显示
            Row() {
              Text(this.selectedAvatar)
                .fontSize(48)
                .margin({ right: 16 })

              Column() {
                Text('点击更换头像')
                  .fontSize(14)
                  .fontColor('#333333')
                Text('从下方选择您喜欢的头像')
                  .fontSize(12)
                  .fontColor('#999999')
                  .margin({ top: 4 })
              }
              .alignItems(HorizontalAlign.Start)

              Blank()
            }
            .width('100%')
            .padding(16)
            .backgroundColor('#F5F5F5')
            .borderRadius(12)
            .onClick(() => {
              this.showAvatarPicker = !this.showAvatarPicker;
            })

            // 头像选择器
            if (this.showAvatarPicker) {
              Grid() {
                ForEach(this.avatarEmojis, (emoji: string) => {
                  GridItem() {
                    Text(emoji)
                      .fontSize(32)
                      .padding(8)
                      .backgroundColor(this.selectedAvatar === emoji ? '#E3F2FD' : '#FFFFFF')
                      .borderRadius(8)
                      .border({
                        width: 2,
                        color: this.selectedAvatar === emoji ? '#2196F3' : '#F0F0F0'
                      })
                  }
                  .onClick(() => {
                    this.selectedAvatar = emoji;
                    this.showAvatarPicker = false;
                  })
                })
              }
              .columnsTemplate('1fr 1fr 1fr 1fr 1fr 1fr')
              .rowsGap(12)
              .columnsGap(12)
              .width('100%')
              .padding(16)
              .backgroundColor('#FAFAFA')
              .borderRadius(12)
              .margin({ top: 12 })
            }
          }
          .width('100%')
          .padding(16)
          .margin({ bottom: 8 })

          // 用户名（只读）
          Column() {
            Text('用户名')
              .fontSize(14)
              .fontColor('#666666')
              .alignSelf(ItemAlign.Start)
              .margin({ bottom: 8 })

            TextInput({ text: this.username })
              .width('100%')
              .height(48)
              .backgroundColor('#F5F5F5')
              .borderRadius(8)
              .enabled(false)  // 用户名不可修改

            Text('用户名不可修改')
              .fontSize(12)
              .fontColor('#999999')
              .margin({ top: 4 })
          }
          .width('100%')
          .padding(16)
          .margin({ bottom: 8 })

          // 邮箱（只读）
          Column() {
            Text('邮箱')
              .fontSize(14)
              .fontColor('#666666')
              .alignSelf(ItemAlign.Start)
              .margin({ bottom: 8 })

            TextInput({ text: this.email })
              .width('100%')
              .height(48)
              .backgroundColor('#F5F5F5')
              .borderRadius(8)
              .enabled(false)  // 邮箱不可修改

            Text('邮箱不可修改')
              .fontSize(12)
              .fontColor('#999999')
              .margin({ top: 4 })
          }
          .width('100%')
          .padding(16)
          .margin({ bottom: 8 })

          // 手机号
          Column() {
            Text('手机号')
              .fontSize(14)
              .fontColor('#666666')
              .alignSelf(ItemAlign.Start)
              .margin({ bottom: 8 })

            TextInput({ placeholder: '请输入手机号', text: this.phone })
              .width('100%')
              .height(48)
              .backgroundColor('#FFFFFF')
              .borderRadius(8)
              .border({ width: 1, color: '#E0E0E0' })
              .type(InputType.PhoneNumber)
              .maxLength(11)
              .onChange((value: string) => {
                this.phone = value;
              })
          }
          .width('100%')
          .padding(16)
          .margin({ bottom: 8 })

          // 个人简介
          Column() {
            Text('个人简介')
              .fontSize(14)
              .fontColor('#666666')
              .alignSelf(ItemAlign.Start)
              .margin({ bottom: 8 })

            TextArea({ placeholder: '请输入个人简介', text: this.bio })
              .width('100%')
              .height(120)
              .backgroundColor('#FFFFFF')
              .borderRadius(8)
              .border({ width: 1, color: '#E0E0E0' })
              .maxLength(200)
              .onChange((value: string) => {
                this.bio = value;
              })

            Text(`${this.bio.length}/200`)
              .fontSize(12)
              .fontColor('#999999')
              .alignSelf(ItemAlign.End)
              .margin({ top: 4 })
          }
          .width('100%')
          .padding(16)
          .margin({ bottom: 8 })

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

          // 保存按钮
          Button(this.isLoading ? '保存中...' : '保存修改')
            .width('90%')
            .height(48)
            .fontSize(16)
            .fontColor('#FFFFFF')
            .backgroundColor(this.isLoading ? '#CCCCCC' : '#4CAF50')
            .borderRadius(24)
            .enabled(!this.isLoading)
            .margin({ top: 16, bottom: 32 })
            .onClick(() => {
              this.saveProfile();
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

  // 保存用户资料
  private async saveProfile() {
    // 清除之前的消息
    this.errorMessage = '';
    this.successMessage = '';

    // 验证手机号
    if (this.phone && !this.validatePhone(this.phone)) {
      this.errorMessage = '手机号格式不正确';
      return;
    }

    this.isLoading = true;

    try {
      console.info('[EditProfile] 开始保存用户资料');
      
      const response = await apiService.updateProfile({
        phone: this.phone,
        avatar: this.selectedAvatar,
        bio: this.bio
      });

      if (response.success) {
        console.info('[EditProfile] ✅ 资料保存成功');
        this.successMessage = '保存成功！';
        
        // 延迟1秒后返回
        setTimeout(() => {
          router.back();
        }, 1000);
      } else {
        console.error('[EditProfile] ❌ 资料保存失败:', response.message);
        this.errorMessage = response.message || '保存失败，请重试';
      }
    } catch (error) {
      console.error('[EditProfile] ❌ 保存异常:', JSON.stringify(error));
      this.errorMessage = '网络连接失败，请检查网络设置';
    } finally {
      this.isLoading = false;
    }
  }

  // 验证手机号格式
  private validatePhone(phone: string): boolean {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
  }
}

