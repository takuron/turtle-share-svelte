<script lang="ts">
	/**
	 * Top navigation bar with glassmorphism effect.
	 * Reads site name from siteStore.
	 */
	// // 顶部导航栏，带玻璃拟态效果。站点名称从 siteStore 读取，用户下拉栏根据 JWT 认证状态渲染。
	import { LogIn, ChevronDown, ListVideo, Lock, LayoutDashboard, LogOut } from 'lucide-svelte';
	import { siteStore } from '$lib/stores/site.svelte';
	import { authStore, logout } from '$lib/stores/auth.svelte';
	import * as m from '$lib/paraglide/messages.js';

	// 1. 处理退出登录并刷新页面，清除状态
	function handleLogout() {
		logout();
		window.location.reload();
	}
</script>

<!-- 顶部导航栏 — 固定定位 + 玻璃拟态 (DESIGN.md §2 Glass Rule) -->
<nav class="fixed top-0 z-50 w-full glass shadow-ambient">
	<div class="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
		<a
			href="/"
			class="font-display text-2xl font-bold tracking-tighter text-primary transition-opacity hover:opacity-80"
		>
			{siteStore.info.name}
		</a>

		{#if authStore.session}
			<!-- 用户下拉菜单 (DaisyUI Dropdown) -->
			<div class="dropdown dropdown-end">
				<button
					tabindex="0"
					class="m-0 flex cursor-pointer items-center gap-3 border-none bg-transparent p-0 transition-opacity hover:opacity-80"
				>
					<span class="text-sm font-bold text-base-content">{authStore.session.name}</span>
					<div class="avatar">
						<div class="w-8 rounded-full shadow-sm ring-1 ring-primary/20">
							<img
								src="https://ui-avatars.com/api/?name={encodeURIComponent(
									authStore.session.name
								)}&background=random"
								alt="Avatar"
							/>
						</div>
					</div>
					<ChevronDown size={14} class="text-base-content" />
				</button>

				<!-- Dropdown Content -->
				<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
				<ul
					tabindex="0"
					class="dropdown-content menu z-[1] mt-2 w-48 rounded-box border border-base-200/50 bg-base-100 p-2 shadow-xl"
				>
					{#if authStore.session.role === 'user'}
						<li>
							<a href="/user/subscriptions" class="text-sm text-base-content hover:bg-base-200">
								<ListVideo size={18} class="mr-2" />
								{m.my_subscriptions()}
							</a>
						</li>
						<li>
							<a href="/user/password" class="text-sm text-base-content hover:bg-base-200">
								<Lock size={18} class="mr-2" />
								{m.change_password()}
							</a>
						</li>
					{:else if authStore.session.role === 'admin'}
						<li>
							<a href="/dashboard/user" class="text-sm text-base-content hover:bg-base-200">
								<LayoutDashboard size={18} class="mr-2" />
								{m.dashboard()}
							</a>
						</li>
					{/if}

					<div class="divider my-1"></div>

					<li>
						<button
							class="text-sm text-error hover:bg-error/10 hover:text-error"
							onclick={handleLogout}
						>
							<LogOut size={18} class="mr-2" />
							{m.logout()}
						</button>
					</li>
				</ul>
			</div>
		{:else}
			<!-- 未登录状态 -->
			<a href="/user" class="btn gap-2 btn-sm btn-primary">
				<LogIn size={16} />
				{m.login()}
			</a>
		{/if}
	</div>
</nav>
