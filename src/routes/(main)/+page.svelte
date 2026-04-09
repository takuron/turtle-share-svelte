<script lang="ts">
	import AuthorProfile from '$lib/components/main/AuthorProfile.svelte';
	import ArticleFeed from '$lib/components/main/ArticleFeed.svelte';
	import { siteStore } from '$lib/stores/site.svelte';
</script>

<!-- 首页标题：仅显示站点名称 -->
<svelte:head>
	<title>{siteStore.info.name}</title>
</svelte:head>

<main class="mx-auto max-w-2xl px-4 pt-24 pb-12">
	<!-- 作者资料头部 -->
	<AuthorProfile />

	<!-- 第 1 页文章信息流 -->
	<ArticleFeed page={1} />
</main>
