<script lang="ts">
	/**
	 * Admin Page Management page.
	 * 管理员页面管理页面，包括公告管理和订阅等级管理。
	 */
	// // 管理员页面管理页面。实现了公告与订阅等级配置的保存与读取逻辑。
	import { onMount } from 'svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { siteStore } from '$lib/stores/site.svelte';
	import { toastStore, addToast } from '$lib/stores/toast.svelte';
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
	// 使用 $state.raw 彻底去掉本地的深层响应式，实现“一次性写入”逻辑
	type TierItem = SubscriptionTier & { _id?: string };
	let tiers = $state.raw<TierItem[]>([]);
	let isLoading = $state(true);
	let isSavingAnnouncement = $state(false);
	let isSavingTierMap = $state<Record<string, boolean>>({});

	// 删除确认模态框状态
	let isDeleteModalOpen = $state(false);
	let tierToDeleteIndex = $state<number | null>(null);

	// 初始化加载数据
	onMount(async () => {
		await loadData();
	});

	// 加载数据：一次性写入所有订阅状态
	async function loadData(silent = false) {
		if (!silent) isLoading = true;
		try {
			const [announcementRes, tiersRes] = await Promise.all([
				fetchAnnouncementRequest(),
				fetchTiersRequest()
			]);

			if (announcementRes.success && announcementRes.data) {
				announcement = announcementRes.data.content || '';
			}

			if (tiersRes.success && tiersRes.data) {
				// 一次性全量覆盖，触发 UI 刷新
				tiers = (tiersRes.data.tiers || []).map((t) => ({
					...t,
					_id: `existing-${t.tier}`
				}));
			}
		} catch (error) {
			console.error('Failed to load page management data:', error);
		} finally {
			if (!silent) isLoading = false;
		}
	}

	// 2. 操作实现
	async function handleUpdateAnnouncement() {
		isSavingAnnouncement = true;
		try {
			const res = await updateAdminAnnouncement(announcement);
			if (res.success) {
				await loadData(true);
				addToast(m.save_success(), 'success');
			} else {
				addToast(m.save_failed(), 'error');
			}
		} catch (e) {
			console.error('Failed to update announcement:', e);
			addToast(m.save_failed(), 'error');
		} finally {
			isSavingAnnouncement = false;
		}
	}

	// 保存单个订阅等级并刷新全量列表
	async function handleSaveTier(tier: TierItem) {
		if (!tier._id) return;

		// 本地验证：1. 至少有一项内容不得为空
		const hasContent =
			(tier.name || '').trim() ||
			(tier.price || '').trim() ||
			(tier.purchase_url || '').trim() ||
			(tier.description || '').trim();
		if (!hasContent) {
			addToast(m.err_validation(), 'error');
			return;
		}

		// 本地验证：2. 等级不可重复
		const isDuplicate = tiers.some((t) => t._id !== tier._id && t.tier === tier.tier);
		if (isDuplicate) {
			addToast(m.err_duplicate_level(), 'error');
			return;
		}

		isSavingTierMap[tier._id] = true;
		try {
			// 过滤掉本地临时字段
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { _id, ...tierData } = tier;
			const res = await updateAdminTierDescription(tierData as SubscriptionTier);

			if (res.success) {
				// 关键：保存成功后，通过刷新全量列表来实现“一次性写入”
				await loadData(true);
				addToast(m.save_success(), 'success');
			} else {
				addToast(m.save_failed(), 'error');
			}
		} catch (e) {
			console.error('Failed to save tier:', e);
			addToast(m.save_failed(), 'error');
		} finally {
			isSavingTierMap[tier._id] = false;
		}
	}

	function handleAddTier() {
		let nextLevel = 0;
		const existingLevels = new Set(tiers.map((t) => t.tier));
		while (existingLevels.has(nextLevel)) {
			nextLevel++;
		}

		// 通过重构数组触发一次性写入
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

	async function handleDeleteTier() {
		if (tierToDeleteIndex === null) return;
		const tier = tiers[tierToDeleteIndex];

		if (tier._id?.startsWith('existing-')) {
			try {
				const res = await deleteAdminTierDescription(tier.tier);
				if (!res.success) {
					addToast(m.save_failed(), 'error');
					return;
				}
			} catch (e) {
				console.error('Failed to delete tier:', e);
				addToast(m.save_failed(), 'error');
				return;
			}
		}

		// 关键：删除成功后全量刷新，不再手动进行本地过滤
		await loadData(true);
		tierToDeleteIndex = null;
		isDeleteModalOpen = false;
		addToast(m.save_success(), 'success');
	}

	// 3. 等级更新与校验（直接操作内存对象，不触发 UI 联动）
	function handleLevelUpdate(tier: TierItem, target: HTMLInputElement) {
		const val = parseInt(target.value, 10);
		if (isNaN(val) || val < 0 || val > 255) {
			target.value = String(tier.tier);
			return;
		}
		const isDuplicate = tiers.some((t) => t._id !== tier._id && t.tier === val);
		if (isDuplicate) {
			addToast(m.err_duplicate_level(), 'error');
			target.value = String(tier.tier);
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

								<!-- 4. 保存当前等级的按钮 -->
								<div class="mt-6 flex justify-end border-t border-outline-variant pt-6">
									<button
										onclick={() => handleSaveTier(tier)}
										disabled={isSavingTierMap[tier._id || '']}
										class="hover:bg-primary-dim flex cursor-pointer items-center justify-center rounded-full bg-primary px-6 py-2 text-sm font-bold text-white transition-all hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-primary/50"
									>
										{#if isSavingTierMap[tier._id || '']}
											<Loader2 size={16} class="mr-2 animate-spin" />
										{/if}
										{m.save_changes()}
									</button>
								</div>
							</div>
						</details>
					{/each}
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
