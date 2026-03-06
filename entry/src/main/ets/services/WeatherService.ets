/**
 * 易客天气服务
 * 
 * 功能说明：
 * 1. 免费天气API集成，提供实时天气数据
 * 2. 支持根据城市名称或IP自动识别获取天气
 * 3. 提供天气表情符号映射，增强用户体验
 * 4. 支持空气质量等级颜色标识
 * 
 * 技术特点：
 * - 基于HarmonyOS NetworkKit的HTTP客户端
 * - 单例模式设计，确保全局唯一实例
 * - 完整的错误处理和超时机制
 * - 支持TypeScript类型检查
 * 
 * 数据来源：易客天气API（免费版）
 * API文档：https://www.yiketianqi.com/api/
 * 
 * 使用说明：
 * - 无需用户认证，直接调用
 * - 支持全国所有城市天气查询
 * - 返回数据包含温度、湿度、风速、空气质量等
 */
import { http } from '@kit.NetworkKit';
import { WeatherConfig } from '../config/WeatherConfig';
import { WeatherData, WeatherServiceResponse } from '../types/WeatherTypes';

/**
 * 天气服务类
 */
export class WeatherService {
  private static instance: WeatherService;

  /**
   * 获取单例实例
   */
  public static getInstance(): WeatherService {
    if (!WeatherService.instance) {
      WeatherService.instance = new WeatherService();
    }
    return WeatherService.instance;
  }

  /**
   * 获取天气数据（核心方法）
   * 
   * @param city - 城市名称（可选，不传则根据IP自动识别）
   * @returns 天气服务响应对象
   * 
   * 新手理解：
   * 这个方法就像是你问天气助手"今天天气怎么样？"，它会帮你：
   * 1. 准备问题（构建请求URL）
   * 2. 发送问题给天气服务器（发送HTTP请求）
   * 3. 等待回答（接收响应）
   * 4. 把回答翻译成我们能理解的格式（解析JSON数据）
   * 
   * 详细步骤说明：
   * 步骤1：创建HTTP请求对象（就像创建一个邮差）
   * 步骤2：构建完整的请求URL（就像写好信封地址）
   * 步骤3：发送请求并等待响应（就像邮差送信并等待回信）
   * 步骤4：检查响应状态（就像检查信封是否完好）
   * 步骤5：解析响应数据（就像读信的内容）
   * 步骤6：返回统一格式的结果（就像整理信息后告诉你）
   * 
   * 错误处理：
   * - 网络连接失败：返回"网络请求失败"
   * - 服务器错误：返回"请求失败: 错误码"
   * - 数据解析错误：在catch块中处理
   */
  public async getWeather(city?: string): Promise<WeatherServiceResponse> {
    // 步骤1：创建HTTP请求对象（就像请一个邮差帮你送信）
    const httpRequest = http.createHttp();
    
    try {
      // 步骤2：构建完整的请求URL（就像写好信封地址）
      // 基础URL包含了API密钥等必要信息
      let url = `${WeatherConfig.BASE_URL}?appid=${WeatherConfig.APP_ID}&appsecret=${WeatherConfig.APP_SECRET}&unescape=1`;
      
      // 如果用户指定了城市，就把城市名加到URL里
      // encodeURIComponent是为了处理城市名中的特殊字符，比如"北京"会变成"%E5%8C%97%E4%BA%AC"
      if (city) {
        url += `&city=${encodeURIComponent(city)}`;
      }
      
      // 打印调试信息，方便开发者查看请求详情（就像记录邮差送信的日志）
      console.info('[WeatherService] 请求天气数据');
      console.info('[WeatherService] URL:', url);
      
      // 步骤3：发送GET请求（就像邮差送信并等待回信）
      const response = await httpRequest.request(url, {
        method: http.RequestMethod.GET,                    // 使用GET方法（就像说"请给我信息"）
        readTimeout: WeatherConfig.REQUEST_TIMEOUT,        // 等待回信的最长时间（就像等回信不能无限等）
        connectTimeout: WeatherConfig.REQUEST_TIMEOUT,   // 连接服务器的最长时间（就像邮差找到你家不能无限找）
        expectDataType: http.HttpDataType.STRING           // 期望收到字符串格式的回信
      });
      
      // 步骤4：检查响应状态码（就像检查信封是否完好）
      console.info('[WeatherService] 响应状态码:', response.responseCode);
      
      // 状态码200表示成功（就像信封完好无损）
      if (response.responseCode === 200) {
        // 步骤5：解析JSON格式的天气数据（就像读信的内容）
        // JSON.parse把字符串转换成JavaScript对象，方便我们使用
        const weatherData = JSON.parse(response.result as string) as WeatherData;
        
        // 打印成功信息，显示获取到的关键数据
        console.info('[WeatherService] 获取天气成功:', weatherData.city, weatherData.wea, weatherData.tem + '°');
        
        // 步骤6：返回统一格式的成功结果（就像整理信息后告诉你）
        return {
          success: true,                    // 标记为成功
          message: '获取天气成功',           // 成功消息
          data: weatherData                // 具体的天气数据
        };
      } else {
        // 如果状态码不是200，说明有问题（就像信封破损或者地址错误）
        return {
          success: false,                   // 标记为失败
          message: `请求失败: ${response.responseCode}`  // 具体的错误信息
        };
      }
    } catch (error) {
      // 步骤6（异常处理）：如果上面的任何步骤出错，就在这里处理
      // 比如网络断了、服务器没响应、数据格式不对等等
      console.error('[WeatherService] 获取天气失败:', JSON.stringify(error));
      return {
        success: false,                     // 标记为失败
        message: '网络请求失败'             // 友好的错误提示
      };
    } finally {
      // 无论成功还是失败，最后都要销毁HTTP请求对象（就像邮差送完信要回家）
      // 这是为了释放系统资源，避免内存泄漏
      httpRequest.destroy();
    }
  }

