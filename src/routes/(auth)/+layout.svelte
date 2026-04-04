<script lang="ts">
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/auth.svelte';
	import { onMount } from 'svelte';

	let { children } = $props();

	// 1. 如果已登录任何身份，立即跳转回首页（两种身份互斥）。
	onMount(() => {
		if (authStore.session) {
			goto('/', { replaceState: true });
		}
	});

	// 2. 响应式监听：登录成功后（session 变化）也触发跳转。
	$effect(() => {
		if (authStore.session) {
			goto('/', { replaceState: true });
		}
	});
</script>

<!-- 认证页面布局 — 无导航栏/页脚，禁止滚动 -->
{#if !authStore.session}
	<div class="h-screen w-screen overflow-hidden">
		{@render children()}
	</div>
{/if}
