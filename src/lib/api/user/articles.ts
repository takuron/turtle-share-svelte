import { apiRequest, type ApiResponse } from '$lib/api/client';
import { DEFAULT_PAGE_SIZE, type ArticleListItem, type PageInfo } from '$lib/api/types';

/**
 * Fetch a page of articles visible to the authenticated user.
 * Accessibility is determined by user's subscription tier at article creation time.
 *
 * @param page - Page number (1-based).
 * @param pageSize - Items per page (default: 10).
 */
// // 获取一页当前用户可见的文章。
// // 可访问性由用户在文章创建时的订阅等级决定。
// //
// // @param page - 页码（从 1 开始）。
// // @param pageSize - 每页数量（默认 10）。

// 原始端点: GET /api/users/articles/page/:page?page_size=N — 分页列出用户可见文章（需要用户 JWT）
export function fetchUserArticlesPage(
	page: number,
	pageSize: number = DEFAULT_PAGE_SIZE
): Promise<ApiResponse<ArticleListItem[]>> {
	return apiRequest<ArticleListItem[]>(
		`/users/articles/page/${page}?page_size=${pageSize}`
	);
}

/**
 * Fetch pagination info for articles visible to the authenticated user.
 * @param pageSize - Items per page (default: 10).
 */
// // 获取当前用户可见文章的分页信息。
// // @param pageSize - 每页数量（默认 10）。

// 原始端点: GET /api/users/articles/page?page_size=N — 获取用户文章分页信息（需要用户 JWT）
export function fetchUserArticlesPageInfo(
	pageSize: number = DEFAULT_PAGE_SIZE
): Promise<ApiResponse<PageInfo>> {
	return apiRequest<PageInfo>(`/users/articles/page?page_size=${pageSize}`);
}
