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

/**
 * Search public articles by title or content.
 * @param query - Search keyword (empty searches all public articles).
 * @param pageSize - Maximum returned items (default: 10).
 */
// // 按标题或正文搜索公开文章。
// // @param query - 搜索关键词（为空时搜索所有公开文章）。
// // @param pageSize - 最大返回项目数（默认 10）。

// 原始端点: GET /api/public/articles/search?q=keyword&page_size=N — 搜索公开文章（无需鉴权）
export function fetchPublicArticlesSearch(
	query: string,
	pageSize: number = DEFAULT_PAGE_SIZE
): Promise<ApiResponse<ArticleListItem[]>> {
	const encodedQuery = encodeURIComponent(query);
	return apiRequest<ArticleListItem[]>(
		`/public/articles/search?q=${encodedQuery}&page_size=${pageSize}`
	);
}

/**
 * Fetch pagination info for public article search results.
 * @param query - Search keyword (empty searches all public articles).
 * @param pageSize - Items per page (default: 10).
 */
// // 获取公开文章搜索结果的分页信息。
// // @param query - 搜索关键词（为空时搜索所有公开文章）。
// // @param pageSize - 每页数量（默认 10）。

// 原始端点: GET /api/public/articles/search/page?q=keyword&page_size=N — 获取公开文章搜索分页信息（无需鉴权）
export function fetchPublicArticlesSearchPageInfo(
	query: string,
	pageSize: number = DEFAULT_PAGE_SIZE
): Promise<ApiResponse<PageInfo>> {
	const encodedQuery = encodeURIComponent(query);
	return apiRequest<PageInfo>(
		`/public/articles/search/page?q=${encodedQuery}&page_size=${pageSize}`
	);
}

/**
 * Fetch a page of public article search results.
 * @param query - Search keyword (empty searches all public articles).
 * @param page - Page number (1-based).
 * @param pageSize - Items per page (default: 10).
 */
// // 获取一页公开文章搜索结果。
// // @param query - 搜索关键词（为空时搜索所有公开文章）。
// // @param page - 页码（从 1 开始）。
// // @param pageSize - 每页数量（默认 10）。

// 原始端点: GET /api/public/articles/search/page/:page?q=keyword&page_size=N — 分页列出公开文章搜索结果（无需鉴权）
export function fetchPublicArticlesSearchPage(
	query: string,
	page: number,
	pageSize: number = DEFAULT_PAGE_SIZE
): Promise<ApiResponse<ArticleListItem[]>> {
	const encodedQuery = encodeURIComponent(query);
	return apiRequest<ArticleListItem[]>(
		`/public/articles/search/page/${page}?q=${encodedQuery}&page_size=${pageSize}`
	);
}
