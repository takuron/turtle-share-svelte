<script lang="ts">
	let { children } = $props();
</script>

<!-- 认证页面布局 — 无导航栏/页脚，禁止滚动 -->
<div class="h-screen w-screen overflow-hidden">
	{@render children()}
</div>
