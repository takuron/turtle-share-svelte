<script lang="ts">
	/**
	 * Admin Article/Content Management page skeleton.
	 * 管理员文章/内容管理页面骨架。
	 */
	// // 管理员文章/内容管理页面骨架。
	import * as m from '$lib/paraglide/messages.js';
</script>

<!-- 文章管理页面 -->
<div class="flex items-end justify-between mb-8">
	<h2 class="text-3xl font-extrabold text-on-surface tracking-tight font-display">{m.nav_content_management()}</h2>
</div>

<div class="text-on-surface-variant text-sm">
	<p>{m.page_content_management_placeholder()}</p>
</div>