  /**
   * 获取天气emoji图标（让天气更生动）
   * 
   * 新手理解：
   * 这个方法就像一个"天气翻译官"，它能把中文的天气描述
   * 转换成对应的表情符号，让界面更生动有趣。
   * 
   * 举个例子：
   * - 输入"晴天" → 输出"☀️"（太阳公公）
   * - 输入"小雨" → 输出"🌧️"（下雨的云朵）
   * - 输入"大雪" → 输出"❄️"（雪花）
   * 
   * 技术说明：
   * 使用includes()方法检查天气字符串中是否包含特定关键词
   * 按优先级顺序判断，确保准确匹配
   * 
   * @param wea - 天气描述字符串（如"晴"、"多云"、"小雨"等）
   * @returns 对应的天气emoji表情符号
   */
  public getWeatherEmoji(wea: string): string {
    // 使用includes()方法检查天气描述中是否包含特定关键词
    // 注意判断顺序：先判断特殊的，再判断一般的
    
    if (wea.includes('晴')) return '☀️';      // 晴天 - 太阳公公
    if (wea.includes('云') || wea.includes('阴')) return '☁️';  // 阴天/多云 - 云朵
    if (wea.includes('雨')) return '🌧️';     // 下雨 - 下雨的云朵
    if (wea.includes('雪')) return '❄️';     // 下雪 - 雪花
    if (wea.includes('雾') || wea.includes('霾')) return '🌫️';  // 雾/霾 - 雾蒙蒙
    if (wea.includes('雷')) return '⚡';      // 打雷 - 闪电
    
    // 如果都不匹配，默认返回多云转晴（大部分天气都是这样）
    return '🌤️';  // 多云转晴 - 云后面的太阳
  }

  /**
   * 获取空气质量颜色（让空气质量一目了然）
   * 
   * 新手理解：
   * 这个方法就像一个"空气质量指示灯"，它能把空气质量
   * 转换成对应的颜色，让用户一眼就能看出空气好坏。
   * 
   * 颜色含义（从好到坏）：
   * 🟢 绿色（#00E400）- 优：空气很好，可以放心户外活动
   * 🟡 黄色（#FFFF00）- 良：空气不错，适合户外活动  
   * 🟠 橙色（#FF7E00）- 轻度污染：敏感人群要注意
   * 🔴 红色（#FF0000）- 中度污染：所有人都要减少户外活动
   * 🟣 紫色（#8F3F97）- 重度污染：避免户外活动
   * 🟤 褐色（#7E0023）- 严重污染：避免外出
   * 
   * 技术说明：
   * 支持两种输入格式：
   * 1. 数字格式（如"75"）- 直接判断数值范围
   * 2. 文字格式（如"良"）- 根据文字描述判断
   * 
   * @param air - 空气质量（可以是数字字符串如"75"，或文字描述如"良"）
   * @returns 对应的颜色代码（十六进制颜色值）
   */
  public getAirQualityColor(air: string): string {
    // 首先尝试把输入转换成数字
    const airNum = parseInt(air);
    
    // 如果不是有效的数字，就按文字描述处理
    if (isNaN(airNum)) {
      // 根据空气质量描述返回对应颜色
      if (air.includes('优')) return '#00E400';      // 绿色 - 优秀
      if (air.includes('良')) return '#FFFF00';    // 黄色 - 良好
      if (air.includes('轻度')) return '#FF7E00';   // 橙色 - 轻度污染
      if (air.includes('中度')) return '#FF0000';   // 红色 - 中度污染
      if (air.includes('重度')) return '#8F3F97'; // 紫色 - 重度污染
      return '#7E0023';                            // 褐色 - 严重污染（默认）
    }
    
    // 如果是数字，按数值范围判断（国标标准）
    // 这些数值范围是根据国家空气质量标准设定的
    if (airNum <= 50) return '#00E400';     // 0-50：优（绿色）
    if (airNum <= 100) return '#FFFF00';   // 51-100：良（黄色）
    if (airNum <= 150) return '#FF7E00';   // 101-150：轻度污染（橙色）
    if (airNum <= 200) return '#FF0000';   // 151-200：中度污染（红色）
    if (airNum <= 300) return '#8F3F97';  // 201-300：重度污染（紫色）
    return '#7E0023';                       // 301+：严重污染（褐色）
  }
}

// 导出单例
export const weatherService = WeatherService.getInstance();

