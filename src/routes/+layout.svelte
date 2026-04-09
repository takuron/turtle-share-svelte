<script lang="ts">
	import { page } from '$app/state';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { fetchSiteInfo } from '$lib/stores/site.svelte';
	import { initAuth } from '$lib/stores/auth.svelte';
	import { onMount } from 'svelte';
	import NetworkToast from '$lib/components/NetworkToast.svelte';

	let { children } = $props();

	// 1. 应用启动时恢复认证状态并获取站点信息。
	onMount(() => {
		initAuth();
		fetchSiteInfo();
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

{@render children()}

<!-- 全局网络错误 Toast -->
<NetworkToast />

<!-- i18n 隐藏链接 -->
<div style="display:none">
	{#each locales as locale}
		<a href={localizeHref(page.url.pathname, { locale })}>{locale}</a>
	{/each}
</div>
