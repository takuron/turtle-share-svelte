<script lang="ts">
	/**
	 * Global network error toast using DaisyUI native toast + alert.
	 * Renders in the bottom-right corner. Each message auto-dismisses.
	 */
	// // 全局网络错误 Toast 组件，使用 DaisyUI 原生 toast + alert。
	// // 固定在右下角，每条消息自动消失。
	import { CircleAlert, CircleCheck, Info, X } from 'lucide-svelte';
	import { toastStore, removeToast } from '$lib/stores/toast.svelte';

	// 获取对应类型的图标和 Alert 类名
	const configs = {
		success: { icon: CircleCheck, className: 'alert-success' },
		error: { icon: CircleAlert, className: 'alert-error' },
		info: { icon: Info, className: 'alert-info' }
	};
</script>

{#if toastStore.messages.length > 0}
	<!-- DaisyUI 原生 toast 容器：右下角定位 -->
	<div class="toast toast-end toast-bottom z-[9999]">
		{#each toastStore.messages as msg (msg.id)}
			{@const config = configs[msg.type]}
			<div class="alert {config.className} shadow-lg">
				<config.icon size={18} />
				<span class="text-sm">{msg.text}</span>
				<button class="btn btn-ghost btn-xs" onclick={() => removeToast(msg.id)}>
					<X size={14} />
				</button>
			</div>
		{/each}
	</div>
{/if}
