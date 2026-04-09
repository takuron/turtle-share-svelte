<script lang="ts">
	/**
	 * A modal dialog for users to change their password.
	 * @prop {boolean} open - Controls the modal visibility.
	 * @prop {() => void} onclose - Callback to close the modal.
	 */
	// // 用户修改密码弹出框，包含旧密码、新密码和确认密码字段。
	// //
	// // @prop {boolean} open - 控制弹窗可见性。
	// // @prop {() => void} onclose - 关闭弹窗的回调。
	import { CircleAlert, CircleCheck, Eye, EyeOff } from 'lucide-svelte';
	import { fade, scale } from 'svelte/transition';
	import { quintOut, backOut } from 'svelte/easing';
	import * as m from '$lib/paraglide/messages.js';
	import { changeUserPassword } from '$lib/api/user/subscriptions';

	let { open = false, onclose } = $props<{
		open: boolean;
		onclose: () => void;
	}>();

	let currentPassword = $state('');
	let newPassword = $state('');
	let confirmPassword = $state('');

	let errorMsg = $state('');
	let successMsg = $state('');
	let loading = $state(false);

	// 密码可见性切换状态
	let showCurrent = $state(false);
	let showNew = $state(false);
	let showConfirm = $state(false);

	// 每次弹窗打开时重置表单
	$effect(() => {
		if (open) {
			currentPassword = '';
			newPassword = '';
			confirmPassword = '';
			errorMsg = '';
			successMsg = '';
			loading = false;
			showCurrent = false;
			showNew = false;
			showConfirm = false;
		}
	});

	// 处理表单提交
	async function handleSubmit(e: Event) {
		e.preventDefault();
		errorMsg = '';
		successMsg = '';

		// 1. 验证所有字段是否填写
		if (!currentPassword || !newPassword || !confirmPassword) {
			errorMsg = m.err_password_empty();
			return;
		}

		// 2. 验证新密码和确认密码是否一致
		if (newPassword !== confirmPassword) {
			errorMsg = m.err_passwords_mismatch();
			return;
		}

		// 3. 调用后端 API 修改密码
		loading = true;
		const res = await changeUserPassword(currentPassword, newPassword);
		loading = false;

		if (!res.success) {
			errorMsg = res.error.message;
			return;
		}

		onclose();
	}
</script>

{#if open}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/30 p-4 backdrop-blur-sm"
		transition:fade={{ duration: 200, easing: quintOut }}
		onclick={onclose}
	>
		<div
			class="border-surface-container-high my-auto w-full max-w-md overflow-hidden rounded-3xl border bg-surface-lowest shadow-2xl"
			transition:scale={{ duration: 300, start: 0.95, opacity: 0, easing: backOut }}
			onclick={(e) => e.stopPropagation()}
		>
			<div class="flex items-center justify-between px-8 pt-8 pb-4">
				<h2 class="text-2xl font-extrabold tracking-tight text-on-surface">
					{m.change_password()}
				</h2>
			</div>

			<form onsubmit={handleSubmit} class="px-8 pb-6">
				<div class="space-y-5">
					<!-- 错误提示 -->
					{#if errorMsg}
						<div
							class="flex items-center gap-2 rounded-xl bg-error/10 px-4 py-3 text-sm font-medium text-error"
						>
							<CircleAlert size={16} />
							{errorMsg}
						</div>
					{/if}

					<!-- 成功提示 -->
					{#if successMsg}
						<div
							class="flex items-center gap-2 rounded-xl bg-success/10 px-4 py-3 text-sm font-medium text-success"
						>
							<CircleCheck size={16} />
							{successMsg}
						</div>
					{/if}

					<!-- 当前密码 -->
					<div class="flex flex-col gap-2">
						<label class="text-outline px-1 text-xs font-black tracking-widest uppercase"
							>{m.current_password()}</label
						>
						<div class="relative">
							<input
								class="bg-surface-container-low border-surface-container-high w-full rounded-xl border px-5 py-3.5 pr-12 text-sm font-medium transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
								type={showCurrent ? 'text' : 'password'}
								placeholder={m.enter_current_password()}
								bind:value={currentPassword}
								required
								disabled={loading || !!successMsg}
							/>
							<button
								type="button"
								class="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-on-surface-variant transition-colors hover:text-on-surface"
								onclick={() => (showCurrent = !showCurrent)}
								tabindex={-1}
							>
								{#if showCurrent}
									<EyeOff size={18} />
								{:else}
									<Eye size={18} />
								{/if}
							</button>
						</div>
					</div>

					<!-- 新密码 -->
					<div class="flex flex-col gap-2">
						<label class="text-outline px-1 text-xs font-black tracking-widest uppercase"
							>{m.new_password()}</label
						>
						<div class="relative">
							<input
								class="bg-surface-container-low border-surface-container-high w-full rounded-xl border px-5 py-3.5 pr-12 text-sm font-medium transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
								type={showNew ? 'text' : 'password'}
								placeholder={m.enter_new_password()}
								bind:value={newPassword}
								required
								disabled={loading || !!successMsg}
							/>
							<button
								type="button"
								class="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-on-surface-variant transition-colors hover:text-on-surface"
								onclick={() => (showNew = !showNew)}
								tabindex={-1}
							>
								{#if showNew}
									<EyeOff size={18} />
								{:else}
									<Eye size={18} />
								{/if}
							</button>
						</div>
					</div>

					<!-- 确认密码 -->
					<div class="flex flex-col gap-2">
						<label class="text-outline px-1 text-xs font-black tracking-widest uppercase"
							>{m.confirm_password()}</label
						>
						<div class="relative">
							<input
								class="bg-surface-container-low border-surface-container-high w-full rounded-xl border px-5 py-3.5 pr-12 text-sm font-medium transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
								type={showConfirm ? 'text' : 'password'}
								placeholder={m.enter_confirm_password()}
								bind:value={confirmPassword}
								required
								disabled={loading || !!successMsg}
							/>
							<button
								type="button"
								class="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-on-surface-variant transition-colors hover:text-on-surface"
								onclick={() => (showConfirm = !showConfirm)}
								tabindex={-1}
							>
								{#if showConfirm}
									<EyeOff size={18} />
								{:else}
									<Eye size={18} />
								{/if}
							</button>
						</div>
					</div>
				</div>

				<div class="flex items-center gap-4 pt-6">
					<button
						type="button"
						class="hover:bg-surface-container-high w-[35%] cursor-pointer rounded-full bg-surface-container py-3.5 text-sm font-bold text-on-surface transition-all active:scale-95 disabled:opacity-50"
						onclick={onclose}
						disabled={loading}
					>
						{successMsg ? m.close() : m.cancel()}
					</button>
					{#if !successMsg}
						<button
							type="submit"
							class="flex w-[65%] cursor-pointer items-center justify-center gap-2 rounded-full py-4 text-sm font-bold whitespace-nowrap text-white shadow-lg shadow-primary/20 transition-all gradient-cta hover:scale-[1.02] active:scale-95 disabled:opacity-50"
							disabled={loading}
						>
							{#if loading}
								<span class="loading loading-sm loading-spinner"></span>
							{/if}
							{m.confirm_change_password()}
						</button>
					{/if}
				</div>
			</form>
		</div>
	</div>
{/if}
