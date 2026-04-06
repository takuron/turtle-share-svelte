import { apiRequest, type ApiResponse } from '$lib/api/client';
import { ADMIN_USERS_PAGE_SIZE, type AdminUserItem, type PageInfo } from '$lib/api/types';

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
