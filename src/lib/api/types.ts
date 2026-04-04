/**
 * Shared API types used across public, user, and admin API modules.
 * 跨 public、user、admin API 模块共享的类型定义。
 */
// // 跨 public、user、admin API 模块共享的类型定义。

/**
 * Normalized article list item. Used by all roles in the UI layer.
 * The `accessible` field is normalized: public/user APIs return it directly,
 * admin API sets it to `true` (admin has full access).
 */
// // 标准化的文章列表项。UI 层统一使用此类型。
// // `accessible` 字段已标准化：public/user API 直接返回，admin API 固定为 true。
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
 * Raw admin article list item as returned by the backend.
 * Contains `is_public` instead of `accessible`.
 */
// // 后端返回的管理员文章列表原始项。
// // 包含 `is_public` 而非 `accessible`。
export interface AdminArticleRawItem {
	hash_id: string;
	title: string;
	cover_image: string | null;
	required_tier: number;
	is_public: boolean;
	created_at: number;
	updated_at: number;
}

/**
 * Pagination metadata returned by page info endpoints.
 * 分页信息端点返回的分页元数据。
 */
// // 分页信息端点返回的分页元数据。
export interface PageInfo {
	total_pages: number;
	total_items: number;
}

/** 默认每页文章数 */
export const DEFAULT_PAGE_SIZE = 10;
