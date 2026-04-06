<script lang="ts">
	/**
	 * Admin User Management page with user list, expandable subscription details.
	 * 管理员用户管理页面，包含用户列表和可展开的订阅详情。
	 */
	// // 管理员用户管理页面骨架，结构参考 stitch/code.html。
	import {
		ChevronRight,
		ChevronDown,
		ChevronLeft,
		Edit,
		Trash2,
		Plus,
		CirclePlus
	} from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';

	// 1. 模拟用户数据（骨架用，后续替换为真实 API 数据）。
	const mockUsers = [
		{ id: 1, name: 'Alex Lawson', initials: 'AL', note: '', bgClass: 'bg-primary/10 text-primary' },
		{ id: 2, name: 'Sarah Miller', initials: 'SM', note: 'This is note for admin', bgClass: 'bg-base-300 text-on-surface-variant' },
		{ id: 3, name: 'James Chen', initials: 'JC', note: '001 002', bgClass: 'bg-primary/10 text-primary' }
	];

	// 2. 模拟订阅数据。
	const mockSubscriptions = [
		{ start: 'Jan 01, 2024', end: 'Dec 31, 2024', level: 5, note: 'Annual renewal', active: true },
		{ start: 'Jan 01, 2023', end: 'Dec 31, 2023', level: 2, note: 'Discount applied', active: false }
	];

	// 3. 展开状态追踪（第一个用户默认展开）。
	let expandedUserId = $state<number | null>(1);

	function toggleExpand(id: number) {
		expandedUserId = expandedUserId === id ? null : id;
	}
</script>

<!-- 用户管理页面 -->
<div class="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
	<h2 class="text-3xl font-extrabold text-on-surface tracking-tight px-2 lg:px-6 font-display">
		{m.nav_user_management()}
	</h2>
	<button
		class="flex items-center gap-2 gradient-cta text-white px-6 py-3 lg:px-8 lg:py-4 rounded-full font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-sm lg:text-base cursor-pointer"
	>
		<CirclePlus size={20} />
		{m.create_new_user()}
	</button>
</div>

