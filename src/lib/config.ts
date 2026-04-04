import type { SocialLink } from '$lib/config/socialIcons.svelte';

// 1. API 地址：使用相对路径，开发环境通过 Vite proxy 转发到后端。
export const API_URL = '/api';

// 2. 无法获取 API 提供的 site_info 时的本地缺省设置。
export const DEFAULT_SITE_INFO: {
	name: string;
	author: string;
	avatar: string;
	bio: string;
	social_links: SocialLink[];
} = {
	name: 'TurtleShare',
	author: 'Admin',
	avatar: '',
	bio: 'Admin',
	social_links: [
		{ platform: 'github', url: 'https://github.com/takuron' },
		{ platform: 'x', url: 'https://x.com/example' },
		{ platform: 'bilibili', url: 'https://space.bilibili.com/12345' },
		{ platform: 'telegram', url: 'https://t.me/example' },
		{ platform: 'email', url: 'mailto:hello@example.com' }
	]
};
