// 根据当前环境获取API基础URL
export const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://bunn-backend.vercel.app'
  : 'http://localhost:3000';

/**
 * 智能判断环境的统一API请求函数
 * 自动处理前端/服务端环境差异，可在任何地方统一调用
 * @param endpoint API端点，以/开头，不包含/api前缀
 * @param options 请求选项
 */
export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  // 构建正确的URL
  // const isServer = typeof window === 'undefined';
  // const url = isServer
  //   ? `${API_BASE_URL}/api${endpoint}` // 服务端：完整URL
  //   : `/api${endpoint}`; // 前端：相对路径

  const url = `${API_BASE_URL}/api${endpoint}`

  // 检查是否是FormData类型
  const isFormData = options.body instanceof FormData;

  // console.log(`[${isServer ? 'Server' : 'Client'}] 请求: ${url}`);

  const response = await fetch(url, {
    ...options,
    headers: {
      // 只有当不是FormData时才设置默认的Content-Type
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API请求失败: ${response.status}`);
  }

  // 检查响应的内容类型
  const contentType = response.headers.get('Content-Type') || '';

  // 根据内容类型返回不同格式的数据
  if (contentType.includes('application/json')) {
    return response.json();
  } else if (contentType.includes('text/event-stream')) {
    return response;
  } else if (contentType.includes('text/')) {
    return response.text();
  } else {
    // 默认尝试解析为JSON，如果失败则返回原始响应
    try {
      return await response.json();
    } catch (error) {
      return response;
    }
  }
} 