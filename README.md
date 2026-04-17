# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).

## 服务器部署（Node 18 / Docker）

### 方式 A：静态文件构建 + Node 启动（适合只有 Node 18）

```bash
npm ci
npm run build
npm run start
```

默认端口为 `4173`，可用反向代理（Nginx）转发到该端口。

### 方式 B：Docker 一键部署（推荐）

```bash
docker compose up -d --build
```

默认映射到 `http://<server-ip>:8080`。
