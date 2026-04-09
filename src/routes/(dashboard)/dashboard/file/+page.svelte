<script lang="ts">
	/**
	 * Admin File Management page.
	 * 管理员文件管理页面。
	 */
	// // 管理员文件管理页面。
	import * as m from '$lib/paraglide/messages.js';
	import { onMount } from 'svelte';
	import { TriangleAlert } from 'lucide-svelte';
	import FileUploadZone from '$lib/components/admin/FileUploadZone.svelte';
	import FileListItem from '$lib/components/admin/FileListItem.svelte';
	import AdminPagination from '$lib/components/admin/AdminPagination.svelte';
	import ConfirmModal from '$lib/components/admin/ConfirmModal.svelte';
	import {
		fetchAdminFilesPage,
		fetchAdminFilesPageInfo,
		uploadAdminFile,
		deleteAdminFile
	} from '$lib/api/admin/files';
	import type { AdminFileItem } from '$lib/api/types';
	import { ADMIN_FILES_PAGE_SIZE } from '$lib/api/types';
	import { siteStore } from '$lib/stores/site.svelte';

	// State
	// 1. 状态管理
	let files = $state<AdminFileItem[]>([]);
	let currentPage = $state(1);
	let totalPages = $state(1);
	let totalItems = $state(0);
	let isLoading = $state(true);
	let isUploading = $state(false);
	let uploadProgress = $state(0);
	let uploadError = $state('');

	// Confirm Delete Modal State
	// 2. 删除确认模态框状态
	let isDeleteModalOpen = $state(false);
	let isDeleting = $state(false);
	let fileToDelete = $state<AdminFileItem | null>(null);

	// Init
	// 3. 初始化加载
	onMount(() => {
		loadPage(1);
	});

	// Load Data
	// 4. 加载分页数据
	async function loadPage(page: number) {
		isLoading = true;
		currentPage = page;
		try {
			// 并发请求分页信息和当页列表数据
			const [infoRes, listRes] = await Promise.all([
				fetchAdminFilesPageInfo(ADMIN_FILES_PAGE_SIZE),
				fetchAdminFilesPage(page, ADMIN_FILES_PAGE_SIZE)
			]);

			if (infoRes.success) {
				totalPages = infoRes.data.total_pages;
				totalItems = infoRes.data.total_items;
			}
			if (listRes.success) {
				files = listRes.data;
			}
		} catch (error) {
			console.error('Failed to load files', error);
		} finally {
			isLoading = false;
		}
	}

	// Handlers
	// 5. 事件处理
	async function handlePageChange(page: number) {
		await loadPage(page);
	}

	async function handleFileUpload(file: File) {
		if (isUploading) return;
		uploadError = '';
		isUploading = true;
		uploadProgress = 0;
		try {
			const res = await uploadAdminFile(file, (progress) => {
				uploadProgress = progress;
			});
			if (res.success) {
				// 上传成功后刷新当前列表或跳回第一页
				await loadPage(1);
			} else {
				console.error('Upload failed:', res.error?.message);
				uploadError = `Upload failed: ${res.error?.message}`;
			}
		} catch (error) {
			console.error('Upload error:', error);
			uploadError = 'An unexpected error occurred during upload.';
		} finally {
			isUploading = false;
			uploadProgress = 0;
		}
	}

	function confirmDelete(file: AdminFileItem) {
		fileToDelete = file;
		isDeleteModalOpen = true;
	}

	async function handleDelete() {
		if (!fileToDelete) return;
		isDeleting = true;
		try {
			const res = await deleteAdminFile(fileToDelete.hash_id);
			if (res.success) {
				isDeleteModalOpen = false;
				fileToDelete = null;
				// 如果删除后当前页空了且不是第一页，则往前翻页
				if (files.length === 1 && currentPage > 1) {
					await loadPage(currentPage - 1);
				} else {
					await loadPage(currentPage);
				}
			} else {
				alert(`Delete failed: ${res.error?.message}`);
			}
		} catch (error) {
			console.error('Delete error:', error);
		} finally {
			isDeleting = false;
		}
	}

	// Utils
	// 6. 格式化工具函数
	function formatBytes(bytes: number, decimals = 1) {
		if (!+bytes) return '0 Bytes';
		const k = 1024;
		const dm = decimals < 0 ? 0 : decimals;
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
	}

	function formatDate(timestamp: number) {
		return new Date(timestamp * 1000).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	function getFullUrl(url: string) {
		if (!url) return '';
		// 确保URL被正确编码（处理空格等特殊字符）
		const encodedUrl = encodeURI(url);

		if (encodedUrl.startsWith('http://') || encodedUrl.startsWith('https://')) {
			return encodedUrl;
		}
		if (typeof window !== 'undefined') {
			return new URL(encodedUrl, window.location.origin).href;
		}
		return encodedUrl;
	}

	// Computed text for pagination
	// 7. 计算分页显示文本
	let showingText = $derived(() => {
		if (totalItems === 0) return 'No files';
		const start = (currentPage - 1) * ADMIN_FILES_PAGE_SIZE + 1;
		const end = Math.min(currentPage * ADMIN_FILES_PAGE_SIZE, totalItems);
		return `Showing ${start} to ${end} of ${totalItems} files`;
	});
</script>

<!-- 文件管理页面标题 -->
<svelte:head>
	<title>{m.page_title_with_site({ title: m.nav_file_management(), siteName: siteStore.info.name })}</title>
</svelte:head>

<!-- 文件管理页面头部 -->
<div class="mb-8 flex items-end justify-between">
	<h2 class="font-display text-3xl font-extrabold tracking-tight text-on-surface">
		{m.nav_file_management()}
	</h2>
</div>

<!-- Upload section -->
{#if uploadError}
	<div class="mb-4 alert text-sm alert-error shadow-sm">
		<TriangleAlert size={18} />
		<span>{uploadError}</span>
		<button class="btn btn-circle btn-ghost btn-sm" onclick={() => (uploadError = '')}> ✕ </button>
	</div>
{/if}

{#if isUploading}
	<div class="group mb-10">
		<div
			class="bg-surface-container-low/50 relative rounded-xl border-2 border-dashed border-outline-variant p-12 text-center transition-all duration-300"
		>
			<div class="flex flex-col items-center gap-4">
				<div class="mt-2 text-primary">
					<div
						class="radial-progress text-primary"
						style="--value:{uploadProgress}; --size:3rem; --thickness: 4px;"
						role="progressbar"
						aria-valuenow={uploadProgress}
						aria-valuemin="0"
						aria-valuemax="100"
					>
						<span class="text-sm font-bold">{uploadProgress}%</span>
					</div>
				</div>
				<div>
					<p class="text-lg font-bold text-on-surface">Uploading file...</p>
					<p class="text-outline mt-1 text-sm font-medium">Please wait, do not close the page</p>
				</div>
			</div>
		</div>
	</div>
{:else}
	<FileUploadZone maxSizeText="Up to 1024MB" onfiledrop={handleFileUpload} />
{/if}

<!-- File list -->
<div class="space-y-4">
	<div
		class="text-outline grid grid-cols-12 px-6 py-3 text-xs font-black tracking-widest uppercase"
	>
		<div class="col-span-5">File Name</div>
		<div class="col-span-2">Upload Date</div>
		<div class="col-span-2">Size</div>
		<div class="col-span-3 text-right">Actions</div>
	</div>

	{#if isLoading}
		<div class="py-12 text-center">
			<span class="loading loading-lg loading-spinner text-primary"></span>
		</div>
	{:else if files.length === 0}
		<div class="py-12 text-center">
			<p class="font-medium text-on-surface-variant">No files uploaded yet.</p>
		</div>
	{:else}
		<!-- Render file items using a loop -->
		{#each files as file (file.hash_id)}
			<FileListItem
				fileName={file.original_name}
				uploadDate={formatDate(file.created_at)}
				fileSize={formatBytes(file.file_size)}
				fileUrl={getFullUrl(file.url)}
				ondelete={() => confirmDelete(file)}
			/>
		{/each}
	{/if}
</div>

<!-- Pagination -->
{#if totalPages > 1}
	<AdminPagination
		{currentPage}
		{totalPages}
		onpagechange={handlePageChange}
		showingText={showingText()}
	/>
{/if}

<!-- Confirm Delete Modal -->
<ConfirmModal
	open={isDeleteModalOpen}
	title="Delete File"
	description={`Are you sure you want to delete "${fileToDelete?.original_name}"? This action cannot be undone.`}
	confirmText="Delete"
	cancelText="Cancel"
	danger={true}
	loading={isDeleting}
	onclose={() => (isDeleteModalOpen = false)}
	onconfirm={handleDelete}
/>
