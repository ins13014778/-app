/**
 * 智慧农场主页 - 重构版本（模块化）
 * 功能：登录认证、首页监控、设备控制、数据分析、用户中心
 * 
 * 这是一个完整的智能农场管理系统，主要功能包括：
 * 1. 用户登录注册 - 支持普通用户和游客模式
 * 2. 实时监控 - 显示温度、湿度、光照等传感器数据
 * 3. 设备控制 - 通过MQTT协议控制农场设备（水泵、灯光等）
 * 4. 数据分析 - AI助手帮助分析农场环境数据
 * 5. 个人中心 - 用户资料管理和系统设置
 * 
 * 技术特点：
 * - 使用ArkTS语言开发（HarmonyOS原生语言）
 * - 采用模块化架构，代码结构清晰
 * - 集成巴法云MQTT服务进行设备通信
 * - 使用Coze AI提供智能分析功能
 * - 支持华为云IoT平台数据获取
 */
import { apiService, LoginRequest, RegisterRequest, SensorDataUploadRequest } from '../services/ApiService';
import { mqttService, MqttStatus, MqttMessage } from '../services/MqttService';
import { bemfaCloudService, TopicDetail, MessageRecord } from '../services/BemfaCloudService';
import cozeService from '../services/CozeService';
import { picker } from '@kit.CoreFileKit';
import { common } from '@kit.AbilityKit';
import { BemfaConfig } from '../config/BemfaConfig';
import { router, promptAction } from '@kit.ArkUI';
import { preferences } from '@kit.ArkData';
import { webview } from '@kit.ArkWeb';
import { http } from '@kit.NetworkKit';
import hilog from '@ohos.hilog';
import { AppColors } from '../constants/AppConstants';

// 导入类型定义
import { ControlDevice, AnalysisData, AIMessage, UserProfile, ProfileMenuItem } from '../types/IndexTypes';

// 导入组件
import { HomePage } from '../components/home/HomePage';
import { ControlPage } from '../components/control/ControlPage';
import { AnalysisPage } from '../components/analysis/AnalysisPage';
import { ProfilePage } from '../components/profile/ProfilePage';
import { LoginPage } from '../components/common/LoginPage';
import { RegisterPage } from '../components/common/RegisterPage';
import { EditDeviceNameDialog } from '../components/common/EditDeviceNameDialog';
import { SensorData } from '../components/control/SensorDataCard';

const DOMAIN = 0x0101;
const TAG_INDEX = 'Index';

/**
 * 传感器主题配置接口
 * 定义传感器的基本信息：主题、名称、单位、图标和颜色
 */
interface SensorTopicConfig {
  topic: string;      // MQTT主题名称
  name: string;     // 传感器显示名称
  unit: string;     // 数据单位（如°C、%、Lx等）
  icon: string;     // 图标emoji
  color: string;    // 显示颜色（十六进制）
}

/**
 * 简化的传感器主题配置（仅用于首页刷新）
 * 只包含主题和名称，用于快速获取传感器数据
 */
interface SimpleSensorTopic {
  topic: string;     // MQTT主题名称
  name: string;      // 传感器显示名称
}

/**
 * 设备状态接口
 * 记录设备的在线状态和最后消息
 */
interface DeviceStatus {
  online: boolean;   // 设备是否在线
  msg: string;       // 设备最后发送的消息
}

/**
 * 设备控制命令接口
 * 定义设备的开关命令（支持不同类型的设备）
 */
interface DeviceCommand {
  on: string;        // 开启命令（如：on、pump_on、auto_on）
  off: string;       // 关闭命令（如：off、pump_off、auto_off）
}

interface CozeRunImageFile {
  url: string;
  file_type: string;
}
interface CozeRunRequestBodyWithImage {
  image_file: CozeRunImageFile;
}

type CozeRunRequestBody = CozeRunRequestBodyWithImage;

interface CozePlantDiagnosis {
  color_analysis?: string;
  spot_detection?: string;
  wilt_analysis?: string;
  pest_detection?: string;
  disease_detection?: string;
}

interface CozePlantHealthAnalysis {
  leaf_type?: string;
  health_status?: string;
  diagnosis?: CozePlantDiagnosis;
  confidence?: number;
  growth_recommendations?: string[];
}

interface CozeRunResponse {
  plant_health_analysis?: CozePlantHealthAnalysis;
  run_id?: string;
  detail?: string | Object;
}

/**
 * 智慧农场主组件
 * @Entry 装饰器表示这是应用的入口组件
 * @Component 装饰器表示这是一个UI组件
 */
@Entry
@Component
struct Index {
  // ========== 传感器数据状态 ==========
  // 这些状态变量用于存储从传感器获取的实时数据
  @State soilHumidity: number = 0;           // 土壤湿度（百分比）
  @State temperature: number = 0;            // 环境温度（摄氏度）
  @State lightIntensity: number = 0;         // 光照强度（勒克斯）
  @State lastTempValue: number = 0;          // 上次温度值（用于比较变化）
  @State lastHumValue: number = 0;           // 上次湿度值（用于比较变化）
  @State lastLightValue: number = 0;         // 上次光照值（用于比较变化）
  @State date: string = '10月10日';           // 当前日期
  @State lastUpdateTime: string = '--:--';   // 最后更新时间
  @State todayMaxTemp: number = 0;           // 今日最高温度
  @State todayMinTemp: number = 0;           // 今日最低温度
  @State todayMaxHumidity: number = 0;       // 今日最高湿度
  @State todayMinHumidity: number = 0;       // 今日最低湿度

  // ========== 用户认证状态 ==========
  // 管理用户的登录状态和相关信息
  @State currentIndex: number = 0;            // 当前选中的Tab索引（0=首页，1=控制，2=监控，3=分析，4=我的）
  @State isLoggedIn: boolean = false;         // 用户是否已登录
  @State userMode: string = 'guest';          // 用户模式：not_logged_in/logged_in/guest
  @State currentView: string = 'main';        // 当前视图：login/register/main
  @State username: string = '';              // 登录用户名
  @State password: string = '';                // 登录密码
  @State confirmPassword: string = '';       // 注册确认密码
  @State email: string = '';                 // 用户邮箱
  @State phone: string = '';                  // 用户手机号
  @State isLoading: boolean = false;        // 是否正在加载（用于显示加载状态）
  @State errorMessage: string = '';          // 错误提示信息
  @State successMessage: string = '';        // 成功提示信息
  @State userProfile: UserProfile = {        // 用户资料对象
     id: 0,                                   // 用户ID
     username: '',                            // 用户名
     email: '',                               // 邮箱
     phone: '',                               // 手机号
     avatar: '👤',                            // 头像emoji
     bio: '智慧农业用户',                     // 个人简介
     user_mode: 'guest',                     // 用户模式
     is_admin: 0                              // 是否为管理员（0=普通用户，1=管理员）
  };

  // ========== 设备控制状态 ==========
  // 管理农场设备的控制状态和连接信息
  @State controlDevices: ControlDevice[] = [];    // 控制设备列表
  @State activeDeviceCount: number = 0;            // 活跃设备数量（开启状态）
  @State onlineDeviceCount: number = 0;            // 在线设备数量（网络连接正常）
  @State mqttStatus: MqttStatus = MqttStatus.DISCONNECTED;  // MQTT连接状态
  @State mqttStatusText: string = '未连接';       // MQTT状态文本
  @State bemfaUID: string = '';                   // 巴法云用户ID
  @State showEditNameDialog: boolean = false;      // 是否显示编辑设备名称对话框
  @State editingDevice: ControlDevice | null = null;  // 正在编辑的设备
  @State newDeviceName: string = '';              // 新的设备名称
  @State sensorDataList: SensorData[] = [];      // 传感器数据列表（用于控制页面）

  // ========== AI聊天状态 ==========
  // 管理AI助手的聊天状态和数据
  @State aiMessages: AIMessage[] = [];            // AI消息列表
  @State aiInputText: string = '';                // AI输入框文本
  @State isAILoading: boolean = false;            // AI是否正在回复
  @State aiQuickQuestions: string[] = [];          // AI快速提问列表
  aiChatScroller: Scroller = new Scroller();      // AI聊天滚动控制器
  @State pendingImageUri: string = '';            // 待发送的图片附件URI（挂载后与文本一起发送）

  // ========== 分析数据状态 ==========
  // 存储历史分析数据
  @State analysisData: AnalysisData[] = [];        // 分析数据数组
  @State selectedDataType: string = '温度';        // 当前选中的数据类型

