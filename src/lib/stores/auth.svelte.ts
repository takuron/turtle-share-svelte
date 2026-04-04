import { loginRequest } from '$lib/api/auth';

/**
 * JWT payload structure decoded from the token.
 * JWT 令牌解码后的 payload 结构。
 */
// // JWT 令牌解码后的 payload 结构。
export interface JwtPayload {
	sub: string;
	name?: string;
	role: 'admin' | 'user';
	exp: number;
	iat: number;
}

/**
 * Auth session info derived from JWT.
 * 从 JWT 派生的认证会话信息。
 */
// // 从 JWT 派生的认证会话信息。
export interface AuthSession {
	token: string;
	role: 'admin' | 'user';
	name: string;
	sub: string;
	exp: number;
}

// 1. 使用 Svelte 5 Runes 定义全局认证状态。
export const authStore = $state<{ session: AuthSession | null }>({
	session: null
});

// 2. 解码 JWT 的 payload 部分（不验证签名，签名由后端验证）。
function decodeJwt(token: string): JwtPayload | null {
	try {
		const payload = token.split('.')[1];
		const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
		return JSON.parse(decoded) as JwtPayload;
	} catch {
		return null;
	}
}

// 3. 从 token 创建会话对象。
function tokenToSession(token: string): AuthSession | null {
	const payload = decodeJwt(token);
	if (!payload) return null;

	// 检查是否已过期
	if (payload.exp * 1000 < Date.now()) return null;

	return {
		token,
		role: payload.role,
		name: payload.name ?? payload.sub,
		sub: payload.sub,
		exp: payload.exp
	};
}

/**
 * Initialize auth state from localStorage on app startup.
 * 应用启动时从 localStorage 恢复认证状态。
 */
// // 应用启动时从 localStorage 恢复认证状态。
export function initAuth() {
	if (typeof localStorage === 'undefined') return;
	const token = localStorage.getItem('auth_token');
	if (token) {
		const session = tokenToSession(token);
		if (session) {
			authStore.session = session;
		} else {
			// token 无效或已过期，清除
			localStorage.removeItem('auth_token');
		}
	}
}

/**
 * Login with the given role. Calls the appropriate API endpoint.
 * Returns null on success, or an error message string on failure.
 *
 * @param role - 'admin' or 'user'
 * @param username - Username
 * @param password - Password
 */
// // 使用指定角色登录。成功返回 null，失败返回错误消息。
// //
// // @param role - 'admin' 或 'user'
// // @param username - 用户名
// // @param password - 密码
export async function login(
	role: 'admin' | 'user',
	username: string,
	password: string
): Promise<string | null> {
	// 1. 如果已有其他身份登录，拒绝操作。
	if (authStore.session) {
		return '请先退出当前账户再登录其他身份';
	}

	try {
		// 2. 调用登录 API。
		const res = await loginRequest(role, username, password);

		if (!res.success) {
			// 3. 将后端错误码映射为用户友好的中文提示。
			const errorMap: Record<string, string> = {
				UNAUTHORIZED: '用户名或密码错误',
				TOO_MANY_REQUESTS: '登录尝试过于频繁，请稍后再试',
				VALIDATION_ERROR: '请求格式错误'
			};
			return errorMap[res.error.code] ?? res.error.message;
		}

		// 4. 解码 token 并验证角色是否匹配。
		const session = tokenToSession(res.data.token);
		if (!session || session.role !== role) {
			return '登录响应异常，请重试';
		}

		// 5. 持久化 token 并更新全局状态。
		localStorage.setItem('auth_token', res.data.token);
		authStore.session = session;
		return null;
	} catch {
		return '网络连接失败，请检查网络状态';
	}
}

/**
 * Logout: clear token and session state.
 * 登出：清除 token 和会话状态。
 */
// // 登出：清除 token 和会话状态。
export function logout() {
	localStorage.removeItem('auth_token');
	authStore.session = null;
}
