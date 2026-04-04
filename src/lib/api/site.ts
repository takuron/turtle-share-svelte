import { apiRequest, type ApiResponse } from '$lib/api/client';
import type { SiteInfo } from '$lib/config';

/**
 * Fetch public site information from the backend.
 * Returns the API response containing site info.
 */
// // 从后端获取公开的站点信息。
// // 返回包含站点信息的 API 响应。
export function fetchSiteInfoRequest(): Promise<ApiResponse<SiteInfo>> {
	return apiRequest<SiteInfo>('/public/site-info');
}