  @State monitorStreamUrl: string = 'http://esp32.zy991.cn/stream';
  private monitorWebController: webview.WebviewController = new webview.WebviewController();
  @State cozeBearerToken: string = '';
  @State cozeTokenInput: string = '';
  @State showCozeTokenDialog: boolean = false;
  @State isCozeRunLoading: boolean = false;
  @State cozeRunResultText: string = '';
  cozeRunResultScroller: Scroller = new Scroller();
  private readonly COZE_TOKEN_STORAGE_KEY: string = 'coze_bearer_token';

  // ========== 用户菜单 ==========
  // 个人中心的菜单项配置
  @State menuItems: ProfileMenuItem[] = [
     { id: 'settings', title: '温室设置', icon: '系统设置.png', hasArrow: true },
     { id: 'help', title: '帮助与反馈', icon: '帮助与反馈.png', hasArrow: true },
     { id: 'about', title: '关于我们', icon: '关于我们.png', hasArrow: true },
     { id: 'logout', title: '退出登录', icon: '退出登录.png', hasArrow: false }
  ];

  // 定时器（用于定时刷新数据）
  private dateTimerID: number = -1;           // 日期刷新定时器
  private dataRefreshTimerID: number = -1;    // 设备状态刷新定时器
  private sensorDataRefreshTimerID: number = -1;  // 传感器数据刷新定时器

/**
   * 组件生命周期 - 即将显示
   * 当组件即将显示时调用，进行初始化操作
   * 主要功能：
   * 1. 设置API服务上下文
   * 2. 加载巴法云用户ID
   * 3. 启动各种定时器（日期、设备状态、传感器数据）
   * 4. 初始化AI服务
   * 5. 延迟获取初始数据
   */
  aboutToAppear() {
    console.info('[Index] 页面即将显示');
    apiService.setContext(this.getUIContext().getHostContext() as common.UIAbilityContext);
    this.loadBemfaUID();
    this.loadCozeBearerToken();
    this.updateDateTime();
    
    // 启动定时器
    this.dateTimerID = setInterval((): void => { this.updateDateTime(); }, 60000);
    this.dataRefreshTimerID = setInterval((): void => {
      if (this.controlDevices.length > 0) { this.refreshDeviceOnlineStatus(); }
    }, 30000);
    this.sensorDataRefreshTimerID = setInterval((): void => {
      // 刷新首页和控制页的传感器数据（缩短到5秒更新一次，更实时）
      this.refreshSensorData(); 
      this.fetchSensorDataFromBemfa();
    }, 5000);

    this.initAIService();
    
    // 延迟1秒后首次获取传感器数据（同时刷新首页和控制页）
    setTimeout((): void => { 
      this.refreshSensorData();
      this.fetchSensorDataFromBemfa(); 
    }, 1000);
  }

