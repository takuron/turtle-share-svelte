<script lang="ts">
	/**
	 * Admin Edit Article page.
	 * Fetches article detail from API, converts to form data, and calls updateAdminArticle on save.
	 *
	 * 管理员编辑文章页面。
	 * 从 API 获取文章详情，转换为表单数据，保存时调用 updateAdminArticle。
	 */
	// // 管理员编辑文章页面。
	// // 从 API 获取文章详情，转换为表单数据，保存时调用 updateAdminArticle。
	import ArticleEditor from '$lib/components/admin/article/ArticleEditor.svelte';
	import type { ArticleFormData } from '$lib/components/admin/article/ArticleEditor.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { Loader2 } from 'lucide-svelte';
	import {
		fetchAdminArticleDetail,
		updateAdminArticle,
		type UpdateArticleRequest
	} from '$lib/api/admin/articles';
	import type { ArticleDetail } from '$lib/api/types';

	// 1. 从 URL 参数获取文章 ID。
	let articleId = $derived(page.params.id);

	// 2. 状态管理：加载、保存、错误信息。
	let isLoading = $state(true);
	let isSaving = $state(false);
	let errorMessage = $state('');
	let fetchError = $state('');
	let initialData = $state<Partial<ArticleFormData>>({});
	let articleDetail = $state<ArticleDetail | null>(null);

	// 3. 将 Unix 时间戳（秒）转换为 HTML date input 所需的 "YYYY-MM-DD" 格式字符串。
	function timestampToDate(ts: number | null | undefined): string {
		if (!ts) return '';
		const date = new Date(ts * 1000);
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	}

	// 4. 将 HTML date input 的 "YYYY-MM-DD" 格式字符串转换为 Unix 时间戳（秒）。
	//    如果日期为空，则不传 publish_at，让后端保持原值。
	function dateToTimestamp(dateStr: string): number | undefined {
		if (!dateStr) return undefined;
		const date = new Date(dateStr);
		if (isNaN(date.getTime())) return undefined;
		return Math.floor(date.getTime() / 1000);
	}

	// 5. 加载文章详情。
	onMount(async () => {
		await loadArticle();
	});

	async function loadArticle() {
		isLoading = true;
		fetchError = '';

		if (!articleId) {
			fetchError = 'Article ID is missing.';
			isLoading = false;
			return;
		}

		const res = await fetchAdminArticleDetail(articleId);

		if (res.success) {
			articleDetail = res.data;
			// 将 API 返回的 ArticleDetail 转换为 ArticleEditor 所需的 ArticleFormData。
			initialData = {
				title: res.data.title,
				content: res.data.content,
				publishDate: timestampToDate(res.data.publish_at),
				headerImage: res.data.cover_image || '',
				requiredTier: res.data.required_tier,
				isPublic: res.data.is_public,
				fileLinks: res.data.file_links ? [...res.data.file_links] : []
			};
		} else {
			fetchError = res.error?.message || 'Failed to load article.';
		}

		isLoading = false;
	}

	// 6. 处理保存：将 ArticleFormData 转换为 API 请求体并调用更新接口。
	async function handleSave(data: ArticleFormData) {
		isSaving = true;
		errorMessage = '';

		// 构建更新请求体，仅包含有意义的字段。
		const requestBody: UpdateArticleRequest = {
			title: data.title.trim(),
			content: data.content,
			required_tier: data.requiredTier,
			is_public: data.isPublic
		};

		// 封面图片：空字符串表示清除，有值则设置。
		requestBody.cover_image = data.headerImage || null;

		// 附件列表：始终发送完整列表（包括空数组以清除所有附件）。
		requestBody.file_links = data.fileLinks || [];

		// 发布日期：转换为 Unix 时间戳。
		const publishAt = dateToTimestamp(data.publishDate);
		if (publishAt !== undefined) {
			requestBody.publish_at = publishAt;
		}

		try {
			const res = await updateAdminArticle(articleId!, requestBody);

			if (res.success) {
				// 更新成功，跳转到文章列表。
				goto('/dashboard/article');
			} else {
				// 显示后端返回的错误信息。
				errorMessage = res.error?.message || 'Failed to update article.';
			}
		} catch (error) {
			console.error('Update article error:', error);
			errorMessage = 'An unexpected error occurred. Please try again.';
		} finally {
			isSaving = false;
		}
	}
</script>

<svelte:head>
	<title>{m.edit_article_title()}</title>
</svelte:head>

{#if isLoading}
	<!-- 加载状态 -->
	<div class="flex flex-col items-center justify-center py-20">
		<Loader2 size={32} class="animate-spin text-primary" />
		<p class="mt-4 text-sm font-medium text-on-surface-variant">Loading article...</p>
	</div>
{:else if fetchError}
	<!-- 加载失败状态 -->
	<div class="flex flex-col items-center justify-center py-20">
		<p class="text-sm font-medium text-error">{fetchError}</p>
		<button
			onclick={loadArticle}
			class="mt-4 cursor-pointer rounded-full px-6 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary/10"
		>
			Retry
		</button>
	</div>
{:else}
	<ArticleEditor
		pageTitle={m.edit_article_title()}
		isEdit={true}
		{initialData}
		{isSaving}
		{errorMessage}
		onsave={handleSave}
	/>
{/if}
