<script lang="ts">
	/**
	 * Centered plain-text footer (DESIGN.md §6).
	 * Reads site name from siteStore.
	 */
	// // 居中纯文本页脚。站点名称从 siteStore 读取。
	import { siteStore } from '$lib/stores/site.svelte';
</script>

<footer class="max-w-2xl mx-auto px-4 py-12 border-t border-outline-variant/10 text-center">
	<p class="text-xs font-medium text-on-surface-variant">
		&copy; {new Date().getFullYear()} {siteStore.info.name}. All rights reserved.
	</p>
</footer>
