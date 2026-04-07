<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/auth.svelte';
	import AdminSidebar from '$lib/components/admin/AdminSidebar.svelte';

	let { children } = $props();

	// 1. 响应式守卫：等待 auth 初始化完成后，非管理员身份则跳转到登录页。
	$effect(() => {
		if (!authStore.initialized) return;
		if (!authStore.session || authStore.session.role !== 'admin') {
			goto('/admin', { replaceState: true });
		}
	});

	// 2. 移动端侧栏展开/收起状态。
	let sidebarOpen = $state(false);

	// 3. 路由变化时自动关闭侧栏。
	$effect(() => {
		page.url.pathname;
		sidebarOpen = false;
	});

	// 4. 切换侧栏状态。
	function toggleSidebar() {
		sidebarOpen = !sidebarOpen;
	}
</script>

<!-- 管理员仪表盘布局 — 等待认证初始化后再渲染 -->
{#if authStore.initialized && authStore.session?.role === 'admin'}
	<div class="flex min-h-screen bg-surface">
		<AdminSidebar open={sidebarOpen} onclose={toggleSidebar} />

		<!-- 主内容区域 -->
		<main class="min-h-screen flex-1 lg:ml-72">
			<div class="mx-auto w-full max-w-7xl p-6 pt-16 lg:p-10">
				{@render children()}
			</div>
		</main>
	</div>
{/if}
