/**
 * 首页组件 - 智慧农场主页
 * 
 * 功能说明：
 * 1. 天气信息展示 - 集成易客天气API显示天气数据
 * 2. 数据统计 - 显示设备统计、报警统计、任务统计
 * 3. 华为云IoT设备数据 - 获取并显示华为云平台的传感器数据
 * 4. 传感器监测 - 实时显示温度、湿度、光照等传感器数据
 * 
 * 技术特点：
 * - 支持折叠展开的数据统计区域
 * - 集成华为云IoT平台API获取设备影子数据
 * - 传感器数据异常预警（颜色提示）
 * - 响应式布局适配不同屏幕
 * 
 * 数据源：
 * - 本地传感器数据（通过父组件传入）
 * - 华为云IoT平台设备影子数据
 * - 天气API数据（在WeatherCard子组件中）
 */
import { ControlDevice } from '../../types/IndexTypes';
import { promptAction } from '@kit.ArkUI';
import { WeatherCard } from './WeatherCard';
import { SensorDataCard } from './SensorDataCard';
import { http } from '@kit.NetworkKit';
import fs from '@ohos.file.fs';
import util from '@ohos.util';

import { AppConfig } from '../../config/AppConfig';
import { AppColors } from '../../constants/AppConstants';

interface IAMDomain { name: string }
interface IAMUser { name: string; password: string; domain: IAMDomain }
interface IAMPassword { user: IAMUser }
interface IAMIdentity { methods: string[]; password: IAMPassword }
interface IAMProject { id: string }
interface IAMScope { project: IAMProject }
interface IAMAuth { identity: IAMIdentity; scope: IAMScope }
interface IAMBody { auth: IAMAuth }

interface IotShadowProperties {
  temperature?: number;
  humidity?: number;
  illumination?: number;
  soil_moisture?: number;
  pump_status?: string;
  auto_mode?: boolean;
  buzzer_status?: string;
  heartbeat?: number;
}
interface IotShadowReported {
  properties?: IotShadowProperties;
  event_time?: string;
}
interface IotShadowService {
  service_id?: string;
  desired?: Object;
  reported?: IotShadowReported;
  version?: number;
}
interface IotShadowResponse {
  device_id?: string;
  shadow?: IotShadowService[];
}
interface IotErrorBody {
  error_code?: string;
  error_msg?: string;
}

interface ConfigFile {
  token?: string;
  XSubjectToken?: string;
  Authorization?: string;
  XSdkContentSha256?: string;
  XSecurityToken?: string;
  UserAgent?: string;
  Host?: string;
  InstanceId?: string;
  XLanguage?: string;
  XProjectId?: string;
  XSdkDate?: string;
}

interface HttpHeaders {
  'X-Auth-Token'?: string;
  'Content-Type': string;
  'Instance-Id'?: string;
  'Authorization'?: string;
  'X-Sdk-Content-Sha256'?: string;
  'X-Security-Token'?: string;
  'X-Language'?: string;
  'X-Project-Id'?: string;
  'X-Sdk-Date'?: string;
  'Host'?: string;
}

/**
 * 首页组件 - 智慧农场主页
 * 
 * 功能说明：
 * 1. 天气信息展示 - 集成易客天气API显示天气数据
 * 2. 数据统计 - 显示设备统计、报警统计、任务统计
 * 3. 华为云IoT设备数据 - 获取并显示华为云平台的传感器数据
 * 4. 传感器监测 - 实时显示温度、湿度、光照等传感器数据
 * 
 * 技术特点：
 * - 支持折叠展开的数据统计区域
 * - 集成华为云IoT平台API获取设备影子数据
 * - 传感器数据异常预警（颜色提示）
 * - 响应式布局适配不同屏幕
 * 
 * 数据源：
 * - 本地传感器数据（通过父组件传入）
 * - 华为云IoT平台设备影子数据
 * - 天气API数据（在WeatherCard子组件中）
 */