  /**
   * 组件生命周期 - 即将销毁
   * 当组件即将销毁时调用，进行清理操作
   * 主要功能：
   * 1. 清除所有定时器
   * 2. 断开MQTT连接
   */
  aboutToDisappear() {
    console.info('[Index] 页面即将销毁');
    if (this.dateTimerID !== -1) clearInterval(this.dateTimerID);
    if (this.dataRefreshTimerID !== -1) clearInterval(this.dataRefreshTimerID);
    if (this.sensorDataRefreshTimerID !== -1) clearInterval(this.sensorDataRefreshTimerID);
    mqttService.disconnect();
  }

/**
   * UI构建方法 - 构建整个应用界面
   * 使用Stack布局，根据用户登录状态显示不同内容
   */
  build() {
    Stack() {
      // ========== 未登录状态 ==========
      if (this.userMode === 'not_logged_in') {
        // 未登录：显示登录或注册页面
        if (this.currentView === 'login') {
          LoginPage({
            username: $username,
            password: $password,
            errorMessage: $errorMessage,
            successMessage: $successMessage,
            isLoading: $isLoading,
            handleLogin: () => this.handleLogin(),
            handleGuestMode: () => this.handleGuestMode(),
            switchToRegister: () => this.switchToRegister()
          })
        } else if (this.currentView === 'register') {
          RegisterPage({
            username: $username,
            password: $password,
            confirmPassword: $confirmPassword,
            email: $email,
            phone: $phone,
            errorMessage: $errorMessage,
            successMessage: $successMessage,
            isLoading: $isLoading,
            handleRegister: () => this.handleRegister(),
            switchToLogin: () => this.switchToLogin()
          })
        }
      } else {
        // ========== 已登录或游客模式 ==========
        // 已登录或游客模式：显示主应用界面（底部Tab导航）
        Tabs({ barPosition: BarPosition.End, index: this.currentIndex }) {
          // 首页 - 显示传感器数据和统计信息
          TabContent() {
            HomePage({
              soilHumidity: $soilHumidity,
              temperature: $temperature,
              lightIntensity: $lightIntensity,
              date: $date,
              lastUpdateTime: $lastUpdateTime,
              todayMaxTemp: $todayMaxTemp,
              todayMinTemp: $todayMinTemp,
              todayMaxHumidity: $todayMaxHumidity,
              todayMinHumidity: $todayMinHumidity,
              controlDevices: $controlDevices,
              activeDeviceCount: $activeDeviceCount,
              onlineDeviceCount: $onlineDeviceCount,
              mqttStatusText: $mqttStatusText,
              getMqttStatusIcon: (): string => this.getMqttStatusIcon(),
              getMqttStatusColor: (): string => this.getMqttStatusColor(),
              refreshSensorData: (): Promise<void> => this.refreshSensorData()
            })
          }.tabBar(this.TabBuilder('首页', 0))

          // 控制页 - 设备控制和状态管理
          TabContent() {
            ControlPage({
              controlDevices: $controlDevices,
              mqttStatus: $mqttStatus,
              mqttStatusText: $mqttStatusText,
              bemfaUID: $bemfaUID,
              onlineDeviceCount: $onlineDeviceCount,
              activeDeviceCount: $activeDeviceCount,
              sensorDataList: $sensorDataList,
              getMqttStatusIcon: (): string => this.getMqttStatusIcon(),
              getMqttStatusColor: (): string => this.getMqttStatusColor(),
              getMaskedUID: (): string => this.getMaskedUID(),
              toggleAllDevicesMQTT: async (isActive: boolean): Promise<void> => { await this.toggleAllDevicesMQTT(isActive); },
              refreshDeviceOnlineStatus: (): void => { this.refreshDeviceOnlineStatus(); },
              refreshSensorData: (): void => { this.fetchSensorDataFromBemfa(); },
              syncDevicesFromBemfa: (): void => { this.syncDevicesFromBemfa(); },
              onToggleDevice: async (id: number, isOn: boolean): Promise<void> => { await this.toggleDeviceMQTT(id, isOn); },
              onEditDeviceName: (device: ControlDevice) => {
                this.editingDevice = device;
                this.newDeviceName = device.name;
                this.showEditNameDialog = true;
              }
            })
          }.tabBar(this.TabBuilder('控制', 1))

          TabContent() {
            Column() {
              Row() {
                Row() {
                  Image($rawfile('在线.png'))
                    .width(20)
                    .height(20)
                    .fillColor(AppColors.PRIMARY_COLOR)
                    .margin({ right: 8 })

                  Text('监控')
                    .fontSize(18)
                    .fontWeight(FontWeight.Bold)
                    .fontColor('#111111')
                }

                Blank()

                Row({ space: 12 }) {
                  Button() {
                    Image($rawfile('刷新.png'))
                      .width(18)
                      .height(18)
                      .fillColor('#FFFFFF')
                  }
                  .width(36)
                  .height(36)
                  .backgroundColor(AppColors.PRIMARY_COLOR)
                  .borderRadius(18)
                  .onClick(() => {
                    this.monitorStreamUrl = `http://esp32.zy991.cn/stream?t=${Date.now()}`;
                  })

                  Button() {
                    Image($rawfile('预警提醒.png'))
                      .width(18)
                      .height(18)
                      .fillColor('#FFFFFF')
                  }
                  .width(36)
                  .height(36)
                  .backgroundColor('#FF3B30')
                  .borderRadius(18)
                  .onClick(() => {
                    promptAction.showToast({ message: '暂无预警' });
                  })
                }
              }
              .width('100%')
              .padding({ left: 16, right: 16, top: 16, bottom: 12 })
              .backgroundColor('#FFFFFF')

              Web({ src: this.monitorStreamUrl, controller: this.monitorWebController })
                .width('100%')
                .height(240)
                .backgroundColor('#000000')

              Row() {
                Button('智能分析')
                  .width('44%')
                  .height(44)
                  .fontSize(16)
                  .fontColor('#FFFFFF')
                  .backgroundColor(this.isCozeRunLoading ? '#CCCCCC' : AppColors.PRIMARY_COLOR)
                  .borderRadius(12)
                  .onClick(() => {
                    this.runCozeSmartAnalysis();
                  })

                Button('生长剪影')
                  .width('44%')
                  .height(44)
                  .fontSize(16)
                  .fontColor('#FFFFFF')
                  .backgroundColor(AppColors.PRIMARY_COLOR)
                  .borderRadius(12)
                  .onClick(() => {
                    router.pushUrl({ url: 'pages/GrowthSilhouette' }).catch((err: Error) => {
                      hilog.error(DOMAIN, TAG_INDEX, '[GrowthSilhouette] pushUrl error=%{public}s', JSON.stringify(err));
                    });
                  })
              }
              .width('100%')
              .justifyContent(FlexAlign.SpaceBetween)
              .padding({ left: 16, right: 16 })
              .margin({ top: 16 })

              if (this.cozeRunResultText) {
                Column() {
                  Text('智能分析结果')
                    .fontSize(15)
                    .fontWeight(FontWeight.Bold)
                    .fontColor('#111111')
                    .width('100%')
                    .margin({ bottom: 10 })

                  Scroll(this.cozeRunResultScroller) {
                    Text(this.cozeRunResultText)
                      .fontSize(12)
                      .fontColor('#333333')
                      .width('100%')
                  }
                  .height(220)
                  .scrollBar(BarState.Auto)
                }
                .width('100%')
                .padding(16)
                .margin({ top: 16 })
                .backgroundColor('#FFFFFF')
                .borderRadius(16)
              }
            }
            .width('100%')
            .height('100%')
            .backgroundColor(AppColors.APP_BG)
          }.tabBar(this.TabBuilder('监控', 2))

          // 分析页 - AI数据分析和建议
          TabContent() {
          AnalysisPage({
            temperature: $temperature,
            soilHumidity: $soilHumidity,
            lightIntensity: $lightIntensity,
            aiMessages: $aiMessages,
            aiInputText: $aiInputText,
            isAILoading: $isAILoading,
            aiQuickQuestions: $aiQuickQuestions,
            pendingImageUri: $pendingImageUri,
            aiChatScroller: this.aiChatScroller,
            getWeatherDescription: (): string => this.getWeatherDescription(),
            getWeatherIcon: (): string => this.getWeatherIcon(),
            sendAIMessage: (msg: string): void => { this.sendAIMessage(msg); },
            addWelcomeMessage: (): void => { this.addWelcomeMessage(); },
            uploadImage: (): void => { this.pickAndUploadImage(); },
            transcribeAudio: (): void => { this.pickAndTranscribeAudio(); }
          })
          }.tabBar(this.TabBuilder('分析', 3))

          // 我的页 - 个人中心和设置
          TabContent() {
            ProfilePage({
              userMode: $userMode,
              userProfile: $userProfile,
              menuItems: $menuItems,
              getMenuItemsForCurrentMode: (): ProfileMenuItem[] => this.getMenuItemsForCurrentMode(),
              handleMenuItemClick: (id: string): void => { this.handleMenuItemClick(id); },
              switchToLogin: () => {
                this.userMode = 'not_logged_in';
                this.currentView = 'login';
              }
            })
          }.tabBar(this.TabBuilder('我的', 4))
        }
        .onChange((index: number) => { this.currentIndex = index; })
        .width('100%')
        .height('100%')
        .backgroundColor(AppColors.APP_BG)
      }

      // 编辑设备名称对话框（浮动层）
      if (this.showCozeTokenDialog) {
        Column() {
          Column()
            .width('100%')
            .height('100%')
            .backgroundColor('#80000000')
            .onClick(() => {
              this.showCozeTokenDialog = false;
            })

          Column() {
            Text('配置智能分析 Token')
              .fontSize(18)
              .fontWeight(FontWeight.Bold)
              .margin({ bottom: 16 })

            TextArea({ placeholder: '请输入 Bearer Token（不含 Bearer 前缀）', text: this.cozeTokenInput })
              .width('100%')
              .height(120)
              .backgroundColor('#F5F5F5')
              .borderRadius(8)
              .maxLength(4096)
              .onChange((value: string) => {
                this.cozeTokenInput = value.trim();
              })

            Row() {
              Button('取消')
                .fontSize(16)
                .fontColor('#666666')
                .backgroundColor('#F5F5F5')
                .borderRadius(8)
                .layoutWeight(1)
                .height(44)
                .onClick(() => {
                  this.showCozeTokenDialog = false;
                })

              Button('保存')
                .fontSize(16)
                .fontColor('#FFFFFF')
                .backgroundColor(AppColors.PRIMARY_COLOR)
                .borderRadius(8)
                .layoutWeight(1)
                .height(44)
                .margin({ left: 12 })
                .onClick(async () => {
                  await this.saveCozeBearerToken(this.cozeTokenInput);
                  this.showCozeTokenDialog = false;
                  await this.runCozeSmartAnalysis();
                })
            }
            .width('100%')
            .margin({ top: 16 })
          }
          .width('85%')
          .padding(24)
          .backgroundColor('#FFFFFF')
          .borderRadius(16)
          .position({ x: '7.5%', y: '25%' })
        }
        .width('100%')
        .height('100%')
        .position({ x: 0, y: 0 })
        .zIndex(1000)
      }

      EditDeviceNameDialog({
        showDialog: $showEditNameDialog,
        editingDevice: $editingDevice,
        newDeviceName: $newDeviceName,
        onConfirm: (): void => { this.confirmEditDeviceName(); }
      })
    }
    .width('100%')
    .height('100%')
  }

  /**
   * 底部Tab构建器 - 构建底部导航栏的每个Tab
   * @param title Tab标题
   * @param index Tab索引（0=首页，1=控制，2=监控，3=分析，4=我的）
   */
  @Builder
  TabBuilder(title: string, index: number) {
    Column() {
      // Tab图标 - 根据当前选中状态显示不同样式
      if (this.currentIndex === index) {
        // 选中状态：图标更大，颜色更亮
        Image(index === 0 ? $rawfile('首页.png') :
          index === 1 ? $rawfile('控制.png') :
          index === 2 ? $rawfile('在线.png') :
          index === 3 ? $rawfile('分析.png') : $rawfile('我的.png'))
          .width(28)           // 选中时图标更大
          .height(28)
          .fillColor(AppColors.PRIMARY_COLOR)
      } else {
        // 未选中状态：图标较小，颜色较暗
        Image(index === 0 ? $rawfile('首页.png') :
          index === 1 ? $rawfile('控制.png') :
          index === 2 ? $rawfile('在线.png') :
          index === 3 ? $rawfile('分析.png') : $rawfile('我的.png'))
          .width(24)           // 未选中时图标较小
          .height(24)
          .fillColor('#999999')
          .opacity(0.6)        // 未选中时透明度较低
      }

      // Tab标题 - 根据当前选中状态显示不同样式
      Text(title)
        .fontSize(this.currentIndex === index ? 12 : 11)  // 选中时字体稍大
        .fontColor(this.currentIndex === index ? AppColors.PRIMARY_COLOR : '#999999')
        .fontWeight(this.currentIndex === index ? FontWeight.Bold : FontWeight.Normal)  // 选中时字体加粗
        .margin({ top: 4 })  // 图标和文字间距
    }
    .width('100%')           // 占满Tab宽度
    .padding({ top: 8, bottom: 8 })  // 上下内边距
    .justifyContent(FlexAlign.Center)  // 内容居中对齐
  }

  // ========== 核心业务方法（保持原样） ==========
  // 由于篇幅原因，这里包含所有原有的业务逻辑方法
  // 包括：数据处理、MQTT通信、认证逻辑、AI服务等
  
  updateDateTime() {
    const now = new Date();
    this.date = `${now.getMonth() + 1}月${now.getDate()}日`;
  }

