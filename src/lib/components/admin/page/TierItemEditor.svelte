<script lang="ts">
	/**
	 * Single subscription tier editor for admin.
	 * 管理员单个订阅等级编辑组件。
	 *
	 * @prop {import('$lib/api/types').SubscriptionTier} tier - The tier data.
	 * @prop {boolean} isOpen - Whether the details panel is open.
	 * @prop {boolean} isSaving - Whether the tier is currently being saved.
	 * @prop {(tier: any, target: HTMLInputElement) => void} onlevelupdate - Callback for tier level change.
	 * @prop {() => void} ondelete - Callback to delete the tier.
	 * @prop {(tier: any) => void} onsave - Callback to save the tier.
	 */
	// // 管理员单个订阅等级编辑组件。
	// //
	// // @prop {SubscriptionTier} tier - 订阅等级数据。
	// // @prop {boolean} isOpen - 详情面板是否展开。
	// // @prop {boolean} isSaving - 是否正在保存。
	// // @prop {(tier: any, target: HTMLInputElement) => void} onlevelupdate - 修改等级号的回调。
	// // @prop {() => void} ondelete - 删除等级的回调。
	// // @prop {(tier: any) => void} onsave - 保存等级的回调。
	import * as m from '$lib/paraglide/messages.js';
	import { Trash2, ChevronDown, Loader2 } from 'lucide-svelte';
	import type { SubscriptionTier } from '$lib/api/types';

	let {
		tier = $bindable(),
		isOpen = false,
		isSaving = false,
		onlevelupdate,
		ondelete,
		onsave
	}: {
		tier: SubscriptionTier;
		isOpen?: boolean;
		isSaving?: boolean;
		onlevelupdate: (tier: any, target: HTMLInputElement) => void;
		ondelete: () => void;
		onsave: (tier: any) => void;
	} = $props();
</script>

<details
	class="group/level border-surface-container-high overflow-hidden rounded-lg border bg-surface-lowest shadow-sm"
	open={isOpen}
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
					ondelete();
				}}
			>
				<Trash2 size={20} />
			</button>
			<ChevronDown class="ml-2 transition-transform group-open/level:rotate-180" size={24} />
		</div>
	</summary>
	<div class="border-surface-container-low border-t bg-surface-low p-6">
		<div class="grid gap-6 sm:grid-cols-2">
			<div class="space-y-4">
				<div>
					<label class="text-outline mb-1 block text-xs font-black tracking-widest uppercase">
						{m.col_level()}
					</label>
					<input
						class="w-full rounded-lg border-outline-variant bg-surface-lowest px-4 py-2 transition-colors focus:border-primary focus:ring-primary"
						type="number"
						min="0"
						max="255"
						required
						value={tier.tier}
						onblur={(e) => onlevelupdate(tier, e.currentTarget)}
						onkeydown={(e) => {
							if (e.key === 'Enter') {
								onlevelupdate(tier, e.currentTarget);
								e.currentTarget.blur();
							}
						}}
					/>
				</div>
				<div>
					<label class="text-outline mb-1 block text-xs font-black tracking-widest uppercase">
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
					<label class="text-outline mb-1 block text-xs font-black tracking-widest uppercase">
						{m.price()}
					</label>
					<input
						class="w-full rounded-lg border-outline-variant bg-surface-lowest px-4 py-2 focus:border-primary focus:ring-primary"
						type="text"
						bind:value={tier.price}
					/>
				</div>
				<div>
					<label class="text-outline mb-1 block text-xs font-black tracking-widest uppercase">
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
				<label class="text-outline mb-1 block text-xs font-black tracking-widest uppercase">
					{m.description()}
				</label>
				<textarea
					class="w-full flex-1 resize-none rounded-lg border-outline-variant bg-surface-lowest px-4 py-2 focus:border-primary focus:ring-primary"
					bind:value={tier.description}
				></textarea>
			</div>
		</div>

		<!-- 保存当前等级的按钮 -->
		<div class="mt-6 flex justify-end border-t border-outline-variant pt-6">
			<button
				onclick={() => onsave(tier)}
				disabled={isSaving}
				class="hover:bg-primary-dim flex cursor-pointer items-center justify-center rounded-full bg-primary px-6 py-2 text-sm font-bold text-white transition-all hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-primary/50"
			>
				{#if isSaving}
					<Loader2 size={16} class="mr-2 animate-spin" />
				{/if}
				{m.save_changes()}
			</button>
		</div>
	</div>
</details>
