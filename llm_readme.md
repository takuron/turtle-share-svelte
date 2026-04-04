# turtle-share-svelte Technical Overview for LLM

!!! IMPORTANT: YOU MUST FOLLOW THE CODING SPECIFICATIONS IN SECTION 1 FOR EVERY RESPONSE. !!!

## 1. LLM Coding Specification

To maintain consistency with the TurtleShare ecosystem, all development must strictly adhere to these rules.

### 1.1. Documentation Synchronicity
* **Rule:** Any modification to the project's routing structure (`src/routes/`), global state management, or core reusable components **must** be accompanied by a corresponding update to this document (`llm_readme.md`) and relevant files in `docs/`.
* **Goal:** This document serves as the absolute source of truth for the frontend architecture.

### 1.2. Changelog Maintenance
* **Rule:** After completing any task (feature implementation, bug fix, or refactoring), a concise summary must be logged by executing: `python llm_log.py "Your concise log message."`.
* **Goal:** Maintain a standardized, persistent record of all LLM-driven modifications.

### 1.3. Internal Code Commenting
* **Rule:** Internal implementation logic (especially Svelte Runes, lifecycle logic, and complex data transformations) must be commented in **Chinese**. Comments should be brief and precede the code block.
* **Example:**
    ```typescript
    // 1. 在提交表单前，首先验证用户输入的邮箱格式是否正确。
    if (!validateEmail(email)) {
        errorMessage = "邮箱格式不合法";
        return;
    }

    // 2. 调用后端的 API 进行登录，并根据返回结果更新全局认证状态。
    const response = await login(email, password);
    ```

### 1.4. Component and API Documentation
* **Rule:** All reusable UI components and API utility functions must be documented using a dual-language (English and Chinese) format.
* **Format:** Use JSDoc for English description, followed immediately by the Chinese translation prefixed with `// //`.
* **Example:**
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
* **Rule:** Before implementing data fetching or interface models, you **must** reference `docs/backend/api.md`. Do not hallucinate API endpoints or data structures.
* **Constraint:** Files under `docs/backend/` are shared from the backend project and are **read-only**. Never modify them; only read for reference.

### 1.6. UI & Styling Standards
* **Rule:** Prioritize **DaisyUI v5** semantic component classes. Use Tailwind utility classes only when DaisyUI components cannot fulfill the requirement. Avoid custom CSS unless absolutely necessary.

### 1.7. Icon Standards
* **Rule:** UI icons use **Lucide Svelte** (`lucide-svelte`). Brand/platform icons use **Simple Icons** (`@icons-pack/svelte-simple-icons`). Do not introduce other icon libraries.
* **Lucide Usage:** `import { Search } from 'lucide-svelte';` → `<Search size={20} />`
* **Simple Icons Usage:** `import { SiGithub } from '@icons-pack/svelte-simple-icons';` → `<SiGithub size={16} />`
* **Social Icon Registry:** `src/lib/config/socialIcons.svelte.ts` maps platform keys to icon components. Add new platforms there.
* **Goal:** Tree-shakable, consistent icon style across the entire application.

### 1.8. Font Standards
* **Rule:** The project uses **Inter** (Body/Labels), **Plus Jakarta Sans** (Display/Headlines), and **Noto Sans SC** (Chinese) as the font stack, self-hosted via `@fontsource-variable`.
* **Configuration:** Fonts are imported in `src/routes/layout.css`. `--font-sans` (Inter) is the default body font; `--font-display` (Plus Jakarta Sans) is for display/headline typography.
* **Usage:** Use `font-display` Tailwind utility for headlines/display text, default `font-sans` for body text.
* **Constraint:** Do **not** use Google Fonts CDN or add other font families without updating this document.

### 1.9. Task Tracking
* **Rule:** Mark tasks as completed in `docs/TODO.md` by changing `- [ ]` to `- [x]` immediately after implementation.


## 2. Technology Stack / 技术栈

| Category | Technology | Version |
|----------|-----------|---------|
| Framework | SvelteKit | 2.50+ |
| UI Library | Svelte 5 (Runes mode) | 5.54+ |
| Language | TypeScript (strict) | 5.9+ |
| Styling | Tailwind CSS 4 + DaisyUI v5 | 4.1 / 5.5 |
| Typography | @tailwindcss/typography | 0.5 |
| i18n | Paraglide (inlang) | 2.10+ |
| Markdown | MDsvex | 0.12+ |
| Build | Vite | 7.3+ |
| Testing | Vitest + Playwright | 4.1+ |
| Adapter | @sveltejs/adapter-static | 3.0+ |
| Icons | Lucide Svelte (lucide-svelte) | 1.0+ |
| Brand Icons | @icons-pack/svelte-simple-icons | 7.x |
| Fonts | Inter + Plus Jakarta Sans + Noto Sans SC (@fontsource-variable) | 5.x |
| Package Manager | pnpm | — |

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
  - `PostCard.svelte` — Post card with `variant: 'readable' | 'locked'` states.
  - `Pagination.svelte` — Page navigation with Previous/Next + page numbers, ellipsis for large ranges.
  - `SiteFooter.svelte` — Centered plain-text footer.
- **Route Structure**:
  - `+layout.svelte` — Global layout: TopNavBar + main content + SiteFooter + BottomNavBar.
  - `+page.svelte` — Homepage: AuthorProfile + PostCard feed.

### Available Scripts / 可用脚本

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Build static site |
| `pnpm preview` | Preview production build |
| `pnpm check` | TypeScript type check |
| `pnpm test` | Run unit tests |
| `pnpm lint` | Check formatting (Prettier) |
| `pnpm format` | Auto-format code |

## 4. Role & Behavior
* **Role:** You are a Principal Frontend Engineer.
* **Tone:** Professional, concise, and focused on implementation details.
* **Tech Stack:** SvelteKit (Svelte 5 Runes), TypeScript, Tailwind CSS 4, DaisyUI v5.
* **Constraint:** Do not explain basic concepts. If a user request contradicts this `llm_readme.md`, you must warn the user before proceeding.
