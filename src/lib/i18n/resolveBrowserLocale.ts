/**
 * Resolve a locale from browser language tags with Chinese variant fallback.
 * Unmatched languages fall back to English (via baseLocale strategy).
 * All Chinese variants (zh-TW, zh-HK, zh, etc.) fall back to zh-cn.
 */
// // 从浏览器语言标签列表中解析出匹配的 locale。
// // 中文变体统一回退至 zh-cn，其余未匹配语言由 baseLocale 策略回退至英语。
import { locales, type Locale } from '$lib/paraglide/runtime';

/**
 * Resolve locale from an ordered list of language tags (highest priority first).
 * @param tags - Language tags from Accept-Language header or navigator.languages
 * @returns Matched locale or undefined if no match
 */
// // 按优先级遍历语言标签，依次尝试精确匹配、中文变体回退、基础语言匹配。
export function resolveLocaleFromTags(tags: string[]): Locale | undefined {
	for (const tag of tags) {
		const lower = tag.toLowerCase();

		// 1. 精确匹配（不区分大小写），例如 en → en, zh-cn → zh-cn
		const exact = locales.find((l) => l.toLowerCase() === lower) as Locale | undefined;
		if (exact) return exact;

		// 2. 所有中文变体回退至 zh-cn（zh, zh-TW, zh-HK, zh-SG 等）
		if (lower === 'zh' || lower.startsWith('zh-')) {
			const zhCn = locales.find((l) => l.toLowerCase() === 'zh-cn') as Locale | undefined;
			if (zhCn) return zhCn;
		}

		// 3. 基础语言标签匹配（例如 en-US → en, en-GB → en）
		const base = lower.split('-')[0];
		const baseMatch = locales.find((l) => l.toLowerCase() === base) as Locale | undefined;
		if (baseMatch) return baseMatch;
	}

	return undefined;
}
