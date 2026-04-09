# turtle-share-svelte Technical Overview for LLM

!!! IMPORTANT: YOU MUST FOLLOW THE CODING SPECIFICATIONS IN SECTION 1 FOR EVERY RESPONSE. !!!

## 1. LLM Coding Specification

To maintain consistency with the TurtleShare ecosystem, all development must strictly adhere to these rules.

### 1.1. Documentation Synchronicity

- **Rule:** Any modification to the project's routing structure (`src/routes/`), global state management, or core reusable components **must** be accompanied by a corresponding update to this document (`llm_readme.md`) and relevant files in `docs/`.
- **Goal:** This document serves as the absolute source of truth for the frontend architecture.

### 1.2. Changelog Maintenance

- **Rule:** After completing any task (feature implementation, bug fix, or refactoring), a concise summary must be logged by executing: `python llm_log.py "Your concise log message."`.
- **Goal:** Maintain a standardized, persistent record of all LLM-driven modifications.

### 1.3. Internal Code Commenting

- **Rule:** Internal implementation logic (especially Svelte Runes, lifecycle logic, and complex data transformations) must be commented in **Chinese**. Comments should be brief and precede the code block.
- **Example:**

  ```typescript
  // 1. 在提交表单前，首先验证用户输入的邮箱格式是否正确。
  if (!validateEmail(email)) {
  	errorMessage = '邮箱格式不合法';
  	return;
  }

  // 2. 调用后端的 API 进行登录，并根据返回结果更新全局认证状态。
  const response = await login(email, password);
  ```

### 1.4. Component and API Documentation

- **Rule:** All reusable UI components and API utility functions must be documented using a dual-language (English and Chinese) format.
- **Format:** Use JSDoc for English description, followed immediately by the Chinese translation prefixed with `// //`.
- **Example:**
  ```svelte
  <script lang="ts">
  	/**
  	 * A button component that follows DaisyUI v5 styling.
  	 * * @prop {string} type - The button style type (e.g., 'primary', 'secondary').
  	 * @prop {boolean} loading - Shows a spinner if true.
  	 */
  	// // 一个遵循 DaisyUI v5 样式的按钮组件。
  	// //
  	// // @prop {string} type - 按钮样式类型（例如 'primary'、'secondary'）。
  	// // @prop {boolean} loading - 为 true 时显示加载图标。
  	let { type = 'primary', loading = false, children } = $props();
  </script>
  ```

### 1.5. Backend Alignment

- **Rule:** Before implementing data fetching or interface models, you **must** reference `docs/backend/api.md`. Do not hallucinate API endpoints or data structures.
- **Constraint:** Files under `docs/backend/` are shared from the backend project and are **read-only**. Never modify them; only read for reference.

### 1.6. UI & Styling Standards

- **Rule:** Prioritize **DaisyUI v5** semantic component classes. Use Tailwind utility classes only when DaisyUI components cannot fulfill the requirement. Avoid custom CSS unless absolutely necessary.

### 1.7. Icon Standards

- **Rule:** UI icons use **Lucide Svelte** (`lucide-svelte`). Brand/platform icons use **Simple Icons** (`@icons-pack/svelte-simple-icons`). Do not introduce other icon libraries.
- **Lucide Usage:** `import { Search } from 'lucide-svelte';` → `<Search size={20} />`
- **Simple Icons Usage:** `import { SiGithub } from '@icons-pack/svelte-simple-icons';` → `<SiGithub size={16} />`
- **Social Icon Registry:** `src/lib/config/socialIcons.svelte.ts` maps platform keys to icon components. Add new platforms there.
- **Goal:** Tree-shakable, consistent icon style across the entire application.

### 1.8. Font Standards

- **Rule:** The project uses **Inter** (Body/Labels), **Plus Jakarta Sans** (Display/Headlines), and **Noto Sans SC** (Chinese) as the font stack, self-hosted via `@fontsource-variable`.
- **Configuration:** Fonts are imported in `src/routes/layout.css`. `--font-sans` (Inter) is the default body font; `--font-display` (Plus Jakarta Sans) is for display/headline typography.
- **Usage:** Use `font-display` Tailwind utility for headlines/display text, default `font-sans` for body text.
- **Constraint:** Do **not** use Google Fonts CDN or add other font families without updating this document.

### 1.9. Task Tracking

- **Rule:** Mark tasks as completed in `docs/TODO.md` by changing `- [ ]` to `- [x]` immediately after implementation.

## 2. Technology Stack / 技术栈