  async loadBemfaUID() {
    try {
      if (BemfaConfig.USER_UID && BemfaConfig.USER_UID.length > 0) {
        this.bemfaUID = BemfaConfig.USER_UID;
        bemfaCloudService.setUID(this.bemfaUID);
        await this.syncDevicesFromBemfa();
        await this.initMQTT();
        return;
      }
      let pref = await preferences.getPreferences(
        this.getUIContext().getHostContext() as common.UIAbilityContext, 'app_config');
      let savedUID: string = await pref.get(BemfaConfig.STORAGE_KEY_UID, '') as string;
      if (savedUID) {
        this.bemfaUID = savedUID;
        bemfaCloudService.setUID(this.bemfaUID);
        await this.syncDevicesFromBemfa();
        await this.initMQTT();
      }
    } catch (error) {
      console.error('[Index] 加载UID失败:', error);
    }
  }

  async loadCozeBearerToken() {
    try {
      const pref = await preferences.getPreferences(
        this.getUIContext().getHostContext() as common.UIAbilityContext,
        'app_config'
      );
      const savedToken: string = await pref.get(this.COZE_TOKEN_STORAGE_KEY, '') as string;
      if (savedToken) this.cozeBearerToken = savedToken;
    } catch (_) {}
  }

  async saveCozeBearerToken(token: string) {
    const t = token?.trim() ?? '';
    if (!t) {
      promptAction.showToast({ message: 'Token不能为空' });
      return;
    }
    try {
      const pref = await preferences.getPreferences(
        this.getUIContext().getHostContext() as common.UIAbilityContext,
        'app_config'
      );
      await pref.put(this.COZE_TOKEN_STORAGE_KEY, t);
      await pref.flush();
      this.cozeBearerToken = t;
      this.cozeTokenInput = '';
    } catch (_) {
      promptAction.showToast({ message: 'Token保存失败' });
    }
  }

  formatCozeRunResult(raw: string): string {
    try {
      const resp = JSON.parse(raw) as CozeRunResponse;

      if (resp.detail) {
        if (typeof resp.detail === 'string') return resp.detail;
        return JSON.stringify(resp.detail, null, 2);
      }

      const analysis = resp.plant_health_analysis;
      if (analysis) {
        const lines: string[] = [];
        if (analysis.leaf_type) lines.push(`叶型：${analysis.leaf_type}`);
        if (analysis.health_status) lines.push(`健康状态：${analysis.health_status}`);
        if (typeof analysis.confidence === 'number') lines.push(`置信度：${analysis.confidence}`);

        const diagnosis = analysis.diagnosis;
        if (diagnosis) {
          const diagLines: string[] = [];
          if (diagnosis.color_analysis) diagLines.push(`- 颜色：${diagnosis.color_analysis}`);
          if (diagnosis.spot_detection) diagLines.push(`- 斑点：${diagnosis.spot_detection}`);
          if (diagnosis.wilt_analysis) diagLines.push(`- 萎蔫：${diagnosis.wilt_analysis}`);
          if (diagnosis.pest_detection) diagLines.push(`- 虫害：${diagnosis.pest_detection}`);
          if (diagnosis.disease_detection) diagLines.push(`- 病害：${diagnosis.disease_detection}`);
          if (diagLines.length > 0) {
            lines.push('');
            lines.push('诊断：');
            diagLines.forEach((l) => lines.push(l));
          }
        }

        if (analysis.growth_recommendations && analysis.growth_recommendations.length > 0) {
          lines.push('');
          lines.push('生长建议：');
          analysis.growth_recommendations.forEach((item: string, idx: number) => {
            lines.push(`${idx + 1}. ${item}`);
          });
        }

        if (lines.length > 0) return lines.join('\n');
      }

      return JSON.stringify(resp, null, 2);
    } catch (_) {
      return raw;
    }
  }

  runCozeSmartAnalysis() {
    if (this.isCozeRunLoading) return;
    if (!this.cozeBearerToken) {
      this.cozeTokenInput = '';
      this.showCozeTokenDialog = true;
      return;
    }

    this.isCozeRunLoading = true;
    const url = 'https://rzvqg9bf5z.coze.site/run';
    const httpRequest: http.HttpRequest = http.createHttp();
    const defaultImageUrlRaw = ' `http://tp.zy991.cn/lll.jpg` ';
    const defaultImageUrl = defaultImageUrlRaw.replace(/`/g, '').trim();
    const body: CozeRunRequestBody = {
      image_file: { url: defaultImageUrl, file_type: 'image' }
    };
    hilog.info(DOMAIN, TAG_INDEX, '[coze.run] POST %{public}s', url);
    httpRequest.request(url, {
      method: http.RequestMethod.POST,
      header: {
        'Authorization': `Bearer ${this.cozeBearerToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      connectTimeout: 10000,
      readTimeout: 10000,
      expectDataType: http.HttpDataType.STRING,
      extraData: JSON.stringify(body)
    }).then((data: http.HttpResponse) => {
      const raw = (data.result ?? '') as string;
      hilog.info(DOMAIN, TAG_INDEX, '[coze.run] status=%{public}d len=%{public}d', data.responseCode, raw.length);
      if (data.responseCode === 200) {
        this.cozeRunResultText = this.formatCozeRunResult(raw);
        promptAction.showToast({ message: '已触发智能分析' });
        return;
      }
      if (data.responseCode === 401) {
        promptAction.showToast({ message: 'Token无效或未授权' });
        this.cozeTokenInput = '';
        this.showCozeTokenDialog = true;
        return;
      }
      this.cozeRunResultText = `HTTP ${data.responseCode}\n\n${raw}`;
      promptAction.showToast({ message: `请求失败(${data.responseCode})` });
    }).catch((err: Object) => {
      this.cozeRunResultText = JSON.stringify(err);
      hilog.error(DOMAIN, TAG_INDEX, '[coze.run] error=%{public}s', JSON.stringify(err));
      promptAction.showToast({ message: '网络请求失败' });
    }).finally(() => {
      this.isCozeRunLoading = false;
      httpRequest.destroy();
    });
  }

  async initMQTT() {
    if (!this.bemfaUID) return;
    mqttService.setClientId(this.bemfaUID);
    
    mqttService.onStatusChange((status: MqttStatus) => {
      this.mqttStatus = status;
      switch (status) {
        case MqttStatus.DISCONNECTED: this.mqttStatusText = '未连接'; break;
        case MqttStatus.CONNECTING: this.mqttStatusText = '连接中...'; break;
        case MqttStatus.CONNECTED:
          this.mqttStatusText = '已连接';
          this.subscribeAllDevices();
          break;
        case MqttStatus.RECONNECTING: this.mqttStatusText = '重连中...'; break;
        case MqttStatus.ERROR: this.mqttStatusText = '连接失败'; break;
      }
    });

    mqttService.onMessage((message: MqttMessage) => {
      this.handleMQTTMessage(message);
    });

    await mqttService.connect();
  }

  subscribeAllDevices(): void {
    this.controlDevices.forEach((device: ControlDevice): void => {
      mqttService.subscribe(device.topic);
    });
    this.refreshDeviceOnlineStatus();
  }

  async syncDevicesFromBemfa() {
    console.info('[设备同步] 开始从巴法云同步设备');
    
    // 获取所有协议类型的设备（type参数：不传=所有，1=MQTT，3=TCP）
    const result = await bemfaCloudService.getAllTopics(1);
    
    if (result.code === 0 && result.data?.data) {
      const totalDevices = result.data.data.length;
      console.info('[设备同步] ========== 应用端接收到设备 ==========');
      console.info('[设备同步] ✅ 成功获取', totalDevices, '个MQTT设备');
      result.data.data.forEach((topic: TopicDetail, idx: number) => {
        console.info(`[设备同步] ${idx + 1}. ${topic.name || topic.topic}`);
        console.info(`           主题: ${topic.topic}`);
        console.info(`           类型: ${topic.deviceType || '未知'}`);
        console.info(`           在线: ${topic.online ? '✅' : '❌'}`);
      });
      console.info('[设备同步] =======================================');
      
      this.controlDevices = result.data.data.map((topic: TopicDetail, index: number): ControlDevice => {
        const isActive = topic.msg === 'on' || topic.msg === '1';
        
        // 详细日志：显示每个设备的状态
        console.info(`[设备同步] 设备${index + 1}: ${topic.name || topic.topic}`);
        console.info(`  - 主题: ${topic.topic}`);
        console.info(`  - 消息: ${topic.msg}`);
        console.info(`  - 在线: ${topic.online}`);
        console.info(`  - 开关: ${isActive ? '开启' : '关闭'}`);
        
        return new ControlDevice(
          index + 1,                              // id
          topic.name || topic.topic,              // name
          topic.topic,                            // topic
          isActive,                               // isActive
          topic.online,                           // isOnline
          topic.room || '未分组',                 // area
          this.getDeviceTypeName(topic.deviceType) // deviceType
        );
      });
      
      // 处理传感器数据
      this.controlDevices.forEach((device: ControlDevice): void => {
        if ((device.topic.endsWith('004') || device.deviceType === '传感器')) {
          const foundTopic = result.data.data.find((t: TopicDetail) => t.topic === device.topic);
          if (foundTopic && foundTopic.msg) {
            this.parseSensorData(foundTopic.msg);
          }
        }
      });
      
      this.updateDeviceStatistics();
      console.info('[设备同步] 同步完成，在线设备:', this.onlineDeviceCount, '运行设备:', this.activeDeviceCount);
      
      if (this.mqttStatus === MqttStatus.CONNECTED) this.subscribeAllDevices();
    } else {
      console.error('[设备同步] ❌ 同步失败 code:', result.code, 'msg:', result.msg);
    }
  }

