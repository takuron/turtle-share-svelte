<script lang="ts">
	import ArticleDetail from '$lib/components/main/ArticleDetail.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { siteStore } from '$lib/stores/site.svelte';

	// 1. 获取页面数据
	let { data } = $props();

	// 2. 从数据中提取文章详情
	const article = $derived(data.article);
</script>

<!-- 文章标题：文章名 — 站点名 -->
<svelte:head>
	<title>{article?.title ? m.page_title_with_site({ title: article.title, siteName: siteStore.info.name }) : siteStore.info.name}</title>
</svelte:head>

<main class="mx-auto max-w-5xl px-6 pt-28 pb-20">
	<ArticleDetail {article} />
</main>
