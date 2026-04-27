/**
 * Search state store using Svelte 5 Runes.
 * 搜索状态store，使用Svelte 5 Runes。
 */

// 搜索状态：包含搜索查询和是否正在搜索的标志
export const searchStore = $state<{
	query: string;
	isSearching: boolean;
}>({
	query: '',
	isSearching: false
});

/**
 * Set the search query and mark as searching.
 * @param q - The search query string.
 */
// // 设置搜索查询并标记为正在搜索。
// // @param q - 搜索查询字符串。
export function setSearchQuery(q: string) {
	searchStore.query = q.trim();
	searchStore.isSearching = q.trim() !== '';
}

/**
 * Clear the search query and stop searching.
 */
// // 清除搜索查询并停止搜索。
export function clearSearch() {
	searchStore.query = '';
	searchStore.isSearching = false;
}
