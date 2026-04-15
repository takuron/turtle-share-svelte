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
	import { Plus, Loader2 } from 'lucide-svelte';
	import { fetchAnnouncementRequest, fetchTiersRequest } from '$lib/api/public/site';
	import {
		updateAdminAnnouncement,
		updateAdminTierDescription,
		deleteAdminTierDescription
	} from '$lib/api/admin/page';
	import type { SubscriptionTier } from '$lib/api/types';
	import ConfirmModal from '$lib/components/admin/shared/ConfirmModal.svelte';
	import AnnouncementEditor from '$lib/components/admin/page/AnnouncementEditor.svelte';
	import TierItemEditor from '$lib/components/admin/page/TierItemEditor.svelte';

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
		<!-- 1. 公告管理 -->
		<AnnouncementEditor
			bind:announcement
			isSaving={isSavingAnnouncement}
			onupdate={handleUpdateAnnouncement}
		/>

		<!-- 2. 订阅等级管理 -->
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
						<TierItemEditor
							bind:tier={tiers[index]}
							isOpen={index === 0}
							isSaving={isSavingTierMap[tier._id || '']}
							onlevelupdate={handleLevelUpdate}
							ondelete={() => confirmDeleteTier(index)}
							onsave={handleSaveTier}
						/>
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
