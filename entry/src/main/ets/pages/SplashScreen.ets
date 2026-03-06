import { router } from '@kit.ArkUI';

@Entry
@Component
struct SplashScreen {
  aboutToAppear() {
    // 2秒后自动跳转到主页面
    setTimeout(() => {
      router.replaceUrl({
        url: 'pages/Index'
      });
    }, 2000);
  }

  build() {
    Column() {
      // 显示开屏图
      Image($rawfile('开屏页.jpg'))
        .width('100%')
        .height('100%')
        .objectFit(ImageFit.Cover)
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#FFFFFF')
  }
}

