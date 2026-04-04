<script lang="ts">
	/**
	 * Author profile header — magazine cover style (DESIGN.md §5).
	 * Placeholder: all content is static until wired to API.
	 */
	// // 作者资料头部 — 杂志封面风格 (DESIGN.md §5)。
	// // 占位组件：内容暂为静态，等待后续接入 API。
	import { Globe, Terminal, Briefcase } from 'lucide-svelte';
</script>

<!-- 作者资料卡 — surface_container_lowest 背景，最高层级 -->
<section class="mb-12 bg-surface-lowest p-6 rounded-2xl shadow-editorial-sm">
	<div class="flex items-center gap-6">
		<!-- 头像占位 -->
		<div class="w-20 h-20 rounded-2xl bg-base-300 shrink-0"></div>

		<div class="flex-1 min-w-0">
			<!-- 名称 + 简介 -->
			<h1 class="font-display text-2xl font-extrabold tracking-tight text-on-surface">
				<!-- TODO: 接入 siteStore.info.author -->
				Author Name
			</h1>
			<p class="text-on-surface-variant text-sm leading-relaxed mb-3">
				<!-- TODO: 接入作者简介 -->
				This is a placeholder bio for the site author.
			</p>

			<!-- 社交链接占位 -->
			<div class="flex gap-4 mt-2">
				{#each [Globe, Terminal, Briefcase] as Icon}
					<span
						class="w-8 h-8 flex items-center justify-center rounded-full bg-base-200 text-on-surface-variant
							hover:bg-primary/10 hover:text-primary transition-colors"
					>
						<Icon size={16} />
					</span>
				{/each}
			</div>
		</div>
	</div>
</section>
