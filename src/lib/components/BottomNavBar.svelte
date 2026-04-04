<script lang="ts">
	/**
	 * Mobile bottom navigation bar with glassmorphism.
	 * Hidden on md+ screens.
	 */
	// // 移动端底部导航栏，带玻璃拟态。md 及以上屏幕隐藏。
	import { Home } from 'lucide-svelte';
</script>

<!-- 底部导航栏 — 仅移动端显示 (DESIGN.md §2 Glass Rule) -->
<nav class="md:hidden fixed bottom-0 left-0 w-full z-50 glass shadow-ambient rounded-t-3xl">
	<div class="flex justify-around items-center px-8 pb-6 pt-3">
		<!-- TODO: 接入实际路由导航项 -->
		<a
			href="/"
			class="flex flex-col items-center justify-center bg-primary text-primary-content rounded-full px-6 py-2
				transition-all active:scale-90 duration-300 ease-out"
		>
			<Home size={20} />
			<span class="text-[10px] font-semibold uppercase tracking-wider mt-1">Home</span>
		</a>
	</div>
</nav>
