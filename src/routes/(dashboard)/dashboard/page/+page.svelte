<script lang="ts">
	/**
	 * Admin Page Management page.
	 * 管理员页面管理页面，包括公告管理和订阅等级管理（原型）。
	 */
	// // 管理员页面管理页面。目前只实现了前端UI原型。
	import * as m from '$lib/paraglide/messages.js';
	import { siteStore } from '$lib/stores/site.svelte';
	import { Plus, Trash2, ChevronDown } from 'lucide-svelte';

	// 1. 本地原型数据
	let announcement = $state('');

	let tiers = $state([
		{
			id: 'standard',
			level: 1,
			name: 'Standard',
			price: '$9.99/mo',
			link: 'https://example.com/standard',
			description: 'Standard features for casual readers.'
		},
		{
			id: 'premium',
			level: 2,
			name: 'Premium',
			price: '$19.99/mo',
			link: 'https://example.com/premium',
			description: 'Full access with exclusive content.'
		}
	]);

	// 2. 模拟操作
	function handleUpdateAnnouncement() {
		// // 模拟更新公告
	}

	function handleSaveTiers() {
		// // 模拟保存订阅等级
	}

	function handleAddTier() {
		// 寻找从 0 开始的第一个未使用的等级
		let nextLevel = 0;
		const existingLevels = new Set(tiers.map((t) => t.level));
		while (existingLevels.has(nextLevel)) {
			nextLevel++;
		}

		tiers = [
			...tiers,
			{
				id: `new-${Date.now()}`,
				level: nextLevel,
				name: '',
				price: '$0.00/mo',
				link: 'https://example.com/new',
				description: ''
			}
		];
	}

	function handleDeleteTier(index: number) {
		tiers = tiers.filter((_, i) => i !== index);
	}

	// 3. 等级更新与校验
	function handleLevelUpdate(tier: (typeof tiers)[0], target: HTMLInputElement) {
		const val = parseInt(target.value, 10);
		if (isNaN(val) || val < 0 || val > 255) {
			target.value = String(tier.level); // 不合理等级：还原
			return;
		}
		const isDuplicate = tiers.some((t) => t.id !== tier.id && t.level === val);
		if (isDuplicate) {
			target.value = String(tier.level); // 重复等级：还原
			return;
		}
		tier.level = val;
	}
</script>

<svelte:head>
	<title
		>{m.page_title_with_site({
			title: m.nav_page_management(),
			siteName: siteStore.info.name
		})}</title
	>
</svelte:head>

