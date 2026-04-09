<script lang="ts">
	/**
	 * Global error page — renders for unmatched routes (404) and other HTTP errors.
	 * Design follows stitch/code.html prototype ("The Fluid Editorial" 404 page).
	 * Supports: 400, 401, 403, 404, 408, 429, 500, 502, 503, and generic fallback.
	 */
	// // 全局错误页 — 处理未匹配路由 (404) 及其他 HTTP 错误。
	// // 支持：400、401、403、404、408、429、500、502、503 及通用回退。
	import { page } from '$app/state';
	import { Home, LogIn } from 'lucide-svelte';
	import TopNavBar from '$lib/components/main/TopNavBar.svelte';
	import SiteFooter from '$lib/components/main/SiteFooter.svelte';
	import * as m from '$lib/paraglide/messages.js';

	// 状态码 → i18n 消息映射表
	const statusMessages: Record<number, { title: () => string; desc: () => string }> = {
		400: { title: m.error_page_400, desc: m.error_page_400_desc },
		401: { title: m.error_page_401, desc: m.error_page_401_desc },
		403: { title: m.error_page_403, desc: m.error_page_403_desc },
		404: { title: m.error_page_404, desc: m.error_page_404_desc },
		408: { title: m.error_page_408, desc: m.error_page_408_desc },
		429: { title: m.error_page_429, desc: m.error_page_429_desc },
		500: { title: m.error_page_500, desc: m.error_page_500_desc },
		502: { title: m.error_page_502, desc: m.error_page_502_desc },
		503: { title: m.error_page_503, desc: m.error_page_503_desc }
	};

	// 根据当前状态码获取标题和描述，未匹配则使用通用文案
	const entry = $derived(statusMessages[page.status]);
	const title = $derived(entry ? entry.title() : m.error_page_generic());
	const description = $derived(entry ? entry.desc() : m.error_page_generic_desc());

	// 401/403 时额外显示登录按钮
	const showLoginAction = $derived(page.status === 401 || page.status === 403);
</script>

<!-- 顶部导航栏 -->
<TopNavBar />

<!-- 错误页主体 — 全屏垂直居中布局 -->
<main class="mx-auto flex w-full max-w-2xl flex-grow flex-col items-center justify-center px-4 pt-24">
	<div class="text-center">
		<!-- 大号状态码背景文字 -->
		<h1
			class="font-display select-none text-[12rem] font-extrabold leading-none tracking-tighter text-primary/10"
		>
			{page.status}
		</h1>

		<div class="mt-[-2rem] space-y-8">
			<div class="space-y-2">
				<!-- 错误标题 -->
				<h2 class="font-display text-4xl font-extrabold text-base-content">
					{title}
				</h2>
				<!-- 错误描述 -->
				<p class="mx-auto max-w-md text-lg text-base-content/60">
					{description}
				</p>
			</div>

			<!-- 操作按钮区域 -->
			<div class="flex flex-wrap items-center justify-center gap-4 pt-4">
				<a href="/" class="btn btn-primary btn-lg rounded-full px-10 shadow-lg">
					<Home size={18} />
					{m.error_return_home()}
				</a>
				{#if showLoginAction}
					<a href="/user" class="btn btn-outline btn-lg rounded-full px-10">
						<LogIn size={18} />
						{m.error_login()}
					</a>
				{/if}
			</div>
		</div>
	</div>
</main>

<!-- 页脚 -->
<SiteFooter />
