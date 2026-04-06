import * as m from '$lib/paraglide/messages.js';
import type { ApiError } from '$lib/api/client';

/**
 * Maps an API error to a localized message.
 * @param error - The API error object or a generic error
 * @returns Localized error message string
 */
// // 将 API 错误映射为本地化的错误信息。
// // @param error - API 错误对象或普通错误
// // @returns 本地化错误信息字符串
export function mapApiError(error: unknown): string {
	if (!error) return m.err_unknown({ message: 'Unknown' });

	// 如果是我们定义的 ApiError 结构
	if (typeof error === 'object' && 'success' in error && error.success === false && 'error' in error) {
		const apiErr = error as ApiError;
		const code = apiErr.error?.code;

		switch (code) {
			case 'UNAUTHORIZED':
				return m.err_unauthorized();
			case 'FORBIDDEN':
				return m.err_forbidden();
			case 'NOT_FOUND':
				return m.err_not_found();
			case 'VALIDATION_ERROR':
				return m.err_validation();
			case 'INTERNAL_ERROR':
				return m.err_internal();
			case 'TOO_MANY_REQUESTS':
				return m.err_too_many_requests();
			default:
				return m.err_unknown({ message: apiErr.error?.message || code || 'Unknown code' });
		}
	}

	// 其他原生 Error 或异常
	if (error instanceof Error) {
		return m.err_unknown({ message: error.message });
	}

	return m.err_unknown({ message: String(error) });
}
