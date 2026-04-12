/**
 * Shared API types used across public, user, and admin API modules.
 * &#36328; public&#12289;user&#12289;admin API &#27169;&#22359;&#20849;&#20139;&#30340;&#31867;&#22411;&#23450;&#20041;&#12290;
 */
// // &#36328; public&#12289;user&#12289;admin API &#27169;&#22359;&#20849;&#20139;&#30340;&#31867;&#22411;&#23450;&#20041;&#12290;

/**
 * Normalized article list item. Used by all roles in the UI layer.
 * The `accessible` field is normalized: public/user APIs return it directly,
 * admin API sets it to `true` (admin has full access).
 */
// // &#26631;&#20934;&#21270;&#30340;&#25991;&#31456;&#21015;&#34920;&#39033;&#12290;UI &#23618;&#32479;&#19968;&#20351;&#29992;&#27492;&#31867;&#22411;&#12290;
// // `accessible` &#23383;&#27573;&#24050;&#26631;&#20934;&#21270;&#65306;public/user API &#30452;&#25509;&#36820;&#22238;&#65292;admin API &#22266;&#23450;&#20026; true&#12290;
export interface ArticleListItem {
	hash_id: string;
	title: string;
	cover_image: string | null;
	required_tier: number;
	accessible: boolean;
	publish_at: number;
	updated_at: number;
}

/**
 * Raw admin article list item as returned by the backend.
 * Contains `is_public` instead of `accessible`.
 */
// // &#21518;&#31471;&#36820;&#22238;&#30340;&#31649;&#29702;&#21592;&#25991;&#31456;&#21015;&#34920;&#21407;&#22987;&#39033;&#12290;
// // &#21253;&#21547; `is_public` &#32780;&#38750; `accessible`&#12290;
export interface AdminArticleRawItem {
	hash_id: string;
	title: string;
	cover_image: string | null;
	required_tier: number;
	is_public: boolean;
	publish_at: number;
	updated_at: number;
}

/**
 * Pagination metadata returned by page info endpoints.
 * &#20998;&#39029;&#20449;&#24687;&#31471;&#28857;&#36820;&#22238;&#30340;&#20998;&#39029;&#20803;&#25968;&#25454;&#12290;
 */
// // &#20998;&#39029;&#20449;&#24687;&#31471;&#28857;&#36820;&#22238;&#30340;&#20998;&#39029;&#20803;&#25968;&#25454;&#12290;
export interface PageInfo {
	total_pages: number;
	total_items: number;
}

/** &#40664;&#35748;&#27599;&#39029;&#25991;&#31456;&#25968; */
export const DEFAULT_PAGE_SIZE = 10;

/** &#31649;&#29702;&#21592;&#25991;&#31456;&#31649;&#29702;&#27599;&#39029;&#25991;&#31456;&#25968; */
export const ADMIN_ARTICLES_PAGE_SIZE = 5;

/** &#31649;&#29702;&#21592;&#29992;&#25143;&#31649;&#29702;&#27599;&#39029;&#29992;&#25143;&#25968; */
export const ADMIN_USERS_PAGE_SIZE = 5;

/** &#31649;&#29702;&#21592;&#35746;&#38405;&#31649;&#29702;&#27599;&#39029;&#35746;&#38405;&#25968; */
export const ADMIN_SUBSCRIPTIONS_PAGE_SIZE = 5;

/** &#31649;&#29702;&#21592;&#25991;&#20214;&#31649;&#29702;&#27599;&#39029;&#25991;&#20214;&#25968; */
export const ADMIN_FILES_PAGE_SIZE = 5;

/** 用户订阅弹窗最多展示的记录数 */
export const USER_SUBSCRIPTIONS_MAX_DISPLAY = 5;

/**
 * Admin user list item as returned by the backend.
 * &#21518;&#31471;&#36820;&#22238;&#30340;&#31649;&#29702;&#21592;&#29992;&#25143;&#21015;&#34920;&#39033;&#12290;
 */
// // &#21518;&#31471;&#36820;&#22238;&#30340;&#31649;&#29702;&#21592;&#29992;&#25143;&#21015;&#34920;&#39033;&#12290;
export interface AdminUserItem {
	hash_id: string;
	username: string;
	email: string;
	note: string;
	created_at: number;
}

/**
 * Admin subscription item as returned by the backend.
 * &#21518;&#31471;&#36820;&#22238;&#30340;&#31649;&#29702;&#21592;&#35746;&#38405;&#21015;&#34920;&#39033;&#12290;
 */
// // &#21518;&#31471;&#36820;&#22238;&#30340;&#31649;&#29702;&#21592;&#35746;&#38405;&#21015;&#34920;&#39033;&#12290;
export interface AdminSubscriptionItem {
	hash_id: string;
	user_hash_id: string;
	tier: number;
	start_date: number;
	end_date: number;
	note: string | null;
	created_at: number;
}

/**
 * User subscription item as returned by the user endpoint.
 * Unlike AdminSubscriptionItem, excludes hash_id, user_hash_id, note, created_at.
 */
// // 用户端订阅列表项。与管理员版不同，不包含 hash_id、user_hash_id、note、created_at。
export interface UserSubscriptionItem {
	tier: number;
	start_date: number;
	end_date: number;
}

/**
 * File link object in article detail.
 * &#25991;&#31456;&#35814;&#24773;&#20013;&#30340;&#25991;&#20214;&#38142;&#25509;&#23545;&#35937;&#12290;
 */
// // &#25991;&#31456;&#35814;&#24773;&#20013;&#30340;&#25991;&#20214;&#38142;&#25509;&#23545;&#35937;&#12290;
export interface FileLink {
	name: string;
	url: string;
}

/**
 * Normalized article detail item. Used by all roles in the UI layer.
 * The `accessible` field is added dynamically by the client (for public/user based on required_tier, or true for admin).
 */
// // &#26631;&#20934;&#21270;&#30340;&#25991;&#31456;&#35814;&#24773;&#39033;&#12290;UI &#23618;&#32479;&#19968;&#20351;&#29992;&#27492;&#31867;&#22411;&#12290;
// // &#23458;&#25143;&#31471;&#20250;&#21160;&#24577;&#28155;&#21152; `accessible` &#23383;&#27573;&#12290;
export interface ArticleDetail {
	hash_id: string;
	title: string;
	cover_image: string | null;
	content: string;
	required_tier: number;
	is_public: boolean;
	file_links: FileLink[];
	publish_at: number;
	created_at: number;
	updated_at: number;
}

/**
 * Admin file item as returned by the backend.
 * &#21518;&#31471;&#36820;&#22238;&#30340;&#31649;&#29702;&#21592;&#25991;&#20214;&#21015;&#34920;&#39033;&#12290;
 */
// // &#21518;&#31471;&#36820;&#22238;&#30340;&#31649;&#29702;&#21592;&#25991;&#20214;&#21015;&#34920;&#39033;&#12290;
export interface AdminFileItem {
	hash_id: string;
	uuid: string;
	original_name: string;
	file_size: number;
	url: string;
	created_at: number;
}

/**
 * Public subscription tier definition.
 * 订阅等级定义，包含用于公开展示的字段。
 */
// // 公开的订阅等级定义。
export interface SubscriptionTier {
	tier: number;
	name: string;
	description: string;
	price: string;
	purchase_url: string;
}

/**
 * Public tier descriptions response.
 * 获取所有公开的订阅等级说明。
 */
// // 公开获取订阅等级说明的响应数据结构。
export interface TierDescriptionsResponse {
	tiers: SubscriptionTier[];
	updated_at: number;
}
