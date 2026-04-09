/**
 * Shared date formatting utilities for Unix timestamps (seconds).
 * Unix 时间戳（秒级）的共享日期格式化工具。
 */
// // Unix 时间戳（秒级）的共享日期格式化工具。

/**
 * Format a Unix timestamp (seconds) to a localized short date string.
 * E.g., "Jan 1, 2024" in English, "2024年1月1日" in Chinese.
 */
// // 将秒级 Unix 时间戳格式化为本地化短日期字符串。
export function formatShortDate(timestampSeconds: number): string {
	return new Date(timestampSeconds * 1000).toLocaleDateString(undefined, {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	});
}

/**
 * Format a Unix timestamp (seconds) to ISO date string (YYYY-MM-DD).
 * Useful for date inputs and structured display.
 */
// // 将秒级 Unix 时间戳格式化为 ISO 日期字符串（YYYY-MM-DD）。
export function formatIsoDate(timestampSeconds: number): string {
	const d = new Date(timestampSeconds * 1000);
	const y = d.getFullYear();
	const mo = String(d.getMonth() + 1).padStart(2, '0');
	const day = String(d.getDate()).padStart(2, '0');
	return `${y}-${mo}-${day}`;
}
