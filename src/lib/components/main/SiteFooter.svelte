<script lang="ts">
	/**
	 * Centered plain-text footer (DESIGN.md §6).
	 * Reads site name from siteStore.
	 */
	// // 居中纯文本页脚。站点名称从 siteStore 读取。
	import { siteStore } from '$lib/stores/site.svelte';
</script>

<footer class="mx-auto max-w-2xl border-t border-outline-variant/10 px-4 py-12 text-center">
	<p class="text-xs font-medium text-on-surface-variant">
		&copy; {new Date().getFullYear()}
		{siteStore.info.name}. All rights reserved.
	</p>
	<p class="text-xs font-medium text-on-surface-variant">
		Powered by <a href="https://github.com/takuron/TurtleShare">TurtleShare</a> and using the
		<a href="https://github.com/takuron/turtle-share-svelte">turtle-share-svelte</a>
		theme. The site follows the
		<a href="https://github.com/takuron/turtle-share-svelte/blob/main/LICENSE">AGPL-3.0</a> license.
	</p>
</footer>
