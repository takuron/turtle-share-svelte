<script lang="ts">
	/**
	 * Admin user edit modal for adding and editing users.
	 * 管理员用户编辑模态框，用于添加和编辑用户。
	 */
	// // 管理员用户编辑模态框，用于添加和编辑用户。
	import { Lock, X } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';
	import type { AdminUserItem } from '$lib/api/types';
	import { fade, scale } from 'svelte/transition';
	import { quintOut, backOut } from 'svelte/easing';

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
			username: string;
			password?: string;
			email?: string;
			note?: string;
		}) => void;
	}>();

	let username = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let email = $state('');
	let note = $state('');

	// 1. 当模态框打开且传入了 user 时，初始化表单数据。
	$effect(() => {
		if (open) {
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
	function handleSubmit(e: Event) {
		e.preventDefault();
		if (password !== confirmPassword) {
			// 在实际应用中这里可以加个提示
			alert('Passwords do not match');
			return;
		}

		const data: any = { username };
		if (password) data.password = password;
		if (email) data.email = email;
		if (note) data.note = note;

		onsubmit(data);
	}
</script>

{#if open}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-[100] flex items-center justify-center bg-black/30"
		transition:fade={{ duration: 200, easing: quintOut }}
		onclick={onclose}
	>
		<div
			class="border-surface-container-high w-full max-w-md overflow-hidden rounded-3xl border bg-surface-lowest shadow-2xl"
			transition:scale={{ duration: 300, start: 0.95, opacity: 0, easing: backOut }}
			onclick={(e) => e.stopPropagation()}
		>
			<div class="flex items-center justify-between px-8 pt-8 pb-4">
				<h2 class="text-2xl font-extrabold tracking-tight text-on-surface">
					{user ? m.edit_user() : m.create_user()}
				</h2>
				<button
					class="text-outline cursor-pointer transition-colors hover:text-on-surface"
					aria-label={m.close()}
					onclick={onclose}
				>
					<X size={24} />
				</button>
			</div>

			<form onsubmit={handleSubmit} class="flex flex-col gap-5 px-8 pb-10">
				<div class="flex flex-col gap-2">
					<label class="text-outline px-1 text-xs font-black tracking-widest uppercase"
						>{m.username()}</label
					>
					<input
						class="bg-surface-container-low border-surface-container-high w-full rounded-xl border px-5 py-4 text-sm font-medium transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
						placeholder={m.enter_username()}
						type="text"
						bind:value={username}
						required
					/>
				</div>

				<div class="flex flex-col gap-2">
					<label class="text-outline px-1 text-xs font-black tracking-widest uppercase"
						>{m.password()}</label
					>
					<input
						class="bg-surface-container-low border-surface-container-high w-full rounded-xl border px-5 py-4 text-sm font-medium transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
						placeholder={m.enter_password()}
						type="password"
						bind:value={password}
						required={!user}
					/>
				</div>

				<div class="flex flex-col gap-2">
					<label class="text-outline px-1 text-xs font-black tracking-widest uppercase"
						>{m.confirm_password()}</label
					>
					<input
						class="bg-surface-container-low border-surface-container-high w-full rounded-xl border px-5 py-4 text-sm font-medium transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
						placeholder={m.confirm_password()}
						type="password"
						bind:value={confirmPassword}
						required={!user || password.length > 0}
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
						class="bg-surface-container-low border-surface-container-high w-full rounded-xl border px-5 py-4 text-sm font-medium transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
						placeholder={m.email_placeholder()}
						type="email"
						bind:value={email}
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
						class="bg-surface-container-low border-surface-container-high w-full resize-none rounded-xl border px-5 py-4 text-sm font-medium transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
						placeholder={m.add_admin_note()}
						rows="3"
						bind:value={note}
					></textarea>
				</div>

				<div class="flex gap-3 pt-4">
					<button
						type="button"
						class="hover:bg-surface-container-high flex-1 cursor-pointer rounded-full bg-surface-container py-4 font-bold text-on-surface transition-all active:scale-95"
						onclick={onclose}
					>
						{m.cancel()}
					</button>
					<button
						type="submit"
						class="flex-[2] cursor-pointer rounded-full py-4 font-bold text-white shadow-lg shadow-primary/20 transition-all gradient-cta hover:scale-[1.02] active:scale-95"
					>
						{user ? m.save_changes() : m.create_user()}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
