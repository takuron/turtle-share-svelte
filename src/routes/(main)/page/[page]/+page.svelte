<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import AuthorProfile from '$lib/components/main/AuthorProfile.svelte';
	import ArticleFeed from '$lib/components/main/ArticleFeed.svelte';

	// 1. 从 URL 参数获取页码并转为数字。
	const pageNum = $derived(Number(page.params.page) || 1);

	// 2. 如果页码为 1，重定向到首页。
	onMount(() => {
		if (pageNum <= 1) {
			goto('/', { replaceState: true });
		}
	});

	$effect(() => {
		if (pageNum <= 1) {
			goto('/', { replaceState: true });
		}
	});
</script>

<main class="mx-auto max-w-2xl px-4 pt-24 pb-12">
	<!-- 作者资料头部 -->
	<AuthorProfile />

	<!-- 指定页码的文章信息流 -->
	{#if pageNum > 1}
		<ArticleFeed page={pageNum} />
	{/if}
</main>