<div class="space-y-4">
	<!-- 表头 -->
	<div class="hidden lg:grid grid-cols-12 px-6 py-3 text-xs font-black uppercase tracking-widest text-on-surface-variant">
		<div class="col-span-1 pl-4"></div>
		<div class="col-span-4">{m.col_username()}</div>
		<div class="col-span-6">{m.col_note()}</div>
		<div class="col-span-1 text-right">{m.col_actions()}</div>
	</div>

	<!-- 用户列表卡片 -->
	<div class="bg-surface-lowest rounded-xl shadow-editorial-sm overflow-hidden">
		{#each mockUsers as user, i}
			<!-- 用户行 -->
			<div
				class="border-b border-outline-variant/20 last:border-b-0
					{expandedUserId === user.id ? 'bg-surface-lowest' : 'hover:bg-surface-low/30 transition-colors'}"
			>
				<div class="grid grid-cols-12 items-center px-4 lg:px-6 py-5">
					<!-- 展开按钮 -->
					<div class="col-span-2 lg:col-span-1 flex items-center pl-0 lg:pl-4">
						<button
							onclick={() => toggleExpand(user.id)}
							class="transition-colors cursor-pointer
								{expandedUserId === user.id ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}"
						>
							{#if expandedUserId === user.id}
								<ChevronDown size={20} />
							{:else}
								<ChevronRight size={20} />
							{/if}
						</button>
					</div>

					<!-- 用户名 + 头像 -->
					<div class="col-span-6 lg:col-span-4 flex items-center gap-3">
						<div class="w-10 h-10 rounded-full {user.bgClass} flex items-center justify-center font-bold text-sm shrink-0">
							{user.initials}
						</div>
						<p class="font-bold text-on-surface text-base truncate">{user.name}</p>
					</div>

					<!-- 备注（仅桌面端） -->
					<div class="hidden lg:block col-span-6 text-on-surface-variant text-sm truncate">
						{user.note}
					</div>

					<!-- 操作按钮 -->
					<div class="col-span-4 lg:col-span-1 flex justify-end gap-3">
						<button class="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
							<Edit size={18} />
						</button>
						<button class="text-on-surface-variant hover:text-error transition-colors cursor-pointer">
							<Trash2 size={18} />
						</button>
					</div>
				</div>

				<!-- 展开的订阅详情面板 -->
				{#if expandedUserId === user.id}
					<div class="bg-surface-low/30 p-4 lg:p-6">
						<!-- 备注（仅移动端展开时显示） -->
						{#if user.note}
							<p class="lg:hidden text-on-surface-variant text-sm mb-4">{user.note}</p>
						{/if}

						<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
							<h3 class="text-sm font-bold uppercase tracking-wider text-on-surface-variant">
								{m.subscription_cycles()}
							</h3>
							<button
								class="flex items-center gap-1.5 text-xs font-bold bg-surface-lowest border border-outline-variant/50 text-primary px-3 py-1.5 rounded-full hover:bg-primary hover:text-white transition-all shadow-editorial-sm cursor-pointer"
							>
								<Plus size={14} />
								{m.add_subscription()}
							</button>
						</div>

						<!-- 订阅表格 -->
						<div class="overflow-x-auto rounded-lg border border-outline-variant/30 bg-surface-lowest">
							<table class="w-full text-left border-collapse">
								<thead>
									<tr class="bg-surface-container/50 text-[11px] font-black uppercase tracking-widest text-on-surface-variant">
										<th class="px-4 py-3 w-32">{m.col_start_date()}</th>
										<th class="px-4 py-3 w-32">{m.col_end_date()}</th>
										<th class="px-4 py-3 w-20">{m.col_level()}</th>
										<th class="px-4 py-3">{m.col_note()}</th>
										<th class="px-4 py-3 text-right w-24">{m.col_actions()}</th>
									</tr>
								</thead>
								<tbody class="divide-y divide-outline-variant/20 text-sm">
									{#each mockSubscriptions as sub}
										<tr>
											<td class="px-4 py-3 font-medium w-32">{sub.start}</td>
											<td class="px-4 py-3 font-medium w-32 {sub.active ? 'text-primary' : ''}">
												{sub.end}
											</td>
											<td class="px-4 py-3 w-20">{sub.level}</td>
											<td class="px-4 py-3 italic text-on-surface-variant">{sub.note}</td>
											<td class="px-4 py-3 text-right w-24">
												<div class="flex justify-end gap-2">
													<button class="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
														<Edit size={16} />
													</button>
													<button class="text-on-surface-variant hover:text-error transition-colors cursor-pointer">
														<Trash2 size={16} />
													</button>
												</div>
											</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					</div>
				{/if}
			</div>
		{/each}
	</div>

	<!-- 分页 -->
	<div class="flex flex-col sm:flex-row justify-between items-center mt-12 px-2 lg:px-6 gap-4">
		<p class="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
			{m.showing_users({ from: '1', to: '3', total: '842' })}
		</p>
		<div class="flex items-center gap-2">
			<button
				class="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container text-on-surface hover:bg-surface-dim transition-all cursor-pointer"
			>
				<ChevronLeft size={18} />
			</button>
			<button
				class="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white font-bold shadow-md cursor-pointer"
			>
				1
			</button>
			<button
				class="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container text-on-surface hover:bg-surface-dim transition-all cursor-pointer"
			>
				2
			</button>
			<button
				class="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container text-on-surface hover:bg-surface-dim transition-all cursor-pointer"
			>
				3
			</button>
			<button
				class="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container text-on-surface hover:bg-surface-dim transition-all cursor-pointer"
			>
				<ChevronRight size={18} />
			</button>
		</div>
	</div>
</div>
