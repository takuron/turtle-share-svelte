<script lang="ts">
	/**
	 * Post card for the vertical feed. Supports readable and locked states.
	 * @prop {'readable' | 'locked'} variant - Card access state.
	 */
	// // 垂直信息流中的帖子卡片。支持可读和锁定两种状态。
	// // @prop {'readable' | 'locked'} variant - 卡片的访问状态。
	import { Lock } from 'lucide-svelte';

	let { variant = 'readable' }: { variant?: 'readable' | 'locked' } = $props();

	// 1. 锁定状态下降低整体不透明度和图片灰度。
	const isLocked = $derived(variant === 'locked');
</script>

<!-- 帖子卡片 — DESIGN.md §5: border-radius xl, 无分割线, hover 提升 -->
<article
	class="bg-surface-lowest rounded-xl shadow-editorial-sm overflow-hidden transition-all hover:-translate-y-0.5
		hover:shadow-ambient duration-300"
	class:opacity-90={isLocked}
>
	<!-- 封面图占位 -->
	<div class="relative h-96 bg-base-300" class:grayscale-[20%]={isLocked}>
		<!-- TODO: 接入 cover_image -->
		<div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
	</div>

	<div class="p-6">
		<!-- 标题占位 -->
		<h2 class="font-display text-xl font-bold text-on-surface mb-4">
			<!-- TODO: 接入 article.title -->
			{isLocked ? 'Locked Post Title Placeholder' : 'Readable Post Title Placeholder'}
		</h2>

		<!-- 底部操作栏 — 使用 surface-low 色调分割，非 border -->
		<div class="flex items-center justify-end pt-6 border-t border-base-200/50">
			{#if isLocked}
				<!-- 锁定状态标签 -->
				<div class="flex items-center gap-2 text-on-surface-variant bg-base-200 px-4 py-2 rounded-full">
					<Lock size={14} />
					<span class="font-bold text-xs">需要等级 5 才能解锁</span>
				</div>
			{:else}
				<!-- 可读状态 CTA -->
				<button class="btn btn-primary btn-sm">阅读详情</button>
			{/if}
		</div>
	</div>
</article>