  /**
   * 刷新设备在线状态和开关状态
   * 从巴法云API获取设备的真实状态（on/off）并同步到界面
   */
  async refreshDeviceOnlineStatus() {
    try {
      console.info('[设备状态] 开始刷新设备状态');
      const result = await bemfaCloudService.getAllTopics(1);
      
      if (result.code === 0 && result.data?.data) {
        // 创建状态映射表
        const deviceStatusMap = new Map<string, DeviceStatus>();
        
        result.data.data.forEach((topic: TopicDetail) => {
          const status: DeviceStatus = {
            online: topic.online,
            msg: topic.msg || ''
          };
          deviceStatusMap.set(topic.topic, status);
        });
        
        // 更新每个设备的在线状态和开关状态 - 创建新数组触发响应式更新
        const updatedDevices = this.controlDevices.map((device, index) => {
          const status = deviceStatusMap.get(device.topic);
          if (status) {
            // 更新在线状态
            device.isOnline = status.online;
            
            // 更新开关状态 - 支持所有类型的开关命令
            // 包括：on, auto_on, pump_on, 1 等
            const msg = status.msg.toLowerCase();
            const isActive = msg.includes('on') || msg === '1' || msg === 'true';
            device.isActive = isActive;
            
            console.info(`[设备状态] ${device.name}: 在线=${status.online}, 状态=${status.msg}, 开关=${isActive ? '开启✓' : '关闭✕'}`);
          }
          return device;
        });
        this.controlDevices = updatedDevices;
      }
      
      this.updateDeviceStatistics();
      console.info('[设备状态] 刷新完成');
    } catch (error) {
      console.error('[设备状态] 刷新失败:', error);
    }
  }

  async refreshSensorData(): Promise<void> {
    try {
      console.info('[首页] 开始刷新传感器数据');
      
      // 分别获取三个传感器主题的最新数据
      // 注意：使用巴法云实际主题名称 tem、light、hum
      const sensorTopics: SimpleSensorTopic[] = [
        { topic: 'tem', name: '温度' } as SimpleSensorTopic,
        { topic: 'light', name: '光照' } as SimpleSensorTopic,
        { topic: 'hum', name: '湿度' } as SimpleSensorTopic
      ];

      let hasData = false;
      let latestUpdateTime = '--:--';
      let tempUpdated = false;
      let humUpdated = false;
      let lightUpdated = false;

      for (const sensor of sensorTopics) {
        try {
          // 获取该主题的最新消息
          const result = await bemfaCloudService.getMessages(sensor.topic, 1, 1);
          
          console.info(`[首页] 查询主题 ${sensor.topic}:`, JSON.stringify(result));
          
          if (result.code === 0 && result.data && result.data.length > 0) {
            const latestData = result.data[0];
            const value = parseFloat(latestData.msg);
            
            console.info(`[首页] ${sensor.name} 原始值: "${latestData.msg}", 解析后: ${value}`);
            
            if (!isNaN(value)) {
              // 根据主题更新对应的状态变量
              if (sensor.topic === 'tem') {
                const newValue = Math.round(value * 10) / 10;  // 保留1位小数
                if (this.lastTempValue !== newValue) {
                  console.info(`[首页] ✅ 温度变化: ${this.lastTempValue}°C -> ${newValue}°C`);
                  this.lastTempValue = newValue;
                }
                this.temperature = newValue;
                tempUpdated = true;
              } else if (sensor.topic === 'light') {
                const newValue = Math.round(value);
                if (this.lastLightValue !== newValue) {
                  console.info(`[首页] ✅ 光照变化: ${this.lastLightValue}Lx -> ${newValue}Lx`);
                  this.lastLightValue = newValue;
                }
                this.lightIntensity = newValue;
                lightUpdated = true;
              } else if (sensor.topic === 'hum') {
                const newValue = Math.round(value * 10) / 10;  // 保留1位小数
                if (this.lastHumValue !== newValue) {
                  console.info(`[首页] ✅ 湿度变化: ${this.lastHumValue}% -> ${newValue}%`);
                  this.lastHumValue = newValue;
                }
                this.soilHumidity = newValue;
                humUpdated = true;
              }
              
              // 更新时间（直接使用返回的时间字符串）
              if (latestData.time) {
                latestUpdateTime = latestData.time;
              }
              hasData = true;
            } else {
              console.warn(`[首页] ${sensor.name} 数据无效: "${latestData.msg}"`);
            }
          } else {
            console.warn(`[首页] ${sensor.name}：暂无数据或API返回失败 (code: ${result.code})`);
          }
        } catch (error) {
          console.error(`[首页] 获取${sensor.name}失败:`, error);
        }
      }

      // 更新最后刷新时间
      if (hasData) {
        this.lastUpdateTime = latestUpdateTime;
        console.info(`[首页] 传感器数据刷新完成 - 温度:${tempUpdated} 湿度:${humUpdated} 光照:${lightUpdated}`);
      } else {
        console.warn('[首页] 未获取到任何传感器数据');
      }
    } catch (error) {
      console.error('[首页] 刷新传感器数据失败:', error);
    }
  }

  /**
   * 从巴法云获取传感器数据（用于控制页面显示）
   * 按照定义顺序依次获取，保证显示顺序固定
   */
  async fetchSensorDataFromBemfa() {
    try {
      console.info('[传感器数据] 开始获取传感器数据');
      
      // 定义需要获取的传感器主题（固定顺序）
      const sensorTopics: SensorTopicConfig[] = [
        { topic: 'tem', name: '温度', unit: '°C', icon: '🌡️', color: '#FF6B6B' } as SensorTopicConfig,
        { topic: 'light', name: '光照', unit: 'Lx', icon: '☀️', color: '#FFD93D' } as SensorTopicConfig,
        { topic: 'hum', name: '湿度', unit: '%', icon: '💧', color: '#4ECDC4' } as SensorTopicConfig,
        { topic: 'soil', name: '土壤湿度', unit: '%', icon: '🌱', color: '#95E1D3' } as SensorTopicConfig,
        { topic: 'water', name: '水位', unit: 'cm', icon: '🌊', color: '#3D5AFE' } as SensorTopicConfig
      ];

      const newSensorDataList: SensorData[] = [];

      // 按顺序依次获取传感器数据，保证顺序固定
      for (const sensor of sensorTopics) {
        try {
          const result = await bemfaCloudService.getMessages(sensor.topic, 1, 1);
          
          if (result.code === 0 && result.data && result.data.length > 0) {
            const latestData = result.data[0];
            const value = (latestData.msg ?? '').toString().trim() || '--';
            const lastUpdateTime = this.normalizeBemfaTime(latestData.time, latestData.unix);
            const sensorData: SensorData = {
              name: sensor.name,
              topic: sensor.topic,
              value,
              unit: sensor.unit,
              icon: sensor.icon,
              color: sensor.color,
              lastUpdateTime
            };
            newSensorDataList.push(sensorData);
            console.info(`[传感器数据] ${sensor.name}: ${latestData.msg}${sensor.unit} (${latestData.time})`);
          } else {
            newSensorDataList.push({
              name: sensor.name,
              topic: sensor.topic,
              value: '--',
              unit: sensor.unit,
              icon: sensor.icon,
              color: sensor.color,
              lastUpdateTime: '--'
            } as SensorData);
            console.warn(`[传感器数据] ${sensor.name}：暂无数据`);
          }
        } catch (error) {
          newSensorDataList.push({
            name: sensor.name,
            topic: sensor.topic,
            value: '--',
            unit: sensor.unit,
            icon: sensor.icon,
            color: sensor.color,
            lastUpdateTime: '--'
          } as SensorData);
          console.error(`[传感器数据] 获取${sensor.name}失败:`, error);
        }
      }

      // 更新传感器数据列表
      this.sensorDataList = newSensorDataList;
      console.info('[传感器数据] 获取完成，共', this.sensorDataList.length, '个传感器');

    } catch (error) {
      console.error('[传感器数据] 获取传感器数据异常:', error);
    }
  }

