let storage2017413441 = new LocalStorage()

@Entry(storage2017413441)
@Component
export struct AdviceFromWeatherCard1 {
  @LocalStorageProp('category2') category2: string = '钓鱼'
  @LocalStorageProp('textSubTitleG1') textSubTitleG1: string = '晴  空气良好'
  @LocalStorageProp('category3') category3: string = '运动'
  @LocalStorageProp('category1') category1: string = '穿衣'
  @LocalStorageProp('categoryImg3') categoryImg3: Resource = $r('app.media.ic_weather_movement')
  @LocalStorageProp('categoryImg1') categoryImg1: Resource = $r('app.media.ic_weather_dressing')
  @LocalStorageProp('locationIcon') locationIcon: Resource = $r('app.media.icon_location')
  @LocalStorageProp('weatherIcon_current') weatherIcon_current: Resource = $r('app.media.ic_weather_sunny')
  @LocalStorageProp('categoryImg2') categoryImg2: Resource = $r('app.media.ic_weather_fishing')
  @LocalStorageProp('backgroundImg') backgroundImg: Resource = $r('app.media.backgroundImg1')
  @LocalStorageProp('cityName') cityName: string = '北京'
  @LocalStorageProp('recommend1') recommend1: string = '厚外套'
  @LocalStorageProp('recommend2') recommend2: string = '适宜'
  @LocalStorageProp('recommend3') recommend3: string = '适宜'
  @LocalStorageProp('digitTitleFText1') digitTitleFText1: string = '10'
  @LocalStorageProp('textSubTitleG2') textSubTitleG2: string = '3月20日|二月十六'
  @LocalStorageProp('digitTitleFText2') digitTitleFText2: string = '℃'
  ClickToHome = () : void => {
    postCardAction(this, {
      "action": "router",
      // Configuring the UIAbility name for jumping.
      'abilityName': 'EntryAbility',
      // Configuring the parameters to be transferred.
      "params": {
        'targetPage': 'page1'
      }
    });  
}  
  build() {
    Column() {
      Row() {
        Column() {
          Row() {
            Text(this.cityName)
              .fontColor(Color.White)
              .fontSize('12')
              .fontWeight(FontWeight.Medium)
              .textOverflow({ overflow: TextOverflow.Ellipsis })
              .lineHeight('14')
              .maxLines(1)
            Image(this.locationIcon)
              .width('11')
              .height('11')
          }
          .alignItems(VerticalAlign.Center)
          Row() {
            Text(this.digitTitleFText1)
              .fontColor(Color.White)
              .fontSize('40')
              .fontWeight(FontWeight.Bold)
              .textOverflow({ overflow: TextOverflow.Ellipsis })
              .lineHeight('40')
              .maxLines(1)
            Text(this.digitTitleFText2)
              .fontColor(Color.White)
              .fontSize('12')
              .textOverflow({ overflow: TextOverflow.Ellipsis })
              .maxLines(1)
          }
          .alignItems(VerticalAlign.Top)
        }
        .alignItems(HorizontalAlign.Start)
        Column() {
          Image(this.weatherIcon_current)
            .width('20')
            .height('20')
          Text(this.textSubTitleG1)
            .fontColor(Color.White)
            .fontSize('12')
            .fontWeight(FontWeight.Regular)
            .textOverflow({ overflow: TextOverflow.Ellipsis })
            .lineHeight('16')
            .maxLines(1)
          Text(this.textSubTitleG2)
            .fontColor(Color.White)
            .fontSize('12')
            .fontWeight(FontWeight.Regular)
            .textOverflow({ overflow: TextOverflow.Ellipsis })
            .lineHeight('16')
            .maxLines(1)
        }
        .alignItems(HorizontalAlign.End)
      }
      .width('100%')
      .alignItems(VerticalAlign.Top)
      .justifyContent(FlexAlign.SpaceBetween)
      Row() {
        Row() {
          Image(this.categoryImg1)
            .width('20')
            .height('20')
          Column() {
            Text(this.recommend1)
              .fontColor(Color.White)
              .fontSize('12')
              .textOverflow({ overflow: TextOverflow.Ellipsis })
              .maxLines(1)
            Text(this.category1)
              .opacity(0.6)
              .fontColor(Color.White)
              .fontSize('10')
              .textOverflow({ overflow: TextOverflow.Ellipsis })
              .maxLines(1)
          }
          .width('65%')
          .alignItems(HorizontalAlign.Start)
          .justifyContent(FlexAlign.SpaceBetween)
        }
        .width('25%')
        .alignItems(VerticalAlign.Center)
        .justifyContent(FlexAlign.SpaceBetween)
        Row() {
          Image(this.categoryImg2)
            .width('20')
            .height('20')
          Column() {
            Text(this.recommend2)
              .fontColor(Color.White)
              .fontSize('12')
              .textOverflow({ overflow: TextOverflow.Ellipsis })
              .maxLines(1)
            Text(this.category2)
              .opacity(0.6)
              .fontColor(Color.White)
              .fontSize('10')
              .textOverflow({ overflow: TextOverflow.Ellipsis })
              .maxLines(1)
          }
          .width('65%')
          .alignItems(HorizontalAlign.Start)
          .justifyContent(FlexAlign.SpaceBetween)
        }
        .width('25%')
        .alignItems(VerticalAlign.Center)
        .justifyContent(FlexAlign.SpaceBetween)
        Row() {
          Image(this.categoryImg3)
            .width('20')
            .height('20')
          Column() {
            Text(this.recommend3)
              .fontColor(Color.White)
              .fontSize('12')
              .textOverflow({ overflow: TextOverflow.Ellipsis })
              .maxLines(1)
            Text(this.category3)
              .opacity(0.6)
              .fontColor(Color.White)
              .fontSize('10')
              .textOverflow({ overflow: TextOverflow.Ellipsis })
              .maxLines(1)
          }
          .width('65%')
          .alignItems(HorizontalAlign.Start)
          .justifyContent(FlexAlign.SpaceBetween)
        }
        .width('25%')
        .alignItems(VerticalAlign.Center)
        .justifyContent(FlexAlign.SpaceBetween)
      }
      .margin({ bottom: '6' })
      .width('100%')
      .alignItems(VerticalAlign.Bottom)
      .justifyContent(FlexAlign.SpaceBetween)
    }
    .backgroundImage(this.backgroundImg)
    .backgroundImageSize({ width: '100%', height: '100%' })
    .padding('12')
    .width('100%')
    .height('100%')
    .onClick(this.ClickToHome)
    .justifyContent(FlexAlign.SpaceBetween)
  }
}