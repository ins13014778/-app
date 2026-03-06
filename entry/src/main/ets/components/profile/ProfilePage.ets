/**
 * 用户页面组件 - 个人中心
 */
import { router } from '@kit.ArkUI';
import { UserProfile, ProfileMenuItem } from '../../types/IndexTypes';
import { AppColors } from '../../constants/AppConstants';

@Component
export struct ProfilePage {
  @Link userMode: string;
  @Link userProfile: UserProfile;
  @Link menuItems: ProfileMenuItem[];
  
  // 回调函数
  getMenuItemsForCurrentMode: () => ProfileMenuItem[] = (): ProfileMenuItem[] => [];
  handleMenuItemClick: (itemId: string) => void = (itemId: string): void => {};
  switchToLogin: () => void = (): void => {};

  build() {
    Column() {
      // 用户信息头部
      Column() {
        if (this.userMode === 'guest') {
          // 游客模式显示
          this.GuestHeader()
        } else {
          // 已登录用户显示
          this.UserHeader()
        }
      }
      .width('100%')
      .backgroundColor('#FFFFFF')
      .borderRadius(12)
      .margin({ top: 16, bottom: 16 })
      .shadow({ radius: 8, color: 'rgba(0,0,0,0.05)', offsetY: 2 })

      // 快捷操作按钮（仅登录用户可见）
      if (this.userMode === 'logged_in') {
        this.QuickActions()
      }

      // 功能菜单列表
      Column() {
        List() {
          ForEach(this.getMenuItemsForCurrentMode(), (item: ProfileMenuItem, index: number) => {
            ListItem() {
              this.MenuItemCard(item)
            }
            .margin({ bottom: index < this.getMenuItemsForCurrentMode().length - 1 ? 1 : 0 })
          })
        }
        .width('100%')
        .height('auto')
        .divider({ strokeWidth: 1, color: '#F0F0F0' })
      }
      .width('100%')
      .backgroundColor('#FFFFFF')
      .borderRadius(12)
      .margin({ bottom: 16 })
      .shadow({ radius: 8, color: 'rgba(0,0,0,0.05)', offsetY: 2 })
    }
    .width('100%')
    .height('100%')
    .padding(16)
    .backgroundColor(AppColors.APP_BG)
  }

  // 游客头部
  @Builder
  GuestHeader() {
    Column() {
      Image($rawfile('农民头像.png'))
      .width(80)
      .height(80)
      .borderRadius(40)
      .margin({ bottom: 12 })
      .border({ width: 2, color: AppColors.PRIMARY_COLOR })

      Text('游客用户')
        .fontSize(20)
        .fontWeight(FontWeight.Bold)
        .fontColor('#333333')
        .margin({ bottom: 4 })

      Text('登录后享受更多个性化服务')
        .fontSize(14)
        .fontColor('#666666')
        .margin({ bottom: 16 })

      // 登录按钮 - 优化为主题色
      Button('立即登录')
        .width(120)
        .height(36)
        .backgroundColor(AppColors.PRIMARY_COLOR)
        .borderRadius(18)
        .fontSize(14)
        .fontColor('#FFFFFF')
        .onClick(() => {
          this.switchToLogin();
        })
        .shadow({ radius: 4, color: 'rgba(52, 199, 89, 0.3)', offsetY: 2 })
    }
    .alignItems(HorizontalAlign.Center)
    .padding({ top: 32, bottom: 24 })
  }

  // 用户头部
  @Builder
  UserHeader() {
    Column() {
      Image($rawfile('农民头像.png'))
        .width(80)
        .height(80)
        .borderRadius(40)
        .margin({ bottom: 12 })
        .border({ width: 2, color: AppColors.PRIMARY_COLOR })

      // 用户名和管理员标识
      Row() {
        Text(this.userProfile.username)
          .fontSize(20)
          .fontWeight(FontWeight.Bold)
          .fontColor('#333333')

        // 管理员标识徽章
        if (this.userProfile.is_admin === 1) {
          Text('👑 管理员')
            .fontSize(14)
            .fontColor('#FFFFFF')
            .backgroundColor('#FF6B35')
            .padding({ left: 8, right: 8, top: 4, bottom: 4 })
            .borderRadius(12)
            .margin({ left: 8 })
        }
      }
      .margin({ bottom: 4 })

      Text(this.userProfile.bio)
        .fontSize(14)
        .fontColor('#666666')
        .margin({ bottom: 8 })

      Text(this.userProfile.phone)
        .fontSize(14)
        .fontColor('#999999')
    }
    .alignItems(HorizontalAlign.Center)
    .padding({ top: 32, bottom: 24 })
  }

  // 快捷操作
  @Builder
  QuickActions() {
    Row() {
      // 编辑资料按钮
      Button() {
        Column() {
          Image($rawfile('编辑资料.png'))
            .width(24)
            .height(24)
            .fillColor(AppColors.PRIMARY_COLOR)
            .margin({ bottom: 4 })
          Text('编辑资料')
            .fontSize(14)
            .fontColor('#333333')
        }
      }
      .layoutWeight(1)
      .height(80)
      .backgroundColor('#FFFFFF')
      .borderRadius(12)
      .onClick(() => {
        console.info('[Profile] 跳转到编辑资料页面');
        router.pushUrl({
          url: 'pages/EditProfile',
          params: {
            username: this.userProfile.username,
            email: this.userProfile.email,
            phone: this.userProfile.phone || '',
            bio: this.userProfile.bio,
            avatar: this.userProfile.avatar
          }
        }).catch((err: Error) => {
          console.error('[Profile] 跳转编辑资料失败:', JSON.stringify(err));
        });
      })

      Blank().width(12)

      // 修改密码按钮
      Button() {
        Column() {
          Image($rawfile('修改密码.png'))
            .width(24)
            .height(24)
            .fillColor(AppColors.PRIMARY_COLOR)
            .margin({ bottom: 4 })
          Text('修改密码')
            .fontSize(14)
            .fontColor('#333333')
        }
      }
      .layoutWeight(1)
      .height(80)
      .backgroundColor('#FFFFFF')
      .borderRadius(12)
      .onClick(() => {
        console.info('[Profile] 跳转到修改密码页面');
        router.pushUrl({
          url: 'pages/ChangePassword'
        }).catch((err: Error) => {
          console.error('[Profile] 跳转修改密码失败:', JSON.stringify(err));
        });
      })
    }
    .width('100%')
    .margin({ bottom: 16 })
  }

  // 菜单项卡片
  @Builder
  MenuItemCard(item: ProfileMenuItem) {
    Row() {
      // 判断是否为图片路径
      if (item.icon.endsWith('.png')) {
        Image($rawfile(item.icon))
          .width(20)
          .height(20)
          .fillColor('#666666')
          .margin({ right: 12 })
      } else {
        Text(item.icon)
          .fontSize(20)
          .margin({ right: 12 })
      }

      Text(item.title)
        .fontSize(16)
        .fontColor('#333333')
        .layoutWeight(1)

      if (item.hasArrow) {
        Image($rawfile('右箭头.png'))
          .width(16)
          .height(16)
          .fillColor('#CCCCCC')
      }
    }
    .width('100%')
    .padding({ left: 16, right: 16, top: 16, bottom: 16 })
    .backgroundColor('#FFFFFF')
    .onClick(() => {
      this.handleMenuItemClick(item.id);
    })
  }
}
