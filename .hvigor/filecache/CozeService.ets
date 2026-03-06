/**
 * Coze AI服务（使用官方SDK）
 * 基于 @coze/api 官方SDK实现
 */

// 注意：由于HarmonyOS环境限制，这里使用原生http模块适配官方API标准
import { http } from '@kit.NetworkKit';
import { BusinessError } from '@kit.BasicServicesKit';

// ========== Coze 官方接口定义 ==========

// 消息接口（官方标准）
export interface CozeMessage {
  content: string;
  content_type: 'text' | 'object_string' | 'card';
  role: 'user' | 'assistant';
  type?: 'question' | 'answer' | 'function_call' | 'tool_output' | 'tool_response' | 'follow_up' | 'verbose';
}

// 流式聊天请求参数（官方标准）
interface ChatStreamRequest {
  bot_id: string;
  user_id: string;
  additional_messages: CozeMessage[];
  auto_save_history?: boolean;
  custom_variables?: Record<string, string>;
}

// 流式响应事件
interface StreamEvent {
  event: string;
  data: string;
}

// CozeAPI配置接口
interface CozeAPIConfig {
  token: string;
  baseURL: string;
}

// 流式响应数据接口
export interface StreamEventData {
  event: string;
  data: string;
}

// 迭代器结果接口
interface StreamIteratorResult {
  value: StreamEventData | undefined;
  done: boolean;
}

// 错误响应接口
interface ErrorResponse {
  error: string;
}

// Chat命名空间接口
interface ChatNamespace {
  stream: (
    request: ChatStreamRequest,
    onEvent: (event: StreamEventData) => void,
    onComplete: () => void,
    onError: (error: string) => void
  ) => Promise<void>;
}

// 解析后的流式数据接口
interface ParsedStreamData {
  conversation_id?: string;
  type?: string;
  content?: string;
}

// HTTP请求体接口
interface HttpRequestBody {
  bot_id: string;
  user_id: string;
  stream: boolean;
  additional_messages: CozeMessage[];
  auto_save_history: boolean;
  custom_variables: Record<string, string>;
}

// HTTP请求头接口
interface HttpHeaders {
  'Content-Type': string;
  'Authorization': string;
}

// HTTP请求配置接口
interface HttpRequestOptions {
  method: http.RequestMethod;
  header: HttpHeaders;
  extraData: string;
  expectDataType: http.HttpDataType;
  connectTimeout: number;
  readTimeout: number;
}

// ========== Coze API Client（官方SDK适配版）==========

/**
 * CozeAPI类（模拟官方SDK接口）
 * 由于HarmonyOS环境限制，使用http模块实现官方API标准
 */
class CozeAPI {
  private token: string;
  private baseURL: string;

  constructor(config: CozeAPIConfig) {
    this.token = config.token;
    this.baseURL = config.baseURL;
    console.info('[CozeAPI] 初始化 - BaseURL:', this.baseURL);
  }

  /**
   * chat命名空间（模拟官方SDK结构）
   */
  chat: ChatNamespace = {
    /**
     * 流式聊天（官方SDK标准接口）
     * @param request 请求参数
     * @param onEvent 事件回调
     * @param onComplete 完成回调
     * @param onError 错误回调
     */
    stream: async (
      request: ChatStreamRequest,
      onEvent: (event: StreamEventData) => void,
      onComplete: () => void,
      onError: (error: string) => void
    ): Promise<void> => {
      return this.executeStreamRequest(request, onEvent, onComplete, onError);
    }
  };

