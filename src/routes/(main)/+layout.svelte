<script lang="ts">
	import TopNavBar from '$lib/components/main/TopNavBar.svelte';
	import SiteFooter from '$lib/components/main/SiteFooter.svelte';

	let { children } = $props();
</script>

<!-- 顶部导航栏 -->
<TopNavBar />

<!-- 主内容区域 — 为顶部导航留出空间 -->
{@render children()}

<!-- 页脚 -->
<SiteFooter />
