<script lang="ts">
	/**
	 * Admin Page Management page.
	 * 管理员页面管理页面，包括公告管理和订阅等级管理。
	 */
	// // 管理员页面管理页面。实现了公告与订阅等级配置的保存与读取逻辑。
	import { onMount } from 'svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { siteStore } from '$lib/stores/site.svelte';
	import { Plus, Trash2, ChevronDown, Loader2 } from 'lucide-svelte';
	import { fetchAnnouncementRequest, fetchTiersRequest } from '$lib/api/public/site';
	import {
		updateAdminAnnouncement,
		updateAdminTierDescription,
		deleteAdminTierDescription
	} from '$lib/api/admin/page';
	import type { SubscriptionTier } from '$lib/api/types';
	import ConfirmModal from '$lib/components/admin/ConfirmModal.svelte';

	// 1. 状态管理
	let announcement = $state('');
	// 为 tier 添加一个临时的 id 用于 UI 渲染 key
	type TierItem = SubscriptionTier & { _id?: string };
	let tiers = $state<TierItem[]>([]);
	let isLoading = $state(true);
	let isSavingAnnouncement = $state(false);
	let isSavingTiers = $state(false);

	// 删除确认模态框状态
	let isDeleteModalOpen = $state(false);
	let tierToDeleteIndex = $state<number | null>(null);

	// 初始化加载数据
	onMount(async () => {
		await loadData();
	});

	async function loadData() {
		isLoading = true;
		try {
			const [announcementRes, tiersRes] = await Promise.all([
				fetchAnnouncementRequest(),
				fetchTiersRequest()
			]);

			if (announcementRes.success && announcementRes.data) {
				announcement = announcementRes.data.content || '';
			} else {
				announcement = '';
			}

			if (tiersRes.success && tiersRes.data) {
				tiers = (tiersRes.data.tiers || []).map((t) => ({ ...t, _id: `existing-${t.tier}` }));
			}
		} catch (error) {
			console.error('Failed to load page management data:', error);
		} finally {
			isLoading = false;
		}
	}

	// 2. 操作实现
	async function handleUpdateAnnouncement() {
		isSavingAnnouncement = true;
		try {
			await updateAdminAnnouncement(announcement);
			await loadData();
		} catch (e) {
			console.error('Failed to update announcement:', e);
		} finally {
			isSavingAnnouncement = false;
		}
	}

	async function handleSaveTiers() {
		isSavingTiers = true;
		try {
			// 1. 获取最新的云端数据进行比较
			const tiersRes = await fetchTiersRequest();
			const cloudTiers = tiersRes.success && tiersRes.data ? tiersRes.data.tiers || [] : [];
			const cloudTiersMap = new Map(cloudTiers.map((t) => [t.tier, t]));

			const localLevels = new Set(tiers.map((t) => t.tier));
			const promises: Promise<any>[] = [];

			// 2. 删除云端有但本地没有的等级
			for (const ct of cloudTiers) {
				if (!localLevels.has(ct.tier)) {
					promises.push(deleteAdminTierDescription(ct.tier).catch(console.error));
				}
			}

			// 3. 更新或新增云端没有或有差异的等级
			for (const lt of tiers) {
				const ct = cloudTiersMap.get(lt.tier);
				const isChanged =
					!ct ||
					ct.name !== lt.name ||
					ct.price !== lt.price ||
					ct.purchase_url !== lt.purchase_url ||
					ct.description !== lt.description;

				if (isChanged) {
					// 过滤掉本地的临时 _id 字段
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					const { _id, ...tierData } = lt;
					promises.push(
						updateAdminTierDescription(tierData as SubscriptionTier).catch(console.error)
					);
				}
			}

			// 等待所有差异提交完成
			await Promise.all(promises);

			// 同步最新的云端状态到本地
			await loadData();
		} catch (e) {
			console.error('Failed to save tiers:', e);
		} finally {
			isSavingTiers = false;
		}
	}

	function handleAddTier() {
		// 寻找从 0 开始的第一个未使用的等级
		let nextLevel = 0;
		const existingLevels = new Set(tiers.map((t) => t.tier));
		while (existingLevels.has(nextLevel)) {
			nextLevel++;
		}

		tiers = [
			...tiers,
			{
				_id: `new-${Date.now()}`,
				tier: nextLevel,
				name: '',
				price: '',
				purchase_url: '',
				description: ''
			}
		];
	}

	function confirmDeleteTier(index: number) {
		tierToDeleteIndex = index;
		isDeleteModalOpen = true;
	}

	function handleDeleteTier() {
		if (tierToDeleteIndex === null) return;
		tiers = tiers.filter((_, i) => i !== tierToDeleteIndex);
		tierToDeleteIndex = null;
		isDeleteModalOpen = false;
	}

	// 3. 等级更新与校验
	function handleLevelUpdate(tier: TierItem, target: HTMLInputElement) {
		const val = parseInt(target.value, 10);
		if (isNaN(val) || val < 0 || val > 255) {
			target.value = String(tier.tier); // 不合理等级：还原
			return;
		}
		const isDuplicate = tiers.some((t) => t._id !== tier._id && t.tier === val);
		if (isDuplicate) {
			target.value = String(tier.tier); // 重复等级：还原
			return;
		}
		tier.tier = val;
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

{#if isLoading}
	<div class="flex items-center justify-center py-20">
		<Loader2 size={24} class="animate-spin text-primary" />
		<span class="ml-3 text-sm text-on-surface-variant">{m.loading_articles()}</span>
	</div>
{:else}
	<div class="space-y-16">
		<!-- 1. Announcement Management -->
		<section class="space-y-6">
			<div class="flex items-center justify-between">
				<h2 class="font-display text-2xl font-bold tracking-tight text-on-surface">
					{m.page_management_title()}
				</h2>
				<button
					onclick={handleUpdateAnnouncement}
					disabled={isSavingAnnouncement}
					class="hover:bg-primary-dim flex cursor-pointer items-center justify-center rounded-full bg-primary px-6 py-2 font-bold text-white transition-all hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-primary/50"
				>
					{#if isSavingAnnouncement}
						<Loader2 size={18} class="mr-2 animate-spin" />
					{/if}
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
					{#each tiers as tier, index (tier._id)}
						<details
							class="group/level border-surface-container-high overflow-hidden rounded-lg border bg-surface-lowest shadow-sm"
							open={index === 0}
						>
							<summary
								class="hover:bg-surface-container-low flex cursor-pointer items-center justify-between p-4 px-6 transition-colors"
							>
								<div class="flex items-center gap-4">
									<span class="font-bold text-on-surface">
										{tier.name ? `${tier.name}(Tier${tier.tier})` : `Tier${tier.tier}`}
									</span>
								</div>
								<div class="flex items-center gap-1">
									<button
										class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-on-surface-variant transition-all hover:bg-error/10 hover:text-error"
										title="Delete"
										onclick={(e) => {
											e.preventDefault();
											confirmDeleteTier(index);
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
												value={tier.tier}
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
												bind:value={tier.purchase_url}
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
						disabled={isSavingTiers}
						class="hover:bg-primary-dim flex cursor-pointer items-center justify-center rounded-full bg-primary px-8 py-3 font-bold text-white transition-all hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-primary/50"
					>
						{#if isSavingTiers}
							<Loader2 size={18} class="mr-2 animate-spin" />
						{/if}
						{m.save_all_changes()}
					</button>
				</div>
			</div>
		</section>
	</div>
{/if}

<ConfirmModal
	open={isDeleteModalOpen}
	title={m.delete()}
	description={m.confirm_delete_subscription_desc()}
	confirmText={m.delete()}
	cancelText={m.cancel()}
	danger={true}
	onclose={() => (isDeleteModalOpen = false)}
	onconfirm={handleDeleteTier}
/>
