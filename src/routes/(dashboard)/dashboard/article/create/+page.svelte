<script lang="ts">
	/**
	 * Admin Create Article page.
	 * Converts form data from ArticleEditor to API request format and calls createAdminArticle.
	 *
	 * 管理员创建文章页面。
	 * 将 ArticleEditor 的表单数据转换为 API 请求格式，并调用 createAdminArticle。
	 */
	// // 管理员创建文章页面。
	// // 将 ArticleEditor 的表单数据转换为 API 请求格式，并调用 createAdminArticle。
	import ArticleEditor from '$lib/components/admin/ArticleEditor.svelte';
	import type { ArticleFormData } from '$lib/components/admin/ArticleEditor.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { goto } from '$app/navigation';
	import { createAdminArticle, type CreateArticleRequest } from '$lib/api/admin/articles';

	// 1. 状态管理
	let isSaving = $state(false);
	let errorMessage = $state('');

	// 2. 将表单日期字符串转换为 Unix 时间戳（秒）。
	//    如果日期为空，则不传 publish_at，让后端默认使用 created_at。
	function dateToTimestamp(dateStr: string): number | undefined {
		if (!dateStr) return undefined;
		const date = new Date(dateStr);
		if (isNaN(date.getTime())) return undefined;
		return Math.floor(date.getTime() / 1000);
	}

	// 3. 处理保存：将 ArticleFormData 转换为 API 请求体并调用创建接口。
	async function handleSave(data: ArticleFormData) {
		isSaving = true;
		errorMessage = '';

		// 构建请求体，仅包含有意义的字段。
		const requestBody: CreateArticleRequest = {
			title: data.title.trim(),
			content: data.content,
			required_tier: data.requiredTier,
			is_public: data.isPublic,
			cover_image: data.headerImage || null,
			file_links: data.fileLinks || [],
			publish_at: dateToTimestamp(data.publishDate) ?? undefined
		};

		try {
			const res = await createAdminArticle(requestBody);

			if (res.success) {
				// 创建成功，跳转到文章列表。
				goto('/dashboard/article');
			} else {
				// 显示后端返回的错误信息。
				errorMessage = res.error?.message || 'Failed to create article.';
			}
		} catch (error) {
			console.error('Create article error:', error);
			errorMessage = 'An unexpected error occurred. Please try again.';
		} finally {
			isSaving = false;
		}
	}
</script>

<svelte:head>
	<title>{m.create_article_title()}</title>
</svelte:head>

<ArticleEditor pageTitle={m.create_article_title()} {isSaving} {errorMessage} onsave={handleSave} />
