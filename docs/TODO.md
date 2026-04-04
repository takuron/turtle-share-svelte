# TODO - Frontend Implementation / 前端实现任务清单

## Phase 0: Project Initialization / 项目初始化

- [x] Initialize SvelteKit project with Svelte 5, TypeScript, Tailwind CSS 4
- [x] Configure Paraglide i18n (en, zh-cn)
- [x] Configure MDsvex for Markdown support
- [x] Configure Vitest + Playwright for testing
- [x] Install and configure DaisyUI v5
- [x] Create documentation structure (`docs/`)
- [ ] Set up global layout with DaisyUI theme and responsive navigation
- [ ] Implement Auth store (`src/lib/stores/auth.svelte.ts`)
- [ ] Implement Theme store (`src/lib/stores/theme.svelte.ts`)
- [ ] Create API client utility (`src/lib/api/client.ts`)

## Phase 1: Authentication / 认证

- [x] Admin login page (`/admin`) + User login page (`/user`)
- [ ] JWT token management (store, refresh, clear)
- [ ] Protected route guard for `/admin/*`
- [ ] Logout functionality

## Phase 2: Admin Dashboard / 管理后台

- [ ] Admin layout with sidebar navigation
- [ ] Dashboard overview page (`/admin`)
- [ ] Article management CRUD (`/admin/articles`)
- [ ] Article editor with Markdown preview
- [ ] File/attachment upload
- [ ] User management (`/admin/users`)
- [ ] Subscription tier management (`/admin/tiers`)

## Phase 3: Public Content / 公开内容

- [ ] Landing/home page design
- [ ] Article list page
- [ ] Article detail page (`/articles/[slug]`) with access control
- [ ] Subscription page

## Phase 4: Polish / 完善

- [ ] Theme switching (light/dark)
- [ ] Responsive design audit
- [ ] i18n message completion (en + zh-cn)
- [ ] Error handling and loading states
- [ ] SEO metadata
