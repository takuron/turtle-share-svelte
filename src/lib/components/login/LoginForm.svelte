<script lang="ts">
	import { goto } from '$app/navigation';
	import { login } from '$lib/stores/auth.svelte';
	import { CircleAlert } from 'lucide-svelte';

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
	let title = $derived(mode === 'admin' ? '管理员登录' : '欢迎回来');
	let subtitle = $derived(
		mode === 'admin' ? '请使用管理员账户登录' : '请登录您的账户以继续'
	);
	let switchText = $derived(
		mode === 'admin' ? '切换为用户登录' : '切换为管理员登录'
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
			errorMsg = '请输入用户名和密码';
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
	class="bg-surface-lowest/95 backdrop-blur-md p-8 rounded-2xl border border-white"
	style="box-shadow: var(--shadow-ambient);"
>
	<!-- 标题区域 -->
	<div class="text-center mb-10">
		<h2 class="text-2xl font-extrabold text-on-surface mb-2 font-display">
			{title}
		</h2>
		<p class="text-on-surface-variant text-sm font-medium">
			{subtitle}
		</p>
	</div>

	<!-- 错误提示 -->
	{#if errorMsg}
		<div class="flex items-center gap-2 rounded-xl bg-error/10 text-error px-4 py-3 mb-6 text-sm font-medium">
			<CircleAlert size={16} />
			{errorMsg}
		</div>
	{/if}

	<!-- 登录表单 -->
	<form class="space-y-6" onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
		<!-- 用户名输入 -->
		<div>
			<label
				class="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2"
				for="username"
			>
				用户名
			</label>
			<input
				class="w-full bg-surface-low border border-outline-variant/20 rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
				id="username"
				type="text"
				placeholder="请输入用户名"
				disabled={loading}
				bind:value={username}
			/>
		</div>

		<!-- 密码输入 -->
		<div>
			<label
				class="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2"
				for="password"
			>
				密码
			</label>
			<input
				class="w-full bg-surface-low border border-outline-variant/20 rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
				id="password"
				type="password"
				placeholder="请输入密码"
				disabled={loading}
				bind:value={password}
			/>
		</div>

		<!-- 登录按钮 -->
		<div class="pt-2">
			<button
				class="btn btn-primary w-full py-4 rounded-xl font-bold text-base shadow-lg active:scale-[0.98] transition-all"
				disabled={loading}
			>
				{#if loading}
					<span class="loading loading-spinner loading-sm"></span>
					登录中…
				{:else}
					登录
				{/if}
			</button>
		</div>
	</form>

	<!-- 切换登录模式链接 -->
	<div class="mt-10 pt-6 border-t border-outline-variant/10 text-center">
		<p class="text-sm text-on-surface-variant">
			<a class="text-primary font-bold hover:underline" href={switchHref}>
				{switchText}
			</a>
		</p>
	</div>
</div>
