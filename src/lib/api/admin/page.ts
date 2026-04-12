import { apiRequest, type ApiResponse } from '$lib/api/client';
import type { SubscriptionTier } from '$lib/api/types';

export interface AnnouncementResponse {
	content: string;
	updated_at: number;
}

export function updateAdminAnnouncement(
	content: string
): Promise<ApiResponse<AnnouncementResponse>> {
	return apiRequest<AnnouncementResponse>('/admin/announcement', {
		method: 'PUT',
		body: JSON.stringify({ content })
	});
}

export function updateAdminTierDescription(tier: SubscriptionTier): Promise<ApiResponse<any>> {
	return apiRequest<any>('/admin/tier-descriptions', {
		method: 'PUT',
		body: JSON.stringify(tier)
	});
}

export function deleteAdminTierDescription(tier: number): Promise<ApiResponse<any>> {
	return apiRequest<any>(`/admin/tier-descriptions/${tier}`, {
		method: 'DELETE'
	});
}