  /**
   * 执行流式请求
   * @private
   */
  private async executeStreamRequest(
    request: ChatStreamRequest,
    onEvent: (event: StreamEventData) => void,
    onComplete: () => void,
    onError: (error: string) => void
  ): Promise<void> {
    // 创建HTTP请求
    const httpRequest = http.createHttp();
    let responseBuffer = '';

    // 响应头接收（用于调试）
    httpRequest.on('headersReceive', (header: Record<string, string>) => {
      console.info('[CozeAPI] 📨 响应头:', JSON.stringify(header));
    });

    // 数据接收处理
    httpRequest.on('dataReceive', (data: ArrayBuffer) => {
      try {
        // ArrayBuffer转字符串
        const uint8Array = new Uint8Array(data);
        let chunk = '';
        for (let i = 0; i < uint8Array.length; i++) {
          chunk += String.fromCharCode(uint8Array[i]);
        }

        responseBuffer += chunk;
        console.info('[CozeAPI] 📥 收到数据块 (长度:', chunk.length, ')');
        // 打印前200字符用于调试
        if (chunk.length > 0) {
          const preview = chunk.length > 200 ? chunk.substring(0, 200) + '...' : chunk;
          console.info('[CozeAPI] 📄 数据预览:', preview);
        }

        // 解析SSE格式
        const lines = responseBuffer.split('\n');
        responseBuffer = lines.pop() || '';

        let currentEvent = '';
        let currentData = '';

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine) {
            continue;
          }

          if (trimmedLine.startsWith('event:')) {
            currentEvent = trimmedLine.substring(6).trim();
          } else if (trimmedLine.startsWith('data:')) {
            currentData = trimmedLine.substring(5).trim();

            if (currentEvent && currentData) {
              // 构建事件数据
              const eventData: StreamEventData = {
                event: currentEvent,
                data: currentData
              };

              // 立即回调
              onEvent(eventData);

              currentEvent = '';
              currentData = '';
            }
          }
        }
      } catch (error) {
        const err = error as Error;
        console.error('[CozeAPI] ❌ 数据处理异常:', err.message);
        onError(err.message);
        httpRequest.destroy();
      }
    });

    // 数据接收完成
    httpRequest.on('dataEnd', () => {
      console.info('[CozeAPI] ✅ 流式响应完成');
      onComplete();
      httpRequest.destroy();
    });

    // 发送请求
    const emptyVars: Record<string, string> = {};
    const requestBody: HttpRequestBody = {
      bot_id: request.bot_id,
      user_id: request.user_id,
      stream: true,
      additional_messages: request.additional_messages,
      auto_save_history: request.auto_save_history ?? true,
      custom_variables: request.custom_variables ?? emptyVars
    };

    console.info('[CozeAPI] 🚀 发送流式请求');
    console.info('[CozeAPI] 📦 请求体:', JSON.stringify(requestBody));

    const headers: HttpHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    };

    // 🔍 调试日志：打印请求头（脱敏）
    const tokenPreview = this.token.substring(0, 10) + '...';
    console.info('[CozeAPI] 🔑 Authorization:', `Bearer ${tokenPreview}`);
    console.info('[CozeAPI] 📍 请求URL:', `${this.baseURL}/v3/chat`);

    const requestOptions: HttpRequestOptions = {
      method: http.RequestMethod.POST,
      header: headers,
      extraData: JSON.stringify(requestBody),
      expectDataType: http.HttpDataType.STRING,
      connectTimeout: 30000,
      readTimeout: 60000
    };

    httpRequest.request(
      `${this.baseURL}/v3/chat`,
      requestOptions
    ).then((response: http.HttpResponse) => {
      console.info('[CozeAPI] ✅ 请求已发送');
      console.info('[CozeAPI] 📊 响应状态码:', response.responseCode);
      console.info('[CozeAPI] 📊 响应消息:', response.result);
      
      // 如果不是200系列状态码，记录错误
      if (response.responseCode < 200 || response.responseCode >= 300) {
        const errorMsg = `HTTP ${response.responseCode}: ${response.result}`;
        console.error('[CozeAPI] ❌ 请求失败:', errorMsg);
        onError(errorMsg);
        httpRequest.destroy();
      }
    }).catch((error: BusinessError) => {
      console.error('[CozeAPI] ❌ 请求异常:', error.code, error.message);
      onError(`请求异常: ${error.message}`);
      httpRequest.destroy();
    });
  }
}

// ========== Coze 服务封装 ==========

/**
 * Coze服务类（使用官方SDK）
 */
