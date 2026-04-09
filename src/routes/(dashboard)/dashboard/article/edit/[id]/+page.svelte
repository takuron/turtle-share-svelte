<script lang="ts">
	import { page } from '$app/state';
	import ArticleEditor from '$lib/components/admin/ArticleEditor.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { goto } from '$app/navigation';

	// Mock fetching article based on ID.
	let articleId = $derived(page.params.id);

	// Mock initial data
	let initialData = $derived({
		title: 'Mock Article ' + articleId,
		content: 'This is the mock content for article ' + articleId + '.\n\nIt is just a placeholder.',
		publishDate: '2024-10-24',
		requiredTier: 3,
		isPublic: true
	});

	function handleSave(data: any) {
		console.log('Update article', articleId, 'with data:', data);
		// Mock saving and returning to list
		goto('/dashboard/article');
	}
</script>

<svelte:head>
	<title>{m.edit_article_title()}</title>
</svelte:head>

<ArticleEditor pageTitle={m.edit_article_title()} isEdit={true} {initialData} onsave={handleSave} />
