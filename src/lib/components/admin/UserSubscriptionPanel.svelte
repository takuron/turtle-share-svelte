<script lang="ts">
	/**
	 * Expandable subscription management panel for a single user.
	 * Fetches all subscriptions and paginates client-side (5 per page).
	 *
	 * @prop {import('$lib/api/types').AdminUserItem} user - The user whose subscriptions to display.
	 */
	// // 单个用户的可展开订阅管理面板。
	// // 拉取所有订阅后在客户端分页（每页 5 条）。
	// //
	// // @prop {AdminUserItem} user - 需要展示订阅的用户。
	import { Plus, Edit, Trash2, ChevronLeft, ChevronRight, Loader2 } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';
	import type { AdminUserItem, AdminSubscriptionItem } from '$lib/api/types';
	import { ADMIN_SUBSCRIPTIONS_PAGE_SIZE } from '$lib/api/types';
	import { fetchAdminUserSubscriptions } from '$lib/api/admin/users';
	import { onMount } from 'svelte';

	let { user }: { user: AdminUserItem } = $props();

	// 1. 订阅数据状态。
	let allSubscriptions = $state<AdminSubscriptionItem[]>([]);
	let loading = $state(true);
	let error = $state<string | null>(null);
	let currentPage = $state(1);

	// 2. 派生当前页的订阅切片。
	let pageSubscriptions = $derived(() => {
		const start = (currentPage - 1) * ADMIN_SUBSCRIPTIONS_PAGE_SIZE;
		return allSubscriptions.slice(start, start + ADMIN_SUBSCRIPTIONS_PAGE_SIZE);
	});

	// 3. 派生总页数。
	let totalPages = $derived(Math.ceil(allSubscriptions.length / ADMIN_SUBSCRIPTIONS_PAGE_SIZE));

	// 4. 派生分页器页码。
	let pageNumbers = $derived(() => {
		const total = totalPages;
		if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
		const start = Math.max(1, Math.min(currentPage - 1, total - 2));
		const end = Math.min(total, start + 2);
		return Array.from({ length: end - start + 1 }, (_, i) => start + i);
	});

	// 5. 将 Unix 时间戳格式化为可读日期。
	function formatDate(timestamp: number): string {
		return new Date(timestamp * 1000).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: '2-digit'
		});
	}

	// 6. 加载订阅数据。
	async function loadSubscriptions() {
		loading = true;
		error = null;
		try {
			const res = await fetchAdminUserSubscriptions(user.hash_id);
			if (res.success) {
				allSubscriptions = res.data;
			} else {
				error = res.error.message;
			}
		} catch (e) {
			error = String(e);
		} finally {
			loading = false;
		}
	}

	// 7. 切换页码。
	function goToPage(page: number) {
		currentPage = page;
	}

	onMount(() => {
		loadSubscriptions();
	});
</script>

<div class="bg-surface-low/30 p-4 lg:p-6">
	<!-- 备注（仅移动端展开时显示） -->
	{#if user.note}
		<p class="mb-4 text-sm text-on-surface-variant lg:hidden">{user.note}</p>
	{/if}

	<div class="mb-4 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
		<h3 class="text-sm font-bold tracking-wider text-on-surface-variant uppercase">
			{m.subscription_cycles()}
		</h3>
		<button
			class="flex cursor-pointer items-center gap-1.5 rounded-full border border-outline-variant/50 bg-surface-lowest px-3 py-1.5 text-xs font-bold text-primary shadow-editorial-sm transition-all hover:bg-primary hover:text-white"
		>
			<Plus size={14} />
			{m.add_subscription()}
		</button>
	</div>

	<!-- 订阅表格 -->
	<div class="overflow-x-auto rounded-lg border border-outline-variant/30 bg-surface-lowest">
		<table class="w-full border-collapse text-left">
			<thead>
				<tr
					class="bg-surface-container/50 text-[11px] font-black tracking-widest text-on-surface-variant uppercase"
				>
					<th class="w-32 px-4 py-3">{m.col_start_date()}</th>
					<th class="w-32 px-4 py-3">{m.col_end_date()}</th>
					<th class="w-20 px-4 py-3">{m.col_level()}</th>
					<th class="px-4 py-3">{m.col_note()}</th>
					<th class="w-24 px-4 py-3 text-right">{m.col_actions()}</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-outline-variant/20 text-sm">
				{#if loading}
					<tr>
						<td colspan="5" class="px-4 py-6 text-center">
							<div class="flex items-center justify-center gap-2">
								<Loader2 size={16} class="animate-spin text-primary" />
								<span class="text-sm text-on-surface-variant">{m.loading_articles()}</span>
							</div>
						</td>
					</tr>
				{:else if error}
					<tr>
						<td colspan="5" class="px-4 py-6 text-center">
							<span class="text-sm text-error">{error}</span>
						</td>
					</tr>
				{:else if allSubscriptions.length === 0}
					<tr>
						<td colspan="5" class="px-4 py-6 text-center text-sm text-on-surface-variant"> — </td>
					</tr>
				{:else}
					{#each pageSubscriptions() as sub (sub.hash_id)}
						<tr>
							<td class="w-32 px-4 py-3 font-medium">{formatDate(sub.start_date)}</td>
							<td class="w-32 px-4 py-3 font-medium">{formatDate(sub.end_date)}</td>
							<td class="w-20 px-4 py-3">{sub.tier}</td>
							<td class="px-4 py-3 text-on-surface-variant italic">{sub.note || ''}</td>
							<td class="w-24 px-4 py-3 text-right">
								<div class="flex justify-end gap-2">
									<button
										class="cursor-pointer text-on-surface-variant transition-colors hover:text-primary"
									>
										<Edit size={16} />
									</button>
									<button
										class="cursor-pointer text-on-surface-variant transition-colors hover:text-error"
									>
										<Trash2 size={16} />
									</button>
								</div>
							</td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>

	<!-- 订阅分页（小尺寸，右对齐） -->
	{#if totalPages > 1}
		<div class="mt-4 flex items-center justify-end px-2">
			<div class="flex items-center gap-1.5">
				<button
					onclick={() => goToPage(currentPage - 1)}
					disabled={currentPage <= 1}
					class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-surface-container text-on-surface transition-all hover:bg-surface-dim disabled:cursor-not-allowed disabled:opacity-30"
				>
					<ChevronLeft size={14} />
				</button>
				{#each pageNumbers() as pageNum}
					<button
						onclick={() => goToPage(pageNum)}
						class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-[11px] transition-all
							{pageNum === currentPage
							? 'bg-primary font-bold text-white'
							: 'bg-surface-container text-on-surface hover:bg-surface-dim'}"
					>
						{pageNum}
					</button>
				{/each}
				<button
					onclick={() => goToPage(currentPage + 1)}
					disabled={currentPage >= totalPages}
					class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-surface-container text-on-surface transition-all hover:bg-surface-dim disabled:cursor-not-allowed disabled:opacity-30"
				>
					<ChevronRight size={14} />
				</button>
			</div>
		</div>
	{/if}
</div>
