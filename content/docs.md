## Introduction

Kinoana is a personal wiki and blog. It is based on [Next.js](https://nextjs.org/), using Markdown / MDX as source files, and generating website content through the folder structure.

## Usage

Please clone or fork the repository to start using it.

Local development:  

1. Install dependencies: `pnpm install`
2. Start the development server: `pnpm dev`
3. Visit: `http://localhost:3000`

Deployment:  
Deploy to Vercel is the simplest way. You can also deploy to other platforms that support Next.js.  
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/project?template=https://github.com/AFXR17light/kinoana)

## Content Management

Use the `content` folder to store website content, the folder structure will be converted into website routes;  
The `index.md` or `index.mdx` in the folder will be converted into the content of the folder page, which can be configured in `frontmatter`.

Frontmatter configuration items:

- `title` Page title
- `date` Page date, such as `2024-03-19`
- `preview` Page content description
- `childrenDisplay` Display method of subpages, optional values: `list`, `post`, `content`, `expand`, `none`, the default is `list`, see [example page](/example).

All the frontmatter configuration items are optional, and can also be without frontmatter.
