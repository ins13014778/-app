/**
 * 智慧农场主页 - 重构版本（模块化）
 * 功能：登录认证、首页监控、设备控制、数据分析、用户中心
 */
import { apiService, LoginRequest, RegisterRequest, SensorDataUploadRequest } from '../services/ApiService';
import { mqttService, MqttStatus, MqttMessage } from '../services/MqttService';
import { bemfaCloudService, TopicDetail, MessageRecord } from '../services/BemfaCloudService';
import cozeService from '../services/CozeService';
import { BemfaConfig } from '../config/BemfaConfig';
import { router } from '@kit.ArkUI';
import { common } from '@kit.AbilityKit';
import { preferences } from '@kit.ArkData';

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

@Entry
@Component
struct Index {
  // ========== 传感器数据状态 ==========
  @State soilHumidity: number = 0;
  @State temperature: number = 0;
  @State lightIntensity: number = 0;
  @State date: string = '10月10日';
  @State lastUpdateTime: string = '--:--';
  @State todayMaxTemp: number = 0;
  @State todayMinTemp: number = 0;
  @State todayMaxHumidity: number = 0;
  @State todayMinHumidity: number = 0;

  // ========== 用户认证状态 ==========
  @State currentIndex: number = 0;
  @State isLoggedIn: boolean = false;
  @State userMode: string = 'not_logged_in';
  @State currentView: string = 'login';
  @State username: string = '';
  @State password: string = '';
  @State confirmPassword: string = '';
  @State email: string = '';
  @State phone: string = '';
  @State isLoading: boolean = false;
  @State errorMessage: string = '';
  @State successMessage: string = '';
  @State userProfile: UserProfile = {
    id: 0,
    username: '',
    email: '',
    phone: '',
    avatar: '👤',
    bio: '智慧农业用户',
    user_mode: 'not_logged_in',
    is_admin: 0
  };

  // ========== 设备控制状态 ==========
  @State controlDevices: ControlDevice[] = [];
  @State activeDeviceCount: number = 0;
  @State onlineDeviceCount: number = 0;
  @State mqttStatus: MqttStatus = MqttStatus.DISCONNECTED;
  @State mqttStatusText: string = '未连接';
  @State bemfaUID: string = '';
  @State showEditNameDialog: boolean = false;
  @State editingDevice: ControlDevice | null = null;
  @State newDeviceName: string = '';

  // ========== AI聊天状态 ==========
  @State aiMessages: AIMessage[] = [];
  @State aiInputText: string = '';
  @State isAILoading: boolean = false;
  @State aiQuickQuestions: string[] = [];
  private aiChatScroller: Scroller = new Scroller();

  // ========== 分析数据状态 ==========
  @State analysisData: AnalysisData[] = [];
  @State selectedDataType: string = '温度';

  // ========== 用户菜单 ==========
  @State menuItems: ProfileMenuItem[] = [
    { id: 'profile', title: '个人资料', icon: '个人资料.png', hasArrow: true },
    { id: 'settings', title: '系统设置', icon: '系统设置.png', hasArrow: true },
    { id: 'help', title: '帮助与反馈', icon: '帮助与反馈.png', hasArrow: true },
    { id: 'about', title: '关于我们', icon: '关于我们.png', hasArrow: true },
    { id: 'logout', title: '退出登录', icon: '退出登录.png', hasArrow: false }
  ];

  // 定时器
  private dateTimerID: number = -1;
  private dataRefreshTimerID: number = -1;
  private sensorDataRefreshTimerID: number = -1;

  // ========== 生命周期方法 ==========
  aboutToAppear() {
    console.info('[Index] 页面即将显示');
    apiService.setContext(this.getUIContext().getHostContext() as common.UIAbilityContext);
    this.loadBemfaUID();
    this.updateDateTime();
    
    // 启动定时器
    this.dateTimerID = setInterval(() => this.updateDateTime(), 60000);
    this.dataRefreshTimerID = setInterval(() => {
      if (this.controlDevices.length > 0) this.refreshDeviceOnlineStatus();
    }, 30000);
    this.sensorDataRefreshTimerID = setInterval(() => {
      if (this.controlDevices.length > 0) this.refreshSensorData();
    }, 10000);

    this.initAIService();
  }

  aboutToDisappear() {
    console.info('[Index] 页面即将销毁');
    if (this.dateTimerID !== -1) clearInterval(this.dateTimerID);
    if (this.dataRefreshTimerID !== -1) clearInterval(this.dataRefreshTimerID);
    if (this.sensorDataRefreshTimerID !== -1) clearInterval(this.sensorDataRefreshTimerID);
    mqttService.disconnect();
  }

