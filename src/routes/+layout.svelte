<script lang="ts">
	import { page } from '$app/state';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { fetchSiteInfo } from '$lib/stores/site.svelte';
	import { onMount } from 'svelte';
	import TopNavBar from '$lib/components/main/TopNavBar.svelte';
	import SiteFooter from '$lib/components/main/SiteFooter.svelte';

	let { children } = $props();

	// 1. 每次项目被访问（组件挂载时）在客户端获取最新的站点信息。
	onMount(() => {
		fetchSiteInfo();
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<!-- 顶部导航栏 -->
<TopNavBar />

<!-- 主内容区域 — 为顶部导航留出空间 -->
<main class="pt-24 pb-12 px-4 max-w-2xl mx-auto">
	{@render children()}
</main>

<!-- 页脚 -->
<SiteFooter />

<!-- i18n 隐藏链接 -->
<div style="display:none">
	{#each locales as locale}
		<a href={localizeHref(page.url.pathname, { locale })}>{locale}</a>
	{/each}
</div>
