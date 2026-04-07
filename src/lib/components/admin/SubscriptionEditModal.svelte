<script lang="ts">
	/**
	 * Admin subscription edit modal for adding and editing subscriptions.
	 * 管理员订阅编辑模态框，用于添加和编辑订阅。
	 */
	// // 管理员订阅编辑模态框，用于添加和编辑订阅。
	import { CircleAlert } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';
	import type { AdminSubscriptionItem } from '$lib/api/types';
	import { fade, scale } from 'svelte/transition';
	import { quintOut, backOut } from 'svelte/easing';

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

	// 辅助函数：将 YYYY-MM-DD 转换为秒级时间戳
	function toTimestamp(dateString: string): number {
		// 加上 T00:00:00 避免时区问题
		return Math.floor(new Date(dateString + 'T00:00:00').getTime() / 1000);
	}

	// 辅助函数：将秒级时间戳转换为 YYYY-MM-DD
	function toDateString(timestamp: number): string {
		const d = new Date(timestamp * 1000);
		const year = d.getFullYear();
		const month = String(d.getMonth() + 1).padStart(2, '0');
		const day = String(d.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	}

	// 1. 初始化表单数据。
	$effect(() => {
		if (open) {
			errorMsg = '';
			loading = false;
			if (subscription) {
				startDate = toDateString(subscription.start_date);
				endDate = toDateString(subscription.end_date);
				tier = subscription.tier;
				note = subscription.note || '';
			} else {
				// 新增时默认当前时间
				startDate = toDateString(Math.floor(Date.now() / 1000));
				endDate = '';
				tier = '';
				note = '';
			}
		}
	});

	// 2. 快速选择时长逻辑。
	function setQuickDuration(days: number) {
		if (!startDate) {
			startDate = toDateString(Math.floor(Date.now() / 1000));
		}
		const start = new Date(startDate + 'T00:00:00');
		start.setDate(start.getDate() + days);
		endDate = toDateString(Math.floor(start.getTime() / 1000));
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

		const startTs = toTimestamp(startDate);
		const endTs = toTimestamp(endDate);

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

{#if open}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/30 p-4 backdrop-blur-sm"
		transition:fade={{ duration: 200, easing: quintOut }}
		onclick={onclose}
	>
		<div
			class="border-surface-container-high bg-surface-lowest my-auto w-full max-w-md overflow-hidden rounded-3xl border shadow-2xl"
			transition:scale={{ duration: 300, start: 0.95, opacity: 0, easing: backOut }}
			onclick={(e) => e.stopPropagation()}
		>
			<div class="flex items-center justify-between px-8 pb-4 pt-8">
				<h2 class="text-on-surface text-2xl font-extrabold tracking-tight">
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

					<!-- 快速时长选择 -->
					<div class="flex flex-col gap-3">
						<label class="text-outline px-1 text-xs font-black tracking-widest uppercase"
							>{m.quick_duration()}</label
						>
						<div class="grid grid-cols-2 gap-2">
							<button
								type="button"
								class="bg-surface-container-low border-surface-container-high text-on-surface hover:border-primary hover:bg-primary rounded-xl border px-2 py-3 text-xs font-bold transition-all hover:text-white"
								onclick={() => setQuickDuration(7)}
							>
								{m.days_7()}
							</button>
							<button
								type="button"
								class="bg-surface-container-low border-surface-container-high text-on-surface hover:border-primary hover:bg-primary rounded-xl border px-2 py-3 text-xs font-bold transition-all hover:text-white"
								onclick={() => setQuickDuration(30)}
							>
								{m.month_1()}
							</button>
							<button
								type="button"
								class="bg-surface-container-low border-surface-container-high text-on-surface hover:border-primary hover:bg-primary rounded-xl border px-2 py-3 text-xs font-bold transition-all hover:text-white"
								onclick={() => setQuickDuration(90)}
							>
								{m.months_3()}
							</button>
							<button
								type="button"
								class="bg-surface-container-low border-surface-container-high text-on-surface hover:border-primary hover:bg-primary rounded-xl border px-2 py-3 text-xs font-bold transition-all hover:text-white"
								onclick={() => setQuickDuration(365)}
							>
								{m.year_1()}
							</button>
						</div>
					</div>

					<div class="flex flex-col gap-2">
						<label class="text-outline px-1 text-xs font-black tracking-widest uppercase"
							>{m.col_start_date()}</label
						>
						<input
							class="bg-surface-container-low border-surface-container-high focus:border-primary focus:ring-primary/20 w-full rounded-xl border px-5 py-3.5 text-sm font-medium outline-none transition-all focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
							type="date"
							bind:value={startDate}
							required
							disabled={loading}
						/>
					</div>

					<div class="flex flex-col gap-2">
						<label class="text-outline px-1 text-xs font-black tracking-widest uppercase"
							>{m.col_end_date()}</label
						>
						<input
							class="bg-surface-container-low border-surface-container-high focus:border-primary focus:ring-primary/20 w-full rounded-xl border px-5 py-3.5 text-sm font-medium outline-none transition-all focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
							type="date"
							bind:value={endDate}
							required
							disabled={loading}
						/>
					</div>

					<div class="flex flex-col gap-2">
						<label class="text-outline px-1 text-xs font-black tracking-widest uppercase"
							>{m.col_level()}</label
						>
						<input
							class="bg-surface-container-low border-surface-container-high focus:border-primary focus:ring-primary/20 w-full rounded-xl border px-5 py-3.5 text-sm font-medium outline-none transition-all focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
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
								<label class="text-outline text-xs font-black tracking-widest uppercase"
									>{m.col_note()}</label
								>
							</div>
							<span class="text-outline-variant text-[10px] font-bold uppercase">{m.optional()}</span>
						</div>
						<textarea
							class="bg-surface-container-low border-surface-container-high focus:border-primary focus:ring-primary/20 w-full resize-none rounded-xl border px-5 py-3.5 text-sm font-medium outline-none transition-all focus:ring-2 disabled:opacity-50"
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
						class="hover:bg-surface-container-high bg-surface-container text-on-surface w-[35%] cursor-pointer rounded-full py-3.5 text-sm font-bold transition-all active:scale-95 disabled:opacity-50"
						onclick={onclose}
						disabled={loading}
					>
						{m.cancel()}
					</button>
					<button
						type="submit"
						class="gradient-cta shadow-primary/20 flex w-[65%] cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full py-4 text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
						disabled={loading}
					>
						{#if loading}
							<span class="loading loading-spinner loading-sm"></span>
						{/if}
						{m.confirm_subscription()}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
