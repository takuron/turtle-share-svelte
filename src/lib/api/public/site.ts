import { apiRequest, type ApiResponse } from '$lib/api/client';
import type { SiteInfo } from '$lib/config';
import type { TierDescriptionsResponse } from '$lib/api/types';

/**
 * Fetch public site information from the backend.
 * Returns the API response containing site info.
 */
// // 从后端获取公开的站点信息。
// // 返回包含站点信息的 API 响应。

// 原始端点: GET /api/public/site-info — 获取站点公开信息（无需鉴权）
export function fetchSiteInfoRequest(): Promise<ApiResponse<SiteInfo>> {
	return apiRequest<SiteInfo>('/public/site-info');
}

/**
 * Fetch public subscription tiers from the backend.
 * Returns the API response containing tier descriptions.
 */
// // 从后端获取公开的订阅等级说明。
// // 原始端点: GET /api/public/tier-descriptions
export function fetchTiersRequest(): Promise<ApiResponse<TierDescriptionsResponse>> {
	return apiRequest<TierDescriptionsResponse>('/public/tier-descriptions');
}
