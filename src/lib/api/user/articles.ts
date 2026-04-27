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
	return apiRequest<ArticleListItem[]>(`/users/articles/page/${page}?page_size=${pageSize}`);
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

/**
 * Fetch detail for a specific article visible to the authenticated user.
 * @param hashId - The article hash ID.
 * @param customFetch - Optional custom fetch instance (e.g. SvelteKit's fetch).
 */
// // 获取对用户可见的特定文章的详情。
// // @param hashId - 文章哈希 ID。
// // @param customFetch - 可选的自定义 fetch 实例（例如 SvelteKit 的 fetch）。
export function fetchUserArticleDetail(hashId: string, customFetch?: typeof fetch) {
	return apiRequest<import('$lib/api/types').ArticleDetail>(`/users/articles/${hashId}`, {
		fetch: customFetch
	});
}

/**
 * Search visible articles by title or content for the authenticated user.
 * @param query - Search keyword (empty searches all visible articles).
 * @param pageSize - Maximum returned items (default: 10).
 */
// // 按标题或正文搜索当前用户可见的文章。
// // @param query - 搜索关键词（为空时搜索所有可见文章）。
// // @param pageSize - 最大返回项目数（默认 10）。

// 原始端点: GET /api/users/articles/search?q=keyword&page_size=N — 搜索用户可见文章（需要用户 JWT）
export function fetchUserArticlesSearch(
	query: string,
	pageSize: number = DEFAULT_PAGE_SIZE
): Promise<ApiResponse<ArticleListItem[]>> {
	const encodedQuery = encodeURIComponent(query);
	return apiRequest<ArticleListItem[]>(
		`/users/articles/search?q=${encodedQuery}&page_size=${pageSize}`
	);
}

/**
 * Fetch pagination info for user article search results.
 * @param query - Search keyword (empty searches all visible articles).
 * @param pageSize - Items per page (default: 10).
 */
// // 获取用户可见文章搜索结果的分页信息。
// // @param query - 搜索关键词（为空时搜索所有可见文章）。
// // @param pageSize - 每页数量（默认 10）。

// 原始端点: GET /api/users/articles/search/page?q=keyword&page_size=N — 获取用户文章搜索分页信息（需要用户 JWT）
export function fetchUserArticlesSearchPageInfo(
	query: string,
	pageSize: number = DEFAULT_PAGE_SIZE
): Promise<ApiResponse<PageInfo>> {
	const encodedQuery = encodeURIComponent(query);
	return apiRequest<PageInfo>(
		`/users/articles/search/page?q=${encodedQuery}&page_size=${pageSize}`
	);
}

/**
 * Fetch a page of user article search results.
 * @param query - Search keyword (empty searches all visible articles).
 * @param page - Page number (1-based).
 * @param pageSize - Items per page (default: 10).
 */
// // 获取一页用户可见文章搜索结果。
// // @param query - 搜索关键词（为空时搜索所有可见文章）。
// // @param page - 页码（从 1 开始）。
// // @param pageSize - 每页数量（默认 10）。

// 原始端点: GET /api/users/articles/search/page/:page?q=keyword&page_size=N — 分页列出用户文章搜索结果（需要用户 JWT）
export function fetchUserArticlesSearchPage(
	query: string,
	page: number,
	pageSize: number = DEFAULT_PAGE_SIZE
): Promise<ApiResponse<ArticleListItem[]>> {
	const encodedQuery = encodeURIComponent(query);
	return apiRequest<ArticleListItem[]>(
		`/users/articles/search/page/${page}?q=${encodedQuery}&page_size=${pageSize}`
	);
}
