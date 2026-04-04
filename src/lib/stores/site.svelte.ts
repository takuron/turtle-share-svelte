import { DEFAULT_SITE_INFO, type SiteInfo } from '$lib/config';
import { fetchSiteInfoRequest } from '$lib/api/public/site';

// 1. 使用 Svelte 5 Runes 定义全局站点信息状态对象，初始值为缺省设置。
export const siteStore = $state<{ info: SiteInfo }>({
	info: DEFAULT_SITE_INFO
});

// 2. 每次访问时在客户端发起的获取站点信息的请求。
export async function fetchSiteInfo() {
	try {
		const res = await fetchSiteInfoRequest();
		if (res.success) {
			siteStore.info = { ...DEFAULT_SITE_INFO, ...res.data };
		} else {
			console.error('获取站点信息失败:', res.error.message);
			siteStore.info = DEFAULT_SITE_INFO;
		}
	} catch (err) {
		console.error('获取站点信息出错:', err);
		siteStore.info = DEFAULT_SITE_INFO;
	}
}
