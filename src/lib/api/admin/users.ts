import { apiRequest, type ApiResponse } from '$lib/api/client';
import {
	ADMIN_USERS_PAGE_SIZE,
	type AdminUserItem,
	type AdminSubscriptionItem,
	type PageInfo
} from '$lib/api/types';

/**
 * Fetch a page of users (admin view).
 * @param page - Page number (1-based).
 * @param pageSize - Items per page (default: 5).
 */
// // 获取一页用户列表（管理员视角）。
// // @param page - 页码（从 1 开始）。
// // @param pageSize - 每页数量（默认 5）。

// 原始端点: GET /api/admin/users/page/:page?page_size=N — 分页列出用户（需要管理员 JWT）
export function fetchAdminUsersPage(
	page: number,
	pageSize: number = ADMIN_USERS_PAGE_SIZE
): Promise<ApiResponse<AdminUserItem[]>> {
	return apiRequest<AdminUserItem[]>(`/admin/users/page/${page}?page_size=${pageSize}`);
}

/**
 * Fetch pagination info for users (admin view).
 * @param pageSize - Items per page (default: 5).
 */
// // 获取用户分页信息（管理员视角）。
// // @param pageSize - 每页数量（默认 5）。

// 原始端点: GET /api/admin/users/page?page_size=N — 获取管理员用户分页信息（需要管理员 JWT）
export function fetchAdminUsersPageInfo(
	pageSize: number = ADMIN_USERS_PAGE_SIZE
): Promise<ApiResponse<PageInfo>> {
	return apiRequest<PageInfo>(`/admin/users/page?page_size=${pageSize}`);
}

/**
 * Fetch all subscriptions for a specific user (admin view).
 * Returns all subscriptions ordered by start_date descending.
 * @param userHashId - The user's hash ID.
 */
// // 获取特定用户的所有订阅（管理员视角）。
// // 返回按 start_date 降序排列的所有订阅。
// // @param userHashId - 用户哈希 ID。

// 原始端点: GET /api/admin/users/:hash_id/subscriptions — 列出用户所有订阅（需要管理员 JWT）
export function fetchAdminUserSubscriptions(
	userHashId: string
): Promise<ApiResponse<AdminSubscriptionItem[]>> {
	return apiRequest<AdminSubscriptionItem[]>(`/admin/users/${userHashId}/subscriptions`);
}

/**
 * Create a new subscription for a user (admin view).
 * @param userHashId - The user's hash ID.
 * @param data - Subscription data.
 */
// // 为用户创建新订阅（管理员视角）。
// // @param userHashId - 用户哈希 ID。
// // @param data - 订阅数据。

// 原始端点: POST /api/admin/users/:hash_id/subscriptions — 为用户添加新的订阅时段（需要管理员 JWT）
export function createAdminUserSubscription(
	userHashId: string,
	data: {
		tier: number;
		start_date: number;
		end_date: number;
		note?: string;
	}
): Promise<ApiResponse<AdminSubscriptionItem>> {
	return apiRequest<AdminSubscriptionItem>(`/admin/users/${userHashId}/subscriptions`, {
		method: 'POST',
		body: JSON.stringify(data)
	});
}

/**
 * Update an existing subscription (admin view).
 * @param hashId - The subscription's hash ID.
 * @param data - Subscription data to update.
 */
// // 更新现有订阅（管理员视角）。
// // @param hashId - 订阅的哈希 ID。
// // @param data - 要更新的订阅数据。

// 原始端点: PUT /api/admin/subscriptions/:hash_id — 更新现有订阅（需要管理员 JWT）
export function updateAdminSubscription(
	hashId: string,
	data: {
		tier?: number;
		start_date?: number;
		end_date?: number;
		note?: string;
	}
): Promise<ApiResponse<AdminSubscriptionItem>> {
	return apiRequest<AdminSubscriptionItem>(`/admin/subscriptions/${hashId}`, {
		method: 'PUT',
		body: JSON.stringify(data)
	});
}

/**
 * Delete a subscription (admin view).
 * @param hashId - The subscription's hash ID.
 */
// // 删除订阅（管理员视角）。
// // @param hashId - 订阅的哈希 ID。

// 原始端点: DELETE /api/admin/subscriptions/:hash_id — 删除订阅（需要管理员 JWT）
export function deleteAdminSubscription(
	hashId: string
): Promise<ApiResponse<{ deleted: boolean; hash_id: string; user_hash_id: string }>> {
	return apiRequest<{ deleted: boolean; hash_id: string; user_hash_id: string }>(
		`/admin/subscriptions/${hashId}`,
		{
			method: 'DELETE'
		}
	);
}

/**
 * Create a new user (admin view).
 * @param data - User data to create.
 */
// // 创建新用户（管理员视角）。
// // @param data - 要创建的用户数据。

// 原始端点: POST /api/admin/users — 创建新用户（需要管理员 JWT）
export function createAdminUser(data: {
	username: string;
	password?: string;
	email?: string;
	note?: string;
}): Promise<ApiResponse<AdminUserItem>> {
	return apiRequest<AdminUserItem>('/admin/users', {
		method: 'POST',
		body: JSON.stringify(data)
	});
}

/**
 * Update an existing user (admin view).
 * @param hashId - The user's hash ID.
 * @param data - User data to update.
 */
// // 更新现有用户（管理员视角）。
// // @param hashId - 用户的哈希 ID。
// // @param data - 要更新的用户数据。

// 原始端点: PUT /api/admin/users/:hash_id — 更新现有用户（需要管理员 JWT）
export function updateAdminUser(
	hashId: string,
	data: {
		username?: string;
		password?: string;
		email?: string;
		note?: string;
	}
): Promise<ApiResponse<AdminUserItem>> {
	return apiRequest<AdminUserItem>(`/admin/users/${hashId}`, {
		method: 'PUT',
		body: JSON.stringify(data)
	});
}

/**
 * Delete a user (admin view).
 * @param hashId - The user's hash ID.
 */
// // 删除用户（管理员视角）。
// // @param hashId - 用户的哈希 ID。

// 原始端点: DELETE /api/admin/users/:hash_id — 删除用户（需要管理员 JWT）
export function deleteAdminUser(hashId: string): Promise<ApiResponse<{ deleted: boolean }>> {
	return apiRequest<{ deleted: boolean }>(`/admin/users/${hashId}`, {
		method: 'DELETE'
	});
}
