<script lang="ts">
	/**
	 * File upload zone component for the admin dashboard.
	 * Allow users to click or drag & drop files to upload.
	 *
	 * @prop {string} [maxSizeText='Up to 1024MB'] - Text to display max file size.
	 * @prop {(file: File) => void} onfiledrop - Callback when a file is selected or dropped.
	 */
	// // 管理员面板的文件上传区域组件。
	// // 允许用户点击或拖拽文件进行上传。
	// //
	// // @prop {string} [maxSizeText='Up to 1024MB'] - 显示最大文件大小的文本。
	// // @prop {(file: File) => void} onfiledrop - 选中或拖拽文件时的回调。
	import { UploadCloud } from 'lucide-svelte';

	let {
		maxSizeText = 'Up to 1024MB',
		onfiledrop
	}: {
		maxSizeText?: string;
		onfiledrop?: (file: File) => void;
	} = $props();

	let fileInput: HTMLInputElement;
	let isDragging = $state(false);

	function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			if (onfiledrop) {
				onfiledrop(target.files[0]);
			}
			target.value = ''; // Reset input
		}
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		isDragging = true;
	}

	function handleDragLeave(event: DragEvent) {
		event.preventDefault();
		isDragging = false;
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		isDragging = false;
		if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
			if (onfiledrop) {
				onfiledrop(event.dataTransfer.files[0]);
			}
		}
	}

	function triggerClick() {
		fileInput?.click();
	}
</script>

<div class="group mb-10">
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="relative cursor-pointer rounded-xl border-2 border-dashed p-12 text-center transition-all duration-300
		{isDragging
			? 'border-primary bg-surface-container'
			: 'bg-surface-container-low/50 border-outline-variant hover:border-primary hover:bg-surface-container'}"
		onclick={triggerClick}
		ondragover={handleDragOver}
		ondragleave={handleDragLeave}
		ondrop={handleDrop}
	>
		<input type="file" bind:this={fileInput} class="hidden" onchange={handleFileChange} />

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
