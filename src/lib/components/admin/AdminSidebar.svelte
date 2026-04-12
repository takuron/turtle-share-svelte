<script lang="ts">
	/**
	 * Admin dashboard sidebar with navigation, home link, and logout button.
	 * Responsive: hidden off-screen on mobile, toggled via `open` prop.
	 *
	 * @prop {boolean} open - Whether the sidebar is visible on mobile.
	 * @prop {() => void} onclose - Callback when sidebar requests closing (overlay click).
	 */
	// // 管理员仪表盘侧栏组件。
	// // 包含导航链接、返回首页、登出按钮。移动端通过 open 控制显隐。
	// //
	// // @prop {boolean} open - 移动端侧栏是否展开。
	// // @prop {() => void} onclose - 侧栏请求关闭时的回调（点击遮罩层）。
	import { page } from '$app/state';
	import { siteStore } from '$lib/stores/site.svelte';
	import { logout } from '$lib/stores/auth.svelte';
	import { Users, FileText, FolderOpen, Home, LogOut, Menu, X, Megaphone } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';

	let { open = false, onclose }: { open: boolean; onclose: () => void } = $props();

	// 1. 侧栏导航项定义。
	const navItems = [
		{ href: '/dashboard/user', label: () => m.nav_user_management(), icon: Users },
		{ href: '/dashboard/article', label: () => m.nav_content_management(), icon: FileText },
		{ href: '/dashboard/file', label: () => m.nav_file_management(), icon: FolderOpen },
		{ href: '/dashboard/page', label: () => m.nav_page_management(), icon: Megaphone }
	];

	// 2. 判断当前路径是否匹配导航项。
	function isActive(href: string): boolean {
		return page.url.pathname.startsWith(href);
	}

	// 3. 处理登出。
	function handleLogout() {
		logout();
	}
</script>

<!-- 移动端遮罩层 -->
{#if open}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-40 bg-black/30 lg:hidden"
		onclick={onclose}
		onkeydown={() => {}}
	></div>
{/if}

<!-- 侧栏 -->
<aside
	class="fixed top-0 left-0 z-50 flex h-screen w-72 flex-col space-y-2 overflow-y-auto border-r
		border-outline-variant/30 bg-surface-lowest p-6
		transition-transform duration-300 ease-in-out
		{open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0"
>
	<!-- 站点标题 -->
	<div class="mb-6 px-4">
		<h1 class="font-display text-xl font-bold tracking-tighter text-primary">
			{siteStore.info.name}
		</h1>
		<p class="mt-1 text-xs font-medium tracking-widest text-on-surface-variant uppercase">
			{m.admin_dashboard()}
		</p>
	</div>

	<!-- 主导航 -->
	<nav class="flex-1 space-y-1">
		{#each navItems as item}
			<a
				href={item.href}
				class="flex items-center gap-3 px-4 py-3 text-sm tracking-tight transition-all duration-300 active:scale-[0.98]
					{isActive(item.href)
					? 'rounded-l-full rounded-r-none border-r-2 border-primary bg-primary/5 font-bold text-primary'
					: 'rounded-full font-medium text-on-surface-variant hover:bg-surface-low hover:text-on-surface'}"
			>
				<item.icon size={20} />
				<span>{item.label()}</span>
			</a>
		{/each}
	</nav>

	<!-- 底部操作 -->
	<div class="space-y-1 border-t border-outline-variant/30 pt-6">
		<a
			href="/"
			class="flex items-center gap-3 rounded-full px-4 py-3 text-on-surface-variant transition-all duration-300 hover:bg-surface-low hover:text-on-surface active:scale-[0.98]"
		>
			<Home size={20} />
			<span class="text-sm font-medium tracking-tight">{m.nav_return_home()}</span>
		</a>
		<button
			onclick={handleLogout}
			class="flex w-full cursor-pointer items-center gap-3 rounded-full px-4 py-3 text-on-surface-variant transition-all duration-300 hover:bg-surface-low hover:text-on-surface active:scale-[0.98]"
		>
			<LogOut size={20} />
			<span class="text-sm font-medium tracking-tight">{m.logout()}</span>
		</button>
	</div>
</aside>

<!-- 移动端悬浮菜单按钮 -->
<button
	onclick={onclose}
	class="fixed top-4 left-4 z-50 flex h-10 w-10 cursor-pointer items-center justify-center
		rounded-full bg-surface-lowest text-on-surface shadow-editorial-sm
		transition-all duration-200 hover:bg-surface-low lg:hidden"
	aria-label="Toggle sidebar"
>
	{#if open}
		<X size={20} />
	{:else}
		<Menu size={20} />
	{/if}
</button>
