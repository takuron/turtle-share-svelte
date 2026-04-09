import { error } from '@sveltejs/kit';
import { fetchPublicArticleDetail } from '$lib/api/public/articles';
import { fetchUserArticleDetail } from '$lib/api/user/articles';
import { fetchAdminArticleDetail } from '$lib/api/admin/articles';
import { authStore, initAuth } from '$lib/stores/auth.svelte';
import { building } from '$app/environment';

/** @type {import('./$types').PageLoad} */
export async function load({ params, fetch }) {
	const hashId = params.hashid;

	// SSG 阶段跳过数据获取，避免 build 失败
	if (building) {
		return { article: null };
	}

	// 确保认证状态已从 localStorage 恢复（load 早于 onMount 执行）。
	if (!authStore.initialized) {
		initAuth();
	}

	let res;

	// 1. 根据当前用户的角色选择相应的 API 进行调用。
	// 管理员使用 admin 接口，普通用户使用 user 接口，未登录使用 public 接口。
	const role = authStore.session?.role;

	if (role === 'admin') {
		res = await fetchAdminArticleDetail(hashId, fetch);
	} else if (role === 'user') {
		res = await fetchUserArticleDetail(hashId, fetch);
	} else {
		res = await fetchPublicArticleDetail(hashId, fetch);
	}
	// 2. 如果请求成功，返回文章数据。
	if (res.success) {
		return {
			article: res.data
		};
	}

	// 3. 如果请求失败，抛出带状态码的错误。
	if (res.error.code === 'NOT_FOUND') {
		error(404, 'Article not found');
	} else if (res.error.code === 'FORBIDDEN') {
		error(403, 'Insufficient subscription tier');
	} else if (res.error.code === 'UNAUTHORIZED') {
		error(401, 'Unauthorized');
	}

	error(500, res.error.message || 'Internal Server Error');
}
