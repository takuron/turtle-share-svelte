<script lang="ts">
	/**
	 * A single user row in the admin user list. Expandable to show subscription panel.
	 *
	 * @prop {import('$lib/api/types').AdminUserItem} user - The user data.
	 * @prop {boolean} expanded - Whether the subscription panel is expanded.
	 * @prop {() => void} ontoggle - Callback when expand/collapse is toggled.
	 */
	// // 管理员用户列表中的单个用户行。可展开显示订阅管理面板。
	// //
	// // @prop {AdminUserItem} user - 用户数据。
	// // @prop {boolean} expanded - 订阅面板是否展开。
	// // @prop {() => void} ontoggle - 展开/收起切换回调。
	import { ChevronRight, ChevronDown, Edit, Trash2 } from 'lucide-svelte';
	import UserSubscriptionPanel from './UserSubscriptionPanel.svelte';
	import type { AdminUserItem } from '$lib/api/types';

	let { user, expanded = false, ontoggle }: {
		user: AdminUserItem;
		expanded: boolean;
		ontoggle: () => void;
	} = $props();

	// 1. 从用户名生成头像缩写（取前两个字符大写）。
	function getInitials(username: string): string {
		return username.slice(0, 2).toUpperCase();
	}
</script>

<div
	class="border-b border-outline-variant/20 last:border-b-0
		{expanded ? 'bg-surface-lowest' : 'hover:bg-surface-low/30 transition-colors'}"
>
	<div class="grid grid-cols-12 items-center px-4 lg:px-6 py-5">
		<!-- 展开按钮 -->
		<div class="col-span-2 lg:col-span-1 flex items-center pl-0 lg:pl-4">
			<button
				onclick={ontoggle}
				class="transition-colors cursor-pointer
					{expanded ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}"
			>
				{#if expanded}
					<ChevronDown size={20} />
				{:else}
					<ChevronRight size={20} />
				{/if}
			</button>
		</div>

		<!-- 用户名 + 头像 -->
		<div class="col-span-6 lg:col-span-4 flex items-center gap-3">
			<div class="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
				{getInitials(user.username)}
			</div>
			<p class="font-bold text-on-surface text-base truncate">{user.username}</p>
		</div>

		<!-- 备注（仅桌面端） -->
		<div class="hidden lg:block col-span-6 text-on-surface-variant text-sm truncate">
			{user.note || ''}
		</div>

		<!-- 操作按钮 -->
		<div class="col-span-4 lg:col-span-1 flex justify-end gap-3">
			<button class="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
				<Edit size={18} />
			</button>
			<button class="text-on-surface-variant hover:text-error transition-colors cursor-pointer">
				<Trash2 size={18} />
			</button>
		</div>
	</div>

	<!-- 展开的订阅详情面板 -->
	{#if expanded}
		<UserSubscriptionPanel {user} />
	{/if}
</div>
