<script lang="ts">
	import { page } from '$app/state';
	import { locales, localizeHref, getLocale, setLocale } from '$lib/paraglide/runtime';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { fetchSiteInfo } from '$lib/stores/site.svelte';
	import { initAuth } from '$lib/stores/auth.svelte';
	import { onMount } from 'svelte';
	import NetworkToast from '$lib/components/NetworkToast.svelte';
	import { applyThemeColors } from '$lib/utils/applyThemeColors';
	import { DEFAULT_THEME_COLORS } from '$lib/config';
	import { resolveLocaleFromTags } from '$lib/i18n/resolveBrowserLocale';

	let { children } = $props();

	onMount(() => {
		// 1. 根据浏览器语言偏好自动切换 locale（中文变体回退至 zh-cn，其余回退至 en）。
		const browserLocale = resolveLocaleFromTags([...navigator.languages]);
		if (browserLocale && browserLocale !== getLocale()) {
			setLocale(browserLocale);
			return; // 页面即将刷新，跳过后续初始化。
		}

		// 2. 应用启动时恢复认证状态、获取站点信息、注入主题色。
		initAuth();
		fetchSiteInfo();
		applyThemeColors(DEFAULT_THEME_COLORS);
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
