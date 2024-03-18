import { promises as fs } from 'fs';
import path from 'path';
import { notFound } from "next/navigation";
import Link from 'next/link';
import { compileMDX } from 'next-mdx-remote/rsc';

import { source } from '../types';
import Layout from '../layout';
import { icons } from '../icons';

const contentDir = 'content';
const fileExtensions = ['.mdx', '.md']; //mdx has higher priority

async function fileSource(filePath: string): Promise<source> {
  if ((await fs.stat(filePath)).isDirectory()) { // directory
    // index check
    let indexFile, indexExtension;
    const files = await fs.readdir(filePath);
    if (files.includes('index.mdx') || files.includes('index.md')) {
      indexFile = await fs.readFile(path.join(filePath, files.includes('index.mdx') ? 'index.mdx' : 'index.md'), 'utf8');
      indexExtension = files.includes('index.mdx') ? '.mdx' : '.md';
    }
    if (files.length === 1 && (files[0] === 'index.mdx' || files[0] === 'index.md')) {
      // directory with only index file
      return { path: filePath, extension: indexExtension, content: indexFile }; // page with seperate folder
    }
    const children = await Promise.all(files.map(fileName => fileSource(path.join(filePath, fileName))));
    return { path: filePath, extension: indexExtension, content: indexFile, children: children, }; // directory
  } else { // file
    const filePathObj = path.parse(filePath);
    if (filePathObj.name !== 'index' && fileExtensions.includes(filePathObj.ext)) {
      const strippedFilePath = path.join(filePathObj.dir, filePathObj.name);
      const fileContent = await fs.readFile(filePath, 'utf8');
      return { path: strippedFilePath, extension: filePathObj.ext, content: fileContent }; // file
    } else return { path: '', }
  }
}

export default async function Page({ params }: { params: { path: string[] } }) {
  let { path: pathFragments } = params;
  if (!pathFragments || (JSON.stringify(pathFragments) === JSON.stringify(['index']))) pathFragments = [];
  let pathTemp = pathFragments;
  let source = await fileSource(path.join(process.cwd(), contentDir));
  let currentSource: source | undefined;
  const find = (source: source, fpath: string[]): source | undefined => {
    if (fpath.length === 0) return source;
    else {
      const fragment = fpath[0];
      const sub = source.children?.find((child) => child?.path?.endsWith(fragment || ''));
      if (!sub) return undefined;
      source = sub;
      return find(source, fpath.slice(1));
    }
  }
  currentSource = find(source, pathTemp);
  if (!currentSource) return notFound();
  currentSource.children?.sort((a, b) => {
    // put directories first, then sort by name
    if (a.children && !b.children) return -1;
    if (!a.children && b.children) return 1;
    if (a.path < b.path) return -1;
    if (a.path > b.path) return 1;
    return 0;
  });
  const { content, frontmatter } = await compileMDX<{ title: string, hideSubdir?: boolean }>({
    source: currentSource?.content || '',
    options: { parseFrontmatter: true },
  })
  return (
    <Layout
      pathFragments={pathFragments}
      source={currentSource}
      title={frontmatter?.title}
    >
      {(currentSource.extension && fileExtensions.includes(currentSource.extension)) && (
        <div>
          {content}
        </div>
      )}
      {!frontmatter?.hideSubdir && currentSource.children?.map((child) => {
        return (child &&
          <div key={child.path}>
            <Link href={child.path.replace(path.join(process.cwd(), contentDir), '').replace(/\\/g, '/').replace('content', '')}>
              {!child.children && child.extension && (child.extension === '.md') && icons.md}
              {!child.children && child.extension && (child.extension === '.mdx') && icons.mdx}
              {child.children && icons.folder}
              {' '} {child.path.replace(path.join(process.cwd(), contentDir), '').replace(/\\/g, '/').replace('content', '').slice(1)}
            </Link>
          </div>
        );
      })}
    </Layout>
  )
}