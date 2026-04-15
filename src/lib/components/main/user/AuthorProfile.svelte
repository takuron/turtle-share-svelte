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

	// 2. 校验 URL 协议，仅允许安全协议，防止 javascript: 等 XSS 注入。
	function isSafeUrl(url: string): boolean {
		try {
			const u = new URL(url);
			return ['http:', 'https:', 'mailto:'].includes(u.protocol);
		} catch {
			return false;
		}
	}
</script>

<!-- 作者资料卡 — surface_container_lowest 背景，最高层级 -->
<section class="mb-12 rounded-2xl bg-surface-lowest p-6 shadow-editorial-sm">
	<div class="flex items-center gap-6">
		<!-- 头像 — 有 URL 时显示图片，否则显示占位色块 -->
		{#if avatar}
			<img
				src={avatar}
				alt={author}
				class="h-20 w-20 shrink-0 rounded-2xl object-cover shadow-inner"
			/>
		{:else}
			<div class="h-20 w-20 shrink-0 rounded-2xl bg-base-300"></div>
		{/if}

		<div class="min-w-0 flex-1">
			<!-- 作者名 -->
			<h1 class="font-display text-2xl font-extrabold tracking-tight text-on-surface">
				{author}
			</h1>

			<!-- 简介 -->
			{#if bio}
				<p class="mb-3 text-sm leading-relaxed text-on-surface-variant">{bio}</p>
			{/if}

			<!-- 社交链接 — 由 siteinfo 配置驱动 -->
			{#if socialLinks.length > 0}
				<div class="mt-2 flex flex-wrap gap-3">
					{#each socialLinks as link}
						{@const platform = socialPlatforms[link.platform]}
						{#if isSafeUrl(link.url)}
							<a
								href={link.url}
								target="_blank"
								rel="noopener noreferrer"
								title={platform?.label ?? link.platform}
								class="flex h-8 w-8 items-center justify-center rounded-full bg-base-200 text-on-surface-variant
									transition-colors hover:bg-primary/10 hover:text-primary"
							>
								{#if platform}
									<platform.icon size={16} />
								{:else}
									<Globe size={16} />
								{/if}
							</a>
						{/if}
					{/each}
				</div>
			{/if}
		</div>
	</div>
</section>
