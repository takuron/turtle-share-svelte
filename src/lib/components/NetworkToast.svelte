<script lang="ts">
	/**
	 * Global network error toast using DaisyUI native toast + alert.
	 * Renders in the bottom-right corner. Each message auto-dismisses.
	 */
	// // 全局网络错误 Toast 组件，使用 DaisyUI 原生 toast + alert。
	// // 固定在右下角，每条消息自动消失。
	import { CircleAlert, X } from 'lucide-svelte';
	import { toastStore, removeToast } from '$lib/stores/toast.svelte';
</script>

{#if toastStore.messages.length > 0}
	<!-- DaisyUI 原生 toast 容器：右下角定位 -->
	<div class="toast toast-end toast-bottom z-[9999]">
		{#each toastStore.messages as msg (msg.id)}
			<div class="alert alert-error shadow-lg">
				<CircleAlert size={18} />
				<span class="text-sm">{msg.text}</span>
				<button class="btn btn-ghost btn-xs" onclick={() => removeToast(msg.id)}>
					<X size={14} />
				</button>
			</div>
		{/each}
	</div>
{/if}
