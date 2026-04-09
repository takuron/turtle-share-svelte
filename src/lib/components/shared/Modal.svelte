<script lang="ts">
	/**
	 * Shared modal wrapper with overlay, transitions, and click-outside behavior.
	 * @prop {boolean} open - Controls the modal visibility.
	 * @prop {() => void} [onclose] - Callback to close. If undefined, overlay click is disabled.
	 * @prop {string} [maxWidth] - Tailwind max-width class for the modal panel.
	 * @prop {boolean} [scrollable] - Whether the overlay supports scrolling (adds padding and blur).
	 */
	// // 共享模态框包装器，封装遮罩层、过渡动画和点击外部关闭行为。
	// //
	// // @prop {boolean} open - 控制弹窗可见性。
	// // @prop {() => void} [onclose] - 关闭回调。为 undefined 时禁用遮罩层点击关闭。
	// // @prop {string} [maxWidth] - 模态框面板的 Tailwind 最大宽度类。
	// // @prop {boolean} [scrollable] - 遮罩层是否支持滚动（添加内边距和模糊效果）。
	import { fade, scale } from 'svelte/transition';
	import { quintOut, backOut } from 'svelte/easing';
	import type { Snippet } from 'svelte';

	let {
		open,
		onclose,
		maxWidth = 'max-w-md',
		scrollable = false,
		children
	}: {
		open: boolean;
		onclose?: () => void;
		maxWidth?: string;
		scrollable?: boolean;
		children: Snippet;
	} = $props();
</script>

{#if open}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-[100] flex items-center justify-center bg-black/30
			{scrollable ? 'overflow-y-auto p-4 backdrop-blur-sm' : ''}"
		transition:fade={{ duration: 200, easing: quintOut }}
		onclick={onclose}
	>
		<div
			class="{scrollable ? 'my-auto' : ''} w-full {maxWidth} overflow-hidden rounded-3xl border border-surface-container-high bg-surface-lowest shadow-2xl"
			transition:scale={{ duration: 300, start: 0.95, opacity: 0, easing: backOut }}
			onclick={(e) => e.stopPropagation()}
		>
			{@render children()}
		</div>
	</div>
{/if}
