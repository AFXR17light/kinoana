## Introduction

Kinoana is a personal wiki and blog based on [Next.js](https://nextjs.org/). It uses Markdown / MDX as source files, and generating website content through the folder structure.

## Usage

Please clone the repository to start using.

**Local development**:  

1. Install dependencies: `pnpm install`
2. Start the development server: `pnpm dev`
3. Visit: `http://localhost:3000`

**Deployment**:

Deploy with Vercel is the simplest way.  
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FAFXR17light%2Fkinoana)  
You can also deploy to other platforms that support Next.js.

## Content Management

Use the `content` folder to store website content. The folder structure will be converted into website routes;  
The `index.md` or `index.mdx` in the folder will be converted into the content of the folder page.

All the pages can be configured in `frontmatter`.

Frontmatter configuration items:

- `title` Page title
- `date` Page date, such as `2024-03-19`
- `preview` Page content description
- `childrenDisplay` Display method of subpages, optional values: `list`, `post`, `content`, `expand`, `none`, the default is `list`, see [example page](https://kinoana.vercel.app/example).

All the frontmatter configuration items are optional, and can also be without frontmatter.

### Separated content repository (experimental)

You can use a separated git repository to store content, and push changes directly to the content repository. The contents on the website will update automatically without the need to redeploy.

1. Create a new repository to store content. Treat the content repository the same as the `content` folder.
2. Get the url of the content repository, and a personal access token from GitHub or password from other git platforms.
3. Add the following environment variables:

```bash
GIT_URL = <content-repo-url>
GIT_USERNAME = <git-username>
GIT_TOKEN = <github-token-or-password>
```

Then the content will be fetched from the content repository instead of the `content` folder.

Note:

This feature currently only supports Vercel runtime. Please do not run the development server with the git related environment variables set in `.env.local`.
