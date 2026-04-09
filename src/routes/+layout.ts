// 1. 静态适配器要求所有页面预渲染。
export const prerender = true;

// 2. 关闭 SSR，dev 模式下也以纯客户端方式运行，避免服务端访问 localStorage 等浏览器 API。
export const ssr = false;
