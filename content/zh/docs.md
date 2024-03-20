---
title: 文档
---

## 简介

Kinoana 是个人博客和知识库系统，基于 [Next.js](https://nextjs.org/) 开发，使用 Markdown / MDX 作为源文件，通过文件夹结构生成网站内容。

## 使用

请 clone 或 folk 仓库以开始使用。

本地开发：

1. 安装依赖：`pnpm install`
2. 启动开发服务器：`pnpm dev`
3. 访问：`http://localhost:3000`

部署：  
部署使用 Vercel，将仓库连接到 Vercel 即可。

## 内容管理

使用 `content` 文件夹存放网站内容，文件夹结构会被转换为网站路由；  
文件夹内的 `index.md` 或 `index.mdx` 会被转换为该文件夹页面的内容，可在 `frontmatter` 中进行配置。

frontmatter 配置项：

- `title` 页面标题
- `date` 页面日期，如 `2024-03-19`
- `preview` 页面内容描述
- `childrenDisplay` 子页面展示方式，可选值：`list`、`post`、`content`、`expand`、`none`，默认为 `list`，详见[示例页面](/zh/example)。

所有 frontmatter 配置项均为可选项，也可以不包含 frontmatter。
