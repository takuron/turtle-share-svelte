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
	import {
		fetchAdminUserSubscriptions,
		createAdminUserSubscription,
		updateAdminSubscription,
		deleteAdminSubscription
	} from '$lib/api/admin/users';
	import { onMount } from 'svelte';
	import SubscriptionEditModal from './SubscriptionEditModal.svelte';
	import ConfirmModal from './ConfirmModal.svelte';

	let { user }: { user: AdminUserItem } = $props();

	// 1. 订阅数据状态。
	let allSubscriptions = $state<AdminSubscriptionItem[]>([]);
	let loading = $state(true);
	let error = $state<string | null>(null);
	let currentPage = $state(1);

	// 模态框状态
	let editModalOpen = $state(false);
	let currentEditSubscription = $state<AdminSubscriptionItem | null>(null);

	// 删除确认模态框状态
	let deleteModalOpen = $state(false);
	let subscriptionToDelete = $state<AdminSubscriptionItem | null>(null);
	let deleting = $state(false);

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

	// 8. 模态框控制逻辑
	function openAddModal() {
		currentEditSubscription = null;
		editModalOpen = true;
	}

	function openEditModal(sub: AdminSubscriptionItem) {
		currentEditSubscription = sub;
		editModalOpen = true;
	}

	function openDeleteModal(sub: AdminSubscriptionItem) {
		subscriptionToDelete = sub;
		deleteModalOpen = true;
	}

	async function handleSubscriptionSubmit(data: {
		start_date: number;
		end_date: number;
		tier: number;
		note?: string;
	}) {
		if (currentEditSubscription) {
			// Update existing subscription
			const res = await updateAdminSubscription(currentEditSubscription.hash_id, data);
			if (!res.success) {
				return res.error.message || m.err_unknown({ message: 'Failed to update' });
			}
			const idx = allSubscriptions.findIndex((s) => s.hash_id === currentEditSubscription!.hash_id);
			if (idx !== -1) {
				allSubscriptions[idx] = res.data;
			}
		} else {
			// Add new subscription
			const res = await createAdminUserSubscription(user.hash_id, data);
			if (!res.success) {
				return res.error.message || m.err_unknown({ message: 'Failed to create' });
			}
			allSubscriptions = [res.data, ...allSubscriptions];
		}
		editModalOpen = false;
	}

	async function handleConfirmDelete() {
		if (!subscriptionToDelete) return;
		deleting = true;
		const res = await deleteAdminSubscription(subscriptionToDelete.hash_id);
		deleting = false;

		if (res.success) {
			allSubscriptions = allSubscriptions.filter(
				(s) => s.hash_id !== subscriptionToDelete!.hash_id
			);
			deleteModalOpen = false;
			subscriptionToDelete = null;
			// 如果当前页为空且不是第一页，自动退回上一页
			if (pageSubscriptions().length === 0 && currentPage > 1) {
				currentPage -= 1;
			}
		} else {
			// The modal doesn't have a built-in error alert state in the generic component
			// So we can just alert or log it
			alert(res.error.message || m.err_unknown({ message: 'Failed to delete' }));
		}
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
			onclick={openAddModal}
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
										onclick={() => openEditModal(sub)}
										class="cursor-pointer text-on-surface-variant transition-colors hover:text-primary"
									>
										<Edit size={16} />
									</button>
									<button
										onclick={() => openDeleteModal(sub)}
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

<SubscriptionEditModal
	open={editModalOpen}
	subscription={currentEditSubscription}
	onclose={() => (editModalOpen = false)}
	onsubmit={handleSubscriptionSubmit}
/>

<ConfirmModal
	open={deleteModalOpen}
	title={m.confirm_delete_subscription()}
	description={m.confirm_delete_subscription_desc()}
	confirmText={m.delete()}
	danger={true}
	loading={deleting}
	onclose={() => (deleteModalOpen = false)}
	onconfirm={handleConfirmDelete}
/>
