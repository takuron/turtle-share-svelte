<script lang="ts">
	/**
	 * Single file row in the admin file list.
	 * Displays file name, upload date, size, and actions.
	 *
	 * @prop {string} fileName - The name of the file.
	 * @prop {string} uploadDate - The formatted upload date.
	 * @prop {string} fileSize - The formatted file size.
	 */
	// // 管理员文件列表中的单行文件记录。
	// // 显示文件名、上传日期、文件大小和操作按钮。
	// //
	// // @prop {string} fileName - 文件名称。
	// // @prop {string} uploadDate - 格式化后的上传日期。
	// // @prop {string} fileSize - 格式化后的文件大小。
	import { Link as LinkIcon, Trash2 } from 'lucide-svelte';

	let {
		fileName,
		uploadDate,
		fileSize
	}: {
		fileName: string;
		uploadDate: string;
		fileSize: string;
	} = $props();
</script>

<div
	class="hover:bg-surface-container-low/30 group grid grid-cols-12 items-center border-b border-surface-container bg-transparent px-6 py-6 transition-colors last:border-b-0"
>
	<div class="col-span-5 flex items-center">
		<p class="truncate text-lg leading-tight font-bold text-on-surface">
			{fileName}
		</p>
	</div>
	<div class="col-span-2">
		<p class="text-sm font-semibold text-on-surface">{uploadDate}</p>
	</div>
	<div class="col-span-2">
		<span class="text-outline text-sm font-medium">{fileSize}</span>
	</div>
	<div class="col-span-3 flex justify-end gap-1">
		<button
			class="flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant transition-all hover:bg-primary/10 hover:text-primary"
			title="Copy Link"
		>
			<LinkIcon size={18} />
		</button>
		<button
			class="flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant transition-all hover:bg-error/10 hover:text-error"
			title="Delete"
		>
			<Trash2 size={18} />
		</button>
	</div>
</div>