| Category        | Technology                                                      | Version   |
| --------------- | --------------------------------------------------------------- | --------- |
| Framework       | SvelteKit                                                       | 2.50+     |
| UI Library      | Svelte 5 (Runes mode)                                           | 5.54+     |
| Language        | TypeScript (strict)                                             | 5.9+      |
| Styling         | Tailwind CSS 4 + DaisyUI v5                                     | 4.1 / 5.5 |
| Typography      | @tailwindcss/typography                                         | 0.5       |
| i18n            | Paraglide (inlang)                                              | 2.10+     |
| Markdown        | MDsvex                                                          | 0.12+     |
| Build           | Vite                                                            | 7.3+      |
| Testing         | Vitest + Playwright                                             | 4.1+      |
| Adapter         | @sveltejs/adapter-static                                        | 3.0+      |
| Icons           | Lucide Svelte (lucide-svelte)                                   | 1.0+      |
| Brand Icons     | @icons-pack/svelte-simple-icons                                 | 7.x       |
| Fonts           | Inter + Plus Jakarta Sans + Noto Sans SC (@fontsource-variable) | 5.x       |
| Package Manager | pnpm                                                            | —         |

### Key Configuration Details / 关键配置

- **Svelte Runes**: Enabled globally for all project source files (not `node_modules`). See `svelte.config.js`.
- **Static Adapter**: The project builds as a static site. Backend API calls happen at runtime via fetch.
- **CSS Entry Point**: `src/routes/layout.css` imports Tailwind CSS, @tailwindcss/typography, and DaisyUI v5.
- **Theme System**: Custom DaisyUI themes (`editorial` light, `editorial-dark` dark) defined in `layout.css` via `@plugin "daisyui/theme" {}`. Design tokens follow `stitch/DESIGN.md` ("The Fluid Editorial"). Theme switching via `data-theme` attribute on `<html>`.
- **Fonts**: Inter (Body, `--font-sans`), Plus Jakarta Sans (Display/Headlines, `--font-display`), Noto Sans SC (Chinese), self-hosted via `@fontsource-variable`.
- **Editorial Design Tokens** (beyond DaisyUI):
  - Surface hierarchy: `bg-surface-lowest`, `bg-surface-low`, `bg-surface`, `bg-surface-container`, `bg-surface-dim`
  - Text colors: `text-on-surface`, `text-on-surface-variant`
  - Utility classes: `glass` (glassmorphism), `gradient-cta` (primary gradient), `ghost-border` (accessibility border)
  - Shadows: `shadow-ambient`, `shadow-editorial-sm`
- **Icons**: Lucide Svelte — import individual components, tree-shakable.
- **i18n Locales**: `en` (base), `zh-cn`. URL pattern: `/` (en), `/zh-cn/` (zh-cn).
- **MDsvex Extensions**: `.svx`, `.md` files are treated as Svelte components.
- **Layout Components** (`src/lib/components/`):
  - `TopNavBar.svelte` — Fixed top nav with glass effect, site name + login button.
  - `AuthorProfile.svelte` — Author profile header (magazine cover style).
  - `PostCard.svelte` — Post card displaying article data. Props: `title`, `hashId`, `coverImage`, `requiredTier`, `accessible`, `createdAt`. Shows readable/locked state based on `accessible`.
  - `ArticleFeed.svelte` — Shared article feed component. Accepts `page` prop, fetches articles + page info from API, renders PostCards + Pagination.
  - `Pagination.svelte` — Link-based page navigation. Props: `currentPage`, `totalPages`, `getHref`. Uses `<a>` tags for SEO-friendly navigation.
  - `SiteFooter.svelte` — Centered plain-text footer.
- **Login Components** (`src/lib/components/login/`):
  - `LoginForm.svelte` — Reusable login form with `mode: 'user' | 'admin'` prop. Calls login API, shows error/loading states, redirects to `/` on success.
- **Admin Components** (`src/lib/components/admin/`):
  - `AdminSidebar.svelte` — Dashboard sidebar with nav links, home link, logout. Props: `open`, `onclose`. Responsive: off-screen on mobile, toggled via floating button.
  - `UserListCard.svelte` — Single user row in admin user list. Props: `user`, `expanded`, `ontoggle`. Expandable to show UserSubscriptionPanel.
  - `UserSubscriptionPanel.svelte` — Subscription management panel for a user. Props: `user`. Fetches all subscriptions via API, client-side pagination (5/page), mini-pagination (w-7 h-7). Includes Add/Edit capabilities calling `SubscriptionEditModal`.
  - `SubscriptionEditModal.svelte` — Modal for adding/editing a subscription. Props: `open`, `subscription`, `onclose`, `onsubmit`. Includes quick duration logic.
  - `AdminPagination.svelte` — Reusable pagination. Props: `currentPage`, `totalPages`, `onpagechange`, `showingText?`. Displays page numbers with prev/next buttons.
