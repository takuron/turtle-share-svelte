import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-static';
import { relative, sep } from 'node:path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		// defaults to rune mode for the project, except for `node_modules`. Can be removed in svelte 6.
		runes: ({ filename }) => {
			const relativePath = relative(import.meta.dirname, filename);
			const pathSegments = relativePath.toLowerCase().split(sep);
			const isExternalLibrary = pathSegments.includes('node_modules');

			return isExternalLibrary ? undefined : true;
		}
	},
	kit: {
		adapter: adapter(),
		prerender: {
			// 动态路由（/page/[page]、/article/[hashid] 等）无法被爬取预渲染，忽略而不报错
			handleUnseenRoutes: 'ignore'
		}
	},
	preprocess: [mdsvex({ extensions: ['.svx', '.md'] })],
	extensions: ['.svelte', '.svx', '.md'],
	vitePlugin: {
		// 在构建时将 a11y / rune 用法警告降级为 warn（而非 error），避免 adapter 无法执行
		onwarn(warning, defaultHandler) {
			const suppressCodes = [
				'a11y_label_has_associated_control',
				'state_referenced_locally'
			];
			if (suppressCodes.includes(warning.code)) return;
			defaultHandler(warning);
		}
	}
};

export default config;
