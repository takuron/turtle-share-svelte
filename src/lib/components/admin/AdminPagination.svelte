<script lang="ts">
	/**
	 * Reusable pagination component for admin dashboard pages.
	 * Displays page numbers with prev/next buttons.
	 *
	 * @prop {number} currentPage - Currently active page (1-based).
	 * @prop {number} totalPages - Total number of pages.
	 * @prop {(page: number) => void} onpagechange - Callback when a page is selected.
	 * @prop {string} [showingText] - Optional "Showing X to Y of Z" text.
	 */
	// // 管理员仪表盘通用分页组件。
	// // 显示页码按钮和上/下一页。
	// //
	// // @prop {number} currentPage - 当前页码（从 1 开始）。
	// // @prop {number} totalPages - 总页数。
	// // @prop {(page: number) => void} onpagechange - 页码切换回调。
	// // @prop {string} [showingText] - 可选的"显示第 X 至 Y 条"文本。
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';

	let { currentPage, totalPages, onpagechange, showingText = '' }: {
		currentPage: number;
		totalPages: number;
		onpagechange: (page: number) => void;
		showingText?: string;
	} = $props();

	// 1. 计算分页器显示的页码范围（最多显示 3 个中间页码）。
	function getPageNumbers(current: number, total: number): number[] {
		if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
		const start = Math.max(1, Math.min(current - 1, total - 2));
		const end = Math.min(total, start + 2);
		return Array.from({ length: end - start + 1 }, (_, i) => start + i);
	}
</script>

{#if totalPages > 1}
	<div class="flex flex-col sm:flex-row justify-between items-center mt-12 px-2 lg:px-6 gap-4">
		{#if showingText}
			<p class="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
				{showingText}
			</p>
		{:else}
			<div></div>
		{/if}
		<div class="flex items-center gap-2">
			<!-- 上一页 -->
			<button
				onclick={() => onpagechange(currentPage - 1)}
				disabled={currentPage <= 1}
				class="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container text-on-surface hover:bg-surface-dim transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
			>
				<ChevronLeft size={18} />
			</button>

			<!-- 页码 -->
			{#each getPageNumbers(currentPage, totalPages) as pageNum}
				<button
					onclick={() => onpagechange(pageNum)}
					class="w-10 h-10 flex items-center justify-center rounded-full transition-all cursor-pointer
						{pageNum === currentPage
							? 'bg-primary text-white font-bold shadow-md'
							: 'bg-surface-container text-on-surface hover:bg-surface-dim'}"
				>
					{pageNum}
				</button>
			{/each}

			<!-- 下一页 -->
			<button
				onclick={() => onpagechange(currentPage + 1)}
				disabled={currentPage >= totalPages}
				class="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container text-on-surface hover:bg-surface-dim transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
			>
				<ChevronRight size={18} />
			</button>
		</div>
	</div>
{/if}
