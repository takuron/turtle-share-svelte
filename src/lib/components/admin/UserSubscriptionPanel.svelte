<script lang="ts">
	/**
	 * Expandable subscription management panel for a single user.
	 * Shows subscription table with headers (data loading TBD).
	 *
	 * @prop {import('$lib/api/types').AdminUserItem} user - The user whose subscriptions to display.
	 */
	// // 单个用户的可展开订阅管理面板。
	// // 显示订阅表格骨架（订阅数据加载待实现）。
	// //
	// // @prop {AdminUserItem} user - 需要展示订阅的用户。
	import { Plus, Edit, Trash2 } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';
	import type { AdminUserItem } from '$lib/api/types';

	let { user }: { user: AdminUserItem } = $props();
</script>

<div class="bg-surface-low/30 p-4 lg:p-6">
	<!-- 备注（仅移动端展开时显示） -->
	{#if user.note}
		<p class="lg:hidden text-on-surface-variant text-sm mb-4">{user.note}</p>
	{/if}

	<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
		<h3 class="text-sm font-bold uppercase tracking-wider text-on-surface-variant">
			{m.subscription_cycles()}
		</h3>
		<button
			class="flex items-center gap-1.5 text-xs font-bold bg-surface-lowest border border-outline-variant/50 text-primary px-3 py-1.5 rounded-full hover:bg-primary hover:text-white transition-all shadow-editorial-sm cursor-pointer"
		>
			<Plus size={14} />
			{m.add_subscription()}
		</button>
	</div>

	<!-- 订阅表格（数据加载待实现） -->
	<div class="overflow-x-auto rounded-lg border border-outline-variant/30 bg-surface-lowest">
		<table class="w-full text-left border-collapse">
			<thead>
				<tr class="bg-surface-container/50 text-[11px] font-black uppercase tracking-widest text-on-surface-variant">
					<th class="px-4 py-3 w-32">{m.col_start_date()}</th>
					<th class="px-4 py-3 w-32">{m.col_end_date()}</th>
					<th class="px-4 py-3 w-20">{m.col_level()}</th>
					<th class="px-4 py-3">{m.col_note()}</th>
					<th class="px-4 py-3 text-right w-24">{m.col_actions()}</th>
				</tr>
			</thead>
			<tbody class="text-sm">
				<!-- 订阅数据暂不加载 -->
			</tbody>
		</table>
	</div>
</div>
