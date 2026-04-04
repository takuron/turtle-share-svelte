<script lang="ts">
	import AuthorProfile from '$lib/components/main/AuthorProfile.svelte';
	import ArticleFeed from '$lib/components/main/ArticleFeed.svelte';
</script>

<!-- 作者资料头部 -->
<AuthorProfile />

<!-- 第 1 页文章信息流 -->
<ArticleFeed page={1} />