  // ========== UI构建 ==========
  build() {
    Stack() {
      if (this.userMode === 'not_logged_in') {
        // 未登录：显示登录或注册
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
        // 已登录或游客模式：显示主应用
        Tabs({ barPosition: BarPosition.End, index: this.currentIndex }) {
          // 首页
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
              getMqttStatusIcon: () => this.getMqttStatusIcon(),
              getMqttStatusColor: () => this.getMqttStatusColor()
            })
          }.tabBar(this.TabBuilder('首页', 0))

          // 控制页
          TabContent() {
            ControlPage({
              controlDevices: $controlDevices,
              mqttStatus: $mqttStatus,
              mqttStatusText: $mqttStatusText,
              bemfaUID: $bemfaUID,
              onlineDeviceCount: $onlineDeviceCount,
              activeDeviceCount: $activeDeviceCount,
              getMqttStatusIcon: () => this.getMqttStatusIcon(),
              getMqttStatusColor: () => this.getMqttStatusColor(),
              getMaskedUID: () => this.getMaskedUID(),
              toggleAllDevicesMQTT: (isActive: boolean) => this.toggleAllDevicesMQTT(isActive),
              refreshDeviceOnlineStatus: () => this.refreshDeviceOnlineStatus(),
              syncDevicesFromBemfa: () => this.syncDevicesFromBemfa(),
              onToggleDevice: (id: number, isOn: boolean) => this.toggleDeviceMQTT(id, isOn),
              onEditDeviceName: (device: ControlDevice) => {
                this.editingDevice = device;
                this.newDeviceName = device.name;
                this.showEditNameDialog = true;
              }
            })
          }.tabBar(this.TabBuilder('控制', 1))

          // 分析页
          TabContent() {
            AnalysisPage({
              temperature: $temperature,
              soilHumidity: $soilHumidity,
              lightIntensity: $lightIntensity,
              aiMessages: $aiMessages,
              aiInputText: $aiInputText,
              isAILoading: $isAILoading,
              aiQuickQuestions: $aiQuickQuestions,
              aiChatScroller: $aiChatScroller,
              getWeatherDescription: () => this.getWeatherDescription(),
              getWeatherIcon: () => this.getWeatherIcon(),
              sendAIMessage: (msg: string) => this.sendAIMessage(msg),
              addWelcomeMessage: () => this.addWelcomeMessage()
            })
          }.tabBar(this.TabBuilder('分析', 2))

          // 我的页
          TabContent() {
            ProfilePage({
              userMode: $userMode,
              userProfile: $userProfile,
              menuItems: $menuItems,
              getMenuItemsForCurrentMode: () => this.getMenuItemsForCurrentMode(),
              handleMenuItemClick: (id: string) => this.handleMenuItemClick(id),
              switchToLogin: () => {
                this.userMode = 'not_logged_in';
                this.currentView = 'login';
              }
            })
          }.tabBar(this.TabBuilder('我的', 3))
        }
        .onChange((index: number) => { this.currentIndex = index; })
        .width('100%')
        .height('100%')
        .backgroundColor('#F5F5F5')
      }

      // 编辑设备名称对话框
      EditDeviceNameDialog({
        showDialog: $showEditNameDialog,
        editingDevice: $editingDevice,
        newDeviceName: $newDeviceName,
        onConfirm: () => this.confirmEditDeviceName()
      })
    }
    .width('100%')
    .height('100%')
  }

  // ========== 底部Tab构建器 ==========
  @Builder
  TabBuilder(title: string, index: number) {
    Column() {
      if (this.currentIndex === index) {
        Image(index === 0 ? $rawfile('首页.png') :
          index === 1 ? $rawfile('控制.png') :
          index === 2 ? $rawfile('分析.png') : $rawfile('我的.png'))
          .width(28)
          .height(28)
          .fillColor('#4facfe')
      } else {
        Image(index === 0 ? $rawfile('首页.png') :
          index === 1 ? $rawfile('控制.png') :
          index === 2 ? $rawfile('分析.png') : $rawfile('我的.png'))
          .width(24)
          .height(24)
          .fillColor('#999999')
          .opacity(0.6)
      }

      Text(title)
        .fontSize(this.currentIndex === index ? 12 : 11)
        .fontColor(this.currentIndex === index ? '#4facfe' : '#999999')
        .fontWeight(this.currentIndex === index ? FontWeight.Bold : FontWeight.Normal)
        .margin({ top: 4 })
    }
    .width('100%')
    .padding({ top: 8, bottom: 8 })
    .justifyContent(FlexAlign.Center)
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

  subscribeAllDevices() {
    this.controlDevices.forEach(device => {
      mqttService.subscribe(device.topic);
    });
    this.refreshDeviceOnlineStatus();
  }

  async syncDevicesFromBemfa() {
    const result = await bemfaCloudService.getAllTopics(1);
    if (result.code === 0 && result.data?.data) {
      this.controlDevices = result.data.data.map((topic: TopicDetail, index: number): ControlDevice => ({
        id: index + 1,
        name: topic.name || topic.topic,
        topic: topic.topic,
        isActive: topic.msg === 'on' || topic.msg === '1',
        isOnline: topic.online,
        area: topic.room || '未分组',
        deviceType: this.getDeviceTypeName(topic.deviceType)
      }));
      
      this.controlDevices.forEach(device => {
        if ((device.topic.endsWith('004') || device.deviceType === '传感器') && 
            result.data.data.find((t: TopicDetail) => t.topic === device.topic)?.msg) {
          this.parseSensorData(result.data.data.find((t: TopicDetail) => t.topic === device.topic).msg);
        }
      });
      
      this.updateDeviceStatistics();
      if (this.mqttStatus === MqttStatus.CONNECTED) this.subscribeAllDevices();
    }
  }

  async refreshDeviceOnlineStatus() {
    try {
      const result = await bemfaCloudService.getAllTopics(1);
      if (result.code === 0 && result.data?.data) {
        const onlineMap = new Map<string, boolean>();
        result.data.data.forEach((topic: TopicDetail) => onlineMap.set(topic.topic, topic.online));
        
        this.controlDevices.forEach((device, index) => {
          this.controlDevices[index].isOnline = onlineMap.get(device.topic) || false;
        });
      }
      this.updateDeviceStatistics();
    } catch (error) {
      console.error('[控制] 刷新在线状态失败:', error);
    }
  }

  async refreshSensorData() {
    try {
      const result = await bemfaCloudService.getAllTopics(1);
      if (result.code === 0 && result.data?.data) {
        const sensorDevices = result.data.data.filter((topic: TopicDetail) =>
          topic.topic.endsWith('004') || topic.deviceType === 'sensor');
        if (sensorDevices.length > 0 && sensorDevices[0].msg) {
          this.parseSensorData(sensorDevices[0].msg);
        }
      }
    } catch (error) {
      console.error('[首页] 刷新传感器数据失败:', error);
    }
  }

  toggleDeviceMQTT(deviceId: number, isActive: boolean) {
    const device = this.controlDevices.find(d => d.id === deviceId);
    if (!device) return;
    
    const command = isActive ? 'on' : 'off';
    const topic = `${device.topic}/set`;
    
    mqttService.publish(topic, command, 1, false).then((success) => {
      if (success) {
        const deviceIndex = this.controlDevices.findIndex(d => d.id === deviceId);
        if (deviceIndex !== -1) {
          this.controlDevices[deviceIndex].isActive = isActive;
          this.updateDeviceStatistics();
        }
      }
    });
  }

  toggleAllDevicesMQTT(isActive: boolean) {
    const command = isActive ? 'on' : 'off';
    this.controlDevices.forEach(device => {
      mqttService.publish(`${device.topic}/set`, command, 1, false);
      const deviceIndex = this.controlDevices.findIndex(d => d.id === device.id);
      if (deviceIndex !== -1) this.controlDevices[deviceIndex].isActive = isActive;
    });
    this.updateDeviceStatistics();
  }

  updateDeviceStatistics() {
    this.activeDeviceCount = this.controlDevices.filter(d => d.isActive).length;
    this.onlineDeviceCount = this.controlDevices.filter(d => d.isOnline).length;
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
      this.userMode = 'not_logged_in';
      this.currentView = 'login';
      this.userProfile = {
        id: 0, username: '', email: '', phone: '', avatar: '👤',
        bio: '智慧农业用户', user_mode: 'not_logged_in', is_admin: 0
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
    
    if (this.temperature > 0 || this.soilHumidity > 0 || this.lightIntensity > 0) {
      fullMessage += `\n\n【当前环境数据】`;
      if (this.temperature > 0) fullMessage += `\n温度: ${this.temperature}°C`;
      if (this.soilHumidity > 0) fullMessage += `\n湿度: ${this.soilHumidity}%`;
      if (this.lightIntensity > 0) fullMessage += `\n光照: ${this.lightIntensity}Lx`;
    }
    
    this.aiMessages.push({ role: 'user', content: userText, timestamp: Date.now() });
    setTimeout(() => this.aiChatScroller.scrollEdge(Edge.Bottom), 100);
    
    this.isAILoading = true;
    
    const assistantMsg: AIMessage = { role: 'assistant', content: '', timestamp: Date.now() };
    this.aiMessages.push(assistantMsg);
    const aiMessageIndex = this.aiMessages.length - 1;
    
    await cozeService.sendMessage(
      fullMessage,
      (deltaContent: string) => {
        this.aiMessages[aiMessageIndex].content += deltaContent;
        this.aiMessages = [...this.aiMessages];
        setTimeout(() => this.aiChatScroller.scrollEdge(Edge.Bottom), 50);
      },
      (fullContent: string) => {
        this.isAILoading = false;
        if (fullContent && this.aiMessages[aiMessageIndex].content !== fullContent) {
          this.aiMessages[aiMessageIndex].content = fullContent;
        }
        if (!this.aiMessages[aiMessageIndex].content) {
          this.aiMessages[aiMessageIndex].content = '抱歉，AI暂时没有回复。';
        }
        this.aiMessages = [...this.aiMessages];
        setTimeout(() => this.aiChatScroller.scrollEdge(Edge.Bottom), 100);
      },
      (error: string) => {
        this.isAILoading = false;
        this.aiMessages[aiMessageIndex].content = `错误: ${error}`;
        this.aiMessages = [...this.aiMessages];
      }
    );
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
    if (this.userMode === 'guest' && (itemId === 'profile' || itemId === 'settings')) {
      this.userMode = 'not_logged_in';
      this.currentView = 'login';
      return;
    }

    if (itemId === 'logout') this.handleLogout();
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