class CozeService {
  private apiClient: CozeAPI | null = null;
  private botId: string = '';
  private userId: string = '123456789';
  private conversationId: string = '';

  /**
   * 初始化配置
   */
  init(token: string, botId: string, userId?: string): void {
    this.apiClient = new CozeAPI({
      token: token,
      baseURL: 'https://api.coze.cn'
    });
    this.botId = botId;
    if (userId) {
      this.userId = userId;
    }
    console.info('[CozeService] 初始化完成 - Bot ID:', this.botId);
  }

  /**
   * 发送消息（流式输出）
   * @param userMessage 用户消息内容
   * @param onUpdate 实时更新回调
   * @param onComplete 完成回调
   * @param onError 错误回调
   */
  async sendMessage(
    userMessage: string,
    onUpdate?: (deltaContent: string) => void,
    onComplete?: (fullContent: string) => void,
    onError?: (error: string) => void
  ): Promise<void> {
    if (!this.apiClient) {
      onError?.('请先配置 Coze API Token');
      return;
    }

    try {
      console.info('[CozeService] 💬 发送消息:', userMessage);

      // 构建请求（官方SDK标准格式）
      const request: ChatStreamRequest = {
        bot_id: this.botId,
        user_id: this.userId,
        additional_messages: [
          {
            content: userMessage,
            content_type: 'text',
            role: 'user',
            type: 'question'
          }
        ]
      };

      // 累积完整响应
      let fullResponse = '';

      // 调用官方SDK的流式接口（使用回调模式）
      await this.apiClient.chat.stream(
        request,
        // onEvent回调 - 处理每个流式事件
        (eventData: StreamEventData) => {
          const event = eventData.event;
          const data = eventData.data;

          console.info('[CozeService] 📨 事件:', event);

          // 跳过空数据
          if (!data || data === '[DONE]') {
            return;
          }
          try {
            const parsedData: ParsedStreamData = JSON.parse(data);

            // 保存会话ID
            if (parsedData.conversation_id) {
              this.conversationId = parsedData.conversation_id;
            }

            // 处理不同事件
            switch (event) {
              case 'conversation.message.delta':
                // 增量消息
                if (parsedData.type === 'answer' && parsedData.content) {
                  console.info('[CozeService] 📝 增量内容:', parsedData.content);
                  fullResponse += parsedData.content;
                  onUpdate?.(parsedData.content);
                }
                break;

              case 'conversation.message.completed':
                // 消息完成
                if (parsedData.type === 'answer' && parsedData.content && !fullResponse) {
                  console.info('[CozeService] ✅ 完整消息:', parsedData.content);
                  fullResponse = parsedData.content;
                  onUpdate?.(parsedData.content);
                }
                break;

              case 'conversation.chat.completed':
                console.info('[CozeService] 🎉 对话完成');
                break;

              case 'conversation.chat.failed':
                console.error('[CozeService] ❌ 对话失败');
                break;
            }
          } catch (parseError) {
            console.warn('[CozeService] ⚠️ 数据解析失败:', data);
          }
        },
        // onComplete回调 - 流式响应完成
        () => {
          console.info('[CozeService] ✅ 流式响应完成，总长度:', fullResponse.length);
          onComplete?.(fullResponse || '抱歉，AI暂时没有回复。');
        },
        // onError回调 - 错误处理
        (error: string) => {
          console.error('[CozeService] ❌ 流式响应错误:', error);
          onError?.(error);
        }
      );

    } catch (error) {
      const err = error as Error;
      console.error('[CozeService] ❌ 发送消息异常:', err.message);
      onError?.(err.message);
    }
  }

  /**
   * 获取快速问题建议
   */
  getQuickReplies(): string[] {
    return [
      '分析当前数据',
      '给出建议',
      '这个正常吗？',
      '如何优化？',
      '有什么问题？',
      '需要注意什么？'
    ];
  }

  /**
   * 重置会话
   */
  resetConversation(): void {
    this.conversationId = '';
    console.info('[CozeService] 🔄 会话已重置');
  }
}

// 导出单例
const cozeService = new CozeService();

export default cozeService;
