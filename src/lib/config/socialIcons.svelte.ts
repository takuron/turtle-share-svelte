/**
 * Social platform icon registry — maps platform keys to icon components.
 * Supports both Simple Icons (brand) and Lucide (generic) icons.
 */
// // 社交平台图标注册表 — 将平台键映射到图标组件。
// // 同时支持 Simple Icons（品牌）和 Lucide（通用）图标。
import type { Component } from 'svelte';

// 品牌图标 (Simple Icons) — 从 barrel export 导入，Vite 负责 tree-shaking
import {
	SiX,
	SiSinaweibo,
	SiThreads,
	SiMastodon,
	SiBluesky,
	SiPixiv,
	SiBilibili,
	SiYoutube,
	SiArtstation,
	SiGithub,
	SiTelegram,
	SiDiscord,
	SiQq,
	SiWechat,
	SiAlipay,
	SiSteam,
	SiEagle,
	SiReddit,
	SiMisskey,
	SiPaypal
} from '@icons-pack/svelte-simple-icons';

// 通用图标 (Lucide)
import { Mail, Globe, Rss } from 'lucide-svelte';

/**
 * Social link item as returned by site-info API.
 */
// // 由 site-info API 返回的社交链接条目。
export interface SocialLink {
	platform: string;
	url: string;
}

export interface SocialPlatform {
	label: string;
	icon: Component<any>;
}

// 1. 预置的平台图标注册表，键名对应 siteinfo.social_links[].platform。
export const socialPlatforms: Record<string, SocialPlatform> = {
	// 社交媒体
	x: { label: 'X (Twitter)', icon: SiX },
	weibo: { label: '微博', icon: SiSinaweibo },
	threads: { label: 'Threads', icon: SiThreads },
	mastodon: { label: 'Mastodon', icon: SiMastodon },
	bluesky: { label: 'Bluesky', icon: SiBluesky },

	// 创作/作品
	pixiv: { label: 'Pixiv', icon: SiPixiv },
	bilibili: { label: 'Bilibili', icon: SiBilibili },
	youtube: { label: 'YouTube', icon: SiYoutube },
	artstation: { label: 'ArtStation', icon: SiArtstation },

	// 开发/技术
	github: { label: 'GitHub', icon: SiGithub },

	// 即时通讯
	telegram: { label: 'Telegram', icon: SiTelegram },
	discord: { label: 'Discord', icon: SiDiscord },
	qq: { label: 'QQ', icon: SiQq },
	wechat: { label: 'WeChat', icon: SiWechat },

	// 支付/商店
	alipay: { label: '支付宝', icon: SiAlipay },
	paypal: { label: 'PayPal', icon: SiPaypal },
	steam: { label: 'Steam', icon: SiSteam },

	// 其他
	eagle: { label: 'Eagle', icon: SiEagle },
	reddit: { label: 'Reddit', icon: SiReddit },
	misskey: { label: 'Misskey', icon: SiMisskey },

	// 通用（Lucide 图标）
	email: { label: '邮箱', icon: Mail },
	website: { label: '个人网站', icon: Globe },
	rss: { label: 'RSS', icon: Rss }
};
