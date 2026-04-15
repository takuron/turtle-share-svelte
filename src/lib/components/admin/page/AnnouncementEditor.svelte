<script lang="ts">
	/**
	 * Announcement management component for admin.
	 * 管理员公告管理组件。
	 *
	 * @prop {string} announcement - The announcement content.
	 * @prop {boolean} isSaving - Whether the content is currently being saved.
	 * @prop {() => void} onupdate - Callback to save the announcement.
	 */
	// // 管理员公告管理组件。
	// //
	// // @prop {string} announcement - 公告内容。
	// // @prop {boolean} isSaving - 是否正在保存。
	// // @prop {() => void} onupdate - 保存公告的回调。
	import * as m from '$lib/paraglide/messages.js';
	import { Loader2 } from 'lucide-svelte';

	let {
		announcement = $bindable(),
		isSaving = false,
		onupdate
	}: {
		announcement: string;
		isSaving?: boolean;
		onupdate: () => void;
	} = $props();
</script>

<section class="space-y-6">
	<div class="flex items-center justify-between">
		<h2 class="font-display text-2xl font-bold tracking-tight text-on-surface">
			{m.page_management_title()}
		</h2>
		<button
			onclick={onupdate}
			disabled={isSaving}
			class="hover:bg-primary-dim flex cursor-pointer items-center justify-center rounded-full bg-primary px-6 py-2 font-bold text-white transition-all hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-primary/50"
		>
			{#if isSaving}
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
