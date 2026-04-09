<script lang="ts">
	/**
	 * Shared component for creating and editing articles.
	 * 共享的创建和编辑文章组件。
	 */
	// // 共享的创建和编辑文章组件。
	import * as m from '$lib/paraglide/messages.js';
	import { Send, ImagePlus, Calendar, Plus, FileText, Image, X } from 'lucide-svelte';

	interface ArticleData {
		title: string;
		content: string;
		publishDate: string;
		requiredTier: number;
		isPublic: boolean;
	}

	interface Props {
		pageTitle: string;
		isEdit?: boolean;
		initialData?: Partial<ArticleData>;
		onsave?: (data: ArticleData) => void;
	}

	let { pageTitle, isEdit = false, initialData = {}, onsave } = $props<Props>();

	// 1. 本地状态管理
	let formData = $state<ArticleData>({
		title: initialData.title || '',
		content: initialData.content || '',
		publishDate: initialData.publishDate || '',
		requiredTier: initialData.requiredTier !== undefined ? initialData.requiredTier : 0,
		isPublic: initialData.isPublic !== undefined ? initialData.isPublic : false
	});

	// Mock attachments for prototype
	let attachments = $state([
		{ id: 1, name: 'product_specification_v2.pdf', type: 'doc' },
		{ id: 2, name: 'header_illustration.png', type: 'image' }
	]);

	function handleSave() {
		if (onsave) {
			onsave($state.snapshot(formData));
		}
	}

	function removeAttachment(id: number) {
		attachments = attachments.filter((a) => a.id !== id);
	}
</script>

<div class="mx-auto flex w-full max-w-5xl flex-col p-6 lg:p-10">
	<!-- Header -->
	<div class="mb-10 flex items-center justify-between">
		<h2 class="font-display text-3xl font-extrabold tracking-tight text-on-surface">
			{pageTitle}
		</h2>
		<div class="ml-auto flex items-center gap-4">
			<button
				onclick={handleSave}
				class="flex cursor-pointer items-center gap-2 rounded-full px-8 py-4 text-base font-bold text-white shadow-xl shadow-indigo-200 transition-all gradient-cta hover:scale-[1.02] active:scale-95 dark:shadow-indigo-900/20"
			>
				<Send size={20} />
				{isEdit ? m.save_article() : m.publish_article()}
			</button>
		</div>
	</div>

	<!-- Title & Cover Image -->
	<div class="mb-8">
		<label
			class="text-outline mb-2 ml-1 block text-xs font-black tracking-widest uppercase"
			for="article-title"
		>
			{m.article_title()}
		</label>
		<div class="flex items-center gap-4">
			<input
				type="text"
				id="article-title"
				bind:value={formData.title}
				placeholder={m.enter_article_title()}
				class="flex-1 rounded-2xl border border-surface-container bg-white px-6 py-4 text-xl font-bold text-on-surface shadow-sm placeholder:text-surface-dim focus:ring-2 focus:ring-primary/20"
			/>
			<button
				class="flex cursor-pointer items-center gap-2 rounded-2xl border border-primary bg-white px-6 py-4 font-bold whitespace-nowrap text-primary shadow-sm transition-all hover:bg-primary hover:text-white"
			>
				<ImagePlus size={20} />
				{m.set_header_image()}
			</button>
		</div>
	</div>

	<!-- Content -->
	<div class="mb-10">
		<label
			class="text-outline mb-2 ml-1 block text-xs font-black tracking-widest uppercase"
			for="article-content"
		>
			{m.article_content()}
		</label>
		<textarea
			id="article-content"
			bind:value={formData.content}
			placeholder={m.start_writing()}
			rows="12"
			class="w-full resize-none rounded-2xl border border-surface-container bg-white px-6 py-6 text-base leading-relaxed text-on-surface shadow-sm placeholder:text-surface-dim focus:ring-2 focus:ring-primary/20"
		></textarea>
	</div>

	<!-- Meta & Attachments -->
	<div class="mb-10 grid grid-cols-1 gap-10 md:grid-cols-2">
		<div class="space-y-8">
			<!-- Publication Date -->
			<div>
				<label
					class="text-outline mb-3 ml-1 block text-xs font-black tracking-widest uppercase"
					for="publication-date"
				>
					{m.publication_date()}
				</label>
				<div class="relative">
					<Calendar size={20} class="text-outline absolute top-1/2 left-4 -translate-y-1/2" />
					<input
						type="text"
						id="publication-date"
						bind:value={formData.publishDate}
						placeholder={m.publication_date_placeholder()}
						class="w-full rounded-2xl border border-surface-container bg-white py-4 pr-6 pl-12 font-semibold text-on-surface shadow-sm focus:ring-2 focus:ring-primary/20"
					/>
				</div>
			</div>

			<!-- Access Requirement -->
			<div>
				<label class="text-outline mb-4 ml-1 block text-xs font-black tracking-widest uppercase">
					{m.access_requirement()}
				</label>
				<div class="space-y-4">
					<div class="flex flex-col gap-2">
						<input
							type="number"
							id="full-view-level"
							bind:value={formData.requiredTier}
							placeholder={m.enter_full_view_level()}
							class="w-full rounded-2xl border border-surface-container bg-white px-6 py-4 text-sm font-semibold text-on-surface shadow-sm focus:ring-2 focus:ring-primary/20"
						/>
					</div>
					<label
						class="hover:border-surface-container-highest flex cursor-pointer items-center gap-3 rounded-2xl border border-transparent bg-white px-6 py-4 shadow-sm transition-all"
					>
						<input
							type="checkbox"
							id="mark-public"
							bind:checked={formData.isPublic}
							class="border-surface-container-highest h-5 w-5 rounded text-primary focus:ring-primary/20"
						/>
						<span class="text-sm font-bold text-on-surface">{m.mark_as_public()}</span>
					</label>
				</div>
			</div>
		</div>

		<!-- Attachments -->
		<div class="flex flex-col">
			<label class="text-outline mb-2 ml-1 block text-xs font-black tracking-widest uppercase">
				{m.attachments()}
			</label>
			<div class="flex flex-col gap-4">
				<button
					class="border-surface-container-highest flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border bg-white px-6 py-4 font-bold text-primary shadow-sm transition-all hover:bg-indigo-50 active:scale-[0.98] dark:hover:bg-indigo-900/20"
				>
					<Plus size={20} />
					{m.add_attachment()}
				</button>
			</div>
			<div class="mt-6 space-y-2">
				{#each attachments as attachment (attachment.id)}
					<div
						class="border-surface-container-low flex items-center justify-between rounded-xl border bg-white px-4 py-3 shadow-sm"
					>
						<div class="flex items-center gap-3">
							{#if attachment.type === 'doc'}
								<FileText size={20} class="text-primary-dim" />
							{:else}
								<Image size={20} class="text-primary-dim" />
							{/if}
							<span class="max-w-[180px] truncate text-sm font-bold text-on-surface"
								>{attachment.name}</span
							>
						</div>
						<button
							onclick={() => removeAttachment(attachment.id)}
							class="cursor-pointer text-outline-variant transition-colors hover:text-error"
						>
							<X size={20} />
						</button>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
