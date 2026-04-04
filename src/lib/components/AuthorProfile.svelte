<script lang="ts">
	/**
	 * Author profile header — magazine cover style (DESIGN.md §5).
	 * All data is read from siteStore.info (name, avatar, bio, social_links).
	 */
	// // 作者资料头部 — 杂志封面风格 (DESIGN.md §5)。
	// // 所有数据均从 siteStore.info 读取（作者名、头像、简介、社交链接）。
	import { siteStore } from '$lib/stores/site.svelte';
	import { socialPlatforms, type SocialLink } from '$lib/config/socialIcons.svelte';
	import { Globe } from 'lucide-svelte';

	// 1. 从全局站点信息中派生各字段。
	const author = $derived(siteStore.info.author);
	const avatar = $derived(siteStore.info.avatar);
	const bio = $derived(siteStore.info.bio);
	const socialLinks: SocialLink[] = $derived(siteStore.info.social_links ?? []);
</script>

<!-- 作者资料卡 — surface_container_lowest 背景，最高层级 -->
<section class="mb-12 bg-surface-lowest p-6 rounded-2xl shadow-editorial-sm">
	<div class="flex items-center gap-6">
		<!-- 头像 — 有 URL 时显示图片，否则显示占位色块 -->
		{#if avatar}
			<img
				src={avatar}
				alt={author}
				class="w-20 h-20 rounded-2xl object-cover shadow-inner shrink-0"
			/>
		{:else}
			<div class="w-20 h-20 rounded-2xl bg-base-300 shrink-0"></div>
		{/if}

		<div class="flex-1 min-w-0">
			<!-- 作者名 -->
			<h1 class="font-display text-2xl font-extrabold tracking-tight text-on-surface">
				{author}
			</h1>

			<!-- 简介 -->
			{#if bio}
				<p class="text-on-surface-variant text-sm leading-relaxed mb-3">{bio}</p>
			{/if}

			<!-- 社交链接 — 由 siteinfo 配置驱动 -->
			{#if socialLinks.length > 0}
				<div class="flex flex-wrap gap-3 mt-2">
					{#each socialLinks as link}
						{@const platform = socialPlatforms[link.platform]}
						<a
							href={link.url}
							target="_blank"
							rel="noopener noreferrer"
							title={platform?.label ?? link.platform}
							class="w-8 h-8 flex items-center justify-center rounded-full bg-base-200 text-on-surface-variant
								hover:bg-primary/10 hover:text-primary transition-colors"
						>
							{#if platform}
								<platform.icon size={16} />
							{:else}
								<Globe size={16} />
							{/if}
						</a>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</section>
