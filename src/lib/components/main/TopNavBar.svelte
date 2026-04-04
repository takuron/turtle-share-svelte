<script lang="ts">
	/**
	 * Top navigation bar with glassmorphism effect.
	 * Reads site name from siteStore.
	 */
	// // 顶部导航栏，带玻璃拟态效果。站点名称从 siteStore 读取。
	import { LogIn } from 'lucide-svelte';
	import { siteStore } from '$lib/stores/site.svelte';
</script>

<!-- 顶部导航栏 — 固定定位 + 玻璃拟态 (DESIGN.md §2 Glass Rule) -->
<nav class="fixed top-0 w-full z-50 glass shadow-ambient">
	<div class="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
		<span class="font-display text-2xl font-bold tracking-tighter text-primary">
			{siteStore.info.name}
		</span>
		<button class="btn btn-primary btn-sm gap-2">
			<LogIn size={16} />
			登录
		</button>
	</div>
</nav>