  private normalizeBemfaTime(time?: string, unix?: number): string {
    const t = (time ?? '').toString().trim();
    if (t && t !== '--' && !t.startsWith('1970-01-01')) {
      return t;
    }
    if (typeof unix === 'number' && unix > 0) {
      const date = new Date(unix * 1000);
      const yyyy = date.getFullYear().toString().padStart(4, '0');
      const mm = (date.getMonth() + 1).toString().padStart(2, '0');
      const dd = date.getDate().toString().padStart(2, '0');
      const hh = date.getHours().toString().padStart(2, '0');
      const mi = date.getMinutes().toString().padStart(2, '0');
      const ss = date.getSeconds().toString().padStart(2, '0');
      return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
    }
    return '--';
  }

  /**
   * 根据设备主题和状态获取控制命令
   * @param topic 设备主题
   * @param isActive 是否开启
   * @returns 控制命令字符串
   */
  private getDeviceCommand(topic: string, isActive: boolean): string {
    // 特殊设备命令映射（根据巴法云主题名称）
    const specialCommands: Record<string, DeviceCommand> = {
      'auto': { on: 'auto_on', off: 'auto_off' },        // 自动水泵
      'pump': { on: 'pump_on', off: 'pump_off' },        // 手动水泵
      'buzzerctrl': { on: 'on', off: 'off' },            // 蜂鸣控制
      'ledctrl': { on: 'on', off: 'off' },               // LED控制
      'humctrl': { on: 'on', off: 'off' }                // 湿度控制
    };
    
    // 如果是特殊设备，返回对应命令
    if (specialCommands[topic]) {
      const cmd = isActive ? specialCommands[topic].on : specialCommands[topic].off;
      console.info(`[命令映射] 主题=${topic}, 状态=${isActive ? '开' : '关'}, 命令=${cmd}`);
      return cmd;
    }
    
    // 默认设备统一使用 on/off
    console.info(`[命令映射] 主题=${topic}, 状态=${isActive ? '开' : '关'}, 命令=${isActive ? 'on' : 'off'}`);
    return isActive ? 'on' : 'off';
  }

  /**
   * 控制设备开关（使用官方GET方式API）
   * 遵循官方文档：GET https://apis.bemfa.com/va/sendMessage
   * 支持不同设备类型的特定控制命令
   */
  async toggleDeviceMQTT(deviceId: number, isActive: boolean) {
    const device = this.controlDevices.find(d => d.id === deviceId);
    if (!device) {
      console.error('[设备控制] 未找到设备:', deviceId);
      return;
    }
    
    // 根据设备主题获取对应的控制命令
    const command = this.getDeviceCommand(device.topic, isActive);
    
    console.info('[设备控制] 准备控制设备:', device.name, '主题:', device.topic, '命令:', command);
    
    try {
      // 使用官方GET方式API控制设备
      const result = await bemfaCloudService.sendMessage(
        device.topic,           // topic: 主题名称
        command,                // msg: 消息内容（on/off）
        BemfaConfig.PROTOCOL_TYPE_MQTT_V1  // type: 1=MQTT协议
      );
      
      if (result.code === 0) {
        console.info('[设备控制] ✅ 控制成功:', device.name, '→', command);
        // 更新设备状态 - 重新赋值数组以触发UI更新
        const deviceIndex = this.controlDevices.findIndex(d => d.id === deviceId);
        if (deviceIndex !== -1) {
          // 创建新数组触发响应式更新
          const updatedDevices = [...this.controlDevices];
          updatedDevices[deviceIndex].isActive = isActive;
          this.controlDevices = updatedDevices;
          this.updateDeviceStatistics();
          console.info('[设备控制] UI状态已更新:', device.name, '→', isActive ? '开启' : '关闭');
        }
      } else {
        console.error('[设备控制] ❌ 控制失败 code:', result.code, 'message:', result.message);
      }
    } catch (error) {
      console.error('[设备控制] ❌ 控制异常:', error);
    }
  }

  /**
   * 批量控制所有设备（使用官方GET方式API）
   * 遵循官方文档：GET https://apis.bemfa.com/va/sendMessage
   * 支持不同设备类型的特定控制命令
   */
  async toggleAllDevicesMQTT(isActive: boolean): Promise<void> {
    console.info('[设备控制] 批量控制所有设备');
    
    // 使用for循环依次控制每个设备
    for (const device of this.controlDevices) {
      try {
        // 根据设备主题获取对应的控制命令
        const command = this.getDeviceCommand(device.topic, isActive);
        
        const result = await bemfaCloudService.sendMessage(
          device.topic,
          command,
          BemfaConfig.PROTOCOL_TYPE_MQTT_V1
        );
        
        if (result.code === 0) {
          const deviceIndex = this.controlDevices.findIndex((d: ControlDevice) => d.id === device.id);
          if (deviceIndex !== -1) {
            this.controlDevices[deviceIndex].isActive = isActive;
          }
          console.info('[设备控制] ✅', device.name, '→', command);
        } else {
          console.error('[设备控制] ❌', device.name, '控制失败 code:', result.code);
        }
        
        // 避免请求过快，延迟200ms
        await new Promise<void>((resolve: Function) => setTimeout(resolve, 200));
      } catch (error) {
        console.error('[设备控制] ❌', device.name, '控制异常:', error);
      }
    }
    
    this.updateDeviceStatistics();
    console.info('[设备控制] 批量控制完成');
  }

  updateDeviceStatistics(): void {
    this.activeDeviceCount = this.controlDevices.filter((d: ControlDevice) => d.isActive).length;
    this.onlineDeviceCount = this.controlDevices.filter((d: ControlDevice) => d.isOnline).length;
  }

  async confirmEditDeviceName() {
    if (!this.editingDevice || !this.newDeviceName.trim()) return;
    
    try {
      const result = await bemfaCloudService.modifyTopicName(
        this.editingDevice.topic,
        this.newDeviceName.trim(),
        BemfaConfig.PROTOCOL_TYPE_MQTT_V1
      );
      
      if (result.code === 0) {
        const deviceIndex = this.controlDevices.findIndex(d => d.id === this.editingDevice!.id);
        if (deviceIndex !== -1) {
          this.controlDevices[deviceIndex].name = this.newDeviceName.trim();
        }
        this.showEditNameDialog = false;
      }
    } catch (error) {
      console.error('[控制] 修改昵称异常:', error);
    }
  }

  handleMQTTMessage(message: MqttMessage) {
    const deviceIndex = this.controlDevices.findIndex(d => d.topic === message.topic);
    if (deviceIndex === -1) return;
    
    const payload = message.payload.toLowerCase();
    const device = this.controlDevices[deviceIndex];
    
    if (message.topic.endsWith('004') || device.deviceType === '传感器') {
      this.parseSensorData(message.payload);
    }
    
    if (payload === 'on' || payload === '1') this.controlDevices[deviceIndex].isActive = true;
    else if (payload === 'off' || payload === '0') this.controlDevices[deviceIndex].isActive = false;
    
    this.controlDevices[deviceIndex].isOnline = true;
    this.updateDeviceStatistics();
  }

  parseSensorData(payload: string) {
    let temperature: number | undefined;
    let humidity: number | undefined;
    let lightIntensity: number | undefined;
    
    try {
      const data: Record<string, number> = JSON.parse(payload) as Record<string, number>;
      if (data.temperature !== undefined) { this.temperature = Math.round(data.temperature); temperature = data.temperature; }
      if (data.humidity !== undefined) { this.soilHumidity = Math.round(data.humidity); humidity = data.humidity; }
      if (data.light !== undefined) { this.lightIntensity = Math.round(data.light); lightIntensity = data.light; }
    } catch (e) {
      const pairs = payload.split(',');
      pairs.forEach(pair => {
        const parts = pair.split(':');
        if (parts.length === 2) {
          const numValue = parseFloat(parts[1]);
          if (!isNaN(numValue)) {
            if (parts[0] === 'temp' || parts[0] === 'temperature') { this.temperature = Math.round(numValue); temperature = numValue; }
            else if (parts[0] === 'humi' || parts[0] === 'humidity' || parts[0] === 'soil') { this.soilHumidity = Math.round(numValue); humidity = numValue; }
            else if (parts[0] === 'light' || parts[0] === 'lux') { this.lightIntensity = Math.round(numValue); lightIntensity = numValue; }
          }
        }
      });
    }
    
    this.updateAnalysisData();
    this.uploadSensorDataToServer(temperature, humidity, lightIntensity);
  }

