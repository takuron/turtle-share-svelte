<script lang="ts">
	/**
	 * A modal dialog for users to view their current subscription tier and history.
	 * @prop {boolean} open - Controls the modal visibility.
	 * @prop {() => void} onclose - Callback to close the modal.
	 */
	// // 用户订阅信息弹出框，展示当前订阅等级和历史订阅记录。
	// //
	// // @prop {boolean} open - 控制弹窗可见性。
	// // @prop {() => void} onclose - 关闭弹窗的回调。
	import { fade, scale } from 'svelte/transition';
	import { quintOut, backOut } from 'svelte/easing';
	import { X, History, Loader2 } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { fetchUserSubscriptions, fetchUserTier } from '$lib/api/user/subscriptions';
	import type { UserSubscriptionItem } from '$lib/api/types';

	/** 最多展示的订阅记录数 */
	const MAX_DISPLAY = 5;

	let { open = false, onclose } = $props<{
		open: boolean;
		onclose: () => void;
	}>();

	// 当前等级、订阅列表、加载状态、错误信息
	let currentTier = $state(0);
	let subscriptions = $state<UserSubscriptionItem[]>([]);
	let loading = $state(false);
	let error = $state('');

	// 每次弹窗打开时重新拉取数据
	$effect(() => {
		if (open) {
			loadData();
		}
	});

	// 并行请求当前等级和订阅列表
	async function loadData() {
		loading = true;
		error = '';
		const [tierRes, subsRes] = await Promise.all([
			fetchUserTier(),
			fetchUserSubscriptions()
		]);

		if (!tierRes.success) {
			error = tierRes.error.message;
		} else {
			currentTier = tierRes.data.tier;
		}

		if (!subsRes.success) {
			error = error || subsRes.error.message;
			subscriptions = [];
		} else {
			subscriptions = subsRes.data.slice(0, MAX_DISPLAY);
		}
		loading = false;
	}

	// 将 Unix 时间戳（秒）格式化为 YYYY-MM-DD
	function formatDate(ts: number): string {
		const d = new Date(ts * 1000);
		const y = d.getFullYear();
		const mo = String(d.getMonth() + 1).padStart(2, '0');
		const day = String(d.getDate()).padStart(2, '0');
		return `${y}-${mo}-${day}`;
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
			class="my-auto w-full max-w-lg overflow-hidden rounded-3xl border border-surface-container-high bg-surface-lowest shadow-2xl"
			transition:scale={{ duration: 300, start: 0.95, opacity: 0, easing: backOut }}
			onclick={(e) => e.stopPropagation()}
		>
			<!-- 头部区域 — 展示当前订阅等级 -->
			<div class="relative bg-primary p-10 text-center text-white">
				<button
					class="absolute top-4 right-4 cursor-pointer text-white/70 transition-colors hover:text-white"
					onclick={onclose}
				>
					<X size={20} />
				</button>
				<p class="mb-1 text-xs font-bold uppercase tracking-widest text-primary-content/70">
					{m.current_subscription_tier()}
				</p>
				<h2 class="font-display text-3xl font-extrabold tracking-tight">
					{#if loading}
						<span class="loading loading-dots loading-sm"></span>
					{:else}
						{m.tier_display({ tier: currentTier })}
					{/if}
				</h2>
			</div>

			<!-- 订阅记录列表 -->
			<div class="p-6">
				<h3
					class="mb-4 flex items-center gap-2 px-1 text-sm font-bold text-on-surface"
				>
					<History size={18} class="text-primary" />
					{m.recent_subscription_records()}
				</h3>

				{#if loading}
					<div class="flex items-center justify-center py-8">
						<Loader2 size={24} class="animate-spin text-primary" />
					</div>
				{:else if error}
					<div class="rounded-xl bg-error/10 p-4 text-center text-sm text-error">
						{error}
					</div>
				{:else if subscriptions.length === 0}
					<p class="py-4 text-center text-sm text-on-surface-variant">
						{m.no_subscriptions()}
					</p>
				{:else}
					<div class="space-y-3">
						{#each subscriptions as sub}
							<div
								class="flex items-center justify-between rounded-2xl border border-outline-variant/5 bg-surface-container p-4"
							>
								<div class="space-y-1">
									<span class="text-sm font-bold text-on-surface">
										{m.tier_display({ tier: sub.tier })}
									</span>
									<p class="text-xs text-on-surface-variant">
										{formatDate(sub.start_date)} {m.date_range_to()} {formatDate(sub.end_date)}
									</p>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}
