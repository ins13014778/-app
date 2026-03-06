/**
 * Coze AI服务（使用官方SDK）
 * 基于 @coze/api 官方SDK实现
 */

// 注意：由于HarmonyOS环境限制，这里使用原生http模块适配官方API标准
import { http } from '@kit.NetworkKit';
import { BusinessError } from '@kit.BasicServicesKit';
import { CozeConfig } from '../config/AppConfig';
import fs from '@ohos.file.fs';
import util from '@ohos.util';
import hilog from '@ohos.hilog';

const DOMAIN = 0x0101;
const TAG = 'CozeService';

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
  conversation_id?: string;
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

interface HttpBinaryRequestOptions {
  method: http.RequestMethod;
  header: HttpHeaders;
  extraData: ArrayBuffer;
  expectDataType: http.HttpDataType;
  connectTimeout: number;
  readTimeout: number;
}

export interface UploadImageResult {
  success: boolean;
  file_id?: string;
  url?: string;
  message?: string;
  status?: number;
}

export interface AudioTranscriptionResult {
  success: boolean;
  text?: string;
  message?: string;
  status?: number;
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
    let chatUrl = `${this.baseURL}/v3/chat`;
    if (request.conversation_id && request.conversation_id.length > 0) {
      chatUrl = `${chatUrl}?conversation_id=${encodeURIComponent(request.conversation_id)}`;
    }
    console.info('[CozeAPI] 📍 请求URL:', chatUrl);

    const requestOptions: HttpRequestOptions = {
      method: http.RequestMethod.POST,
      header: headers,
      extraData: JSON.stringify(requestBody),
      expectDataType: http.HttpDataType.STRING,
      connectTimeout: 30000,
      readTimeout: 60000
    };
    console.info('[CozeAPI] 📦 请求体:', requestOptions.extraData);

