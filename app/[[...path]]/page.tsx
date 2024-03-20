import path from 'path';
import { notFound } from "next/navigation";

import { source } from '../types';
import Layout from '../layout';
import childDisplay from '../childDisplay';
import { fileSource } from '../source';

const contentDir = 'content';
const fileExtensions = ['.mdx', '.md']; //mdx has higher priority

export default async function Page({ params }: { params: { path: string[] } }) {
  let { path: pathFragments } = params;
  if (!pathFragments || (JSON.stringify(pathFragments) === JSON.stringify(['index']))) pathFragments = [];
  let pathTemp = pathFragments;
  let source = await fileSource(path.join(process.cwd(), contentDir), fileExtensions);
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

  return (
    <Layout
      pathFragments={pathFragments}
      source={currentSource}
      title={currentSource.frontmatter?.title}
    >
      {(currentSource.extension && fileExtensions.includes(currentSource.extension)) && (
        <div>
          {currentSource.content}
        </div>
      )}
      {currentSource.children?.map((child) => childDisplay(child, currentSource?.frontmatter?.childrenDisplay))}
    </Layout>
  )
}