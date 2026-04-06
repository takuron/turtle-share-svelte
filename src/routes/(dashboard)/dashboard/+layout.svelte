<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { authStore, logout } from '$lib/stores/auth.svelte';
	import { siteStore } from '$lib/stores/site.svelte';
	import { Users, FileText, FolderOpen, Home, LogOut, Menu, X } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';

	let { children } = $props();

	// 1. 响应式守卫：等待 auth 初始化完成后，非管理员身份则跳转到登录页。
	$effect(() => {
		if (!authStore.initialized) return;
		if (!authStore.session || authStore.session.role !== 'admin') {
			goto('/admin', { replaceState: true });
		}
	});

	// 2. 侧栏导航项定义，label 使用 i18n 函数引用。
	const navItems = [
		{ href: '/dashboard/user', label: () => m.nav_user_management(), icon: Users },
		{ href: '/dashboard/article', label: () => m.nav_content_management(), icon: FileText },
		{ href: '/dashboard/file', label: () => m.nav_file_management(), icon: FolderOpen }
	];

	// 3. 判断当前路径是否匹配导航项。
	function isActive(href: string): boolean {
		return page.url.pathname.startsWith(href);
	}

	// 4. 处理登出。
	function handleLogout() {
		logout();
	}

	// 5. 移动端侧栏展开/收起状态。
	let sidebarOpen = $state(false);

	// 6. 路由变化时自动关闭侧栏。
	$effect(() => {
		page.url.pathname;
		sidebarOpen = false;
	});
</script>

<!-- 管理员仪表盘布局 — 等待认证初始化后再渲染 -->
{#if authStore.initialized && authStore.session?.role === 'admin'}
	<div class="flex min-h-screen bg-surface-low">
		<!-- 移动端遮罩层 -->
		{#if sidebarOpen}
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="fixed inset-0 z-40 bg-black/30 lg:hidden"
				onclick={() => (sidebarOpen = false)}
				onkeydown={() => {}}
			></div>
		{/if}

		<!-- 侧栏 -->
		<aside
			class="h-screen w-72 fixed left-0 top-0 overflow-y-auto flex flex-col p-6 space-y-2 z-50
				bg-surface-lowest border-r border-outline-variant/30
				transition-transform duration-300 ease-in-out
				{sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0"
		>
			<!-- 站点标题 -->
			<div class="mb-6 px-4">
				<h1 class="text-xl font-bold tracking-tighter text-primary font-display">{siteStore.info.name}</h1>
				<p class="text-xs font-medium text-on-surface-variant mt-1 uppercase tracking-widest">{m.admin_dashboard()}</p>
			</div>

			<!-- 主导航 -->
			<nav class="flex-1 space-y-1">
				{#each navItems as item}
					<a
						href={item.href}
						class="px-4 py-3 flex items-center gap-3 transition-all duration-300 active:scale-[0.98] text-sm tracking-tight
							{isActive(item.href)
								? 'text-primary font-bold bg-primary/5 border-r-2 border-primary rounded-l-full rounded-r-none'
								: 'text-on-surface-variant hover:text-on-surface hover:bg-surface-low rounded-full font-medium'}"
					>
						<item.icon size={20} />
						<span>{item.label()}</span>
					</a>
				{/each}
			</nav>

			<!-- 底部操作 -->
			<div class="pt-6 border-t border-outline-variant/30 space-y-1">
				<a
					href="/"
					class="text-on-surface-variant hover:text-on-surface hover:bg-surface-low rounded-full px-4 py-3 flex items-center gap-3 transition-all duration-300 active:scale-[0.98]"
				>
					<Home size={20} />
					<span class="font-medium text-sm tracking-tight">{m.nav_return_home()}</span>
				</a>
				<button
					onclick={handleLogout}
					class="w-full text-on-surface-variant hover:text-on-surface hover:bg-surface-low rounded-full px-4 py-3 flex items-center gap-3 transition-all duration-300 active:scale-[0.98] cursor-pointer"
				>
					<LogOut size={20} />
					<span class="font-medium text-sm tracking-tight">{m.logout()}</span>
				</button>
			</div>
		</aside>

		<!-- 移动端悬浮菜单按钮 -->
		<button
			onclick={() => (sidebarOpen = !sidebarOpen)}
			class="fixed top-4 left-4 z-50 lg:hidden w-10 h-10 flex items-center justify-center
				rounded-full bg-surface-lowest text-on-surface shadow-editorial-sm
				hover:bg-surface-low transition-all duration-200 cursor-pointer"
			aria-label="Toggle sidebar"
		>
			{#if sidebarOpen}
				<X size={20} />
			{:else}
				<Menu size={20} />
			{/if}
		</button>

		<!-- 主内容区域 -->
		<main class="lg:ml-72 flex-1 min-h-screen">
			<div class="p-6 pt-16 lg:p-10 max-w-7xl mx-auto w-full">
				{@render children()}
			</div>
		</main>
	</div>
{/if}
