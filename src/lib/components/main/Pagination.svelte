<script lang="ts">
	/**
	 * Pagination component matching the editorial design style.
	 * @prop {number} currentPage - Currently active page (1-based).
	 * @prop {number} totalPages - Total number of pages.
	 */
	// // 翻页组件，匹配编辑性设计风格。
	// // @prop {number} currentPage - 当前页码（从 1 开始）。
	// // @prop {number} totalPages - 总页数。
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';

	let {
		currentPage = 1,
		totalPages = 1,
		onPageChange
	}: {
		currentPage?: number;
		totalPages?: number;
		onPageChange?: (page: number) => void;
	} = $props();

	// 1. 计算需要显示的页码列表，中间用省略号连接。
	const visiblePages = $derived.by(() => {
		const pages: (number | '...')[] = [];
		if (totalPages <= 5) {
			for (let i = 1; i <= totalPages; i++) pages.push(i);
			return pages;
		}

		// 始终显示第一页
		pages.push(1);

		// 当前页附近的页码
		const start = Math.max(2, currentPage - 1);
		const end = Math.min(totalPages - 1, currentPage + 1);

		if (start > 2) pages.push('...');
		for (let i = start; i <= end; i++) pages.push(i);
		if (end < totalPages - 1) pages.push('...');

		// 始终显示最后一页
		pages.push(totalPages);
		return pages;
	});

	function goToPage(page: number) {
		if (page < 1 || page > totalPages || page === currentPage) return;
		onPageChange?.(page);
	}
</script>

<!-- 翻页导航 — 匹配原型中的 editorial 风格 -->
{#if totalPages > 1}
	<nav aria-label="Pagination" class="flex justify-center items-center space-x-2 my-12">
		<!-- 上一页按钮 -->
		<button
			class="flex items-center px-4 py-2 text-sm font-semibold text-on-surface-variant bg-surface-lowest
				rounded-lg hover:bg-base-300 hover:text-primary transition-colors
				disabled:opacity-50 disabled:cursor-not-allowed"
			disabled={currentPage <= 1}
			onclick={() => goToPage(currentPage - 1)}
		>
			<ChevronLeft size={16} class="mr-1" />
			Previous
		</button>

		<!-- 页码按钮 -->
		<div class="flex items-center gap-1">
			{#each visiblePages as page}
				{#if page === '...'}
					<span class="px-2 text-on-surface-variant">...</span>
				{:else if page === currentPage}
					<button
						class="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-primary-content
							font-bold text-sm shadow-editorial-sm"
					>
						{page}
					</button>
				{:else}
					<button
						class="w-10 h-10 flex items-center justify-center rounded-lg bg-surface-lowest text-on-surface-variant
							font-semibold text-sm hover:bg-base-300 hover:text-primary transition-colors"
						onclick={() => goToPage(page)}
					>
						{page}
					</button>
				{/if}
			{/each}
		</div>

		<!-- 下一页按钮 -->
		<button
			class="flex items-center px-4 py-2 text-sm font-semibold text-on-surface-variant bg-surface-lowest
				rounded-lg hover:bg-base-300 hover:text-primary transition-colors
				disabled:opacity-50 disabled:cursor-not-allowed"
			disabled={currentPage >= totalPages}
			onclick={() => goToPage(currentPage + 1)}
		>
			Next
			<ChevronRight size={16} class="ml-1" />
		</button>
	</nav>
{/if}
