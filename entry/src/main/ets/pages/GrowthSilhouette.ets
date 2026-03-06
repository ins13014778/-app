import { router } from '@kit.ArkUI';
import { webview } from '@kit.ArkWeb';
import { AppColors } from '../constants/AppConstants';

@Entry
@Component
struct GrowthSilhouette {
  @State url: string = 'http://bbs.zy991.cn/';
  private webController: webview.WebviewController = new webview.WebviewController();

  build() {
    Column() {
      Row() {
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

        Text('生长剪影')
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

      Web({ src: this.url, controller: this.webController })
        .width('100%')
        .layoutWeight(1)
        .backgroundColor(AppColors.APP_BG)
    }
    .width('100%')
    .height('100%')
    .backgroundColor(AppColors.APP_BG)
  }
}

