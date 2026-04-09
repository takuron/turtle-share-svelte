import { apiRequest, getAuthToken, type ApiResponse } from '../client';
import { ADMIN_FILES_PAGE_SIZE, type AdminFileItem, type PageInfo } from '../types';
import { API_URL } from '$lib/config';

/**
 * Fetch a paginated list of files for admin.
 * 获取管理员文件分页列表。
 *
 * @param page - The page number to fetch.
 * @param pageSize - Number of items per page.
 */
// // 获取管理员文件分页列表。
export async function fetchAdminFilesPage(
	page: number,
	pageSize: number = ADMIN_FILES_PAGE_SIZE
): Promise<ApiResponse<AdminFileItem[]>> {
	return apiRequest<AdminFileItem[]>(`/admin/files/page/${page}?page_size=${pageSize}`);
}

/**
 * Fetch total pages and items info for admin files.
 * 获取管理员文件分页信息（总页数、总条数）。
 *
 * @param pageSize - Number of items per page.
 */
// // 获取管理员文件分页信息（总页数、总条数）。
export async function fetchAdminFilesPageInfo(
	pageSize: number = ADMIN_FILES_PAGE_SIZE
): Promise<ApiResponse<PageInfo>> {
	return apiRequest<PageInfo>(`/admin/files/page?page_size=${pageSize}`);
}

/**
 * Upload a file.
 * 上传文件。
 *
 * @param file - The file to upload.
 * @param onProgress - Optional callback for upload progress (0-100).
 */
// // 上传文件。
export async function uploadAdminFile(
	file: File,
	onProgress?: (progress: number) => void
): Promise<ApiResponse<AdminFileItem>> {
	const formData = new FormData();
	formData.append('file', file);

	// 复用全局 token 获取逻辑，避免重复实现。
	const token = getAuthToken();

	// 上传超时时间：2 分钟。
	const UPLOAD_TIMEOUT_MS = 120_000;

	return new Promise((resolve) => {
		const xhr = new XMLHttpRequest();
		xhr.open('POST', `${API_URL}/admin/files`, true);
		xhr.timeout = UPLOAD_TIMEOUT_MS;

		if (token) {
			xhr.setRequestHeader('Authorization', `Bearer ${token}`);
		}

		if (onProgress && xhr.upload) {
			xhr.upload.onprogress = (event) => {
				if (event.lengthComputable) {
					const percentComplete = Math.round((event.loaded / event.total) * 100);
					onProgress(percentComplete);
				}
			};
		}

		xhr.onload = () => {
			try {
				const response = JSON.parse(xhr.responseText);
				resolve(response as ApiResponse<AdminFileItem>);
			} catch {
				resolve({
					success: false,
					error: { code: 'PARSE_ERROR', message: 'Failed to parse response' }
				});
			}
		};

		xhr.onerror = () => {
			resolve({
				success: false,
				error: { code: 'NETWORK_ERROR', message: 'Network error occurred' }
			});
		};

		xhr.ontimeout = () => {
			resolve({
				success: false,
				error: { code: 'TIMEOUT', message: 'Upload timed out' }
			});
		};

		xhr.send(formData);
	});
}

/**
 * Delete a file by hash ID.
 * 删除指定文件。
 *
 * @param hashId - The hash ID of the file.
 */
// // 删除指定文件。
export async function deleteAdminFile(hashId: string): Promise<ApiResponse<{ deleted: boolean }>> {
	return apiRequest<{ deleted: boolean }>(`/admin/files/${hashId}`, {
		method: 'DELETE'
	});
}
