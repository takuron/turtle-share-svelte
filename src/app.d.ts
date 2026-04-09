// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}

		/**
		 * Route parameter types for parameterized routes.
		 * Maps route IDs to their expected parameter objects.
		 *
		 * 路由参数类型定义。
		 * 将路由 ID 映射到其预期的参数对象。
		 */
		// // 路由参数类型定义。
		interface RouteParams {
			'/(dashboard)/dashboard/article/edit/[id]': { id: string };
		}
	}
}

export {};
