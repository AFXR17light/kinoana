## Introduction
Kinoana is a website based on [Next.js](https://nextjs.org/), using Markdown / MDX as source files, and generating website content through the folder structure.

## Usage
Please clone or fork the repository to start using it.

Local development:  
1. Install dependencies: `pnpm install`
2. Start the development server: `pnpm dev`
3. Visit: `http://localhost:3000`

Deployment:  
Deployment uses Vercel, just connect the repository to Vercel.

## Content Management
Use the `content` folder to store website content, the folder structure will be converted into website routes;  
The `index.md` or `index.mdx` in the folder will be converted into the content of the folder page, which can be configured in `frontmatter`.

Frontmatter configuration items:
- `title` Page title
- `date` Page date, such as `2024-03-19`
- `childrenDisplay` Display method of subpages, optional values: `list`, `content`, `expand`, `none`, the default is `list`, see [example page](https://kinoana.vercel.app/example).