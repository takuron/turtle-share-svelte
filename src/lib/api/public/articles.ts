import { apiRequest, type ApiResponse } from '$lib/api/client';
import { DEFAULT_PAGE_SIZE, type ArticleListItem, type PageInfo } from '$lib/api/types';

/**
 * Fetch a page of public articles.
 * @param page - Page number (1-based).
 * @param pageSize - Items per page (default: 10).
 */
// // 获取一页公开文章。
// // @param page - 页码（从 1 开始）。
// // @param pageSize - 每页数量（默认 10）。

// 原始端点: GET /api/public/articles/page/:page?page_size=N — 分页列出公开文章（无需鉴权）
export function fetchPublicArticlesPage(
	page: number,
	pageSize: number = DEFAULT_PAGE_SIZE
): Promise<ApiResponse<ArticleListItem[]>> {
	return apiRequest<ArticleListItem[]>(`/public/articles/page/${page}?page_size=${pageSize}`);
}

/**
 * Fetch pagination info (total pages & items) for public articles.
 * @param pageSize - Items per page (default: 10).
 */
// // 获取公开文章的分页信息（总页数和总条目数）。
// // @param pageSize - 每页数量（默认 10）。

// 原始端点: GET /api/public/articles/page?page_size=N — 获取公开文章分页信息（无需鉴权）
export function fetchPublicArticlesPageInfo(
	pageSize: number = DEFAULT_PAGE_SIZE
): Promise<ApiResponse<PageInfo>> {
	return apiRequest<PageInfo>(`/public/articles/page?page_size=${pageSize}`);
}

/**
 * Fetch detail for a specific public article.
 * @param hashId - The article hash ID.
 * @param customFetch - Optional custom fetch instance (e.g. SvelteKit's fetch).
 */
// // 获取特定公开文章的详情。
// // @param hashId - 文章哈希 ID。
// // @param customFetch - 可选的自定义 fetch 实例（例如 SvelteKit 的 fetch）。
export function fetchPublicArticleDetail(hashId: string, customFetch?: typeof fetch) {
	// Import ArticleDetail locally to avoid circular dependencies or modify the import list
	return apiRequest<import('$lib/api/types').ArticleDetail>(`/public/articles/${hashId}`, {
		fetch: customFetch
	});
}
