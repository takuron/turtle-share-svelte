<script lang="ts">
	/**
	 * Admin User Management page skeleton.
	 * 管理员用户管理页面骨架。
	 */
	// // 管理员用户管理页面骨架。
	import * as m from '$lib/paraglide/messages.js';
</script>

<!-- 用户管理页面 -->
<div class="flex items-end justify-between mb-8">
	<h2 class="text-3xl font-extrabold text-on-surface tracking-tight font-display">{m.nav_user_management()}</h2>
</div>

<div class="text-on-surface-variant text-sm">
	<p>{m.page_user_management_placeholder()}</p>
</div>
