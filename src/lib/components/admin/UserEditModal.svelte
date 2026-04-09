<script lang="ts">
	/**
	 * Admin user edit modal for adding and editing users.
	 * 管理员用户编辑模态框，用于添加和编辑用户。
	 */
	// // 管理员用户编辑模态框，用于添加和编辑用户。
	import { Lock, CircleAlert } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';
	import type { AdminUserItem } from '$lib/api/types';
	import Modal from '$lib/components/shared/Modal.svelte';

	let {
		open = false,
		user = null,
		onclose,
		onsubmit
	} = $props<{
		open: boolean;
		user?: AdminUserItem | null;
		onclose: () => void;
		onsubmit: (data: {
			username?: string;
			password?: string;
			email?: string;
			note?: string;
		}) => Promise<string | void>;
	}>();

	let username = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let email = $state('');
	let note = $state('');

	let errorMsg = $state('');
	let loading = $state(false);

	// 1. 当模态框打开且传入了 user 时，初始化表单数据。
	$effect(() => {
		if (open) {
			errorMsg = '';
			loading = false;
			if (user) {
				username = user.username || '';
				email = user.email || '';
				note = user.note || '';
				password = '';
				confirmPassword = '';
			} else {
				username = '';
				email = '';
				note = '';
				password = '';
				confirmPassword = '';
			}
		}
	});

	// 2. 处理表单提交，调用父组件传入的 onsubmit 回调。
	async function handleSubmit(e: Event) {
		e.preventDefault();
		errorMsg = '';
		if (password !== confirmPassword) {
			errorMsg = m.err_passwords_mismatch();
			return;
		}

		const data: { username?: string; password?: string; email?: string; note?: string } = {};
		if (!user) {
			data.username = username;
		}
		if (password) data.password = password;
		// 允许清空内容
		data.email = email;
		data.note = note;

		loading = true;
		const err = await onsubmit(data);
		loading = false;

		if (err) {
			errorMsg = err;
		}
	}
</script>

<Modal {open} {onclose}>
		<div class="flex items-center justify-between px-8 pt-8 pb-4">
				<h2 class="text-2xl font-extrabold tracking-tight text-on-surface">
					{user ? m.edit_user() : m.create_user()}
				</h2>
			</div>

			<form onsubmit={handleSubmit} class="flex flex-col gap-5 px-8 pb-10">
				<!-- 错误提示 -->
				{#if errorMsg}
					<div
						class="flex items-center gap-2 rounded-xl bg-error/10 px-4 py-3 text-sm font-medium text-error"
					>
						<CircleAlert size={16} />
						{errorMsg}
					</div>
				{/if}

				<div class="flex flex-col gap-2">
					<label class="text-outline px-1 text-xs font-black tracking-widest uppercase"
						>{m.username()}</label
					>
					<input
						class="bg-surface-container-low border-surface-container-high w-full rounded-xl border px-5 py-4 text-sm font-medium transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
						placeholder={m.enter_username()}
						type="text"
						bind:value={username}
						required={!user}
						disabled={!!user || loading}
					/>
				</div>

				<div class="flex flex-col gap-2">
					<label class="text-outline px-1 text-xs font-black tracking-widest uppercase"
						>{m.password()}</label
					>
					<input
						class="bg-surface-container-low border-surface-container-high w-full rounded-xl border px-5 py-4 text-sm font-medium transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
						placeholder={m.enter_password()}
						type="password"
						bind:value={password}
						required={!user}
						disabled={loading}
					/>
				</div>

				<div class="flex flex-col gap-2">
					<label class="text-outline px-1 text-xs font-black tracking-widest uppercase"
						>{m.confirm_password()}</label
					>
					<input
						class="bg-surface-container-low border-surface-container-high w-full rounded-xl border px-5 py-4 text-sm font-medium transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
						placeholder={m.confirm_password()}
						type="password"
						bind:value={confirmPassword}
						required={!user || password.length > 0}
						disabled={loading}
					/>
				</div>

				<div class="flex flex-col gap-2">
					<div class="flex justify-between px-1">
						<label class="text-outline text-xs font-black tracking-widest uppercase"
							>{m.email()}</label
						>
						<span class="text-[10px] font-bold text-outline-variant uppercase">{m.optional()}</span>
					</div>
					<input
						class="bg-surface-container-low border-surface-container-high w-full rounded-xl border px-5 py-4 text-sm font-medium transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
						placeholder={m.email_placeholder()}
						type="email"
						bind:value={email}
						disabled={loading}
					/>
				</div>

				<div class="flex flex-col gap-2">
					<div class="flex justify-between px-1">
						<div class="flex items-center gap-1.5">
							<label class="text-outline text-xs font-black tracking-widest uppercase"
								>{m.col_note()}</label
							>
							<Lock size={14} class="text-outline-variant" />
							<span class="text-[10px] font-bold text-outline-variant uppercase"
								>{m.admin_only_visible()}</span
							>
						</div>
						<span class="text-[10px] font-bold text-outline-variant uppercase">{m.optional()}</span>
					</div>
					<textarea
						class="bg-surface-container-low border-surface-container-high w-full resize-none rounded-xl border px-5 py-4 text-sm font-medium transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
						placeholder={m.add_admin_note()}
						rows="3"
						bind:value={note}
						disabled={loading}
					></textarea>
				</div>

				<div class="flex gap-3 pt-4">
					<button
						type="button"
						class="hover:bg-surface-container-high flex-1 cursor-pointer rounded-full bg-surface-container py-4 font-bold text-on-surface transition-all active:scale-95 disabled:opacity-50"
						onclick={onclose}
						disabled={loading}
					>
						{m.cancel()}
					</button>
					<button
						type="submit"
						class="flex flex-[2] cursor-pointer items-center justify-center gap-2 rounded-full py-4 font-bold text-white shadow-lg shadow-primary/20 transition-all gradient-cta hover:scale-[1.02] active:scale-95 disabled:opacity-50"
						disabled={loading}
					>
						{#if loading}
							<span class="loading loading-sm loading-spinner"></span>
						{/if}
						{user ? m.save_changes() : m.create_user()}
					</button>
				</div>
			</form>
</Modal>
