# Routing Structure / 路由结构

## Overview / 概述

TurtleShare frontend uses SvelteKit's file-based routing with Paraglide i18n URL localization.

TurtleShare 前端使用 SvelteKit 的文件路由系统，配合 Paraglide i18n URL 本地化。

## Current Route Hierarchy / 当前路由层级

```
src/routes/
├── +layout.svelte      # 根布局：引入全局样式、favicon、语言切换
├── +page.svelte        # 首页（待实现）
└── layout.css          # 全局样式入口：Tailwind CSS + DaisyUI v5 + Typography
```

## Layout Chain / 布局链

### Root Layout (`+layout.svelte`)

- Imports global CSS (`layout.css`)
- Sets favicon
- Provides locale switcher (hidden, for Paraglide crawlability)
- Renders child content via `{@render children()}`

## i18n URL Pattern / 国际化 URL 模式

Paraglide handles URL-based locale routing automatically:

- `/` → English (default locale)
- `/zh-cn/` → Simplified Chinese

## Planned Routes / 计划路由

> To be defined based on backend API endpoints. See `docs/architecture.md` for backend feature reference.

| Route                 | Description                       |
| --------------------- | --------------------------------- |
| `/`                   | Landing / Home page               |
| `/login`              | Admin login                       |
| `/admin/`             | Admin dashboard                   |
| `/admin/articles`     | Article management                |
| `/admin/users`        | User management                   |
| `/admin/tiers`        | Subscription tier management      |
| `/post/[post_hashid]` | Public article view (detail page) |
| `/subscribe`          | Subscription page                 |
