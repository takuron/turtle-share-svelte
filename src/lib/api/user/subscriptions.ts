import { apiRequest, type ApiResponse } from '$lib/api/client';
import type { UserSubscriptionItem } from '$lib/api/types';

/**
 * Fetch all subscriptions for the authenticated user.
 * Results are ordered by start_date descending (newest first).
 */
// // 获取当前已登录用户的所有订阅记录。
// // 结果按 start_date 降序排列（最新优先）。

// 原始端点: GET /api/users/subscriptions — 获取用户自己的订阅列表（需要用户 JWT）
export function fetchUserSubscriptions(): Promise<ApiResponse<UserSubscriptionItem[]>> {
	return apiRequest<UserSubscriptionItem[]>('/users/subscriptions');
}

/**
 * Fetch the user's subscription tier at a specific time.
 * If `at` is omitted, defaults to the current time.
 * @param at - Optional Unix timestamp (seconds).
 */
// // 查询用户在指定时间的订阅等级。省略 at 则返回当前时刻的等级。
// // @param at - 可选的 Unix 时间戳（秒）。

// 原始端点: GET /api/users/tier?at=<timestamp> — 查询用户自身订阅等级（需要用户 JWT）
export function fetchUserTier(at?: number): Promise<ApiResponse<{ tier: number }>> {
	const query = at !== undefined ? `?at=${at}` : '';
	return apiRequest<{ tier: number }>(`/users/tier${query}`);
}

/**
 * Change password for the authenticated user.
 * @param currentPassword - Current password for verification.
 * @param newPassword - New password to set.
 */
// // 修改当前已登录用户的密码。
// // @param currentPassword - 用于验证的当前密码。
// // @param newPassword - 要设置的新密码。

// 原始端点: PUT /api/users/password — 修改密码（需要用户 JWT）
export function changeUserPassword(
	currentPassword: string,
	newPassword: string
): Promise<ApiResponse<{ message: string }>> {
	return apiRequest<{ message: string }>('/users/password', {
		method: 'PUT',
		body: JSON.stringify({
			current_password: currentPassword,
			new_password: newPassword
		}),
		skipUnauthorizedEvent: true
	});
}
