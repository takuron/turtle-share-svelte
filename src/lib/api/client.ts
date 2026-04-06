import { API_URL } from '$lib/config';

/**
 * Generic API response wrapper matching backend format.
 * 通用 API 响应包装，匹配后端格式。
 */
// // 通用 API 响应包装，匹配后端格式。
export interface ApiSuccess<T> {
	success: true;
	data: T;
}

export interface ApiError {
	success: false;
	error: {
		code: string;
		message: string;
	};
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export interface ApiOptions extends RequestInit {
	fetch?: typeof fetch;
}

/**
 * Sends a JSON request to the backend API.
 * @param path - API path relative to API_URL (e.g., '/admin/login').
 * @param options - Fetch options (method, body, headers, custom fetch).
 * @returns Parsed JSON response.
 */
// // 向后端 API 发送 JSON 请求。
// // @param path - 相对于 API_URL 的路径（例如 '/admin/login'）。
// // @param options - Fetch 选项（method、body、headers、自定义 fetch）。
// // @returns 解析后的 JSON 响应。
export async function apiRequest<T>(
	path: string,
	options: ApiOptions = {}
): Promise<ApiResponse<T>> {
	// 1. 合并默认 headers，如果有 body 则添加 Content-Type。
	const headers: Record<string, string> = {
		...(options.body ? { 'Content-Type': 'application/json' } : {}),
		...(options.headers as Record<string, string>)
	};

	// 2. 从 localStorage 读取 token，如果存在则附加 Authorization 头。
	const token =
		typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
			? window.localStorage.getItem('auth_token')
			: null;
	if (token) {
		headers['Authorization'] = `Bearer ${token}`;
	}

	const fetchFn = options.fetch || globalThis.fetch;

	const res = await fetchFn(`${API_URL}${path}`, {
		...options,
		headers
	});

	const data = (await res.json()) as ApiResponse<T>;

	// 3. 如果遇到 401 错误或认证错误，触发未授权事件
	if (
		!data.success &&
		(res.status === 401 ||
			data.error?.code === 'UNAUTHORIZED' ||
			data.error?.code === 'INVALID_TOKEN' ||
			data.error?.code === 'TOKEN_EXPIRED')
	) {
		if (typeof window !== 'undefined') {
			window.dispatchEvent(new CustomEvent('auth:unauthorized'));
		}
	}

	return data;
}
