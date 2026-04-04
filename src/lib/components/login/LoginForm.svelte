<script lang="ts">
	import { goto } from '$app/navigation';
	import { login } from '$lib/stores/auth.svelte';
	import { CircleAlert } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';

	/**
	 * A login form component following the Editorial design system.
	 * Supports user and admin login modes with different titles and toggle links.
	 *
	 * @prop {'user' | 'admin'} mode - Determines the login form variant.
	 */
	// // 遵循 Editorial 设计系统的登录表单组件。
	// // 支持用户和管理员两种登录模式，标题和切换链接不同。
	// //
	// // @prop {'user' | 'admin'} mode - 决定登录表单的变体。
	let { mode = 'user' }: { mode: 'user' | 'admin' } = $props();

	// 1. 根据模式派生界面文案
	let title = $derived(mode === 'admin' ? m.admin_login_heading() : m.welcome_back());
	let subtitle = $derived(mode === 'admin' ? m.admin_login_subtitle() : m.user_login_subtitle());
	let switchText = $derived(
		mode === 'admin' ? m.switch_to_user_login() : m.switch_to_admin_login()
	);
	let switchHref = $derived(mode === 'admin' ? '/user' : '/admin');

	// 2. 表单状态
	let username = $state('');
	let password = $state('');
	let errorMsg = $state('');
	let loading = $state(false);

	// 3. 提交登录请求
	async function handleSubmit() {
		errorMsg = '';

		// 前端基本校验
		if (!username.trim() || !password) {
			errorMsg = m.enter_username_password();
			return;
		}

		loading = true;
		const err = await login(mode, username.trim(), password);
		loading = false;

		if (err) {
			errorMsg = err;
			return;
		}

		// 登录成功，跳转到首页
		await goto('/', { replaceState: true });
	}
</script>

<!-- 登录卡片容器 — 玻璃拟态 + 环境阴影 -->
<div
	class="rounded-2xl border border-white bg-surface-lowest/95 p-8 backdrop-blur-md"
	style="box-shadow: var(--shadow-ambient);"
>
	<!-- 标题区域 -->
	<div class="mb-10 text-center">
		<h2 class="mb-2 font-display text-2xl font-extrabold text-on-surface">
			{title}
		</h2>
		<p class="text-sm font-medium text-on-surface-variant">
			{subtitle}
		</p>
	</div>

	<!-- 错误提示 -->
	{#if errorMsg}
		<div
			class="mb-6 flex items-center gap-2 rounded-xl bg-error/10 px-4 py-3 text-sm font-medium text-error"
		>
			<CircleAlert size={16} />
			{errorMsg}
		</div>
	{/if}

	<!-- 登录表单 -->
	<form
		class="space-y-6"
		onsubmit={(e) => {
			e.preventDefault();
			handleSubmit();
		}}
	>
		<!-- 用户名输入 -->
		<div>
			<label
				class="mb-2 block text-xs font-bold tracking-wider text-on-surface-variant uppercase"
				for="username"
			>
				{m.username()}
			</label>
			<input
				class="w-full rounded-xl border border-outline-variant/20 bg-surface-low px-4 py-3 text-on-surface transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-primary"
				id="username"
				type="text"
				placeholder={m.enter_username()}
				disabled={loading}
				bind:value={username}
			/>
		</div>

		<!-- 密码输入 -->
		<div>
			<label
				class="mb-2 block text-xs font-bold tracking-wider text-on-surface-variant uppercase"
				for="password"
			>
				{m.password()}
			</label>
			<input
				class="w-full rounded-xl border border-outline-variant/20 bg-surface-low px-4 py-3 text-on-surface transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-primary"
				id="password"
				type="password"
				placeholder={m.enter_password()}
				disabled={loading}
				bind:value={password}
			/>
		</div>

		<!-- 登录按钮 -->
		<div class="pt-2">
			<button
				class="btn w-full rounded-xl py-4 text-base font-bold shadow-lg transition-all btn-primary active:scale-[0.98]"
				disabled={loading}
			>
				{#if loading}
					<span class="loading loading-sm loading-spinner"></span>
					{m.logging_in()}
				{:else}
					{m.login()}
				{/if}
			</button>
		</div>
	</form>

	<!-- 切换登录模式链接 -->
	<div class="mt-10 border-t border-outline-variant/10 pt-6 text-center">
		<p class="text-sm text-on-surface-variant">
			<a class="font-bold text-primary hover:underline" href={switchHref}>
				{switchText}
			</a>
		</p>
	</div>
</div>
