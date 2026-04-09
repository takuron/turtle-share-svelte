import type { ThemeColors } from '$lib/config';

/**
 * Parse oklch lightness from an oklch() string.
 * Returns a number in [0, 100] or null if not parseable.
 */
// // 从 oklch 字符串中提取亮度值，用于自动计算对比文本色。
function parseLightness(oklch: string): number | null {
	const match = oklch.match(/oklch\(\s*([\d.]+)%/);
	return match ? parseFloat(match[1]) : null;
}

/**
 * Auto-derive a content color (text on top of a color) based on lightness.
 * Light backgrounds get dark text; dark backgrounds get white text.
 */
// // 亮度 > 60% 用深色文本，否则用白色文本。
function deriveContentColor(oklch: string): string {
	const l = parseLightness(oklch);
	return l !== null && l > 60 ? 'oklch(30% 0.02 260)' : 'oklch(100% 0 0)';
}

/**
 * Apply ThemeColors config as CSS custom property overrides on <html>.
 * Overrides DaisyUI theme variables at runtime so config changes take effect.
 *
 * @param colors - ThemeColors from config
 */
// // 将配置中的主题色注入到 <html> 的 CSS 自定义属性，覆盖 DaisyUI 默认主题。
export function applyThemeColors(colors: ThemeColors): void {
	const s = document.documentElement.style;

	// 主色
	s.setProperty('--color-primary', colors.primary);
	s.setProperty('--color-primary-content', deriveContentColor(colors.primary));

	// 辅色
	s.setProperty('--color-secondary', colors.secondary);
	s.setProperty('--color-secondary-content', deriveContentColor(colors.secondary));

	// 强调色
	s.setProperty('--color-accent', colors.accent);
	s.setProperty('--color-accent-content', deriveContentColor(colors.accent));
}
