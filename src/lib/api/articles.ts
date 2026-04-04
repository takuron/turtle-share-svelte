import { apiRequest, type ApiResponse } from '$lib/api/client';

/**
 * Article list item returned by the public articles endpoint.
 * 公开文章列表端点返回的文章列表项。
 */
// // 公开文章列表端点返回的文章列表项。
export interface ArticleListItem {
	hash_id: string;
	title: string;
	cover_image: string | null;
	required_tier: number;
	accessible: boolean;
	created_at: number;
	updated_at: number;
}

/**
 * Pagination metadata returned by the page info endpoint.
 * 分页信息端点返回的分页元数据。
 */
// // 分页信息端点返回的分页元数据。
export interface PageInfo {
	total_pages: number;
	total_items: number;
}

/** 默认每页文章数 */
export const DEFAULT_PAGE_SIZE = 10;

/**
 * Fetch a page of public articles.
 * @param page - Page number (1-based).
 * @param pageSize - Items per page (default: 10).
 */
// // 获取一页公开文章。
// // @param page - 页码（从 1 开始）。
// // @param pageSize - 每页数量（默认 10）。
export function fetchArticlesPage(
	page: number,
	pageSize: number = DEFAULT_PAGE_SIZE
): Promise<ApiResponse<ArticleListItem[]>> {
	return apiRequest<ArticleListItem[]>(
		`/public/articles/page/${page}?page_size=${pageSize}`
	);
}

/**
 * Fetch pagination info (total pages & items) for public articles.
 * @param pageSize - Items per page (default: 10).
 */
// // 获取公开文章的分页信息（总页数和总条目数）。
// // @param pageSize - 每页数量（默认 10）。
export function fetchArticlesPageInfo(
	pageSize: number = DEFAULT_PAGE_SIZE
): Promise<ApiResponse<PageInfo>> {
	return apiRequest<PageInfo>(`/public/articles/page?page_size=${pageSize}`);
}
