<script lang="ts">
	/**
	 * Single file row in the admin file list.
	 * Displays file name, upload date, size, and actions.
	 *
	 * @prop {string} fileName - The name of the file.
	 * @prop {string} uploadDate - The formatted upload date.
	 * @prop {string} fileSize - The formatted file size.
	 * @prop {string} fileUrl - The full absolute URL to the file.
	 * @prop {() => void} ondelete - Callback when delete button is clicked.
	 */
	// // 管理员文件列表中的单行文件记录。
	// // 显示文件名、上传日期、文件大小和操作按钮。
	// //
	// // @prop {string} fileName - 文件名称。
	// // @prop {string} uploadDate - 格式化后的上传日期。
	// // @prop {string} fileSize - 格式化后的文件大小。
	// // @prop {string} fileUrl - 文件的完整绝对路径。
	// // @prop {() => void} ondelete - 点击删除按钮时的回调。
	import { Link as LinkIcon, Trash2 } from 'lucide-svelte';

	let {
		fileName,
		uploadDate,
		fileSize,
		fileUrl,
		ondelete
	}: {
		fileName: string;
		uploadDate: string;
		fileSize: string;
		fileUrl: string;
		ondelete: () => void;
	} = $props();

	let copyState = $state<'idle' | 'success' | 'error'>('idle');

	async function handleCopyLink() {
		try {
			await navigator.clipboard.writeText(fileUrl);
			copyState = 'success';
		} catch (err) {
			console.error('Failed to copy text: ', err);
			copyState = 'error';
		} finally {
			setTimeout(() => {
				copyState = 'idle';
			}, 2000);
		}
	}
</script>

<div
	class="hover:bg-surface-container-low/30 group grid grid-cols-12 items-center border-b border-surface-container bg-transparent px-6 py-6 transition-colors last:border-b-0"
>
	<div class="col-span-5 flex items-center">
		<a
			href={fileUrl}
			target="_blank"
			rel="noopener noreferrer"
			class="truncate text-lg leading-tight font-bold text-on-surface transition-colors hover:text-primary"
		>
			{fileName}
		</a>
	</div>
	<div class="col-span-2">
		<p class="text-sm font-semibold text-on-surface">{uploadDate}</p>
	</div>
	<div class="col-span-2">
		<span class="text-outline text-sm font-medium">{fileSize}</span>
	</div>
	<div class="col-span-3 flex justify-end gap-1">
		<div
			class="tooltip tooltip-top {copyState === 'success'
				? 'tooltip-open tooltip-primary'
				: copyState === 'error'
					? 'tooltip-open tooltip-error'
					: ''}"
			data-tip={copyState === 'success'
				? 'Copied!'
				: copyState === 'error'
					? 'Failed!'
					: 'Copy Link'}
		>
			<button
				class="flex h-8 w-8 items-center justify-center rounded-full transition-all {copyState ===
				'success'
					? 'bg-primary/10 text-primary'
					: copyState === 'error'
						? 'bg-error/10 text-error'
						: 'text-on-surface-variant hover:bg-primary/10 hover:text-primary'}"
				onclick={handleCopyLink}
			>
				<LinkIcon size={18} />
			</button>
		</div>

		<div class="tooltip tooltip-top" data-tip="Delete">
			<button
				class="flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant transition-all hover:bg-error/10 hover:text-error"
				onclick={ondelete}
			>
				<Trash2 size={18} />
			</button>
		</div>
	</div>
</div>
