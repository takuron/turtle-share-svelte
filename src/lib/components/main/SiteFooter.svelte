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
		Powered by
		<a href="https://github.com/takuron/TurtleShare" class="text-primary hover:underline">TurtleShare</a>
		&
		<a href="https://github.com/takuron/turtle-share-svelte" class="text-primary hover:underline">turtle-share-svelte</a>
		· Source code licensed under
		<a href="https://www.gnu.org/licenses/agpl-3.0.html" class="text-primary hover:underline">AGPL-3.0</a>
	</p>
</footer>
