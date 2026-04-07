<script lang="ts">
	/**
	 * Admin Article/Content Management page skeleton.
	 * 管理员文章/内容管理页面骨架。
	 */
	// // 管理员文章/内容管理页面骨架。
	import * as m from '$lib/paraglide/messages.js';
</script>

<!-- 文章管理页面 -->
<div class="mb-8 flex items-end justify-between">
	<h2 class="font-display text-3xl font-extrabold tracking-tight text-on-surface">
		{m.nav_content_management()}
	</h2>
</div>

<div class="text-sm text-on-surface-variant">
	<p>{m.page_content_management_placeholder()}</p>
</div>
