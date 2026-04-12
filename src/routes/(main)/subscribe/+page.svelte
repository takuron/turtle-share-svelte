<script lang="ts">
	/**
	 * Subscription page.
	 * Displays available subscription tiers for users fetched from the backend.
	 * Redirects to home page if there are no tiers available.
	 */
	// // 订阅方案页面。展示可供用户选择的订阅方案和等级。从后端接口预取数据。
	import { ArrowLeft, Loader2 } from 'lucide-svelte';
	import { tiersStore } from '$lib/stores/tiers.svelte';
	import { goto } from '$app/navigation';
	import * as m from '$lib/paraglide/messages.js';

	// 如果加载完成且数据为空，则自动重定向回主页
	$effect(() => {
		if (!tiersStore.loading && tiersStore.tiers.length === 0) {
			goto('/');
		}
	});
</script>

<svelte:head>
	<title>{m.subscribe()} - TurtleShare</title>
</svelte:head>

<div class="mx-auto max-w-4xl px-4 pt-32 pb-12">
	<div id="tiers" class="mb-10 text-center">
		<h2 class="mb-3 font-display text-4xl font-black tracking-tight text-on-surface">
			{m.subscribe()}
		</h2>
	</div>

	{#if tiersStore.loading}
		<!-- 加载状态 -->
		<div class="flex h-40 items-center justify-center">
			<Loader2 class="h-8 w-8 animate-spin text-primary" />
		</div>
	{:else if tiersStore.tiers.length > 0}
		<!-- 方案列表 -->
		<div class="mb-16 space-y-6">
			{#each tiersStore.tiers as tier}
				<div
					class="flex flex-col items-center gap-8 rounded-2xl border border-outline-variant/10 bg-surface-lowest p-8 shadow-editorial-sm transition-all duration-300 hover:scale-[1.01] hover:shadow-ambient md:flex-row"
				>
					<div class="flex-[1.5] text-center md:text-left">
						<div class="mb-3 flex flex-col items-center gap-2 md:flex-row">
							<h3 class="font-display text-2xl font-extrabold text-on-surface">
								{tier.name} <span class="text-lg font-bold text-primary">(Tier {tier.tier})</span>
							</h3>
						</div>
						{#if tier.description}
							<p class="max-w-2xl text-base leading-relaxed text-on-surface-variant">
								{tier.description}
							</p>
						{/if}
					</div>
					{#if tier.price || tier.purchase_url}
						<div
							class="flex min-w-[200px] flex-col items-center gap-4 border-l-0 border-outline-variant/10 md:items-end md:border-l md:pl-8"
						>
							{#if tier.price}
								<div class="text-center md:text-right">
									<span class="font-display text-4xl font-black text-on-surface">{tier.price}</span>
								</div>
							{/if}
							{#if tier.purchase_url}
								<a
									href={tier.purchase_url}
									target="_blank"
									rel="noopener noreferrer"
									class="btn w-full rounded-full font-bold shadow-lg shadow-primary/20 btn-primary"
								>
									{m.subscribe()}
								</a>
							{/if}
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}

	<div class="mb-12 text-center">
		<a
			href="/"
			class="flex items-center justify-center gap-1 text-sm font-bold text-primary hover:underline"
		>
			<ArrowLeft size={16} />
			{m.nav_return_home()}
		</a>
	</div>
</div>
