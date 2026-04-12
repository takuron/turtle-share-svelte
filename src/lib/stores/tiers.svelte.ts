import { fetchTiersRequest } from '$lib/api/public/site';
import type { SubscriptionTier } from '$lib/api/types';

// 1. 使用 Svelte 5 Runes 定义全局订阅等级状态对象。
export const tiersStore = $state<{
	tiers: SubscriptionTier[];
	updated_at: number;
	loading: boolean;
}>({
	tiers: [],
	updated_at: -1,
	loading: true
});

// 2. 每次应用加载时发起的获取订阅等级信息的请求。
export async function fetchTiers() {
	tiersStore.loading = true;
	try {
		const res = await fetchTiersRequest();
		if (res.success) {
			tiersStore.tiers = res.data.tiers || [];
			tiersStore.updated_at = res.data.updated_at;
		} else {
			console.error('获取订阅等级信息失败:', res.error.message);
			tiersStore.tiers = [];
		}
	} catch (err) {
		console.error('获取订阅等级信息出错:', err);
		tiersStore.tiers = [];
	} finally {
		tiersStore.loading = false;
	}
}
