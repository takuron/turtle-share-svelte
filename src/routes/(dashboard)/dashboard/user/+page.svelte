<script lang="ts">
	/**
	 * Admin User Management page with paginated user list and expandable subscription details.
	 * 管理员用户管理页面，包含分页用户列表和可展开的订阅详情。
	 */
	// // 管理员用户管理页面，从后端 API 获取真实用户数据。
	import { CirclePlus, Loader2 } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { fetchAdminUsersPage, fetchAdminUsersPageInfo } from '$lib/api/admin/users';
	import { ADMIN_USERS_PAGE_SIZE, type AdminUserItem, type PageInfo } from '$lib/api/types';
	import { onMount } from 'svelte';
	import UserListCard from '$lib/components/admin/UserListCard.svelte';
	import AdminPagination from '$lib/components/admin/AdminPagination.svelte';
	import UserEditModal from '$lib/components/admin/UserEditModal.svelte';

	// 1. 页面状态。
	let users = $state<AdminUserItem[]>([]);
	let pageInfo = $state<PageInfo | null>(null);
	let currentPage = $state(1);
	let loading = $state(true);
	let error = $state<string | null>(null);

	// 2. 展开状态追踪。
	let expandedUserId = $state<string | null>(null);

	function toggleExpand(hashId: string) {
		expandedUserId = expandedUserId === hashId ? null : hashId;
	}

	// 3. 加载指定页数据。
	async function loadPage(page: number) {
		loading = true;
		error = null;
		expandedUserId = null;

		try {
			// 并行请求用户列表和分页信息。
			const [usersRes, pageInfoRes] = await Promise.all([
				fetchAdminUsersPage(page),
				fetchAdminUsersPageInfo()
			]);

			if (usersRes.success) {
				users = usersRes.data;
			} else {
				error = usersRes.error.message;
				return;
			}

			if (pageInfoRes.success) {
				pageInfo = pageInfoRes.data;
			}

			currentPage = page;
		} catch (e) {
			error = String(e);
		} finally {
			loading = false;
		}
	}

	// 4. 计算当前页的展示范围文本。
	function getShowingText(): string {
		if (!pageInfo) return '';
		const from = (currentPage - 1) * ADMIN_USERS_PAGE_SIZE + 1;
		const to = Math.min(currentPage * ADMIN_USERS_PAGE_SIZE, pageInfo.total_items);
		return m.showing_users({
			from: String(from),
			to: String(to),
			total: String(pageInfo.total_items)
		});
	}

	// 5. 编辑/创建用户模态框状态。
	let isModalOpen = $state(false);
	let editingUser = $state<AdminUserItem | null>(null);

	function openCreateModal() {
		editingUser = null;
		isModalOpen = true;
	}

	function openEditModal(user: AdminUserItem) {
		editingUser = user;
		isModalOpen = true;
	}

	async function handleModalSubmit(data: any) {
		// 这里暂未实现真实的 API 调用，先模拟提交成功
		console.log('Submit user data:', data);
		isModalOpen = false;
		// 重新加载列表
		loadPage(currentPage);
	}

	onMount(() => {
		loadPage(1);
	});
</script>

<!-- 用户管理页面 -->
<div class="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
	<h2 class="px-2 font-display text-3xl font-extrabold tracking-tight text-on-surface lg:px-6">
		{m.nav_user_management()}
	</h2>
	<button
		class="flex cursor-pointer items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white shadow-xl shadow-primary/20 transition-all gradient-cta hover:scale-[1.02] active:scale-95 lg:px-8 lg:py-4 lg:text-base"
		onclick={openCreateModal}
	>
		<CirclePlus size={20} />
		{m.create_new_user()}
	</button>
</div>

<div class="space-y-4">
	<!-- 表头 -->
	<div
		class="hidden grid-cols-12 px-6 py-3 text-xs font-black tracking-widest text-on-surface-variant uppercase lg:grid"
	>
		<div class="col-span-1 pl-4"></div>
		<div class="col-span-4">{m.col_username()}</div>
		<div class="col-span-6">{m.col_note()}</div>
		<div class="col-span-1 text-right">{m.col_actions()}</div>
	</div>

	<!-- 加载状态 -->
	{#if loading}
		<div class="flex items-center justify-center py-20">
			<Loader2 size={24} class="animate-spin text-primary" />
			<span class="ml-3 text-sm text-on-surface-variant">{m.loading_articles()}</span>
		</div>
	{:else if error}
		<!-- 错误状态 -->
		<div class="flex items-center justify-center py-20">
			<p class="text-sm text-error">{error}</p>
		</div>
	{:else if users.length === 0}
		<!-- 空状态 -->
		<div class="flex items-center justify-center py-20">
			<p class="text-sm text-on-surface-variant">{m.no_articles()}</p>
		</div>
	{:else}
		<!-- 用户列表卡片 -->
		<div class="overflow-hidden rounded-xl bg-surface-lowest shadow-editorial-sm">
			{#each users as user (user.hash_id)}
				<UserListCard
					{user}
					expanded={expandedUserId === user.hash_id}
					ontoggle={() => toggleExpand(user.hash_id)}
					onedit={() => openEditModal(user)}
				/>
			{/each}
		</div>

		<!-- 分页 -->
		{#if pageInfo}
			<AdminPagination
				{currentPage}
				totalPages={pageInfo.total_pages}
				onpagechange={loadPage}
				showingText={getShowingText()}
			/>
		{/if}
	{/if}
</div>

<!-- 用户编辑/创建模态框 -->
<UserEditModal
	open={isModalOpen}
	user={editingUser}
	onclose={() => (isModalOpen = false)}
	onsubmit={handleModalSubmit}
/>
