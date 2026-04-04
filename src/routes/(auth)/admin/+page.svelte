<script lang="ts">
	import LoginForm from '$lib/components/login/LoginForm.svelte';
	import * as m from '$lib/paraglide/messages.js';
</script>

<!-- 管理员登录页面 — 全屏居中布局 + 点阵背景 -->
<svelte:head>
	<title>{m.admin_login_page_title()}</title>
</svelte:head>

<div
	class="flex h-full w-full items-center justify-center p-4"
	style="background-image: radial-gradient(oklch(from var(--outline-variant) l c h / 30%) 0.75px, transparent 0.75px); background-size: 24px 24px;"
>
	<div class="w-full max-w-md">
		<LoginForm mode="admin" />
	</div>
</div>