    httpRequest.request(
      chatUrl,
      requestOptions
    ).then((response: http.HttpResponse) => {
      console.info('[CozeAPI] ✅ 请求已发送');
      console.info('[CozeAPI] 📊 响应状态码:', response.responseCode);
      
      // 如果不是200系列状态码，记录错误
      if (response.responseCode < 200 || response.responseCode >= 300) {
        const errorMsg = `HTTP ${response.responseCode}: ${response.result}`;
        console.error('[CozeAPI] ❌ 请求失败:', errorMsg);
        console.error('[CozeAPI] 📊 响应内容:', response.result);
        onError(errorMsg);
        httpRequest.destroy();
        return;
      }

      // 🔥 处理响应数据（HarmonyOS http模块会将流式数据放在result中）
      const resultData = response.result as string;
      console.info('[CozeAPI] 📊 响应数据长度:', resultData.length);
      console.info('[CozeAPI] 📊 响应数据预览:', resultData.substring(0, 200));
      
      // 解析SSE格式数据
      const lines = resultData.split('\n');
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
            // 构建事件数据并回调
            const eventData: StreamEventData = {
              event: currentEvent,
              data: currentData
            };
            
            console.info('[CozeAPI] 📨 解析事件:', currentEvent);
            onEvent(eventData);
            
            currentEvent = '';
            currentData = '';
          }
        }
      }
      
      // 完成回调
      onComplete();
      httpRequest.destroy();
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
  private userId: string = '';
  private conversationId: string = '';

  /**
   * 初始化配置
   * @param token Coze Access Token（可选，默认使用CozeConfig配置）
   * @param botId Bot ID（可选，默认使用CozeConfig配置）
   * @param userId 用户ID（可选，默认使用CozeConfig配置）
   */
  init(token?: string, botId?: string, userId?: string): void {
    const finalToken = token || CozeConfig.ACCESS_TOKEN;
    const finalBotId = botId || CozeConfig.BOT_ID;
    const finalUserId = userId || CozeConfig.DEFAULT_USER_ID;
    
    this.apiClient = new CozeAPI({
      token: finalToken,
      baseURL: CozeConfig.BASE_URL
    });
    this.botId = finalBotId;
    this.userId = finalUserId;
    
    console.info('[CozeService] ✅ 初始化完成');
    console.info('[CozeService] 📍 API地址:', CozeConfig.BASE_URL);
    console.info('[CozeService] 🤖 Bot ID:', this.botId);
    console.info('[CozeService] 👤 User ID:', this.userId);
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
        ],
        conversation_id: this.conversationId || undefined,
        auto_save_history: true
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
                  
                  // 🔍 调试：检查回调是否存在
                  if (onUpdate) {
                    console.info('[CozeService] 🔔 调用onUpdate回调');
                    onUpdate(parsedData.content);
                  } else {
                    console.warn('[CozeService] ⚠️ onUpdate回调不存在');
                  }
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

  async sendMessageWithOptionalImage(
    userMessage: string,
    fileId?: string,
    onUpdate?: (deltaContent: string) => void,
    onComplete?: (fullContent: string) => void,
    onError?: (error: string) => void
  ): Promise<void> {
    if (!this.apiClient) {
      onError?.('请先配置 Coze API Token');
      return;
    }

    try {
      console.info('[CozeService] 💬 发送消息(可附图):', userMessage);

      let additional_messages: CozeMessage[];
      if (fileId && fileId.length > 0) {
        const payload = JSON.stringify([
          { type: 'text', text: userMessage },
          { type: 'image', file_id: fileId }
        ]);
        additional_messages = [
          {
            content: payload,
            content_type: 'object_string',
            role: 'user',
            type: 'question'
          }
        ];
      } else {
        additional_messages = [
          {
            content: userMessage,
            content_type: 'text',
            role: 'user',
            type: 'question'
          }
        ];
      }

      const request: ChatStreamRequest = {
        bot_id: this.botId,
        user_id: this.userId,
        additional_messages,
        conversation_id: this.conversationId || undefined,
        auto_save_history: true
      };

      let fullResponse = '';

      await this.apiClient.chat.stream(
        request,
        (eventData: StreamEventData) => {
          const event = eventData.event;
          const data = eventData.data;

          console.info('[CozeService] 📨 事件:', event);
          if (!data || data === '[DONE]') {
            return;
          }
          try {
            const parsedData: ParsedStreamData = JSON.parse(data);
            if (parsedData.conversation_id) {
              this.conversationId = parsedData.conversation_id;
            }
            switch (event) {
              case 'conversation.message.delta':
                if (parsedData.type === 'answer' && parsedData.content) {
                  fullResponse += parsedData.content;
                  onUpdate?.(parsedData.content);
                }
                break;
              case 'conversation.message.completed':
                if (parsedData.type === 'answer' && parsedData.content && !fullResponse) {
                  fullResponse = parsedData.content;
                  onUpdate?.(parsedData.content);
                }
                break;
              case 'conversation.chat.completed':
                break;
              case 'conversation.chat.failed':
                break;
            }
          } catch (_) {
            console.warn('[CozeService] ⚠️ 数据解析失败:', data);
          }
        },
        () => {
          onComplete?.(fullResponse || '抱歉，AI暂时没有回复。');
        },
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
    return CozeConfig.QUICK_REPLIES;
  }

  /**
   * 重置会话
   */
  resetConversation(): void {
    this.conversationId = '';
    console.info('[CozeService] 🔄 会话已重置');
  }

  async uploadImageFromUri(uri: string, filename?: string): Promise<UploadImageResult> {
    const token = CozeConfig.ACCESS_TOKEN;
    const baseURL = CozeConfig.BASE_URL;
    // 根据URI推断扩展名与MIME，避免因错误类型导致上传失败
    let name = filename || '';
    let mime = 'application/octet-stream';
    const uriLower = uri.toLowerCase();
    if (!name) {
      if (uriLower.endsWith('.jpg') || uriLower.endsWith('.jpeg')) { name = 'image_' + Date.now() + '.jpg'; mime = 'image/jpeg'; }
      else if (uriLower.endsWith('.png')) { name = 'image_' + Date.now() + '.png'; mime = 'image/png'; }
      else if (uriLower.endsWith('.gif')) { name = 'image_' + Date.now() + '.gif'; mime = 'image/gif'; }
      else if (uriLower.endsWith('.webp')) { name = 'image_' + Date.now() + '.webp'; mime = 'image/webp'; }
      else if (uriLower.endsWith('.heic')) { name = 'image_' + Date.now() + '.heic'; mime = 'image/heic'; }
      else if (uriLower.endsWith('.heif')) { name = 'image_' + Date.now() + '.heif'; mime = 'image/heif'; }
      else if (uriLower.endsWith('.bmp')) { name = 'image_' + Date.now() + '.bmp'; mime = 'image/bmp'; }
      else { name = 'image_' + Date.now() + '.jpg'; mime = 'image/jpeg'; }
    } else {
      const lower = name.toLowerCase();
      if (lower.endsWith('.png')) mime = 'image/png';
      else if (lower.endsWith('.jpeg') || lower.endsWith('.jpg')) mime = 'image/jpeg';
      else if (lower.endsWith('.gif')) mime = 'image/gif';
      else if (lower.endsWith('.webp')) mime = 'image/webp';
      else if (lower.endsWith('.heic')) mime = 'image/heic';
      else if (lower.endsWith('.heif')) mime = 'image/heif';
      else if (lower.endsWith('.bmp')) mime = 'image/bmp';
      else mime = 'application/octet-stream';
    }

    // 保持使用完整的 file:// URI，兼容HarmonyOS图库返回的资源路径
    let path = uri;
    hilog.info(DOMAIN, TAG, '[upload] start uri=%{public}s', uri);

    let fileBytes: Uint8Array | undefined = undefined;
    try {
      const f = fs.openSync(path, fs.OpenMode.READ_ONLY);
      const chunkSize = 65536;
      const parts: Uint8Array[] = [];
      let total = 0;
      for (;;) {
        const buf = new ArrayBuffer(chunkSize);
        const n = fs.readSync(f.fd, buf);
        if (!n || n <= 0) break;
        parts.push(new Uint8Array(buf.slice(0, n)));
        total += n;
      }
      fs.closeSync(f.fd);
      fileBytes = new Uint8Array(total);
      let offset = 0;
      for (let i = 0; i < parts.length; i++) { const p = parts[i]; fileBytes.set(p, offset); offset += p.length; }
      hilog.info(DOMAIN, TAG, '[upload] read bytes=%{public}d', fileBytes.length);
    } catch (e1) {
      try {
        const p2 = path.startsWith('file://') ? path.substring('file://'.length) : path;
        const f2 = fs.openSync(p2, fs.OpenMode.READ_ONLY);
        const chunkSize2 = 65536;
        const parts2: Uint8Array[] = [];
        let total2 = 0;
        for (;;) {
          const buf2 = new ArrayBuffer(chunkSize2);
          const n2 = fs.readSync(f2.fd, buf2);
          if (!n2 || n2 <= 0) break;
          parts2.push(new Uint8Array(buf2.slice(0, n2)));
          total2 += n2;
        }
        fs.closeSync(f2.fd);
        fileBytes = new Uint8Array(total2);
        let off2 = 0;
        for (let i = 0; i < parts2.length; i++) { const p = parts2[i]; fileBytes.set(p, off2); off2 += p.length; }
        hilog.info(DOMAIN, TAG, '[upload] read bytes fallback=%{public}d', fileBytes.length);
      } catch (e2) {
        hilog.error(DOMAIN, TAG, '[upload] read failed %{public}s', JSON.stringify(e2));
        const result: UploadImageResult = { success: false, message: 'READ_FILE_ERROR' };
        return result;
      }
    }

    const boundary = '----CozeBoundary' + Date.now();
    const enc = util.TextEncoder.create('utf-8');
    const part1 = enc.encode(`--${boundary}\r\n` +
      `Content-Disposition: form-data; name="file"; filename="${name}"\r\n` +
      `Content-Type: ${mime}\r\n\r\n`);
    const part2 = enc.encode(`\r\n--${boundary}--\r\n`);

    const totalLen = part1.length + fileBytes!.length + part2.length;
    const bodyBuf = new ArrayBuffer(totalLen);
    const bodyU8 = new Uint8Array(bodyBuf);
    bodyU8.set(part1, 0);
    bodyU8.set(fileBytes!, part1.length);
    bodyU8.set(part2, part1.length + fileBytes!.length);
    hilog.info(DOMAIN, TAG, '[upload] multipart size=%{public}d', totalLen);

    const request = http.createHttp();
    try {
      const headers: HttpHeaders = {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Authorization': `Bearer ${token}`
      };
      const options: HttpBinaryRequestOptions = {
        method: http.RequestMethod.POST,
        header: headers,
        extraData: bodyBuf,
        expectDataType: http.HttpDataType.STRING,
        connectTimeout: 30000,
        readTimeout: 60000
      };
      hilog.info(DOMAIN, TAG, '[upload] url=%{public}s', `${baseURL}/v1/files/upload`);
      const res: http.HttpResponse = await request.request(`${baseURL}/v1/files/upload`, options);
      request.destroy();
      if (res.responseCode >= 200 && res.responseCode < 300) {
        try {
          const text = res.result as string;
          hilog.info(DOMAIN, TAG, '[upload] resp=%{public}s', text.substring(0, 200));
          const j = JSON.parse(text) as Record<string, Object>;
          const code = (j['code'] as number) ?? 0;
          const data = j['data'] as Record<string, Object> | undefined;
          let file_id = (j['id'] || j['file_id']) as string | undefined;
          let url = (j['url'] || j['download_url']) as string | undefined;
          if (!file_id && data) {
            file_id = (data?.['id'] || data?.['file_id']) as string | undefined;
          }
          if (!url && data) {
            url = (data?.['url'] || data?.['download_url']) as string | undefined;
          }
          if (code === 0 && file_id) {
            const result: UploadImageResult = { success: true, file_id, url, status: res.responseCode };
            return result;
          }
          const result: UploadImageResult = { success: false, status: res.responseCode, message: `COZE_CODE_${code}` };
          return result;
        } catch (_) {
          const result: UploadImageResult = { success: false, status: res.responseCode, message: 'JSON_PARSE_ERROR' };
          return result;
        }
      }
      hilog.error(DOMAIN, TAG, '[upload] http error code=%{public}d body=%{public}s', res.responseCode, String(res.result));
      const result: UploadImageResult = { success: false, status: res.responseCode, message: String(res.result) };
      return result;
    } catch (e) {
      request.destroy();
      hilog.error(DOMAIN, TAG, '[upload] exception %{public}s', JSON.stringify(e));
      const result: UploadImageResult = { success: false, status: -1, message: JSON.stringify(e) };
      return result;
    }
  }

  async transcribeAudioFromUri(uri: string, filename?: string): Promise<AudioTranscriptionResult> {
    const token = CozeConfig.ACCESS_TOKEN;
    const baseURL = CozeConfig.BASE_URL;
    let name = filename || '';
    let mime = 'application/octet-stream';
    const lowerUri = uri.toLowerCase();
    if (!name || name.length === 0) {
      if (lowerUri.endsWith('.mp3')) { name = 'audio_' + Date.now() + '.mp3'; mime = 'audio/mpeg'; }
      else if (lowerUri.endsWith('.wav')) { name = 'audio_' + Date.now() + '.wav'; mime = 'audio/wav'; }
      else if (lowerUri.endsWith('.m4a')) { name = 'audio_' + Date.now() + '.m4a'; mime = 'audio/mp4'; }
      else if (lowerUri.endsWith('.aac')) { name = 'audio_' + Date.now() + '.aac'; mime = 'audio/aac'; }
      else if (lowerUri.endsWith('.ogg')) { name = 'audio_' + Date.now() + '.ogg'; mime = 'audio/ogg'; }
      else if (lowerUri.endsWith('.flac')) { name = 'audio_' + Date.now() + '.flac'; mime = 'audio/flac'; }
      else { name = 'audio_' + Date.now() + '.mp3'; mime = 'audio/mpeg'; }
    } else {
      const ln = name.toLowerCase();
      if (ln.endsWith('.mp3')) mime = 'audio/mpeg';
      else if (ln.endsWith('.wav')) mime = 'audio/wav';
      else if (ln.endsWith('.m4a')) mime = 'audio/mp4';
      else if (ln.endsWith('.aac')) mime = 'audio/aac';
      else if (ln.endsWith('.ogg')) mime = 'audio/ogg';
      else if (ln.endsWith('.flac')) mime = 'audio/flac';
      else mime = 'application/octet-stream';
    }

    let path = uri;
    hilog.info(DOMAIN, TAG, '[transcribe] start uri=%{public}s', uri);

    let fileBytes: Uint8Array | undefined = undefined;
    try {
      const f = fs.openSync(path, fs.OpenMode.READ_ONLY);
      const chunk = 65536;
      const parts: Uint8Array[] = [];
      let total = 0;
      for (;;) {
        const buf = new ArrayBuffer(chunk);
        const n = fs.readSync(f.fd, buf);
        if (!n || n <= 0) break;
        parts.push(new Uint8Array(buf.slice(0, n)));
        total += n;
      }
      fs.closeSync(f.fd);
      fileBytes = new Uint8Array(total);
      let off = 0;
      for (let i = 0; i < parts.length; i++) { const p = parts[i]; fileBytes.set(p, off); off += p.length; }
      hilog.info(DOMAIN, TAG, '[transcribe] read bytes=%{public}d', fileBytes.length);
    } catch (e1) {
      try {
        const p2 = path.startsWith('file://') ? path.substring('file://'.length) : path;
        const f2 = fs.openSync(p2, fs.OpenMode.READ_ONLY);
        const chunk2 = 65536;
        const parts2: Uint8Array[] = [];
        let total2 = 0;
        for (;;) {
          const buf2 = new ArrayBuffer(chunk2);
          const n2 = fs.readSync(f2.fd, buf2);
          if (!n2 || n2 <= 0) break;
          parts2.push(new Uint8Array(buf2.slice(0, n2)));
          total2 += n2;
        }
        fs.closeSync(f2.fd);
        fileBytes = new Uint8Array(total2);
        let off2 = 0;
        for (let i = 0; i < parts2.length; i++) { const p = parts2[i]; fileBytes.set(p, off2); off2 += p.length; }
        hilog.info(DOMAIN, TAG, '[transcribe] read bytes fallback=%{public}d', fileBytes.length);
      } catch (e2) {
        hilog.error(DOMAIN, TAG, '[transcribe] read failed %{public}s', JSON.stringify(e2));
        const result: AudioTranscriptionResult = { success: false, message: 'READ_FILE_ERROR' };
        return result;
      }
    }

    const boundary = '----CozeBoundary' + Date.now();
    const enc = util.TextEncoder.create('utf-8');
    const head = enc.encode(`--${boundary}\r\n` +
      `Content-Disposition: form-data; name="file"; filename="${name}"\r\n` +
      `Content-Type: ${mime}\r\n\r\n`);
    const tail = enc.encode(`\r\n--${boundary}--\r\n`);

    const totalLen = head.length + fileBytes!.length + tail.length;
    const bodyBuf = new ArrayBuffer(totalLen);
    const bodyU8 = new Uint8Array(bodyBuf);
    bodyU8.set(head, 0);
    bodyU8.set(fileBytes!, head.length);
    bodyU8.set(tail, head.length + fileBytes!.length);
    hilog.info(DOMAIN, TAG, '[transcribe] multipart size=%{public}d', totalLen);

    const request = http.createHttp();
    try {
      const headers: HttpHeaders = {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Authorization': `Bearer ${token}`
      };
      const options: HttpBinaryRequestOptions = {
        method: http.RequestMethod.POST,
        header: headers,
        extraData: bodyBuf,
        expectDataType: http.HttpDataType.STRING,
        connectTimeout: 30000,
        readTimeout: 60000
      };
      const url = `${baseURL}/v1/audio/transcriptions`;
      hilog.info(DOMAIN, TAG, '[transcribe] url=%{public}s', url);
      const res: http.HttpResponse = await request.request(url, options);
      request.destroy();
      if (res.responseCode >= 200 && res.responseCode < 300) {
        try {
          const text = res.result as string;
          hilog.info(DOMAIN, TAG, '[transcribe] resp=%{public}s', text.substring(0, 200));
          const j = JSON.parse(text) as Record<string, Object>;
          const code = (j['code'] as number) ?? 0;
          const data = j['data'] as Record<string, Object> | undefined;
          const msgText = data ? (data['text'] as string | undefined) : undefined;
          if (code === 0 && msgText && msgText.length > 0) {
            const result: AudioTranscriptionResult = { success: true, text: msgText, status: res.responseCode };
            return result;
          }
          const result: AudioTranscriptionResult = { success: false, status: res.responseCode, message: `COZE_CODE_${code}` };
          return result;
        } catch (_) {
          const result: AudioTranscriptionResult = { success: false, status: res.responseCode, message: 'JSON_PARSE_ERROR' };
          return result;
        }
      }
      hilog.error(DOMAIN, TAG, '[transcribe] http error code=%{public}d body=%{public}s', res.responseCode, String(res.result));
      const result: AudioTranscriptionResult = { success: false, status: res.responseCode, message: String(res.result) };
      return result;
    } catch (e) {
      request.destroy();
      hilog.error(DOMAIN, TAG, '[transcribe] exception %{public}s', JSON.stringify(e));
      const result: AudioTranscriptionResult = { success: false, status: -1, message: JSON.stringify(e) };
      return result;
    }
  }
}

// 导出单例
const cozeService = new CozeService();

export default cozeService;