@Component
export struct HomePage {
  // ========== 父组件传入的参数 ==========
  // 这些参数通过@Link装饰器与父组件双向绑定，实现数据同步
  @Link soilHumidity: number;           // 土壤湿度（从传感器获取）
  @Link temperature: number;            // 环境温度（从传感器获取）
  @Link lightIntensity: number;          // 光照强度（从传感器获取）
  @Link date: string;                    // 当前日期
  @Link lastUpdateTime: string;          // 最后更新时间
  @Link todayMaxTemp: number;            // 今日最高温度
  @Link todayMinTemp: number;            // 今日最低温度
  @Link todayMaxHumidity: number;        // 今日最高湿度
  @Link todayMinHumidity: number;        // 今日最低湿度
  @Link controlDevices: ControlDevice[]; // 控制设备列表
  @Link activeDeviceCount: number;       // 活跃设备数量
  @Link onlineDeviceCount: number;       // 在线设备数量
  @Link mqttStatusText: string;          // MQTT连接状态文本
  
  // 回调函数（从父组件传入）
  getMqttStatusIcon: () => string = (): string => '⚪';      // 获取MQTT状态图标
  getMqttStatusColor: () => string = (): string => '#999999'; // 获取MQTT状态颜色
  refreshSensorData: () => Promise<void> = async (): Promise<void> => {}; // 刷新传感器数据

  // ========== 组件内部状态 ==========
  // 数据统计区域的折叠展开状态
  @State isDataStatExpanded: boolean = true;  // 数据统计是否展开（默认展开）

  // 华为云IoT设备数据（从华为云平台获取）
  @State iotTemperature: number = 0;        // 华为云IoT温度数据
  @State iotHumidity: number = 0;            // 华为云IoT湿度数据
  @State iotLight: number = 0;              // 华为云IoT光照数据
  @State iotSoilMoisture: number = 0;      // 华为云IoT土壤湿度数据
  @State iotLoading: boolean = false;        // IoT数据加载状态
  @State iotError: string = '';              // IoT数据错误信息
  @State iotDebug: string = '';              // IoT调试信息

