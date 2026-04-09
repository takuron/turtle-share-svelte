<script lang="ts">
	/**
	 * Admin Article/Content Management page (Prototype).
	 * 管理员文章/内容管理页面（原型）。
	 */
	// // 管理员文章/内容管理页面（原型）。
	import * as m from '$lib/paraglide/messages.js';
	import { CirclePlus } from 'lucide-svelte';
	import AdminPagination from '$lib/components/admin/AdminPagination.svelte';
	import AdminArticleListItem from '$lib/components/admin/AdminArticleListItem.svelte';

	// 1. Mock data based on the prototype.
	const mockArticles = [
		{
			id: 1,
			title: 'The Future of Generative UI: A Deep Dive',
			date: 'Oct 24, 2023',
			requirement: 'Public',
			requirementClass: 'bg-indigo-100 text-indigo-700'
		},
		{
			id: 2,
			title: 'Understanding Modern CSS Layouts',
			date: 'Oct 26, 2023',
			requirement: 'Level 5',
			requirementClass: 'bg-slate-200 text-slate-700'
		},
		{
			id: 3,
			title: 'Building Personal Brands in 2024',
			date: 'Oct 28, 2023',
			requirement: 'Public',
			requirementClass: 'bg-indigo-100 text-indigo-700'
		}
	];

	// 2. 分页状态。
	let currentPage = $state(1);
	let totalPages = 15;

	// 3. 处理页码切换。
	function handlePageChange(page: number) {
		currentPage = page;
	}

	// 4. Mock 回调
	function handleEdit(article: any) {
		console.log('Edit article', article.id);
	}

	function handleDelete(article: any) {
		console.log('Delete article', article.id);
	}
</script>

<!-- 内容管理头部 -->
<div class="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
	<h2 class="px-2 font-display text-3xl font-extrabold tracking-tight text-on-surface lg:px-6">
		{m.nav_content_management()}
	</h2>
	<button
		class="flex cursor-pointer items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white shadow-xl shadow-primary/20 transition-all gradient-cta hover:scale-[1.02] active:scale-95 lg:px-8 lg:py-4 lg:text-base"
	>
		<CirclePlus size={20} />
		{m.publish_new_article()}
	</button>
</div>

<!-- 内容列表 -->
<div class="space-y-4">
	<!-- 表头 -->
	<div
		class="text-outline grid grid-cols-12 px-6 py-3 text-xs font-black tracking-widest uppercase"
	>
		<div class="col-span-6">{m.col_article_title()}</div>
		<div class="col-span-2">{m.col_date()}</div>
		<div class="col-span-3">{m.col_requirement()}</div>
		<div class="col-span-1 text-right">{m.col_actions()}</div>
	</div>

	<!-- 列表项容器 -->
	{#each mockArticles as article (article.id)}
		<AdminArticleListItem
			{article}
			onedit={() => handleEdit(article)}
			ondelete={() => handleDelete(article)}
		/>
	{/each}
</div>

<!-- 分页 -->
<AdminPagination
	{currentPage}
	{totalPages}
	onpagechange={handlePageChange}
	showingText={m.showing_articles({ from: '1', to: '3', total: '142' })}
/>
