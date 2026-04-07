<script lang="ts">
	/**
	 * File upload zone component for the admin dashboard.
	 * Allow users to click or drag & drop files to upload.
	 *
	 * @prop {string} [maxSizeText='Up to 1024MB'] - Text to display max file size.
	 */
	// // 管理员面板的文件上传区域组件。
	// // 允许用户点击或拖拽文件进行上传。
	// //
	// // @prop {string} [maxSizeText='Up to 1024MB'] - 显示最大文件大小的文本。
	import { UploadCloud } from 'lucide-svelte';

	let { maxSizeText = 'Up to 1024MB' }: { maxSizeText?: string } = $props();
</script>

<div class="group mb-10">
	<div
		class="bg-surface-container-low/50 relative cursor-pointer rounded-xl border-2 border-dashed border-outline-variant p-12 text-center transition-all duration-300 hover:border-primary hover:bg-surface-container"
	>
		<div class="flex flex-col items-center gap-4">
			<div
				class="bg-primary-container/20 flex h-16 w-16 items-center justify-center rounded-full text-primary transition-transform duration-300 group-hover:scale-110"
			>
				<UploadCloud size={36} />
			</div>
			<div>
				<p class="text-lg font-bold text-on-surface">Click or drop files here to upload</p>
				<p class="text-outline mt-1 text-sm font-medium">{maxSizeText}</p>
			</div>
		</div>
	</div>
</div>
