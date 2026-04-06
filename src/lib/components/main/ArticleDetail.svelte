<script lang="ts">
	import { API_URL } from '$lib/config';
	import { Download } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';
	import type { ArticleDetail } from '$lib/api/types';
	import { parseMarkdown } from '$lib/utils/markdown';

	/**
	 * Article detail component to display the content of a post.
	 * @prop {ArticleDetail | null} article - The article data.
	 */
	// // 文章详情组件，用于展示文章内容。
	// // @prop {ArticleDetail | null} article - 文章数据。
	let { article }: { article: ArticleDetail | null } = $props();

	// 根据文章数据动态拼接封面 URL
	const coverUrl = $derived(article?.cover_image ? `${API_URL}${article.cover_image}` : null);

	// 解析 Markdown 内容为安全的 HTML
	const htmlContent = $derived(parseMarkdown(article?.content));
</script>

<article class="bg-surface-container-lowest mb-12 overflow-hidden rounded-3xl shadow-lg">
	<!-- 封面图区域，保持 5:3 比例锁定 -->
	<div class="bg-surface-container-high/50 relative aspect-[5/3] w-full">
		{#if coverUrl}
			<img
				src={coverUrl}
				alt={article?.title}
				class="absolute inset-0 h-full w-full object-cover"
			/>
		{/if}
		<div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
	</div>

	<div class="space-y-8 p-8 md:p-12">
		<!-- 标题 -->
		<h1 class="text-4xl leading-tight font-extrabold tracking-tight text-on-surface md:text-5xl">
			{article?.title}
		</h1>

		<!-- 文章内容 -->
		<div class="prose max-w-none text-lg leading-loose text-on-surface">
			{@html htmlContent}
		</div>

		<!-- 附件下载区 -->
		{#if article?.file_links && article.file_links.length > 0}
			<section class="border-surface-container-low mt-16 border-t-2 pt-10">
				<div class="grid gap-4">
					{#each article.file_links as file}
						<div
							class="bg-surface-container-low flex flex-col items-start justify-between gap-4 rounded-xl border border-outline-variant/20 p-4 transition-colors hover:border-primary/30 sm:flex-row sm:items-center"
						>
							<div class="flex items-center gap-4">
								<div>
									<p class="font-bold text-on-surface">{file.name}</p>
								</div>
							</div>
							<a
								href={file.url}
								target="_blank"
								rel="noopener noreferrer"
								class="hover:bg-primary-dim flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-bold text-white shadow-sm transition-all sm:w-auto"
							>
								<Download size={16} />
								{m.download()}
							</a>
						</div>
					{/each}
				</div>
			</section>
		{/if}
	</div>
</article>
