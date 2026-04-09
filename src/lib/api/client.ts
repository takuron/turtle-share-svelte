import { API_URL } from '$lib/config';
import { addToast } from '$lib/stores/toast.svelte';
import * as m from '$lib/paraglide/messages.js';

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
	/** 为 true 时，即使返回 401 也不触发全局 unauthorized 事件 */
	skipUnauthorizedEvent?: boolean;
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

	const { skipUnauthorizedEvent, ...fetchOptions } = options;

	const fetchFn = fetchOptions.fetch || globalThis.fetch;

	// 3. 执行网络请求，捕获网络级错误（如后端无响应）并通过全局 toast 提示。
	let res: Response;
	try {
		res = await fetchFn(`${API_URL}${path}`, {
			...fetchOptions,
			headers
		});
	} catch (err) {
		addToast(m.err_network());
		throw err;
	}

	// 4. 如果 HTTP 状态码为 429（速率限制），通过全局 toast 提示。
	if (res.status === 429) {
		addToast(m.err_too_many_requests());
	}

	const data = (await res.json()) as ApiResponse<T>;

	// 5. 如果遇到 401 错误或认证错误，且未设置 skipUnauthorizedEvent，触发未授权事件
	if (
		!skipUnauthorizedEvent &&
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