<div class="space-y-16">
	<!-- 1. Announcement Management -->
	<section class="space-y-6">
		<div class="flex items-center justify-between">
			<h2 class="font-display text-2xl font-bold tracking-tight text-on-surface">
				{m.page_management_title()}
			</h2>
			<button
				onclick={handleUpdateAnnouncement}
				class="hover:bg-primary-dim cursor-pointer rounded-full bg-primary px-6 py-2 font-bold text-white transition-all hover:shadow-lg active:scale-[0.98]"
			>
				{m.update_announcement()}
			</button>
		</div>
		<div class="space-y-4">
			<textarea
				class="w-full rounded-xl border-outline-variant bg-surface-lowest p-4 text-on-surface shadow-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary"
				id="announcement-content"
				placeholder={m.announcement_placeholder()}
				rows="4"
				bind:value={announcement}
			></textarea>
		</div>
	</section>

	<!-- 2. Subscription Level Management -->
	<section class="space-y-6">
		<div class="flex items-center justify-between">
			<h2 class="font-display text-2xl font-bold tracking-tight text-on-surface">
				{m.subscription_level_management()}
			</h2>
			<button
				onclick={handleAddTier}
				class="hover:bg-primary-dim flex cursor-pointer items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all active:scale-[0.98]"
			>
				<Plus size={18} />
				{m.add_new_level()}
			</button>
		</div>

		<div class="space-y-8">
			<div class="space-y-8">
				{#each tiers as tier, index (tier.id)}
					<details
						class="group/level border-surface-container-high overflow-hidden rounded-lg border bg-surface-lowest shadow-sm"
						open={index === 0}
					>
						<summary
							class="hover:bg-surface-container-low flex cursor-pointer items-center justify-between p-4 px-6 transition-colors"
						>
							<div class="flex items-center gap-4">
								<span class="font-bold text-on-surface">
									{tier.name ? `${tier.name}(Tier${tier.level})` : `Tier${tier.level}`}
								</span>
							</div>
							<div class="flex items-center gap-1">
								<button
									class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-on-surface-variant transition-all hover:bg-error/10 hover:text-error"
									title="Delete"
									onclick={(e) => {
										e.preventDefault();
										handleDeleteTier(index);
									}}
								>
									<Trash2 size={20} />
								</button>
								<ChevronDown
									class="ml-2 transition-transform group-open/level:rotate-180"
									size={24}
								/>
							</div>
						</summary>
						<div class="border-surface-container-low border-t bg-surface-low p-6">
							<div class="grid gap-6 sm:grid-cols-2">
								<div class="space-y-4">
									<div>
										<label
											class="text-outline mb-1 block text-xs font-black tracking-widest uppercase"
										>
											{m.col_level()}
										</label>
										<input
											class="w-full rounded-lg border-outline-variant bg-surface-lowest px-4 py-2 transition-colors focus:border-primary focus:ring-primary"
											type="number"
											min="0"
											max="255"
											required
											value={tier.level}
											onblur={(e) => handleLevelUpdate(tier, e.currentTarget)}
											onkeydown={(e) => {
												if (e.key === 'Enter') {
													handleLevelUpdate(tier, e.currentTarget);
													e.currentTarget.blur();
												}
											}}
										/>
									</div>
									<div>
										<label
											class="text-outline mb-1 block text-xs font-black tracking-widest uppercase"
										>
											{m.level_name()}
										</label>
										<input
											class="w-full rounded-lg border-outline-variant bg-surface-lowest px-4 py-2 focus:border-primary focus:ring-primary"
											type="text"
											value={tier.name}
											onblur={(e) => (tier.name = e.currentTarget.value)}
											onkeydown={(e) => {
												if (e.key === 'Enter') {
													tier.name = e.currentTarget.value;
													e.currentTarget.blur();
												}
											}}
										/>
									</div>
									<div>
										<label
											class="text-outline mb-1 block text-xs font-black tracking-widest uppercase"
										>
											{m.price()}
										</label>
										<input
											class="w-full rounded-lg border-outline-variant bg-surface-lowest px-4 py-2 focus:border-primary focus:ring-primary"
											type="text"
											bind:value={tier.price}
										/>
									</div>
									<div>
										<label
											class="text-outline mb-1 block text-xs font-black tracking-widest uppercase"
										>
											{m.access_link()}
										</label>
										<input
											class="w-full rounded-lg border-outline-variant bg-surface-lowest px-4 py-2 focus:border-primary focus:ring-primary"
											type="url"
											bind:value={tier.link}
										/>
									</div>
								</div>
								<div class="flex h-full flex-col">
									<label
										class="text-outline mb-1 block text-xs font-black tracking-widest uppercase"
									>
										{m.description()}
									</label>
									<textarea
										class="w-full flex-1 resize-none rounded-lg border-outline-variant bg-surface-lowest px-4 py-2 focus:border-primary focus:ring-primary"
										bind:value={tier.description}
									></textarea>
								</div>
							</div>
						</div>
					</details>
				{/each}
			</div>

			<div class="flex justify-end pt-6">
				<button
					onclick={handleSaveTiers}
					class="hover:bg-primary-dim flex cursor-pointer items-center justify-center rounded-full bg-primary px-8 py-3 font-bold text-white transition-all hover:shadow-lg active:scale-[0.98]"
				>
					{m.save_all_changes()}
				</button>
			</div>
		</div>
	</section>
</div>
