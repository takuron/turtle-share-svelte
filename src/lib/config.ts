import type { SocialLink } from '$lib/config/socialIcons.svelte';

// 1. API 地址：使用相对路径，开发环境通过 Vite proxy 转发到后端。
export const API_URL = '/api';

// 2. 站点信息类型定义。
export interface SiteInfo {
	name: string;
	author: string;
	avatar: string;
	bio: string;
	social_links: SocialLink[];
}

// 3. 主题色配置类型定义。
// // 修改此处即可全局切换网站主色调，值使用 oklch 格式。
export interface ThemeColors {
	primary: string; // 主色（按钮、链接、CTA）
	secondary: string; // 辅色（次要操作）
	accent: string; // 强调色（高亮、装饰）
}

// 4. 默认主题色 — 与 layout.css 中 editorial 主题一致。
export const DEFAULT_THEME_COLORS: ThemeColors = {
	primary: 'oklch(49.61% 0.242 275.31)',
	secondary: 'oklch(50.15% 0.216 342.46)',
	accent: 'oklch(71.61% 0.152 282.28)'
};

// 5. 无法获取 API 提供的 site_info 时的本地缺省设置。
export const DEFAULT_SITE_INFO: SiteInfo = {
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
