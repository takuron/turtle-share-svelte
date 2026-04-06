<script lang="ts">
	import ArticleDetail from '$lib/components/main/ArticleDetail.svelte';

	// 1. 获取页面数据
	let { data } = $props();

	// 2. 从数据中提取文章详情
	const article = $derived(data.article);
</script>

<main class="mx-auto max-w-5xl px-6 pt-28 pb-20">
	<ArticleDetail {article} />
</main>
