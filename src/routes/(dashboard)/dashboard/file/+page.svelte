<script lang="ts">
	/**
	 * Admin File Management page.
	 * 管理员文件管理页面。
	 */
	// // 管理员文件管理页面。
	import * as m from '$lib/paraglide/messages.js';
	import FileUploadZone from '$lib/components/admin/FileUploadZone.svelte';
	import FileListItem from '$lib/components/admin/FileListItem.svelte';
	import AdminPagination from '$lib/components/admin/AdminPagination.svelte';

	// Mock file data for UI prototyping
	// 1. 用于界面原型的模拟文件数据
	const mockFiles = [
		{ id: 1, name: 'generative-ui-whitepaper.pdf', date: 'Oct 24, 2023', size: '2.4 MB' },
		{ id: 2, name: 'hero-layout-preview.png', date: 'Oct 26, 2023', size: '850 KB' },
		{ id: 3, name: 'brand-assets-2024.zip', date: 'Oct 28, 2023', size: '15.2 MB' }
	];

	// Pagination state
	// 2. 分页状态
	let currentPage = $state(1);
	let totalPages = $state(14); // 42 files / 3 per page = 14 pages
</script>

<!-- 文件管理页面头部 -->
<div class="mb-8 flex items-end justify-between">
	<h2 class="font-display text-3xl font-extrabold tracking-tight text-on-surface">
		{m.nav_file_management()}
	</h2>
</div>

<!-- Upload section -->
<FileUploadZone maxSizeText="Up to 1024MB" />

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

	<!-- Render file items using a loop -->
	{#each mockFiles as file (file.id)}
		<FileListItem fileName={file.name} uploadDate={file.date} fileSize={file.size} />
	{/each}
</div>

<!-- Pagination -->
<AdminPagination
	{currentPage}
	{totalPages}
	onpagechange={(page) => (currentPage = page)}
	showingText="Showing 1 to 3 of 42 files"
/>
