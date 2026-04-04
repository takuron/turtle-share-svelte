import { apiRequest } from '$lib/api/client';

/**
 * Call the login API for the given role.
 * Returns the raw API response containing a JWT token.
 *
 * @param role - 'admin' or 'user'
 * @param username - Username
 * @param password - Password
 */
// // 调用指定角色的登录 API。
// // 返回包含 JWT token 的原始 API 响应。
// //
// // @param role - 'admin' 或 'user'
// // @param username - 用户名
// // @param password - 密码
export function loginRequest(role: 'admin' | 'user', username: string, password: string) {
	// 根据角色选择不同的 API 端点。
	const endpoint = role === 'admin' ? '/admin/login' : '/users/login';

	return apiRequest<{ token: string }>(endpoint, {
		method: 'POST',
		body: JSON.stringify({ username, password })
	});
}
