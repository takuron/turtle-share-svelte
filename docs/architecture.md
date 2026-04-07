# TurtleShare Frontend Architecture

# TurtleShare 前端架构文档

## 1. Overview / 概述

TurtleShare is a single-administrator membership content distribution platform, similar to Afdian/Patreon. This document describes the frontend architecture.

TurtleShare 是一个单管理员的会员内容分发平台，类似于爱发电/Patreon。本文档描述前端架构。

The backend is built with Rust (Axum + SQLite). Backend documentation is available in `docs/backend/` (read-only reference).

后端使用 Rust（Axum + SQLite）构建。后端文档位于 `docs/backend/`（只读参考）。

## 2. Tech Stack / 技术栈

| Category   | Technology                  | Version   |
| ---------- | --------------------------- | --------- |
| Framework  | SvelteKit                   | 2.50+     |
| UI Library | Svelte 5 (Runes mode)       | 5.54+     |
| Language   | TypeScript (strict)         | 5.9+      |
| Styling    | Tailwind CSS 4 + DaisyUI v5 | 4.1 / 5.5 |
| Typography | @tailwindcss/typography     | 0.5       |
| i18n       | Paraglide (inlang)          | 2.10+     |
| Markdown   | MDsvex                      | 0.12+     |
| Build      | Vite                        | 7.3+      |
| Testing    | Vitest + Playwright         | 4.1+      |
| Adapter    | @sveltejs/adapter-static    | 3.0+      |

## 3. Frontend-Backend Integration / 前后端集成

The frontend is built as a static site and deployed to the backend's `/static` directory:

1. `pnpm build` produces static HTML/CSS/JS in the `build/` directory.
2. The built files are served by the Rust backend's static file fallback (SPA routing).
3. API calls from the frontend go to `/api/*` endpoints on the same origin.
4. Uploaded files are accessed via `/files/*` routes.

### API Response Format / API 响应格式

All backend API responses follow a consistent format (see `docs/backend/api.md` for full details):

```json
// 成功响应
{ "success": true, "data": <response_data> }

// 错误响应
{ "success": false, "error": { "code": "ERROR_CODE", "message": "Human-readable message" } }
```

### Common Error Codes / 常见错误码

- `UNAUTHORIZED` (401) — invalid or missing token
- `FORBIDDEN` (403) — insufficient permissions
- `NOT_FOUND` (404) — resource not found
- `VALIDATION_ERROR` (400) — invalid input
- `TOO_MANY_REQUESTS` (429) — rate limit exceeded
- `INTERNAL_ERROR` (500) — server error

## 4. Authentication Flow / 认证流程

### Admin Authentication / 管理员认证

1. Admin submits credentials via login page → `POST /api/admin/login`
2. Backend returns JWT token (`sub: "admin", role: "admin"`)
3. Frontend stores token in memory (Svelte Runes state)
4. Token attached to subsequent API requests via `Authorization: Bearer <token>` header
5. Token expiration handled client-side with redirect to login

### User Authentication / 用户认证

1. User submits credentials → `POST /api/users/login`
2. Backend returns JWT token (`sub: "user:<hash_id>", role: "user"`)
3. Same storage and header pattern as admin

### Access Control / 访问控制

- **Public articles** (`is_public=true`, `required_tier=0`): accessible to everyone
- **Public articles** (`is_public=true`, `required_tier>0`): title/cover visible, content requires subscription
- **Private articles**: only visible to users with sufficient tier at article's `created_at` time
- **Files**: direct access via `/files/:uuid/:filename` (no auth required, UUID-protected)

## 5. Key API Endpoints / 关键 API 端点

> Complete API documentation: `docs/backend/api.md`

### Public (no auth)

| Method | Endpoint                        | Description                            |
| ------ | ------------------------------- | -------------------------------------- |
| GET    | `/api/health`                   | Health check                           |
| GET    | `/api/public/site-info`         | Site configuration (name, theme, etc.) |
| GET    | `/api/public/articles`          | List public articles                   |
| GET    | `/api/public/articles/:hash_id` | Public article detail (tier 0 only)    |

### User (user JWT)

| Method | Endpoint                       | Description                 |
| ------ | ------------------------------ | --------------------------- |
| POST   | `/api/users/login`             | User login                  |
| PUT    | `/api/users/password`          | Change password             |
| GET    | `/api/users/subscriptions`     | Own subscription history    |
| GET    | `/api/users/articles`          | Accessible articles list    |
| GET    | `/api/users/articles/:hash_id` | Article detail (tier-gated) |

### Admin (admin JWT)

| Method | Endpoint                             | Description             |
| ------ | ------------------------------------ | ----------------------- |
| POST   | `/api/admin/login`                   | Admin login             |
| CRUD   | `/api/admin/users/*`                 | User management         |
| CRUD   | `/api/admin/articles/*`              | Article management      |
| CRUD   | `/api/admin/files/*`                 | File management         |
| CRUD   | `/api/admin/users/:id/subscriptions` | Subscription management |

## 6. Frontend Documentation / 前端文档

- [Routing Structure / 路由结构](./routing.md)
- [State Management / 状态管理](./state-management.md)
- [TODO / 任务清单](./TODO.md)

## 7. Backend Reference / 后端参考文档

> `docs/backend/` 为后端项目共享文档，**只读不可修改**，仅供前端开发查阅。

- [API Endpoints / API 端点](./backend/api.md)
