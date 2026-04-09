<script lang="ts">
	/**
	 * Post card for the vertical feed. Displays article data with readable/locked states.
	 * @prop {string} title - Article title.
	 * @prop {string} hashId - Article hash ID for linking.
	 * @prop {string | null} coverImage - Cover image URL (absolute or relative).
	 * @prop {number} requiredTier - Minimum tier to access full content.
	 * @prop {boolean} accessible - Whether current user can access full content.
	 * @prop {number} publishAt - Unix timestamp of article publish.
	 */
	// // 垂直信息流中的帖子卡片。展示文章数据，支持可读和锁定两种状态。
	// // @prop {string} title - 文章标题。
	// // @prop {string} hashId - 文章哈希 ID，用于链接。
	// // @prop {string | null} coverImage - 封面图片链接（绝对或相对路径）。
	// // @prop {number} requiredTier - 完整访问所需的最低等级。
	// // @prop {boolean} accessible - 当前用户是否可以访问完整内容。
	// // @prop {number} publishAt - 文章发布时间的 Unix 时间戳。
	import { Lock } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';

	let {
		title,
		hashId,
		coverImage = null,
		requiredTier = 0,
		accessible = true,
		publishAt
	}: {
		title: string;
		hashId: string;
		coverImage?: string | null;
		requiredTier?: number;
		accessible?: boolean;
		publishAt: number;
	} = $props();

	// 1. 根据 accessible 字段判断是否锁定。
	const isLocked = $derived(!accessible);

	// 2. 格式化发布日期。
	const formattedDate = $derived(
		new Date(publishAt * 1000).toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		})
	);

	// 3. 封面图片 URL，直接使用传入的链接。
	const coverUrl = $derived(
		coverImage && coverImage.trim() !== '' ? coverImage : null
	);
</script>

<!-- 帖子卡片 — DESIGN.md §5: border-radius xl, 无分割线, hover 提升 -->
<article
	class="overflow-hidden rounded-xl bg-surface-lowest shadow-editorial-sm transition-all duration-300
		hover:-translate-y-0.5 hover:shadow-ambient"
	class:opacity-90={isLocked}
>
	<!-- 封面图区域 -->
	{#if coverUrl}
		<div class="relative aspect-[5/3] w-full bg-base-300" class:grayscale-[20%]={isLocked}>
			<img src={coverUrl} alt={title} class="absolute inset-0 h-full w-full object-cover" />
			<div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
		</div>
	{/if}

	<div class="p-6">
		<!-- 日期 -->
		<time class="text-xs font-medium text-on-surface-variant">{formattedDate}</time>

		<!-- 标题 -->
		<h2 class="mt-1 mb-4 font-display text-xl font-bold text-on-surface">
			{title}
		</h2>

		<!-- 底部操作栏 — 使用 surface-low 色调分割，非 border -->
		<div class="flex items-center justify-end border-t border-base-200/50 pt-6">
			{#if isLocked}
				<!-- 锁定状态标签 -->
				<div
					class="flex items-center gap-2 rounded-full bg-base-200 px-4 py-2 text-on-surface-variant"
				>
					<Lock size={14} />
					<span class="text-xs font-bold">{m.requires_tier({ tier: requiredTier })}</span>
				</div>
			{:else}
				<!-- 可读状态 CTA -->
				<a href="/article/{hashId}" class="btn rounded-full btn-sm btn-primary">
					{m.read_more()}
				</a>
			{/if}
		</div>
	</div>
</article>
