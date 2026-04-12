/**
 * Global toast notification store for network errors.
 * @module toast
 */
// // 全局 Toast 通知 store，用于展示网络错误。

export type ToastType = 'success' | 'error' | 'info';

interface ToastMessage {
	id: number;
	text: string;
	type: ToastType;
}

// 自增 ID 计数器
let nextId = 0;

export const toastStore = $state<{ messages: ToastMessage[] }>({
	messages: []
});

/**
 * Push a toast message. Duplicate text is ignored while visible.
 * Auto-removes after `duration` ms (default 5000).
 * @param text - The message to display.
 * @param type - The type of toast (success, error, info).
 * @param duration - Auto-dismiss delay in ms.
 */
// // 推送一条 toast 消息。相同文本在显示期间不会重复。
// // 默认 5 秒后自动移除。
export function addToast(text: string, type: ToastType = 'error', duration = 5000): void {
	// 去重：如果已有相同文本的 toast 正在展示，则忽略
	if (toastStore.messages.some((m) => m.text === text)) return;

	const id = nextId++;
	toastStore.messages.push({ id, text, type });

	setTimeout(() => {
		removeToast(id);
	}, duration);
}

/**
 * Remove a toast by its id.
 * @param id - The toast id to remove.
 */
// // 根据 id 移除一条 toast。
export function removeToast(id: number): void {
	const idx = toastStore.messages.findIndex((m) => m.id === id);
	if (idx !== -1) {
		toastStore.messages.splice(idx, 1);
	}
}
