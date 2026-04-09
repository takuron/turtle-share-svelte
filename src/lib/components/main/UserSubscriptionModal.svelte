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
	import { X, History } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';

	let { open = false, onclose } = $props<{
		open: boolean;
		onclose: () => void;
	}>();

	// 模拟订阅记录数据（后续接入真实 API）
	const mockSubscriptions = [
		{ tier: 5, startDate: '2024-03-15', endDate: '2024-04-15' },
		{ tier: 5, startDate: '2024-02-15', endDate: '2024-03-15' },
		{ tier: 3, startDate: '2024-01-15', endDate: '2024-02-15' },
		{ tier: 3, startDate: '2023-12-15', endDate: '2024-01-15' },
		{ tier: 1, startDate: '2023-11-15', endDate: '2023-12-15' }
	];

	// 当前订阅等级取最新一条记录
	const currentTier = mockSubscriptions[0]?.tier ?? 0;
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
					Tier {currentTier}
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

				{#if mockSubscriptions.length === 0}
					<p class="py-4 text-center text-sm text-on-surface-variant">
						{m.no_subscriptions()}
					</p>
				{:else}
					<div class="space-y-3">
						{#each mockSubscriptions as sub}
							<div
								class="flex items-center justify-between rounded-2xl border border-outline-variant/5 bg-surface-container-low p-4"
							>
								<div class="space-y-1">
									<span class="text-sm font-bold text-on-surface">
										Level {sub.tier}
									</span>
									<p class="text-xs text-on-surface-variant">
										{sub.startDate} {m.date_range_to()} {sub.endDate}
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
