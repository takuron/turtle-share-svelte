<script lang="ts">
	/**
	 * Top navigation bar with glassmorphism effect.
	 * @prop {string} siteName - Site name displayed as logo text.
	 */
	// // 顶部导航栏，带玻璃拟态效果。
	// // @prop {string} siteName - 显示为 logo 的站点名称。
	import { LogIn } from 'lucide-svelte';

	let { siteName = 'TurtleShare' }: { siteName?: string } = $props();
</script>

<!-- 顶部导航栏 — 固定定位 + 玻璃拟态 (DESIGN.md §2 Glass Rule) -->
<nav class="fixed top-0 w-full z-50 glass shadow-ambient">
	<div class="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
		<span class="font-display text-2xl font-bold tracking-tighter text-primary">
			{siteName}
		</span>
		<button class="btn btn-primary btn-sm gap-2">
			<LogIn size={16} />
			登录
		</button>
	</div>
</nav>
