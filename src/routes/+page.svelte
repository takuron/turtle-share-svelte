<script lang="ts">
	import AuthorProfile from '$lib/components/AuthorProfile.svelte';
	import PostCard from '$lib/components/PostCard.svelte';
</script>

<!-- 作者资料头部 -->
<AuthorProfile />

<!-- 垂直帖子信息流 — DESIGN.md §5: 卡片间距 2rem -->
<div class="space-y-12">
	<!-- TODO: 后续接入 API 数据，用 {#each} 渲染 -->
	<PostCard variant="readable" />
	<PostCard variant="locked" />
</div>
