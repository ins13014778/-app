import { http } from '@kit.NetworkKit';
import { AppConfig } from '../config/AppConfig';

export interface IAMResult {
  success: boolean;
  status: number;
  token?: string;
  message?: string;
}

export async function getSubjectToken(): Promise<IAMResult> {
  const url = `${AppConfig.IAM_ENDPOINT}/v3/auth/tokens`;
  const scope = AppConfig.IAM_PROJECT_ID && AppConfig.IAM_PROJECT_ID.length > 0
    ? { project: { id: AppConfig.IAM_PROJECT_ID } }
    : { project: { name: AppConfig.IAM_REGION_NAME } };
  const body: Object = {
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
      scope
    }
  };
  const client = http.createHttp();
  try {
    const options: http.HttpRequestOptions = {
      method: http.RequestMethod.POST,
      header: { 'Content-Type': 'application/json' },
      connectTimeout: AppConfig.REQUEST_TIMEOUT,
      readTimeout: AppConfig.REQUEST_TIMEOUT,
      extraData: JSON.stringify(body)
    };
    const res = await client.request(url, options);
    if (res.responseCode === 201) {
      let token: string = '';
      const h = (res as Record<string, Object>)['header'] as Record<string, Object> | undefined;
      if (h) {
        const t1 = h['x-subject-token'] as Object | undefined;
        const t2 = h['X-Subject-Token'] as Object | undefined;
        if (typeof t1 === 'string') { token = t1 as string; }
        else if (typeof t2 === 'string') { token = t2 as string; }
      }
      if (token && token.length > 0) {
        return { success: true, status: 201, token };
      }
      return { success: false, status: 201, message: 'TOKEN_HEADER_MISSING' };
    }
    return { success: false, status: res.responseCode, message: 'HTTP_ERROR' };
  } catch (_) {
    return { success: false, status: -1, message: 'NETWORK_ERROR' };
  } finally {
    client.destroy();
  }
}

