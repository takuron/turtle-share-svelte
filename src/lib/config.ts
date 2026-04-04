import type { SocialLink } from '$lib/config/socialIcons.svelte';

// 1. 预设的 API 地址，默认与前端同路径（同源）。
//export const API_URL = '/api';
export const API_URL = 'http://localhost:3000/api';

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
