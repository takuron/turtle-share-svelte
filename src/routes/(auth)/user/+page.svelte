<script lang="ts">
	import LoginForm from '$lib/components/login/LoginForm.svelte';
</script>

<!-- 用户登录页面 — 全屏居中布局 + 点阵背景 -->
<svelte:head>
	<title>用户登录 — TurtleShare</title>
</svelte:head>

<div class="h-full w-full flex items-center justify-center p-4"
	style="background-image: radial-gradient(oklch(from var(--outline-variant) l c h / 30%) 0.75px, transparent 0.75px); background-size: 24px 24px;"
>
	<div class="w-full max-w-md">
		<LoginForm mode="user" />
	</div>
</div>
