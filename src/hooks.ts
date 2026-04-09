import type { Reroute, Transport } from '@sveltejs/kit';
import { deLocalizeUrl } from '$lib/paraglide/runtime';

export const reroute: Reroute = (request) => deLocalizeUrl(request.url).pathname;

// SvelteKit 2.x 客户端代码需要此导出；当前项目无自定义序列化需求，导出空对象即可。
export const transport: Transport = {};
