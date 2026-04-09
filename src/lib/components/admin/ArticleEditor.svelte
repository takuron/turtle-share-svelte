<script lang="ts">
	/**
	 * Shared component for creating and editing articles.
	 * Supports real API data with file_links, loading/error states.
	 *
	 * 共享的创建和编辑文章组件。
	 * 支持真实 API 数据，包含文件链接、加载/错误状态。
	 */
	// // 共享的创建和编辑文章组件。
	// // 支持真实 API 数据，包含文件链接、加载/错误状态。
	import * as m from '$lib/paraglide/messages.js';
	import { Send, ImagePlus, Plus, FileText, Image, X, Loader2 } from 'lucide-svelte';

	import FileSelectModal, { type FileData } from '$lib/components/admin/FileSelectModal.svelte';
	import type { FileLink } from '$lib/api/types';

	/**
	 * Article form data used by the editor UI.
	 * Maps between API types and form state.
	 *
	 * 编辑器 UI 使用的文章表单数据。
	 * 在 API 类型和表单状态之间进行映射。
	 */
	// // 编辑器 UI 使用的文章表单数据。
	// // 在 API 类型和表单状态之间进行映射。
	export interface ArticleFormData {
		title: string;
		content: string;
		publishDate: string;
		headerImage: string;
		requiredTier: number;
		isPublic: boolean;
		fileLinks: FileLink[];
	}

	interface Props {
		pageTitle: string;
		isEdit?: boolean;
		initialData?: Partial<ArticleFormData>;
		isSaving?: boolean;
		errorMessage?: string;
		onsave?: (data: ArticleFormData) => void;
	}

	let {
		pageTitle,
		isEdit = false,
		initialData = {},
		isSaving = false,
		errorMessage = '',
		onsave
	}: Props = $props();

	// 1. 本地表单状态管理
	let formData = $state<ArticleFormData>({
		title: initialData.title || '',
		content: initialData.content || '',
		publishDate: initialData.publishDate || '',
		headerImage: initialData.headerImage || '',
		requiredTier: initialData.requiredTier !== undefined ? initialData.requiredTier : 0,
		isPublic: initialData.isPublic !== undefined ? initialData.isPublic : false,
		fileLinks: initialData.fileLinks ? [...initialData.fileLinks] : []
	});

	// 2. 弹窗状态
	let isFileModalOpen = $state(false);
	let fileModalMode = $state<'image' | 'file'>('image');

	// 3. 保存表单数据
	function handleSave() {
		if (!formData.title.trim()) {
			return;
		}
		if (onsave) {
			onsave($state.snapshot(formData));
		}
	}

	// 4. 移除附件
	function removeAttachment(index: number) {
		formData.fileLinks = formData.fileLinks.filter((_, i) => i !== index);
	}

	// 5. 打开文件选择弹窗
	function openFileModal(mode: 'image' | 'file') {
		fileModalMode = mode;
		isFileModalOpen = true;
	}

	// 6. 处理文件选择回调
	function handleFileSelect(data: FileData) {
		if (fileModalMode === 'image') {
			// 选择头图：直接设置 URL
			formData.headerImage = data.url;
		} else {
			// 选择附件：添加到 fileLinks 列表
			formData.fileLinks = [
				...formData.fileLinks,
				{
					name: data.title || data.url.split('/').pop() || 'unnamed',
					url: data.url
				}
			];
		}
	}

	// 7. 判断文件类型图标
	function isImageUrl(url: string): boolean {
		return /\.(jpg|jpeg|png|webp|gif|svg|avif)$/i.test(url);
	}
</script>