- **API & Stores** (API modules organized by permission level under `src/lib/api/`):
  - `src/lib/api/client.ts` — Generic `apiRequest()` helper with auto-attached JWT Authorization header.
  - `src/lib/api/types.ts` — Shared types: `ArticleListItem`, `AdminArticleRawItem`, `AdminUserItem`, `AdminSubscriptionItem`, `PageInfo`, `DEFAULT_PAGE_SIZE`, `ADMIN_USERS_PAGE_SIZE`, `ADMIN_SUBSCRIPTIONS_PAGE_SIZE`.
  - `src/lib/api/public/auth.ts` — Login API: `loginRequest()` for admin/user login. Endpoints: `POST /api/admin/login`, `POST /api/users/login`.
  - `src/lib/api/public/site.ts` — Site API: `fetchSiteInfoRequest()`. Endpoint: `GET /api/public/site-info`.
  - `src/lib/api/public/articles.ts` — Public articles API: `fetchPublicArticlesPage()`, `fetchPublicArticlesPageInfo()`. Endpoints: `GET /api/public/articles/page/:page`, `GET /api/public/articles/page`.
  - `src/lib/api/user/articles.ts` — User articles API: `fetchUserArticlesPage()`, `fetchUserArticlesPageInfo()`. Endpoints: `GET /api/users/articles/page/:page`, `GET /api/users/articles/page`. Requires user JWT.
  - `src/lib/api/admin/articles.ts` — Admin articles API: `fetchAdminArticlesPage()`, `fetchAdminArticlesPageInfo()`. Endpoints: `GET /api/admin/articles/page/:page`, `GET /api/admin/articles/page`. Requires admin JWT. Normalizes `is_public` → `accessible=true`.
  - `src/lib/api/admin/users.ts` — Admin users API: `fetchAdminUsersPage()`, `fetchAdminUsersPageInfo()`, `fetchAdminUserSubscriptions()`. Endpoints: `GET /api/admin/users/page/:page`, `GET /api/admin/users/page`, `GET /api/admin/users/:hash_id/subscriptions`. Requires admin JWT.
  - `src/lib/stores/auth.svelte.ts` — Auth store: JWT decode, `login()`, `logout()`, `initAuth()`. Two roles (admin/user) are mutually exclusive. Delegates API calls to `src/lib/api/public/auth.ts`.
  - `src/lib/stores/site.svelte.ts` — Site info store with `fetchSiteInfo()`. Delegates API calls to `src/lib/api/public/site.ts`.
- **Route Structure**:
  - `+layout.svelte` — Root layout: CSS imports, favicon, i18n links, `initAuth()` + `fetchSiteInfo()`.
  - `(main)/+layout.svelte` — Main layout group: TopNavBar + main content + SiteFooter.
  - `(main)/+page.svelte` — Homepage: AuthorProfile + ArticleFeed (page 1).
  - `(main)/page/[page]/+page.svelte` — Paginated article list: AuthorProfile + ArticleFeed (page N). Redirects `/page/1` to `/`.
  - `(main)/post/[post_hashid]/+page.svelte` — Article detail page (skeleton implemented).
  - `(auth)/+layout.svelte` — Auth layout group: full-screen, no nav/footer, no scroll. Redirects to `/` if already logged in.
  - `(auth)/user/+page.svelte` — User login page (dot-pattern background).
  - `(auth)/admin/+page.svelte` — Admin login page (dot-pattern background).
  - `(dashboard)/dashboard/+layout.svelte` — Dashboard layout group: fixed sidebar (72w) + main content area. Admin-only guard redirects non-admin to `/admin`. Sidebar has nav links (User/Article/File), home link, and logout button.
  - `(dashboard)/dashboard/user/+page.svelte` — User Management page. Fetches real user data from API (page_size=5), paginated list with expandable subscription panel (subscription loading TBD).
  - `(dashboard)/dashboard/article/+page.svelte` — Content Management page (prototype implemented with mock data).
  - `(dashboard)/dashboard/file/+page.svelte` — File Management page (skeleton).

### Available Scripts / 可用脚本

| Command        | Description                 |
| -------------- | --------------------------- |
| `pnpm dev`     | Start dev server            |
| `pnpm build`   | Build static site           |
| `pnpm preview` | Preview production build    |
| `pnpm check`   | TypeScript type check       |
| `pnpm test`    | Run unit tests              |
| `pnpm lint`    | Check formatting (Prettier) |
| `pnpm format`  | Auto-format code            |

## 4. Role & Behavior

- **Role:** You are a Principal Frontend Engineer.
- **Tone:** Professional, concise, and focused on implementation details.
- **Tech Stack:** SvelteKit (Svelte 5 Runes), TypeScript, Tailwind CSS 4, DaisyUI v5.
- **Constraint:** Do not explain basic concepts. If a user request contradicts this `llm_readme.md`, you must warn the user before proceeding.
