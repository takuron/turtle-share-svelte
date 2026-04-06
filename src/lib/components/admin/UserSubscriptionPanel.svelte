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

	<!-- 订阅表格 -->
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
			<tbody class="divide-y divide-outline-variant/20 text-sm">
				{#if loading}
					<tr>
						<td colspan="5" class="px-4 py-6 text-center">
							<div class="flex items-center justify-center gap-2">
								<Loader2 size={16} class="animate-spin text-primary" />
								<span class="text-on-surface-variant text-sm">{m.loading_articles()}</span>
							</div>
						</td>
					</tr>
				{:else if error}
					<tr>
						<td colspan="5" class="px-4 py-6 text-center">
							<span class="text-error text-sm">{error}</span>
						</td>
					</tr>
				{:else if allSubscriptions.length === 0}
					<tr>
						<td colspan="5" class="px-4 py-6 text-center text-on-surface-variant text-sm">
							—
						</td>
					</tr>
				{:else}
					{#each pageSubscriptions() as sub (sub.hash_id)}
						<tr>
							<td class="px-4 py-3 font-medium w-32">{formatDate(sub.start_date)}</td>
							<td class="px-4 py-3 font-medium w-32">{formatDate(sub.end_date)}</td>
							<td class="px-4 py-3 w-20">{sub.tier}</td>
							<td class="px-4 py-3 italic text-on-surface-variant">{sub.note || ''}</td>
							<td class="px-4 py-3 text-right w-24">
								<div class="flex justify-end gap-2">
									<button class="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
										<Edit size={16} />
									</button>
									<button class="text-on-surface-variant hover:text-error transition-colors cursor-pointer">
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
		<div class="flex justify-end items-center mt-4 px-2">
			<div class="flex items-center gap-1.5">
				<button
					onclick={() => goToPage(currentPage - 1)}
					disabled={currentPage <= 1}
					class="w-7 h-7 flex items-center justify-center rounded-full bg-surface-container text-on-surface hover:bg-surface-dim transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
				>
					<ChevronLeft size={14} />
				</button>
				{#each pageNumbers() as pageNum}
					<button
						onclick={() => goToPage(pageNum)}
						class="w-7 h-7 flex items-center justify-center rounded-full transition-all text-[11px] cursor-pointer
							{pageNum === currentPage
								? 'bg-primary text-white font-bold'
								: 'bg-surface-container text-on-surface hover:bg-surface-dim'}"
					>
						{pageNum}
					</button>
				{/each}
				<button
					onclick={() => goToPage(currentPage + 1)}
					disabled={currentPage >= totalPages}
					class="w-7 h-7 flex items-center justify-center rounded-full bg-surface-container text-on-surface hover:bg-surface-dim transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
				>
					<ChevronRight size={14} />
				</button>
			</div>
		</div>
	{/if}
</div>
