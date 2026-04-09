<script lang="ts">
	import ArticleEditor from '$lib/components/admin/ArticleEditor.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { goto } from '$app/navigation';

	function handleSave(data: any) {
		console.log('Create article with data:', data);
		// Mock saving and returning to list
		goto('/dashboard/article');
	}
</script>

<svelte:head>
	<title>{m.create_article_title()}</title>
</svelte:head>

<ArticleEditor pageTitle={m.create_article_title()} onsave={handleSave} />
