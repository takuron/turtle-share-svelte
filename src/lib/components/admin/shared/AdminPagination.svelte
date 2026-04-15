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

	let {
		currentPage,
		totalPages,
		onpagechange,
		showingText = ''
	}: {
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
	<div class="mt-12 flex flex-col items-center justify-between gap-4 px-2 sm:flex-row lg:px-6">
		{#if showingText}
			<p class="text-xs font-bold tracking-wider text-on-surface-variant uppercase">
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
				class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-surface-container text-on-surface transition-all hover:bg-surface-dim disabled:cursor-not-allowed disabled:opacity-30"
			>
				<ChevronLeft size={18} />
			</button>

			<!-- 页码 -->
			{#each getPageNumbers(currentPage, totalPages) as pageNum}
				<button
					onclick={() => onpagechange(pageNum)}
					class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-all
						{pageNum === currentPage
						? 'bg-primary font-bold text-white shadow-md'
						: 'bg-surface-container text-on-surface hover:bg-surface-dim'}"
				>
					{pageNum}
				</button>
			{/each}

			<!-- 下一页 -->
			<button
				onclick={() => onpagechange(currentPage + 1)}
				disabled={currentPage >= totalPages}
				class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-surface-container text-on-surface transition-all hover:bg-surface-dim disabled:cursor-not-allowed disabled:opacity-30"
			>
				<ChevronRight size={18} />
			</button>
		</div>
	</div>
{/if}
