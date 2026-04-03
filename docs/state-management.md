# State Management / 状态管理

## Overview / 概述

TurtleShare frontend uses Svelte 5 Runes for all state management. No external state management library is used.

TurtleShare 前端使用 Svelte 5 Runes 管理所有状态，不使用外部状态管理库。

## Conventions / 约定

- Use `$state()` for reactive local state within components.
- Use `$derived()` for computed values.
- Use `$effect()` for side effects triggered by state changes.
- Shared global state should be defined in `src/lib/stores/` as module-level rune exports.

## Global Stores / 全局状态

> 以下为计划中的全局状态模块，尚未实现。

### Auth Store (`src/lib/stores/auth.svelte.ts`) — Planned

Manages admin authentication state.

| Field | Type | Description |
|-------|------|-------------|
| `token` | `string \| null` | JWT token from backend |
| `isAuthenticated` | `boolean` (derived) | Whether a valid token exists |

### Theme Store (`src/lib/stores/theme.svelte.ts`) — Planned

Manages DaisyUI theme selection.

| Field | Type | Description |
|-------|------|-------------|
| `current` | `string` | Active DaisyUI theme name |

## Pattern Example / 模式示例

```typescript
// src/lib/stores/auth.svelte.ts

// 1. 定义全局认证状态，使用 Svelte 5 Runes。
let token = $state<string | null>(null);
let isAuthenticated = $derived(token !== null);

export function setToken(t: string) {
    token = t;
}

export function clearToken() {
    token = null;
}

export { token, isAuthenticated };
```
