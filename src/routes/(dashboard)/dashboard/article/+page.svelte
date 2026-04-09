<script lang="ts">
	/**
	 * Admin Article/Content Management page.
	 * 管理员文章/内容管理页面。
	 */
	// // 管理员文章/内容管理页面。
	import * as m from '$lib/paraglide/messages.js';
	import { CirclePlus, Loader2 } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import AdminPagination from '$lib/components/admin/AdminPagination.svelte';
	import AdminArticleListItem from '$lib/components/admin/AdminArticleListItem.svelte';
	import ConfirmModal from '$lib/components/admin/ConfirmModal.svelte';
	import {
		fetchAdminArticlesRawPage,
		fetchAdminArticlesPageInfo,
		deleteAdminArticle
	} from '$lib/api/admin/articles';
	import { ADMIN_ARTICLES_PAGE_SIZE, type AdminArticleRawItem } from '$lib/api/types';

	// 1. 状态管理
	let articles = $state<AdminArticleRawItem[]>([]);
	let currentPage = $state(1);
	let totalPages = $state(1);
	let totalItems = $state(0);
	let isLoading = $state(true);

	// 2. 删除确认模态框状态
	let isDeleteModalOpen = $state(false);
	let isDeleting = $state(false);
	let articleToDelete = $state<AdminArticleRawItem | null>(null);

	// 初始化
	onMount(() => {
		loadPage(1);
	});

	// 3. 加载分页数据
	async function loadPage(page: number) {
		isLoading = true;
		currentPage = page;
		try {
			const [infoRes, listRes] = await Promise.all([
				fetchAdminArticlesPageInfo(ADMIN_ARTICLES_PAGE_SIZE),
				fetchAdminArticlesRawPage(page, ADMIN_ARTICLES_PAGE_SIZE)
			]);

			if (infoRes.success) {
				totalPages = infoRes.data.total_pages;
				totalItems = infoRes.data.total_items;
			}
			if (listRes.success) {
				articles = listRes.data;
			}
		} catch (error) {
			console.error('Failed to load articles', error);
		} finally {
			isLoading = false;
		}
	}

	function handlePageChange(page: number) {
		loadPage(page);
	}

	// 4. 格式化辅助函数
	function formatDate(timestamp: number) {
		return new Date(timestamp * 1000).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	function getRequirements(item: AdminArticleRawItem) {
		const reqs = [];
		reqs.push({
			text: m.req_level({ tier: String(item.required_tier) }),
			className: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
		});
		if (item.is_public) {
			reqs.push({
				text: m.req_public(),
				className: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
			});
		}
		return reqs;
	}

	// 计算分页显示文本
	let showingText = $derived(() => {
		if (totalItems === 0) return m.no_articles();
		const start = (currentPage - 1) * ADMIN_ARTICLES_PAGE_SIZE + 1;
		const end = Math.min(currentPage * ADMIN_ARTICLES_PAGE_SIZE, totalItems);
		return m.showing_articles({
			from: String(start),
			to: String(end),
			total: String(totalItems)
		});
	});

	// 5. 事件处理
	function handleEdit(article: AdminArticleRawItem) {
		// TODO: Navigate to article editor page
		console.log('Edit article', article.hash_id);
	}

	function confirmDelete(article: AdminArticleRawItem) {
		articleToDelete = article;
		isDeleteModalOpen = true;
	}

	async function handleDelete() {
		if (!articleToDelete) return;
		isDeleting = true;
		try {
			const res = await deleteAdminArticle(articleToDelete.hash_id);
			if (res.success) {
				isDeleteModalOpen = false;
				articleToDelete = null;
				// 如果当前页没有数据了，回退一页
				if (articles.length === 1 && currentPage > 1) {
					await loadPage(currentPage - 1);
				} else {
					await loadPage(currentPage);
				}
			} else {
				alert(`Delete failed: ${res.error?.message}`);
			}
		} catch (error) {
			console.error('Delete error:', error);
		} finally {
			isDeleting = false;
		}
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

	{#if isLoading}
		<div class="flex items-center justify-center py-20">
			<Loader2 size={24} class="animate-spin text-primary" />
			<span class="ml-3 text-sm text-on-surface-variant">{m.loading_articles()}</span>
		</div>
	{:else if articles.length === 0}
		<div class="flex items-center justify-center py-20">
			<p class="text-sm font-medium text-on-surface-variant">{m.no_articles()}</p>
		</div>
	{:else}
		<!-- 列表项容器 -->
		{#each articles as article (article.hash_id)}
			{@const reqs = getRequirements(article)}
			<AdminArticleListItem
				article={{
					title: article.title,
					date: formatDate(article.publish_at),
					requirements: reqs
				}}
				onedit={() => handleEdit(article)}
				ondelete={() => confirmDelete(article)}
			/>
		{/each}
	{/if}
</div>

<!-- 分页 -->
{#if totalPages > 1}
	<AdminPagination
		{currentPage}
		{totalPages}
		onpagechange={handlePageChange}
		showingText={showingText()}
	/>
{/if}

<!-- Confirm Delete Modal -->
<ConfirmModal
	open={isDeleteModalOpen}
	title={m.delete()}
	description={`Are you sure you want to delete "${articleToDelete?.title}"? This action cannot be undone.`}
	confirmText={m.delete()}
	cancelText={m.cancel()}
	danger={true}
	loading={isDeleting}
	onclose={() => (isDeleteModalOpen = false)}
	onconfirm={handleDelete}
/>
