<script lang="ts">
	import AuthorProfile from '$lib/components/main/AuthorProfile.svelte';
	import ArticleFeed from '$lib/components/main/ArticleFeed.svelte';
	import { siteStore } from '$lib/stores/site.svelte';
	import { onMount } from 'svelte';
	import { fetchAnnouncementRequest } from '$lib/api/public/site';
	import { parseMarkdown } from '$lib/utils/markdown';

	// 1. 公告状态
	let announcementContent = $state<string | null>(null);

	// 2. 挂载时获取公告
	onMount(async () => {
		try {
			const res = await fetchAnnouncementRequest();
			if (res.success && res.data && res.data.content) {
				announcementContent = res.data.content;
			}
		} catch (error) {
			console.error('Failed to load announcement:', error);
		}
	});
</script>

<!-- 首页标题：仅显示站点名称 -->
<svelte:head>
	<title>{siteStore.info.name}</title>
</svelte:head>

<main class="mx-auto max-w-2xl px-4 pt-24 pb-12">
	<!-- 作者资料头部 -->
	<AuthorProfile />

	<!-- 公告卡片 -->
	{#if announcementContent && announcementContent.trim()}
		<div class="mb-12 rounded-xl border border-outline-variant/5 bg-surface-lowest p-6 shadow-md">
			<div
				class="prose prose-sm max-w-none text-left text-sm leading-relaxed text-on-surface-variant dark:prose-invert prose-p:my-1 prose-a:text-primary"
			>
				{@html parseMarkdown(announcementContent)}
			</div>
		</div>
	{/if}

	<!-- 第 1 页文章信息流 -->
	<ArticleFeed page={1} />
</main>
