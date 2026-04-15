<script lang="ts">
	/**
	 * Single article row in admin article list.
	 *
	 * @prop {any} article - The article item (mock data for now).
	 * @prop {() => void} onedit - Callback when edit is clicked.
	 * @prop {() => void} ondelete - Callback when delete is clicked.
	 */
	// // 管理员文章列表中的单行文章组件。
	// //
	// // @prop {any} article - 文章数据对象（当前为 mock 数据）。
	// // @prop {() => void} onedit - 点击编辑的回调。
	// // @prop {() => void} ondelete - 点击删除的回调。

	import { Edit, Trash2 } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';

	let {
		article,
		onedit,
		ondelete
	}: {
		article: any;
		onedit: () => void;
		ondelete: () => void;
	} = $props();
</script>

<div
	class="hover:bg-surface-container-low/30 group grid grid-cols-12 items-center border-b border-surface-container bg-transparent px-6 py-6 transition-colors last:border-b-0"
>
	<div class="col-span-6 flex items-center">
		<p class="truncate text-lg leading-tight font-bold text-on-surface">{article.title}</p>
	</div>
	<div class="col-span-2">
		<p class="text-sm font-semibold text-on-surface">{article.date}</p>
	</div>
	<div class="col-span-3 flex flex-wrap items-center gap-2">
		{#each article.requirements as req}
			<span
				class="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold {req.className}"
			>
				{req.text}
			</span>
		{/each}
	</div>
	<div class="col-span-1 flex justify-end gap-1">
		<div class="tooltip tooltip-top" data-tip={m.edit()}>
			<button
				onclick={onedit}
				class="flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant transition-all hover:bg-primary/10 hover:text-primary"
			>
				<Edit size={18} />
			</button>
		</div>
		<div class="tooltip tooltip-top" data-tip={m.delete()}>
			<button
				onclick={ondelete}
				class="flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant transition-all hover:bg-error/10 hover:text-error"
			>
				<Trash2 size={18} />
			</button>
		</div>
	</div>
</div>
