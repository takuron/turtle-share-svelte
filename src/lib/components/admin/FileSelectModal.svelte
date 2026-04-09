<script lang="ts">
	/**
	 * Admin file select modal for choosing images or files.
	 * Fetches real file data from the admin files API with pagination.
	 *
	 * 管理员文件选择模态框，用于选择图片或文件。
	 * 从管理员文件 API 获取真实文件数据，支持分页。
	 */
	// // 管理员文件选择模态框，用于选择图片或文件。
	// // 从管理员文件 API 获取真实文件数据，支持分页。
	import * as m from '$lib/paraglide/messages.js';
	import { Link, ChevronLeft, ChevronRight, Loader2 } from 'lucide-svelte';
	import { fade, scale } from 'svelte/transition';
	import { quintOut, backOut } from 'svelte/easing';
	import { onMount } from 'svelte';

	import { fetchAdminFilesPage, fetchAdminFilesPageInfo } from '$lib/api/admin/files';
	import { ADMIN_FILES_PAGE_SIZE, type AdminFileItem } from '$lib/api/types';

	export interface FileData {
		title: string;
		url: string;
	}

	interface Props {
		open: boolean;
		mode?: 'image' | 'file';
		onclose: () => void;
		onselect: (data: FileData) => void;
	}

	let { open, mode = 'image', onclose, onselect }: Props = $props();

	// 1. 本地表单状态
	let inputTitle = $state('');
	let inputUrl = $state('');

	// 2. 文件列表与分页状态
	let files = $state<AdminFileItem[]>([]);
	let currentPage = $state(1);
	let totalPages = $state(1);
	let isLoadingFiles = $state(true);

	// 3. 当弹窗打开时，加载文件列表。
	$effect(() => {
		if (open) {
			loadFiles(1);
		}
	});

	async function loadFiles(page: number) {
		isLoadingFiles = true;
		currentPage = page;

		const [infoRes, listRes] = await Promise.all([
			fetchAdminFilesPageInfo(ADMIN_FILES_PAGE_SIZE),
			fetchAdminFilesPage(page, ADMIN_FILES_PAGE_SIZE)
		]);

		if (infoRes.success) {
			totalPages = infoRes.data.total_pages;
		}
		if (listRes.success) {
			files = listRes.data;
		}

		isLoadingFiles = false;
	}

	// 4. 格式化文件大小：将字节数转换为人类可读的 KB 或 MB。
	function formatFileSize(bytes: number): string {
		if (bytes >= 1024 * 1024) {
			const mb = (bytes / (1024 * 1024)).toFixed(1);
			return m.size_mb({ size: mb });
		} else {
			const kb = Math.ceil(bytes / 1024);
			return m.size_kb({ size: String(kb) });
		}
	}

	// 5. 格式化相对时间：将 Unix 时间戳转换为 "X 时间前" 的格式。
	function formatRelativeTime(timestamp: number): string {
		const now = Date.now();
		const diff = now - timestamp * 1000;
		const seconds = Math.floor(diff / 1000);
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);
		const days = Math.floor(hours / 24);
		const weeks = Math.floor(days / 7);

		if (weeks > 0) {
			return m.uploaded_ago({ time: `${weeks}w` });
		} else if (days > 0) {
			return m.uploaded_ago({ time: `${days}d` });
		} else if (hours > 0) {
			return m.uploaded_ago({ time: `${hours}h` });
		} else if (minutes > 0) {
			return m.uploaded_ago({ time: `${minutes}m` });
		} else {
			return m.uploaded_ago({ time: '1m' });
		}
	}

	// 6. 点击文件列表项，将 URL 填入输入框。
	function handleFileClick(file: AdminFileItem) {
		inputUrl = file.url;
		if (mode !== 'image') {
			inputTitle = file.original_name;
		}
	}

	// 7. 确认选择：将输入的 URL 和标题传回父组件。
	function handleConfirm() {
		if (inputUrl) {
			onselect({
				title: mode === 'image' ? '' : inputTitle,
				url: inputUrl
			});
			handleClose();
		}
	}

	// 8. 关闭弹窗并重置状态。
	function handleClose() {
		onclose();
		inputTitle = '';
		inputUrl = '';
	}
</script>

