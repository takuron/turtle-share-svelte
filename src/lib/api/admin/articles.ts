import { apiRequest, type ApiResponse } from '$lib/api/client';
import {
	DEFAULT_PAGE_SIZE,
	type AdminArticleRawItem,
	type ArticleDetail,
	type ArticleListItem,
	type FileLink,
	type PageInfo
} from '$lib/api/types';

/**
 * Request body for creating a new article.
 * 创建新文章的请求体。
 */
// // 创建新文章的请求体。
export interface CreateArticleRequest {
	title: string;
	cover_image?: string | null;
	content: string;
	required_tier: number;
	is_public: boolean;
	file_links?: FileLink[];
	publish_at?: number | null;
}

/**
 * Request body for updating an existing article. All fields are optional.
 * 更新现有文章的请求体。所有字段均为可选。
 */
// // 更新现有文章的请求体。所有字段均为可选。
export interface UpdateArticleRequest {
	title?: string;
	cover_image?: string | null;
	content?: string;
	required_tier?: number;
	is_public?: boolean;
	file_links?: FileLink[];
	publish_at?: number | null;
}

/**
 * Create a new article.
 * @param data - The article data to create.
 */
// // 创建新文章。
// // @param data - 要创建的文章数据。

// 原始端点: POST /api/admin/articles — 创建新文章（需要管理员 JWT）
export function createAdminArticle(
	data: CreateArticleRequest
): Promise<ApiResponse<ArticleDetail>> {
	return apiRequest<ArticleDetail>('/admin/articles', {
		method: 'POST',
		body: JSON.stringify(data)
	});
}

/**
 * Update an existing article. Only the provided fields are updated.
 * @param hashId - The article hash ID.
 * @param data - The fields to update.
 */
// // 更新现有文章。仅更新提供的字段。
// // @param hashId - 文章哈希 ID。
// // @param data - 要更新的字段。

// 原始端点: PUT /api/admin/articles/:hash_id — 更新现有文章（需要管理员 JWT）
export function updateAdminArticle(
	hashId: string,
	data: UpdateArticleRequest
): Promise<ApiResponse<ArticleDetail>> {
	return apiRequest<ArticleDetail>(`/admin/articles/${hashId}`, {
		method: 'PUT',
		body: JSON.stringify(data)
	});
}

/**
 * Fetch a page of all articles (admin view).
 * Admin has full access to all articles. The raw response contains `is_public`
 * instead of `accessible`; this function normalizes it to `accessible: true`.
 *
 * @param page - Page number (1-based).
 * @param pageSize - Items per page (default: 10).
 */
// // 获取一页所有文章（管理员视角）。
// // 管理员拥有所有文章的完整访问权限。原始响应包含 `is_public` 而非 `accessible`，
// // 此函数将其标准化为 `accessible: true`。
// //
// // @param page - 页码（从 1 开始）。
// // @param pageSize - 每页数量（默认 10）。

// 原始端点: GET /api/admin/articles/page/:page?page_size=N — 分页列出所有文章（需要管理员 JWT）
export async function fetchAdminArticlesPage(
	page: number,
	pageSize: number = DEFAULT_PAGE_SIZE
): Promise<ApiResponse<ArticleListItem[]>> {
	const res = await apiRequest<AdminArticleRawItem[]>(
		`/admin/articles/page/${page}?page_size=${pageSize}`
	);

	// 标准化：管理员默认拥有所有文章权限，将 is_public 映射为 accessible=true。
	if (res.success) {
		return {
			success: true,
			data: res.data.map((item) => ({
				hash_id: item.hash_id,
				title: item.title,
				cover_image: item.cover_image,
				required_tier: item.required_tier,
				accessible: true,
				publish_at: item.publish_at,
				updated_at: item.updated_at
			}))
		};
	}

	return res;
}

/**
 * Fetch pagination info for all articles (admin view).
 * @param pageSize - Items per page (default: 10).
 */
// // 获取所有文章的分页信息（管理员视角）。
// // @param pageSize - 每页数量（默认 10）。

// 原始端点: GET /api/admin/articles/page?page_size=N — 获取管理员文章分页信息（需要管理员 JWT）
export function fetchAdminArticlesPageInfo(
	pageSize: number = DEFAULT_PAGE_SIZE
): Promise<ApiResponse<PageInfo>> {
	return apiRequest<PageInfo>(`/admin/articles/page?page_size=${pageSize}`);
}

/**
 * Fetch raw admin articles page for management dashboard.
 * @param page
 * @param pageSize
 */
// // 获取供管理面板使用的未格式化的管理员文章分页数据（保留 is_public）。
// // @param page - 页码
// // @param pageSize - 每页数量
export function fetchAdminArticlesRawPage(
	page: number,
	pageSize: number = DEFAULT_PAGE_SIZE
): Promise<ApiResponse<AdminArticleRawItem[]>> {
	return apiRequest<AdminArticleRawItem[]>(`/admin/articles/page/${page}?page_size=${pageSize}`);
}

/**
 * Delete an article.
 * @param hashId - The article hash ID.
 */
// // 删除一篇文章。
// // @param hashId - 文章哈希 ID。
export function deleteAdminArticle(hashId: string): Promise<ApiResponse<{ deleted: boolean }>> {
	return apiRequest<{ deleted: boolean }>(`/admin/articles/${hashId}`, {
		method: 'DELETE'
	});
}

/**
 * Fetch detail for a specific article (admin view).
 * Admin has full access to all article details.
 * @param hashId - The article hash ID.
 * @param customFetch - Optional custom fetch instance (e.g. SvelteKit's fetch).
 */
// // 获取特定文章的详情（管理员视角）。
// // 管理员拥有所有文章详情的完整访问权限。
// // @param hashId - 文章哈希 ID。
// // @param customFetch - 可选的自定义 fetch 实例（例如 SvelteKit 的 fetch）。
export function fetchAdminArticleDetail(hashId: string, customFetch?: typeof fetch) {
	return apiRequest<ArticleDetail>(`/admin/articles/${hashId}`, {
		fetch: customFetch
	});
}