  // 华为云API签名认证参数
  @State signAuthorization: string = '';
  @State signContentSha256: string = '';
  @State signSecurityToken: string = '';
  @State signLanguage: string = '';
  @State signProjectId: string = '';
  @State signSdkDate: string = '';
  @State signHost: string = '';
  @State signInstanceId: string = '';



/**
   * UI构建方法 - 构建首页界面
   * 使用Scroll布局，支持上下滚动
   * 主要包含4个模块：天气卡片、数据统计、华为云IoT数据、传感器监测
   */
  build() {
    Scroll() {
      Column() {
        // ========== 天气大卡片 ==========
        // 使用易客天气API获取天气数据
        Column() {
          WeatherCard()  // 天气卡片子组件
        }
        .width('100%')
        .margin({ top: 16, bottom: 16 })  // 上下外边距

        // ========== 数据统计模块 ==========
        // 可折叠的数据统计区域，显示设备、报警、任务统计
        Column() {
          // 标题行 - 包含标题和折叠/展开图标
          Row() {
            Text('数据统计')
              .fontSize(16)
              .fontWeight(FontWeight.Bold)
              .fontColor(AppColors.PRIMARY_COLOR)
            
            Blank()  // 空白占位，将图标推到右边
            
            // 折叠/展开图标：∨表示展开，∧表示折叠
            Text(this.isDataStatExpanded ? '∨' : '∧')
              .fontSize(16)
              .fontColor(AppColors.PRIMARY_COLOR)
          }
          .width('100%')
          .onClick(() => {
            // 点击标题行切换折叠状态
            this.isDataStatExpanded = !this.isDataStatExpanded;
          })

          // 统计内容（可折叠）
          if (this.isDataStatExpanded) {
            Column({ space: 12 }) {  // 子组件间距12
              // 第一行：设备统计
              Row() {
                this.StatItem('设备总数', `${this.controlDevices.length}`, AppColors.PRIMARY_COLOR)
                this.StatItem('在线设备', `${this.onlineDeviceCount}`, '#69F0AE') // 荧光绿
                this.StatItem('离线设备', `${this.controlDevices.length - this.onlineDeviceCount}`, '#FF4081') // 荧光粉
              }
              .width('100%')
              .justifyContent(FlexAlign.SpaceBetween)  // 子组件两端对齐

              // 第二行：报警统计
              Row() {
                this.StatItem('报警总数', '33', '#FFAB40') // 荧光橙
                this.StatItem('今日报警数', '10', '#69F0AE') // 荧光绿
                this.StatItem('未处理报警数', '23', '#FF4081') // 荧光粉
              }
              .width('100%')
              .justifyContent(FlexAlign.SpaceBetween)

              // 第三行：任务统计
              Row() {
                this.StatItem('任务总数', '652', '#B0BEC5') // 浅灰
                this.StatItem('今日任务数', '18', '#69F0AE') // 荧光绿
                this.StatItem('未完成数量', '102', '#FFAB40') // 荧光橙
              }
              .width('100%')
              .justifyContent(FlexAlign.SpaceBetween)
            }
            .width('100%')
            .margin({ top: 12 })
          }
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
        .margin({ bottom: 16 })

        // ========== 传感器监测区域 ==========
        // 本地传感器数据监测（带预警功能）
        Column() {
          // 标题行 - 带预警图标
          Row() {
            Text('⚠️')  // 预警图标
              .fontSize(16)
            
            Text('传感器监测')
              .fontSize(16)
              .fontColor(AppColors.PRIMARY_COLOR)
              .fontWeight(FontWeight.Bold)
              .margin({ left: 6 })
          }
          .alignSelf(ItemAlign.Start)  // 左对齐
          .margin({ bottom: 16 })

          // 传感器数据卡片（垂直排列）
          Column({ space: 12 }) {
            this.SensorWarningCard(
              $rawfile('环境温度.png'),  // 温度图标
              '温度',
              () => this.temperature,  // 温度值获取函数（本地传感器）
              '°C',  // 单位
              '#FF4081',  // 颜色（荧光粉）
              18,  // 最低阈值
              35,  // 最高阈值
              '温度正常'  // 正常状态文本
            )

            this.SensorWarningCard(
              $rawfile('土壤湿度.png'),  // 湿度图标
              '湿度',
              () => this.soilHumidity,  // 湿度值获取函数（本地传感器）
              '%',  // 单位
              AppColors.PRIMARY_COLOR,
              30,  // 最低阈值
              80,  // 最高阈值
              '湿度正常'  // 正常状态文本
            )

            this.SensorWarningCard(
              $rawfile('光照强度-copy.png'),  // 光照图标
              '光照',
              () => this.lightIntensity,  // 光照值获取函数（本地传感器）
              'Lx',  // 单位
              '#FFAB40',  // 颜色（荧光橙）
              300,  // 最低阈值
              2000,  // 最高阈值
              '光照正常'  // 正常状态文本
            )
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
        .margin({ bottom: 20 })
      }
      .width('100%')
      .padding({ left: 16, right: 16 })
    }
    .width('100%')
    .height('100%')
    .backgroundColor(AppColors.APP_BG)
    .edgeEffect(EdgeEffect.Spring)
  }

  async aboutToAppear() {
    const t = this.loadConfig();
    const tok1: string = t && t.token ? (t.token as string) : '';
    const tok2: string = t && t.XSubjectToken ? (t.XSubjectToken as string) : '';
    const tok: string = tok1.length > 0 ? tok1 : tok2;
    if (tok.length > 0 && t) {
      AppStorage.setOrCreate('token', tok);
      this.signAuthorization = t.Authorization ?? '';
      this.signContentSha256 = t.XSdkContentSha256 ?? '';
      this.signSecurityToken = t.XSecurityToken ?? '';
      this.signLanguage = t.XLanguage ?? '';
      this.signProjectId = t.XProjectId ?? '';
      this.signSdkDate = t.XSdkDate ?? '';
      this.signHost = t.Host ?? '';
      this.signInstanceId = t.InstanceId ?? '';
      this.fetchIotShadow();
    } else {
      this.getToken();
    }
  }

  private getHeaderToken(headers: Object | undefined): string {
    if (!headers) {
      return '';
    }
    const keys = Object.keys(headers as Object);
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      if (k && typeof k === 'string' && k.toLowerCase() === 'x-subject-token') {
        const v = Reflect.get(headers as Object, k) as Object | undefined;
        if (v && typeof v === 'string') {
          return v as string;
        }
      }
    }
    return '';
  }

  getToken() {
    const url = `${AppConfig.IAM_ENDPOINT}/v3/auth/tokens`;
    const body: IAMBody = {
      auth: {
        identity: {
          methods: ['password'],
          password: {
            user: {
              name: AppConfig.IAM_USER_NAME,
              password: AppConfig.IAM_PASSWORD,
              domain: { name: AppConfig.IAM_DOMAIN_NAME }
            }
          }
        },
        scope: {
          project: { id: AppConfig.IAM_PROJECT_ID }
        }
      }
    };
    let httpRequest: http.HttpRequest = http.createHttp();
    httpRequest.request(url, {
      method: http.RequestMethod.POST,
      header: { 'Content-Type': 'application/json' },
      connectTimeout: AppConfig.REQUEST_TIMEOUT,
      readTimeout: AppConfig.REQUEST_TIMEOUT,
      extraData: JSON.stringify(body)
    }).then((data) => {
      console.info('httpRequest login:' + JSON.stringify(data));
      if (data.responseCode === 201) {
        const h = (data as http.HttpResponse).header as Object | undefined;
        const token: string = this.getHeaderToken(h);
        if (token && token.length > 0) {
          AppStorage.setOrCreate('token', token);
          this.saveConfig(token);
          promptAction.showToast({ message: '获取成功' });
          this.fetchIotShadow();
        } else {
          promptAction.showToast({ message: '获取权限失败' });
        }
      } else {
        promptAction.showToast({ message: '获取权限失败' });
      }
    }).catch((err: Object) => {
      console.info('httpRequest err:' + JSON.stringify(err));
      promptAction.showToast({ message: '获取失败' });
    }).finally(() => {
      httpRequest.destroy();
    });
  }

  private saveConfig(token: string): void {
    const ctx = getContext(this);
    const p: string = ctx.filesDir + '/cofing.json';
    const content: string = '{' +
      '"token":"' + token + '",' +
      '"endpoint":"' + AppConfig.IAM_ENDPOINT + '",' +
      '"domain":"' + AppConfig.IAM_DOMAIN_NAME + '",' +
      '"user":"' + AppConfig.IAM_USER_NAME + '",' +
      '"region":"' + AppConfig.IAM_REGION_NAME + '",' +
      '"projectId":"' + AppConfig.IAM_PROJECT_ID + '",' +
      '"savedAt":"' + new Date().toISOString() + '"' +
    '}';
    try {
      const file = fs.openSync(p, fs.OpenMode.CREATE | fs.OpenMode.TRUNC | fs.OpenMode.WRITE_ONLY);
      const encoder = new util.TextEncoder();
      const bytes = encoder.encode(content);
      fs.writeSync(file.fd, bytes);
      fs.closeSync(file.fd);
    } catch (_) {}
  }

  private loadConfig(): ConfigFile | undefined {
    const ctx = getContext(this);
    const p: string = ctx.filesDir + '/cofing.json';
    try {
      const file = fs.openSync(p, fs.OpenMode.READ_ONLY);
      const buf = new ArrayBuffer(16384);
      const n = fs.readSync(file.fd, buf, { offset: 0 });
      fs.closeSync(file.fd);
      if (n > 0) {
        const dec = util.TextDecoder.create('utf-8');
        const s = dec.decode(new Uint8Array(buf.slice(0, n)));
        const j = JSON.parse(s) as Object;
        const cfg: ConfigFile = {
          token: Reflect.get(j, 'token') as string | undefined,
          XSubjectToken: Reflect.get(j, 'X-Subject-Token') as string | undefined,
          Authorization: Reflect.get(j, 'Authorization') as string | undefined,
          XSdkContentSha256: Reflect.get(j, 'X-Sdk-Content-Sha256') as string | undefined,
          XSecurityToken: Reflect.get(j, 'X-Security-Token') as string | undefined,
          UserAgent: Reflect.get(j, 'User-Agent') as string | undefined,
          Host: Reflect.get(j, 'Host') as string | undefined,
          InstanceId: Reflect.get(j, 'Instance-Id') as string | undefined,
          XLanguage: Reflect.get(j, 'X-Language') as string | undefined,
          XProjectId: Reflect.get(j, 'X-Project-Id') as string | undefined,
          XSdkDate: Reflect.get(j, 'X-Sdk-Date') as string | undefined,
        };
        return cfg;
      }
    } catch (_) {}
    return undefined;
  }

  /**
   * 获取设备影子数据
   */
  private fetchIotShadow(): void {
    const token = AppStorage.get('token') as string;
    if (!token) {
      this.iotDebug = 'Token 空';
      return;
    }
    /* ====== ① 选择域名：优先签名Host，其次配置Endpoint ====== */
    const projectId = (this.signProjectId.length > 0) ? this.signProjectId : AppConfig.IOTDA_PROJECT_ID;
    const deviceId  = AppConfig.IOTDA_DEBUG_DEVICE_ID;
    const base      = (this.signHost.length > 0) ? ('https://' + this.signHost) : AppConfig.IOTDA_ENDPOINT;
    const url       = `${base}/v5/iot/${projectId}/devices/${deviceId}/shadow`;

    this.iotLoading = true;
    this.iotError   = '';
    this.iotDebug    = '请求中...';

    const httpRequest = http.createHttp();
    const iidBase: string = '' + (this.signInstanceId.length > 0 ? this.signInstanceId : AppConfig.IOTDA_INSTANCE_ID);
    const iid: string = '' + iidBase;
    const useSigned: boolean = (this.signAuthorization.length > 0);
    const headers: HttpHeaders = useSigned
      ? {
          'Authorization': this.signAuthorization,
          'X-Sdk-Content-Sha256': (this.signContentSha256.length > 0) ? this.signContentSha256 : 'UNSIGNED-PAYLOAD',
          'X-Security-Token': this.signSecurityToken,
          'X-Language': (this.signLanguage.length > 0) ? this.signLanguage : 'zh-cn',
          'X-Project-Id': projectId,
          'X-Sdk-Date': (this.signSdkDate.length > 0) ? this.signSdkDate : '',
          'Instance-Id': iid,
          'Host': this.signHost,
          'Content-Type': 'application/json'
        }
      : (iid
          ? { 'X-Auth-Token': token, 'Content-Type': 'application/json', 'Instance-Id': iid }
          : { 'X-Auth-Token': token, 'Content-Type': 'application/json' });
    console.info('IoTDA GET url:' + url);
    console.info('IoTDA headers:' + JSON.stringify(headers));
    httpRequest.request(url, {
      method: http.RequestMethod.GET,
      header: headers,
      connectTimeout: 3000,
      readTimeout: 3000
    }).then((data: http.HttpResponse) => {
      console.info('IoTDA response:' + JSON.stringify(data));
      if (data.responseCode === 200 && data.result) {
        try {
          const json  = JSON.parse(data.result as string) as IotShadowResponse;
          let props: IotShadowProperties | undefined = undefined;
          if (json.shadow && json.shadow.length > 0) {
            for (let i = 0; i < json.shadow.length; i++) {
              const s = json.shadow[i];
              if (s && s.service_id === 'environment' && s.reported && s.reported.properties) {
                props = s.reported.properties as IotShadowProperties;
                break;
              }
            }
          }
          if (props) {
            if (typeof props.temperature === 'number') {
              this.iotTemperature = props.temperature as number;
            }
            if (typeof props.humidity === 'number') {
              this.iotHumidity = props.humidity as number;
            }
            if (typeof props.illumination === 'number') {
              this.iotLight = props.illumination as number;
            }
            this.iotDebug = '更新于 ' + new Date().toLocaleTimeString();
            console.info('iot values:' + JSON.stringify({
              temperature: this.iotTemperature,
              humidity: this.iotHumidity,
              illumination: this.iotLight
            }));
            return;   // 成功直接返回
          }
          this.iotDebug = 'properties 为空';
        } catch (_) {
          this.iotDebug = 'JSON 解析失败';
        }
      } else {
        let extra: string = '';
        try {
          const err = JSON.parse(data.result as string) as IotErrorBody;
          if (err && err.error_code) {
            extra = `${err.error_code} ${err.error_msg ?? ''}`;
          }
        } catch (_) {}
        this.iotDebug = data.responseCode === 401
          ? 'HTTP401 未授权/Token失效'
          : (data.responseCode === 403
              ? `HTTP403 ${extra || '权限不足/项目或实例不匹配'}`
              : `HTTP${data.responseCode}`);
      }
    }).catch(() => {
      console.error('IoTDA request error');
      this.iotDebug = '网络/超时错误';
    }).finally(() => {
      this.iotLoading = false;
      httpRequest.destroy();
    });
  }

  /**
   * 统计数据项
   */
  @Builder
  StatItem(title: string, value: string, color: string) {
    Column() {
      Text(title)
        .fontSize(12)
        .fontColor('#B0BEC5') // 浅灰色
        .margin({ bottom: 8 })
      
      Text(value)
        .fontSize(22)
        .fontWeight(FontWeight.Bold)
        .fontColor(color)
    }
    .layoutWeight(1)
    .padding(12)
    .backgroundColor('#F5F5F7')
    .borderRadius(12)
    .margin({ right: 6, left: 6 })
  }

  /**
   * 传感器预警卡片
   */
  @Builder
  SensorWarningCard(
    icon: Resource,
    name: string,
    valueGetter: () => number,
    unit: string,
    color: string,
    minThreshold: number,
    maxThreshold: number,
    normalMsg: string
  ) {
    Row() {
      // 左侧图标和名称
      Row() {
        Image(icon)
          .width(32)
          .height(32)
          .fillColor(color)
          .margin({ right: 12 })

        Column() {
          Text(name)
            .fontSize(14)
            .fontColor('#333333')
            .fontWeight(FontWeight.Medium)

          Text(this.lastUpdateTime || '等待更新...')
            .fontSize(11)
            .fontColor('#B0BEC5') // 浅灰色
            .margin({ top: 2 })
        }
        .alignItems(HorizontalAlign.Start)
      }
      .layoutWeight(1)

      // 右侧数值和状态
      Column() {
        Row({ space: 4 }) {
          Text(this.formatNumber(valueGetter(), unit))
            .fontSize(22)
            .fontWeight(FontWeight.Bold)
            .fontColor(color)

          Text(unit)
            .fontSize(13)
            .fontColor('#B0BEC5') // 浅灰色
            .margin({ top: 6 })
        }

        // 状态提示
        Text(this.getSensorStatus(valueGetter(), minThreshold, maxThreshold, normalMsg))
          .fontSize(11)
          .fontColor(this.getSensorStatusColor(valueGetter(), minThreshold, maxThreshold))
          .margin({ top: 4 })
      }
      .alignItems(HorizontalAlign.End)
    }
    .width('100%')
    .padding(16)
    .backgroundColor('#FFFFFF')
    .borderRadius(12)
    .border({
      width: 1,
      color: (valueGetter() > 0 && (valueGetter() < minThreshold || valueGetter() > maxThreshold))
        ? '#FFAB40'
        : '#E0E0E0'
    })
  }

  /**
   * 获取传感器状态文本
   */
  private getSensorStatus(
    value: number,
    minThreshold: number,
    maxThreshold: number,
    normalMsg: string
  ): string {
    if (value <= 0) {
      return '等待数据...';
    }
    if (value < minThreshold) {
      return '⚠️ 偏低';
    }
    if (value > maxThreshold) {
      return '⚠️ 偏高';
    }
    return `✅ ${normalMsg}`;
  }

  /**
   * 获取传感器状态颜色
   */
  private getSensorStatusColor(
    value: number,
    minThreshold: number,
    maxThreshold: number
  ): string {
    if (value === 0) {
      return '#999999';
    }
    if (value < minThreshold || value > maxThreshold) {
      return '#FF6B6B';
    }
    return '#52C41A';
  }

  private formatNumber(v: number, unit: string): string {
    if (typeof v !== 'number') {
      return '--';
    }
    const n: number = unit === 'Lx' ? Math.round(v) : Math.round(v * 10) / 10;
    return '' + n;
  }
}
