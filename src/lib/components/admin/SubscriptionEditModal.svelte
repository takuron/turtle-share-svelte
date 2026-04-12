<script lang="ts">
	/**
	 * Admin subscription edit modal for adding and editing subscriptions.
	 * 管理员订阅编辑模态框，用于添加和编辑订阅。
	 */
	// // 管理员订阅编辑模态框，用于添加和编辑订阅。
	import { CircleAlert } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';
	import type { AdminSubscriptionItem } from '$lib/api/types';
	import { formatIsoDate } from '$lib/utils/formatDate';
	import Modal from '$lib/components/shared/Modal.svelte';

	let {
		open = false,
		subscription = null,
		onclose,
		onsubmit
	} = $props<{
		open: boolean;
		subscription?: AdminSubscriptionItem | null;
		onclose: () => void;
		onsubmit: (data: {
			start_date: number;
			end_date: number;
			tier: number;
			note?: string;
		}) => Promise<string | void>;
	}>();

	let startDate = $state('');
	let endDate = $state('');
	let tier = $state<number | ''>('');
	let note = $state('');

	let errorMsg = $state('');
	let loading = $state(false);

	// 辅助函数：将 YYYY-MM-DD 转换为秒级时间戳（开始日期用当天 00:00:00）
	function toStartTimestamp(dateString: string): number {
		return Math.floor(new Date(dateString + 'T00:00:00').getTime() / 1000);
	}

	// 辅助函数：将 YYYY-MM-DD 转换为秒级时间戳（截止日期用当天 23:59:59）
	function toEndTimestamp(dateString: string): number {
		return Math.floor(new Date(dateString + 'T23:59:59').getTime() / 1000);
	}

	// 1. 初始化表单数据。
	$effect(() => {
		if (open) {
			errorMsg = '';
			loading = false;
			if (subscription) {
				startDate = formatIsoDate(subscription.start_date);
				endDate = formatIsoDate(subscription.end_date);
				tier = subscription.tier;
				note = subscription.note || '';
			} else {
				// 新增时默认当前时间
				startDate = formatIsoDate(Math.floor(Date.now() / 1000));
				endDate = '';
				tier = '';
				note = '';
			}
		}
	});

	// 2. 快速选择时长逻辑。
	function setQuickDuration(days: number) {
		if (!startDate) {
			startDate = formatIsoDate(Math.floor(Date.now() / 1000));
		}
		const start = new Date(startDate + 'T00:00:00');
		start.setDate(start.getDate() + days);
		endDate = formatIsoDate(Math.floor(start.getTime() / 1000));
	}

	// 3. 处理表单提交。
	async function handleSubmit(e: Event) {
		e.preventDefault();
		errorMsg = '';

		if (!startDate || !endDate) {
			errorMsg = m.error_missing_dates();
			return;
		}

		if (tier === '') {
			errorMsg = m.error_missing_tier();
			return;
		}

		const startTs = toStartTimestamp(startDate);
		const endTs = toEndTimestamp(endDate);

		if (startTs > endTs) {
			errorMsg = m.error_invalid_dates();
			return;
		}

		const data = {
			start_date: startTs,
			end_date: endTs,
			tier: Number(tier),
			note
		};

		loading = true;
		const err = await onsubmit(data);
		loading = false;

		if (err) {
			errorMsg = err;
		}
	}
</script>

