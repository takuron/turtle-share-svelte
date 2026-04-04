<script lang="ts">
	/**
	 * Link-based pagination component matching the editorial design style.
	 * @prop {number} currentPage - Currently active page (1-based).
	 * @prop {number} totalPages - Total number of pages.
	 * @prop {(page: number) => string} getHref - Function to generate href for a given page number.
	 */
	// // 基于链接的翻页组件，匹配编辑性设计风格。
	// // @prop {number} currentPage - 当前页码（从 1 开始）。
	// // @prop {number} totalPages - 总页数。
	// // @prop {(page: number) => string} getHref - 根据页码生成链接的函数。
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';

	let {
		currentPage = 1,
		totalPages = 1,
		getHref
	}: {
		currentPage?: number;
		totalPages?: number;
		getHref: (page: number) => string;
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
</script>

<!-- 翻页导航 — 匹配原型中的 editorial 风格 -->
{#if totalPages > 1}
	<nav aria-label="Pagination" class="flex justify-center items-center space-x-2 my-12">
		<!-- 上一页按钮 -->
		{#if currentPage > 1}
			<a
				href={getHref(currentPage - 1)}
				class="flex items-center px-4 py-2 text-sm font-semibold text-on-surface-variant bg-surface-lowest
					rounded-lg hover:bg-base-300 hover:text-primary transition-colors"
			>
				<ChevronLeft size={16} class="mr-1" />
				{m.previous()}
			</a>
		{:else}
			<span
				class="flex items-center px-4 py-2 text-sm font-semibold text-on-surface-variant bg-surface-lowest
					rounded-lg opacity-50 cursor-not-allowed"
			>
				<ChevronLeft size={16} class="mr-1" />
				{m.previous()}
			</span>
		{/if}

		<!-- 页码按钮 -->
		<div class="flex items-center gap-1">
			{#each visiblePages as page}
				{#if page === '...'}
					<span class="px-2 text-on-surface-variant">...</span>
				{:else if page === currentPage}
					<span
						class="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-primary-content
							font-bold text-sm shadow-editorial-sm"
					>
						{page}
					</span>
				{:else}
					<a
						href={getHref(page)}
						class="w-10 h-10 flex items-center justify-center rounded-lg bg-surface-lowest text-on-surface-variant
							font-semibold text-sm hover:bg-base-300 hover:text-primary transition-colors"
					>
						{page}
					</a>
				{/if}
			{/each}
		</div>

		<!-- 下一页按钮 -->
		{#if currentPage < totalPages}
			<a
				href={getHref(currentPage + 1)}
				class="flex items-center px-4 py-2 text-sm font-semibold text-on-surface-variant bg-surface-lowest
					rounded-lg hover:bg-base-300 hover:text-primary transition-colors"
			>
				{m.next()}
				<ChevronRight size={16} class="ml-1" />
			</a>
		{:else}
			<span
				class="flex items-center px-4 py-2 text-sm font-semibold text-on-surface-variant bg-surface-lowest
					rounded-lg opacity-50 cursor-not-allowed"
			>
				{m.next()}
				<ChevronRight size={16} class="ml-1" />
			</span>
		{/if}
	</nav>
{/if}
