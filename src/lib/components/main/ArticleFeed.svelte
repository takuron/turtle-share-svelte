<script lang="ts">
	/**
	 * Shared article feed component. Fetches and displays a page of articles with pagination.
	 * Selects the appropriate API based on the current user's auth role.
	 * @prop {number} page - Current page number (1-based).
	 */
	// // 共享文章信息流组件。根据当前用户的认证角色选择对应 API，获取并展示一页文章。
	// // @prop {number} page - 当前页码（从 1 开始）。
	import { onMount } from 'svelte';
	import PostCard from '$lib/components/main/PostCard.svelte';
	import Pagination from '$lib/components/main/Pagination.svelte';
	import type { ArticleListItem, PageInfo } from '$lib/api/types';
	import type { ApiResponse } from '$lib/api/client';
	import { fetchPublicArticlesPage, fetchPublicArticlesPageInfo } from '$lib/api/public/articles';
	import { fetchUserArticlesPage, fetchUserArticlesPageInfo } from '$lib/api/user/articles';
	import { fetchAdminArticlesPage, fetchAdminArticlesPageInfo } from '$lib/api/admin/articles';
	import { authStore } from '$lib/stores/auth.svelte';
	import * as m from '$lib/paraglide/messages.js';

	let { page = 1 }: { page?: number } = $props();

	let articles = $state<ArticleListItem[]>([]);
	let totalPages = $state(1);
	let loading = $state(true);
	let error = $state(false);

	// 1. 生成分页链接：第 1 页 → /，其他页 → /page/N。
	function getPageHref(p: number): string {
		return p <= 1 ? '/' : `/page/${p}`;
	}

	// 2. 根据认证角色选择对应的 API 函数。
	function getApiFunctions(): {
		fetchPage: (page: number) => Promise<ApiResponse<ArticleListItem[]>>;
		fetchPageInfo: () => Promise<ApiResponse<PageInfo>>;
	} {
		const role = authStore.session?.role ?? null;

		if (role === 'admin') {
			return { fetchPage: fetchAdminArticlesPage, fetchPageInfo: fetchAdminArticlesPageInfo };
		}
		if (role === 'user') {
			return { fetchPage: fetchUserArticlesPage, fetchPageInfo: fetchUserArticlesPageInfo };
		}
		return { fetchPage: fetchPublicArticlesPage, fetchPageInfo: fetchPublicArticlesPageInfo };
	}

	// 3. 并行获取文章列表和分页信息。
	async function loadArticles(p: number) {
		loading = true;
		error = false;

		const { fetchPage, fetchPageInfo } = getApiFunctions();

		try {
			const [articlesRes, pageInfoRes] = await Promise.all([
				fetchPage(p),
				fetchPageInfo()
			]);

			if (articlesRes.success) {
				articles = articlesRes.data;
			} else {
				error = true;
			}

			if (pageInfoRes.success) {
				totalPages = pageInfoRes.data.total_pages;
			}
		} catch {
			error = true;
		} finally {
			loading = false;
		}
	}

	// 4. 当 page 或 auth 状态变化时重新加载。
	$effect(() => {
		// 读取 page 和 authStore.session 以建立依赖追踪
		const _page = page;
		const _session = authStore.session;
		loadArticles(_page);
	});
</script>

<!-- 文章信息流 -->
{#if loading}
	<!-- 加载状态 -->
	<div class="flex justify-center py-24">
		<span class="loading loading-spinner loading-lg text-primary"></span>
		<span class="ml-3 text-on-surface-variant">{m.loading_articles()}</span>
	</div>
{:else if error}
	<!-- 错误状态 -->
	<div class="text-center py-24 text-on-surface-variant">
		<p>{m.load_error()}</p>
	</div>
{:else if articles.length === 0}
	<!-- 空状态 -->
	<div class="text-center py-24 text-on-surface-variant">
		<p>{m.no_articles()}</p>
	</div>
{:else}
	<!-- 垂直帖子信息流 — DESIGN.md §5: 卡片间距 2rem -->
	<div class="space-y-12 mb-12">
		{#each articles as article (article.hash_id)}
			<PostCard
				title={article.title}
				hashId={article.hash_id}
				coverImage={article.cover_image}
				requiredTier={article.required_tier}
				accessible={article.accessible}
				createdAt={article.created_at}
			/>
		{/each}
	</div>

	<!-- 翻页 -->
	<Pagination currentPage={page} {totalPages} getHref={getPageHref} />
{/if}