<Modal {open} {onclose} scrollable>
	<div class="flex items-center justify-between px-8 pt-8 pb-4">
		<h2 class="text-2xl font-extrabold tracking-tight text-on-surface">
			{subscription ? m.edit_subscription() : m.add_subscription()}
		</h2>
	</div>

	<form onsubmit={handleSubmit} class="px-8 pb-6">
		<div class="space-y-5">
			<!-- 错误提示 -->
			{#if errorMsg}
				<div
					class="flex items-center gap-2 rounded-xl bg-error/10 px-4 py-3 text-sm font-medium text-error"
				>
					<CircleAlert size={16} />
					{errorMsg}
				</div>
			{/if}

			<!-- 快速时长选择 — 标注的是一组按钮，用 span 而非 label -->
			<div class="flex flex-col gap-3">
				<span class="text-outline px-1 text-xs font-black tracking-widest uppercase"
					>{m.quick_duration()}</span
				>
				<div class="grid grid-cols-2 gap-2">
					<button
						type="button"
						class="bg-surface-container-low border-surface-container-high rounded-xl border px-2 py-3 text-xs font-bold text-on-surface transition-all hover:border-primary hover:bg-primary hover:text-white"
						onclick={() => setQuickDuration(7)}
					>
						{m.days_7()}
					</button>
					<button
						type="button"
						class="bg-surface-container-low border-surface-container-high rounded-xl border px-2 py-3 text-xs font-bold text-on-surface transition-all hover:border-primary hover:bg-primary hover:text-white"
						onclick={() => setQuickDuration(30)}
					>
						{m.month_1()}
					</button>
					<button
						type="button"
						class="bg-surface-container-low border-surface-container-high rounded-xl border px-2 py-3 text-xs font-bold text-on-surface transition-all hover:border-primary hover:bg-primary hover:text-white"
						onclick={() => setQuickDuration(90)}
					>
						{m.months_3()}
					</button>
					<button
						type="button"
						class="bg-surface-container-low border-surface-container-high rounded-xl border px-2 py-3 text-xs font-bold text-on-surface transition-all hover:border-primary hover:bg-primary hover:text-white"
						onclick={() => setQuickDuration(365)}
					>
						{m.year_1()}
					</button>
				</div>
			</div>

			<div class="flex flex-col gap-2">
				<label
					for="sub-edit-start"
					class="text-outline px-1 text-xs font-black tracking-widest uppercase"
					>{m.col_start_date()}</label
				>
				<input
					id="sub-edit-start"
					class="bg-surface-container-low border-surface-container-high w-full rounded-xl border px-5 py-3.5 text-sm font-medium transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
					type="date"
					bind:value={startDate}
					required
					disabled={loading}
				/>
			</div>

			<div class="flex flex-col gap-2">
				<label
					for="sub-edit-end"
					class="text-outline px-1 text-xs font-black tracking-widest uppercase"
					>{m.col_end_date()}</label
				>
				<input
					id="sub-edit-end"
					class="bg-surface-container-low border-surface-container-high w-full rounded-xl border px-5 py-3.5 text-sm font-medium transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
					type="date"
					bind:value={endDate}
					required
					disabled={loading}
				/>
			</div>

			<div class="flex flex-col gap-2">
				<label
					for="sub-edit-tier"
					class="text-outline px-1 text-xs font-black tracking-widest uppercase"
					>{m.col_level()}</label
				>
				<input
					id="sub-edit-tier"
					class="bg-surface-container-low border-surface-container-high w-full rounded-xl border px-5 py-3.5 text-sm font-medium transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
					placeholder={m.enter_level()}
					type="number"
					bind:value={tier}
					required
					disabled={loading}
				/>
			</div>

			<div class="flex flex-col gap-2">
				<div class="flex justify-between px-1">
					<div class="flex items-center gap-1.5">
						<label
							for="sub-edit-note"
							class="text-outline text-xs font-black tracking-widest uppercase"
							>{m.col_note()}</label
						>
					</div>
					<span class="text-[10px] font-bold text-outline-variant uppercase">{m.optional()}</span>
				</div>
				<textarea
					id="sub-edit-note"
					class="bg-surface-container-low border-surface-container-high w-full resize-none rounded-xl border px-5 py-3.5 text-sm font-medium transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
					placeholder={m.add_admin_note()}
					rows="2"
					bind:value={note}
					disabled={loading}
				></textarea>
			</div>
		</div>

		<div class="flex items-center gap-4 pt-6">
			<button
				type="button"
				class="hover:bg-surface-container-high w-[35%] cursor-pointer rounded-full bg-surface-container py-3.5 text-sm font-bold text-on-surface transition-all active:scale-95 disabled:opacity-50"
				onclick={onclose}
				disabled={loading}
			>
				{m.cancel()}
			</button>
			<button
				type="submit"
				class="flex w-[65%] cursor-pointer items-center justify-center gap-2 rounded-full py-4 text-sm font-bold whitespace-nowrap text-white shadow-lg shadow-primary/20 transition-all gradient-cta hover:scale-[1.02] active:scale-95 disabled:opacity-50"
				disabled={loading}
			>
				{#if loading}
					<span class="loading loading-sm loading-spinner"></span>
				{/if}
				{m.confirm_subscription()}
			</button>
		</div>
	</form>
</Modal>