  private async uploadSensorDataToServer(temperature?: number, humidity?: number, lightIntensity?: number) {
    if (temperature === undefined && humidity === undefined && lightIntensity === undefined) return;
    
    try {
      const uploadData: SensorDataUploadRequest = {
        device_topic: 'farm001',
        temperature: temperature,
        humidity: humidity,
        light_intensity: lightIntensity
      };
      
      if (this.userProfile.id > 0) uploadData.user_id = this.userProfile.id;
      
      const response = await apiService.uploadSensorData(uploadData);
      if (response.success) {
        console.info('[传感器上传] ✅ 上传成功');
      }
    } catch (error) {
      console.error('[传感器上传] ❌ 上传异常:', error);
    }
  }

  updateAnalysisData() {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    this.lastUpdateTime = timeStr;
    
    this.analysisData.unshift({
      date: timeStr,
      temperature: this.temperature,
      humidity: this.soilHumidity,
      soilMoisture: this.lightIntensity,
      yield: 0
    });
    
    if (this.analysisData.length > 10) this.analysisData.pop();
    this.updateTodayStats();
  }

  updateTodayStats() {
    if (this.analysisData.length === 0) return;
    
    const temps = this.analysisData.map(d => d.temperature);
    this.todayMaxTemp = Math.max(...temps);
    this.todayMinTemp = Math.min(...temps);
    
    const humidities = this.analysisData.map(d => d.humidity);
    this.todayMaxHumidity = Math.max(...humidities);
    this.todayMinHumidity = Math.min(...humidities);
  }

  // 认证相关方法
  private validateLoginForm(): boolean {
    if (!this.username.trim()) { this.errorMessage = '请输入用户名'; return false; }
    if (!this.password.trim()) { this.errorMessage = '请输入密码'; return false; }
    if (this.password.length < 6) { this.errorMessage = '密码长度不能少于6位'; return false; }
    this.errorMessage = '';
    return true;
  }

  private validateRegisterForm(): boolean {
    if (!this.username.trim()) { this.errorMessage = '请输入用户名'; return false; }
    if (!this.phone.trim()) { this.errorMessage = '请输入手机号'; return false; }
    if (!this.email.trim()) { this.errorMessage = '请输入邮箱'; return false; }
    if (!this.password.trim()) { this.errorMessage = '请输入密码'; return false; }
    if (this.password.length < 6) { this.errorMessage = '密码长度不能少于6位'; return false; }
    if (this.password !== this.confirmPassword) { this.errorMessage = '两次输入的密码不一致'; return false; }
    this.errorMessage = '';
    return true;
  }

  private async handleLogin(): Promise<void> {
    if (!this.validateLoginForm()) return;
    
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    try {
      const response = await apiService.login({
        login: this.username.trim(),
        password: this.password
      });
      
      if (response.success && response.data) {
        this.userProfile = {
          id: response.data.user.id,
          username: response.data.user.username,
          email: response.data.user.email,
          phone: response.data.user.phone || '',
          avatar: response.data.user.avatar || '👤',
          bio: response.data.user.bio || '智慧农业用户',
          user_mode: response.data.user.user_mode,
          is_admin: response.data.user.is_admin || 0
        };
        
        this.isLoggedIn = true;
        this.userMode = 'logged_in';
        this.currentView = 'main';
        this.successMessage = '登录成功！';
        this.clearForm();
      } else {
        this.errorMessage = response.message || '登录失败';
      }
    } catch (error) {
      this.errorMessage = '网络连接失败';
    } finally {
      this.isLoading = false;
    }
  }

  private async handleRegister(): Promise<void> {
    if (!this.validateRegisterForm()) return;
    
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    try {
      const response = await apiService.register({
        username: this.username.trim(),
        email: this.email.trim(),
        phone: this.phone.trim(),
        password: this.password
      });
      
      if (response.success && response.data) {
        if (response.data.token) apiService.setToken(response.data.token);
        
        this.userProfile = {
          id: response.data.user.id,
          username: response.data.user.username,
          email: response.data.user.email,
          phone: response.data.user.phone || '',
          avatar: response.data.user.avatar || '👤',
          bio: response.data.user.bio || '智慧农业用户',
          user_mode: response.data.user.user_mode,
          is_admin: response.data.user.is_admin || 0
        };
        
        this.successMessage = '注册成功！';
        setTimeout(() => {
          this.isLoggedIn = true;
          this.userMode = 'logged_in';
          this.currentView = 'main';
          this.clearForm();
          this.successMessage = '';
        }, 1000);
      } else {
        this.errorMessage = response.message || '注册失败';
      }
    } catch (error) {
      this.errorMessage = '网络连接失败';
    } finally {
      this.isLoading = false;
    }
  }

  private async handleLogout(): Promise<void> {
    this.isLoading = true;
    try {
      await apiService.logout();
    } catch (error) {
      console.error('登出异常:', error);
    } finally {
      this.isLoggedIn = false;
      this.userMode = 'guest';
      this.currentView = 'main';
      this.userProfile = {
        id: 0, username: '', email: '', phone: '', avatar: '👤',
        bio: '智慧农业用户', user_mode: 'guest', is_admin: 0
      };
      this.clearForm();
      this.isLoading = false;
    }
  }

  private handleGuestMode(): void {
    this.isLoggedIn = false;
    this.userMode = 'guest';
    this.currentView = 'main';
    this.clearForm();
  }

  private clearForm(): void {
    this.username = '';
    this.password = '';
    this.confirmPassword = '';
    this.email = '';
    this.phone = '';
    this.errorMessage = '';
    this.successMessage = '';
  }

  private switchToRegister(): void {
    this.currentView = 'register';
    this.clearForm();
  }

  private switchToLogin(): void {
    this.currentView = 'login';
    this.clearForm();
  }

  // AI相关方法
  initAIService() {
    cozeService.init();
    this.aiQuickQuestions = cozeService.getQuickReplies();
    this.addWelcomeMessage();
  }

  addWelcomeMessage() {
    this.aiMessages.push({
      role: 'assistant',
      content: '你好！我是智慧农场AI助手🌾\n\n我可以：\n• 分析实时传感器数据\n• 提供种植建议\n• 回答农业问题\n• 给出优化方案\n\n请告诉我你想了解什么？',
      timestamp: Date.now()
    });
  }

