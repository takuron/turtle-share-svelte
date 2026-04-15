<script lang="ts">
	/**
	 * Top navigation bar with glassmorphism effect.
	 * Reads site name from siteStore.
	 */
	// // 顶部导航栏，带玻璃拟态效果。站点名称从 siteStore 读取，用户下拉栏根据 JWT 认证状态渲染。
	import {
		LogIn,
		ChevronDown,
		ListVideo,
		Lock,
		LayoutDashboard,
		LogOut,
		Menu
	} from 'lucide-svelte';
	import { siteStore } from '$lib/stores/site.svelte';
	import { tiersStore } from '$lib/stores/tiers.svelte';
	import { authStore, logout } from '$lib/stores/auth.svelte';
	import { page } from '$app/stores';
	import * as m from '$lib/paraglide/messages.js';
	import UserSubscriptionModal from '../user/UserSubscriptionModal.svelte';
	import ChangePasswordModal from '../user/ChangePasswordModal.svelte';
	// 订阅弹窗状态
	let subscriptionModalOpen = $state(false);
	// 修改密码弹窗状态
	let changePasswordModalOpen = $state(false);

	// 1. 处理退出登录并刷新页面，清除状态
	function handleLogout() {
		logout();
		window.location.reload();
	}
</script>

<!-- 顶部导航栏 — 固定定位 + 玻璃拟态 (DESIGN.md §2 Glass Rule) -->
<nav class="fixed top-0 z-50 w-full glass shadow-ambient">
	<div class="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
		<div class="flex items-center gap-3 md:gap-8">
			{#if !tiersStore.loading && tiersStore.tiers.length > 0}
				<!-- 移动端下拉菜单 -->
				<div class="dropdown md:hidden">
					<div
						tabindex="0"
						role="button"
						class="btn -ml-2 btn-circle text-base-content btn-ghost btn-sm"
					>
						<Menu size={20} />
					</div>
					<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
					<ul
						tabindex="0"
						class="dropdown-content menu z-[1] mt-3 w-52 menu-sm rounded-box border border-base-200/50 bg-base-100 p-2 shadow-xl"
					>
						<li>
							<a
								href="/subscribe"
								class={$page.url.pathname.endsWith('/subscribe')
									? 'font-bold text-primary'
									: 'text-base-content'}
							>
								{m.subscribe()}
							</a>
						</li>
					</ul>
				</div>
			{/if}

			<a
				href="/"
				class="font-display text-2xl font-bold tracking-tighter text-primary transition-opacity hover:opacity-80"
			>
				{siteStore.info.name}
			</a>

			{#if !tiersStore.loading && tiersStore.tiers.length > 0}
				<div class="hidden items-center gap-6 md:flex">
					<a
						href="/subscribe"
						class="text-sm font-semibold transition-opacity hover:opacity-80 {$page.url.pathname.endsWith(
							'/subscribe'
						)
							? 'text-primary'
							: 'text-on-surface'}"
					>
						{m.subscribe()}
					</a>
				</div>
			{/if}
		</div>

		<div class="flex items-center gap-4">
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
								<button
									class="text-sm text-base-content hover:bg-base-200"
									onclick={() => (subscriptionModalOpen = true)}
								>
									<ListVideo size={18} class="mr-2" />
									{m.my_subscriptions()}
								</button>
							</li>
							<li>
								<button
									class="text-sm text-base-content hover:bg-base-200"
									onclick={() => (changePasswordModalOpen = true)}
								>
									<Lock size={18} class="mr-2" />
									{m.change_password()}
								</button>
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
	</div>
</nav>

<!-- 用户订阅信息弹窗 -->
<UserSubscriptionModal
	open={subscriptionModalOpen}
	onclose={() => (subscriptionModalOpen = false)}
/>

<!-- 修改密码弹窗 -->
<ChangePasswordModal
	open={changePasswordModalOpen}
	onclose={() => (changePasswordModalOpen = false)}
/>
