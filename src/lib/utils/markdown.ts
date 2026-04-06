import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';

/**
 * Parses markdown to HTML and sanitizes it using DOMPurify.
 * Supports GitHub Flavored Markdown (GFM).
 *
 * @param markdown - The markdown string to parse.
 * @returns The sanitized HTML string.
 */
// // 解析 Markdown 为 HTML 并使用 DOMPurify 进行净化过滤。
// // 支持 GitHub Flavored Markdown (GFM)。
// //
// // @param markdown - 要解析的 Markdown 字符串。
// // @returns 净化后的 HTML 字符串。
export function parseMarkdown(markdown: string | undefined | null): string {
	if (!markdown) return '';

	// Configure marked for GitHub Flavored Markdown
	marked.use({
		gfm: true,
		breaks: true // convert \n to <br>
	});

	// Parse markdown to HTML
	const rawHtml = marked.parse(markdown) as string;

	// Sanitize the HTML to prevent XSS
	return DOMPurify.sanitize(rawHtml, {
		USE_PROFILES: { html: true } // Only allow safe HTML tags
	});
}
