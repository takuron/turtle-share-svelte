import { API_URL, DEFAULT_SITE_INFO } from '$lib/config';

// 1. 使用 Svelte 5 Runes 定义全局站点信息状态对象，初始值为缺省设置。
export const siteStore = $state<{ info: any }>({
	info: DEFAULT_SITE_INFO
});

// 2. 每次访问时在客户端发起的获取站点信息的请求。
export async function fetchSiteInfo() {
	try {
		const res = await fetch(`${API_URL}/public/site-info`);
		if (res.ok) {
			const json = await res.json();
			siteStore.info = json.data;
		} else {
			console.error('获取站点信息失败状态码:', res.status);
			// 3. 失败时使用缺省设置
			siteStore.info = DEFAULT_SITE_INFO;
		}
	} catch (err) {
		console.error('获取站点信息出错:', err);
		// 4. 异常时使用缺省设置
		siteStore.info = DEFAULT_SITE_INFO;
	}
}
