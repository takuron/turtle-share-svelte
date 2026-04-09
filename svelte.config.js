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
	// fallback: 'index.html' 让 adapter-static 为所有未命中路由提供 SPA 入口，
	// 搭配 prerender=false 的动态路由，由客户端 SvelteKit 路由器接管。
	kit: { adapter: adapter({ fallback: 'index.html' }) },
	preprocess: [mdsvex({ extensions: ['.svx', '.md'] })],
	extensions: ['.svelte', '.svx', '.md'],
	vitePlugin: {
		// ArticleEditor 表单用 $state 捕获 initialData 初始值是有意行为，降级为警告
		onwarn(warning, defaultHandler) {
			if (warning.code === 'state_referenced_locally') return;
			defaultHandler(warning);
		}
	}
};

export default config;