  async sendAIMessage(userText: string) {
    let fullMessage = userText;
    let attachedFileId: string = '';
    
    if (this.temperature > 0 || this.soilHumidity > 0 || this.lightIntensity > 0) {
      fullMessage += `\n\n【当前环境数据】`;
      if (this.temperature > 0) fullMessage += `\n温度: ${this.temperature}°C`;
      if (this.soilHumidity > 0) fullMessage += `\n湿度: ${this.soilHumidity}%`;
      if (this.lightIntensity > 0) fullMessage += `\n光照: ${this.lightIntensity}Lx`;
    }
    
    this.aiMessages.push({ role: 'user', content: userText, timestamp: Date.now() });
    setTimeout((): void => { this.aiChatScroller.scrollEdge(Edge.Bottom); }, 100);
    
    this.isAILoading = true;
    
    const assistantMsg: AIMessage = { role: 'assistant', content: '', timestamp: Date.now() };
    this.aiMessages.push(assistantMsg);
    const aiMessageIndex = this.aiMessages.length - 1;
    
    // 如果存在挂载的图片，先上传获取file_id，再与文本一起发送
    if (this.pendingImageUri && this.pendingImageUri.length > 0) {
      hilog.info(DOMAIN, TAG_INDEX, '[sendAIMessage] pending image uri=%{public}s', this.pendingImageUri);
      try {
        cozeService.init();
        const filename = 'image_' + Date.now();
        const upload = await cozeService.uploadImageFromUri(this.pendingImageUri, filename);
        if (upload && upload.success && upload.file_id) {
          hilog.info(DOMAIN, TAG_INDEX, '[sendAIMessage] upload ok file_id=%{public}s', upload.file_id as string);
          attachedFileId = upload.file_id;
          // 在消息体中附加文件ID，确保AI能关联到该图片
          fullMessage += `\n\n【附件】图片文件ID: ${attachedFileId}`;
        } else {
          hilog.error(DOMAIN, TAG_INDEX, '[sendAIMessage] upload fail msg=%{public}s', String(upload?.message));
          this.aiMessages.push({ role: 'assistant', content: '图片附件上传失败', timestamp: Date.now() });
        }
      } catch (e) {
        hilog.error(DOMAIN, TAG_INDEX, '[sendAIMessage] upload exception %{public}s', JSON.stringify(e));
        this.aiMessages.push({ role: 'assistant', content: '图片附件上传异常', timestamp: Date.now() });
      } finally {
        // 清理挂载的附件，避免重复使用
        this.pendingImageUri = '';
      }
    }

    const useWithImage = attachedFileId && attachedFileId.length > 0;
    if (useWithImage) {
      await cozeService.sendMessageWithOptionalImage(
        fullMessage,
        attachedFileId,
        (deltaContent: string): void => {
          this.aiMessages[aiMessageIndex].content += deltaContent;
          this.aiMessages = [...this.aiMessages];
          setTimeout((): void => { this.aiChatScroller.scrollEdge(Edge.Bottom); }, 50);
        },
        (fullContent: string): void => {
          this.isAILoading = false;
          if (fullContent && this.aiMessages[aiMessageIndex].content !== fullContent) {
            this.aiMessages[aiMessageIndex].content = fullContent;
          }
          if (!this.aiMessages[aiMessageIndex].content) {
            this.aiMessages[aiMessageIndex].content = '抱歉，AI暂时没有回复。';
          }
          this.aiMessages = [...this.aiMessages];
          setTimeout((): void => { this.aiChatScroller.scrollEdge(Edge.Bottom); }, 100);
        },
        (error: string): void => {
          this.isAILoading = false;
          this.aiMessages[aiMessageIndex].content = `错误: ${error}`;
          this.aiMessages = [...this.aiMessages];
        }
      );
    } else {
      await cozeService.sendMessage(
        fullMessage,
        (deltaContent: string): void => {
          this.aiMessages[aiMessageIndex].content += deltaContent;
          this.aiMessages = [...this.aiMessages];
          setTimeout((): void => { this.aiChatScroller.scrollEdge(Edge.Bottom); }, 50);
        },
        (fullContent: string): void => {
          this.isAILoading = false;
          if (fullContent && this.aiMessages[aiMessageIndex].content !== fullContent) {
            this.aiMessages[aiMessageIndex].content = fullContent;
          }
          if (!this.aiMessages[aiMessageIndex].content) {
            this.aiMessages[aiMessageIndex].content = '抱歉，AI暂时没有回复。';
          }
          this.aiMessages = [...this.aiMessages];
          setTimeout((): void => { this.aiChatScroller.scrollEdge(Edge.Bottom); }, 100);
        },
        (error: string): void => {
          this.isAILoading = false;
          this.aiMessages[aiMessageIndex].content = `错误: ${error}`;
          this.aiMessages = [...this.aiMessages];
        }
      );
    }
  }

  async pickAndUploadImage() {
    try {
      const ctx = this.getUIContext().getHostContext() as common.UIAbilityContext;
      const photoPicker = new picker.PhotoViewPicker(ctx);
      const selectOptions = new picker.PhotoSelectOptions();
      selectOptions.MIMEType = picker.PhotoViewMIMETypes.IMAGE_TYPE;
      selectOptions.maxSelectNumber = 1;
      const result: picker.PhotoSelectResult = await photoPicker.select(selectOptions);
      const uris: string[] = result.photoUris;
      if (!uris || uris.length === 0) {
        return;
      }
      const uri = uris[0];
      hilog.info(DOMAIN, TAG_INDEX, '[pickAndUploadImage] selected uri=%{public}s', uri);
      // 仅挂载图片，不立即上传；在用户点击发送时与文本一并处理
      this.pendingImageUri = uri;
      this.aiMessages.push({ role: 'user', content: '已选择图片', timestamp: Date.now(), imageUri: uri });
      setTimeout((): void => { this.aiChatScroller.scrollEdge(Edge.Bottom); }, 50);
    } catch (_) {
      hilog.error(DOMAIN, TAG_INDEX, '[pickAndUploadImage] select fail');
      this.aiMessages.push({ role: 'assistant', content: '未选择图片或选择失败', timestamp: Date.now() });
    }
  }

  async pickAndTranscribeAudio() {
    try {
      const ctx = this.getUIContext().getHostContext() as common.UIAbilityContext;
      const docPicker = new picker.DocumentViewPicker(ctx);
      const selectOptions = new picker.DocumentSelectOptions();
      selectOptions.maxSelectNumber = 1;
      const uris: string[] = await docPicker.select(selectOptions) as Array<string>;
      if (!uris || uris.length === 0) {
        return;
      }
      const uri = uris[0];
      hilog.info(DOMAIN, TAG_INDEX, '[pickAndTranscribeAudio] selected uri=%{public}s', uri);
      cozeService.init();
      const filename = 'audio_' + Date.now();
      const resp = await cozeService.transcribeAudioFromUri(uri, filename);
      if (resp && resp.success && resp.text) {
        this.aiInputText = resp.text;
        setTimeout((): void => { this.aiChatScroller.scrollEdge(Edge.Bottom); }, 50);
      } else {
        this.aiMessages.push({ role: 'assistant', content: '语音转写失败', timestamp: Date.now() });
      }
    } catch (_) {
      hilog.error(DOMAIN, TAG_INDEX, '[pickAndTranscribeAudio] select/transcribe fail');
      this.aiMessages.push({ role: 'assistant', content: '未选择音频或转写异常', timestamp: Date.now() });
    }
  }

  // 用户页面方法
  getMenuItemsForCurrentMode(): ProfileMenuItem[] {
    if (this.userMode === 'guest') {
      return this.menuItems.filter(item => item.id === 'help' || item.id === 'about');
    } else if (this.userMode === 'logged_in') {
      return this.menuItems;
    }
    return [];
  }

  handleMenuItemClick(itemId: string) {
    if (this.userMode === 'guest' && itemId === 'settings') {
      this.userMode = 'not_logged_in';
      this.currentView = 'login';
      return;
    }

    if (itemId === 'settings') {
      promptAction.showToast({ message: '该功能已移除', duration: 2000 });
      return;
    }

    if (itemId === 'logout') this.handleLogout();

    if (itemId === 'help' || itemId === 'about') {
      promptAction.showToast({ message: '功能开发中', duration: 2000 });
    }
  }

  // 辅助方法
  getMqttStatusIcon(): string {
    switch (this.mqttStatus) {
      case MqttStatus.CONNECTED: return '🟢';
      case MqttStatus.CONNECTING:
      case MqttStatus.RECONNECTING: return '🟡';
      case MqttStatus.ERROR: return '🔴';
      default: return '⚪';
    }
  }

  getMqttStatusColor(): string {
    switch (this.mqttStatus) {
      case MqttStatus.CONNECTED: return '#4CAF50';
      case MqttStatus.CONNECTING:
      case MqttStatus.RECONNECTING: return '#FF9800';
      case MqttStatus.ERROR: return '#F44336';
      default: return '#999999';
    }
  }

  getMaskedUID(): string {
    if (!this.bemfaUID || this.bemfaUID.length < 8) return '未配置';
    return this.bemfaUID.substring(0, 4) + '***' + this.bemfaUID.substring(this.bemfaUID.length - 4);
  }

  getDeviceTypeName(deviceType?: string): string {
    const typeMap: Record<string, string> = {
      'outlet': '插座', 'light': '灯泡', 'fan': '风扇', 'sensor': '传感器',
      'aircondition': '空调', 'switch': '开关', 'curtain': '窗帘',
      'thermostat': '温控器', 'waterheater': '热水器', 'television': '电视',
      'airpurifier': '空气净化器'
    };
    return typeMap[deviceType || ''] || '开关';
  }

  getWeatherDescription(): string {
    if (this.temperature === 0 && this.soilHumidity === 0) return '等待数据...';
    if (this.temperature > 30) return '炎热天气';
    if (this.temperature > 25) return '温暖天气';
    if (this.temperature > 18) return '舒适天气';
    if (this.temperature > 10) return '凉爽天气';
    return '寒冷天气';
  }

  getWeatherIcon(): string {
    if (this.temperature === 0 && this.soilHumidity === 0) return '⏳';
    if (this.lightIntensity > 800) return '☀️';
    if (this.lightIntensity > 500) return '🌤️';
    if (this.lightIntensity > 200) return '☁️';
    return '🌧️';
  }
}