{#if open}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm"
		transition:fade={{ duration: 200, easing: quintOut }}
		onclick={handleClose}
	>
		<div
			class="border-surface-container-high flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-3xl border bg-white shadow-2xl"
			transition:scale={{ duration: 300, start: 0.95, opacity: 0, easing: backOut }}
			onclick={(e) => e.stopPropagation()}
		>
			<!-- Header -->
			<div class="px-8 pt-8 pb-4">
				<div class="mb-6">
					<h2
						class="text-center text-2xl font-extrabold tracking-tight text-on-surface sm:text-left"
					>
						{mode === 'image' ? m.set_header_image_dialog_title() : m.set_attachment_dialog_title()}
					</h2>
				</div>
				<div class="space-y-4">
					{#if mode !== 'image'}
						<div>
							<label
								for="file-title"
								class="text-outline mb-1.5 ml-1 block text-[10px] font-black tracking-widest uppercase"
							>
								{m.file_title_label()}
							</label>
							<input
								id="file-title"
								type="text"
								bind:value={inputTitle}
								placeholder={m.enter_file_title()}
								class="bg-surface-container-low border-surface-container-high w-full rounded-xl border px-5 py-3 text-sm font-medium transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
							/>
						</div>
					{/if}
					<div>
						<label
							for="file-url"
							class="text-outline mb-1.5 ml-1 block text-[10px] font-black tracking-widest uppercase"
						>
							{mode === 'image' ? m.image_url_label() : m.file_url_label()}
						</label>
						<div class="relative">
							<Link size={18} class="text-outline absolute top-1/2 left-4 -translate-y-1/2" />
							<input
								id="file-url"
								type="text"
								bind:value={inputUrl}
								placeholder={mode === 'image' ? m.enter_image_url() : m.enter_file_url()}
								class="bg-surface-container-low border-surface-container-high w-full rounded-xl border px-5 py-3 pl-11 text-sm font-medium transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
							/>
						</div>
					</div>
				</div>
			</div>

			<!-- Divider -->
			<div class="relative flex items-center bg-white py-4">
				<div class="border-surface-container-high flex-grow border-t"></div>
				<span class="text-outline mx-4 shrink text-[10px] font-bold tracking-widest uppercase"
					>{m.select_from_uploaded_files()}</span
				>
				<div class="border-surface-container-high flex-grow border-t"></div>
			</div>

			<!-- File List -->
			<div class="flex-1 overflow-y-auto px-6">
				{#if isLoadingFiles}
					<div class="flex items-center justify-center py-12">
						<Loader2 size={24} class="animate-spin text-primary" />
					</div>
				{:else if files.length === 0}
					<div class="flex items-center justify-center py-12">
						<p class="text-sm font-medium text-on-surface-variant">No files uploaded yet.</p>
					</div>
				{:else}
					<div class="divide-surface-container-low divide-y">
						{#each files as file (file.hash_id)}
							<button
								onclick={() => handleFileClick(file)}
								class="hover:bg-surface-container-low flex w-full cursor-pointer items-center px-2 py-3 text-left transition-colors"
							>
								<div class="flex-1">
									<p class="text-[13px] font-semibold text-on-surface">{file.original_name}</p>
									<p class="text-outline text-[10px] font-medium">
										{formatRelativeTime(file.created_at)} — {formatFileSize(file.file_size)}
									</p>
								</div>
							</button>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Pagination -->
			{#if totalPages > 1}
				<div class="flex justify-center bg-white px-8 py-3">
					<div class="flex items-center gap-0.5">
						<button
							class="text-outline rounded-md p-1 hover:bg-surface-container disabled:opacity-30"
							disabled={currentPage <= 1}
							onclick={() => loadFiles(currentPage - 1)}
						>
							<ChevronLeft size={16} />
						</button>
						{#each Array.from({ length: totalPages }, (_, i) => i + 1) as pageNum}
							<button
								class="flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-bold transition-colors {pageNum ===
								currentPage
									? 'bg-primary text-white'
									: 'text-on-surface hover:bg-surface-container'}"
								onclick={() => loadFiles(pageNum)}
							>
								{pageNum}
							</button>
						{/each}
						<button
							class="text-outline cursor-pointer rounded-md p-1 hover:bg-surface-container disabled:opacity-30"
							disabled={currentPage >= totalPages}
							onclick={() => loadFiles(currentPage + 1)}
						>
							<ChevronRight size={16} />
						</button>
					</div>
				</div>
			{/if}

			<!-- Footer -->
			<div class="border-surface-container-low flex justify-end gap-3 border-t bg-white px-8 py-6">
				<button
					type="button"
					onclick={handleClose}
					class="hover:bg-surface-container-high flex-1 cursor-pointer rounded-full bg-surface-container py-3.5 text-sm font-bold text-on-surface transition-all active:scale-95"
				>
					{m.cancel()}
				</button>
				<button
					type="button"
					onclick={handleConfirm}
					disabled={!inputUrl}
					class="flex-[2] cursor-pointer rounded-full py-4 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all gradient-cta hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
				>
					{mode === 'image' ? m.select_image() : m.select_file()}
				</button>
			</div>
		</div>
	</div>
{/if}