<div class="mx-auto flex w-full max-w-5xl flex-col p-4 lg:p-6">
	<!-- Header -->
	<div class="mb-6 flex items-center justify-between">
		<h2 class="font-display text-3xl font-extrabold tracking-tight text-on-surface">
			{pageTitle}
		</h2>
		<div class="ml-auto flex items-center gap-4">
			<button
				onclick={handleSave}
				disabled={isSaving || !formData.title.trim()}
				class="flex cursor-pointer items-center gap-2 rounded-full px-8 py-3 text-base font-bold text-white shadow-xl shadow-indigo-200 transition-all gradient-cta hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 dark:shadow-indigo-900/20"
			>
				{#if isSaving}
					<Loader2 size={20} class="animate-spin" />
				{:else}
					<Send size={20} />
				{/if}
				{isEdit ? m.save_article() : m.publish_article()}
			</button>
		</div>
	</div>

	<!-- Error Message -->
	{#if errorMessage}
		<div
			class="mb-6 rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-sm font-medium text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
		>
			{errorMessage}
		</div>
	{/if}

	<!-- Title & Cover Image -->
	<div class="mb-6">
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
				disabled={isSaving}
				class="flex-1 rounded-2xl border border-surface-container bg-white px-6 py-4 text-xl font-bold text-on-surface shadow-sm placeholder:text-surface-dim focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
			/>
			<button
				onclick={() => openFileModal('image')}
				disabled={isSaving}
				class="flex cursor-pointer items-center gap-2 rounded-2xl border border-primary bg-white px-6 py-4 font-bold whitespace-nowrap text-primary shadow-sm transition-all hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
			>
				<ImagePlus size={20} />
				{#if formData.headerImage}
					<span class="max-w-[120px] truncate">{formData.headerImage.split('/').pop()}</span>
				{:else}
					{m.set_header_image()}
				{/if}
			</button>
		</div>
		{#if formData.headerImage}
			<div class="mt-3 flex items-center gap-2">
				<span class="max-w-[300px] truncate text-xs text-on-surface-variant"
					>{formData.headerImage}</span
				>
				<button
					onclick={() => (formData.headerImage = '')}
					class="cursor-pointer text-outline-variant transition-colors hover:text-error"
					title="Remove header image"
				>
					<X size={14} />
				</button>
			</div>
		{/if}
	</div>

	<!-- Content -->
	<div class="mb-6">
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
			disabled={isSaving}
			class="w-full resize-none rounded-2xl border border-surface-container bg-white px-6 py-4 text-base leading-relaxed text-on-surface shadow-sm placeholder:text-surface-dim focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
		></textarea>
	</div>

	<!-- Meta & Attachments -->
	<div class="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
		<div class="space-y-6">
			<!-- Publication Date -->
			<div>
				<label
					class="text-outline mb-3 ml-1 block text-xs font-black tracking-widest uppercase"
					for="publication-date"
				>
					{m.publication_date()}
				</label>
				<div class="relative">
					<input
						type="date"
						id="publication-date"
						bind:value={formData.publishDate}
						disabled={isSaving}
						class="w-full rounded-2xl border border-surface-container bg-white px-6 py-4 font-semibold text-on-surface shadow-sm focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
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
							min="0"
							max="255"
							bind:value={formData.requiredTier}
							placeholder={m.enter_full_view_level()}
							disabled={isSaving}
							class="w-full rounded-2xl border border-surface-container bg-white px-6 py-4 text-sm font-semibold text-on-surface shadow-sm focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
						/>
					</div>
					<label
						class="hover:border-surface-container-highest flex cursor-pointer items-center gap-3 rounded-2xl border border-transparent bg-white px-6 py-4 shadow-sm transition-all"
					>
						<input
							type="checkbox"
							id="mark-public"
							bind:checked={formData.isPublic}
							disabled={isSaving}
							class="border-surface-container-highest h-5 w-5 rounded text-primary focus:ring-primary/20"
						/>
						<span class="text-sm font-bold text-on-surface">{m.mark_as_public()}</span>
					</label>
				</div>
			</div>
		</div>

		<!-- Attachments (file_links) -->
		<div class="flex flex-col">
			<label class="text-outline mb-2 ml-1 block text-xs font-black tracking-widest uppercase">
				{m.attachments()}
			</label>
			<div class="flex flex-col gap-4">
				<button
					onclick={() => openFileModal('file')}
					disabled={isSaving}
					class="border-surface-container-highest flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border bg-white px-6 py-4 font-bold text-primary shadow-sm transition-all hover:bg-indigo-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-indigo-900/20"
				>
					<Plus size={20} />
					{m.add_attachment()}
				</button>
			</div>
			<div class="mt-6 space-y-2">
				{#each formData.fileLinks as attachment, index (index)}
					<div
						class="border-surface-container-low flex items-center justify-between rounded-xl border bg-white px-4 py-3 shadow-sm"
					>
						<div class="flex items-center gap-3">
							{#if isImageUrl(attachment.url)}
								<Image size={20} class="text-primary-dim" />
							{:else}
								<FileText size={20} class="text-primary-dim" />
							{/if}
							<a
								href={attachment.url}
								target="_blank"
								rel="noopener noreferrer"
								class="max-w-[180px] truncate text-sm font-bold text-on-surface hover:text-primary"
								>{attachment.name}</a
							>
						</div>
						<button
							onclick={() => removeAttachment(index)}
							disabled={isSaving}
							class="cursor-pointer text-outline-variant transition-colors hover:text-error disabled:cursor-not-allowed disabled:opacity-50"
						>
							<X size={20} />
						</button>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>

<FileSelectModal
	open={isFileModalOpen}
	mode={fileModalMode}
	onclose={() => (isFileModalOpen = false)}
	onselect={handleFileSelect}
/>
