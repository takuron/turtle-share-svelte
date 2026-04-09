<script lang="ts">
	/**
	 * A generic confirmation modal.
	 * 通用确认模态框。
	 */
	// // 通用确认模态框。
	import * as m from '$lib/paraglide/messages.js';
	import { CircleAlert } from 'lucide-svelte';
	import Modal from '$lib/components/shared/Modal.svelte';

	let {
		open = false,
		title,
		description,
		confirmText = m.confirm(),
		cancelText = m.cancel(),
		danger = false,
		loading = false,
		onclose,
		onconfirm
	} = $props<{
		open: boolean;
		title: string;
		description: string;
		confirmText?: string;
		cancelText?: string;
		danger?: boolean;
		loading?: boolean;
		onclose: () => void;
		onconfirm: () => void;
	}>();
</script>

<Modal open={open} onclose={!loading ? onclose : undefined} maxWidth="max-w-sm">
		<div class="px-8 pt-8 pb-6">
				<div class="mb-4 flex items-center gap-3">
					{#if danger}
						<div
							class="flex h-10 w-10 items-center justify-center rounded-full bg-error/10 text-error"
						>
							<CircleAlert size={24} />
						</div>
					{/if}
					<h2 class="text-xl font-extrabold tracking-tight text-on-surface">
						{title}
					</h2>
				</div>
				<p class="text-sm leading-relaxed font-medium text-on-surface-variant">
					{description}
				</p>
			</div>

			<div class="flex gap-3 px-8 pb-8">
				<button
					type="button"
					class="hover:bg-surface-container-high flex-1 cursor-pointer rounded-full bg-surface-container py-3 font-bold text-on-surface transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
					onclick={onclose}
					disabled={loading}
				>
					{cancelText}
				</button>
				<button
					type="button"
					class="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full py-3 font-bold text-white shadow-lg transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 {danger
						? 'bg-error shadow-error/20 hover:bg-error/90'
						: 'shadow-primary/20 gradient-cta hover:scale-[1.02]'}"
					onclick={onconfirm}
					disabled={loading}
				>
					{#if loading}
						<span class="loading loading-sm loading-spinner"></span>
					{/if}
					{confirmText}
				</button>
			</div>
</Modal>
