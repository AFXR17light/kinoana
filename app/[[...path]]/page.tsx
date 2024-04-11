import { notFound } from "next/navigation";
import path from 'path';

import { source } from '../types';
import Layout from '../layout';
import childDisplay from '../childDisplay';
import { getSource } from '../source';

export default async function Page({ params }: { params: { path: string[] } }) {
  let { path: pathFragments } = params;
  if (!pathFragments || (JSON.stringify(pathFragments) === JSON.stringify(['index']))) pathFragments = [];
  let pathTemp = pathFragments;
  let source = await getSource();
  // console.log(JSON.stringify(source));
  let currentSource: source | undefined;
  const find = (source: source, fpath: string[]): source | undefined => {
    if (fpath.length === 0) return source;
    else {
      const fragment = fpath[0];
      console.log(fragment);
      const sub = source.children?.find((child) => path.basename(child?.path) === fragment);
      if (!sub) return undefined;
      source = sub;
      return find(source, fpath.slice(1));
    }
  }
  currentSource = find(source, pathTemp);
  if (!currentSource) return notFound();
  currentSource.children?.sort((a, b) => {
    // put directories first
    if (a.children && !b.children) return -1;
    if (!a.children && b.children) return 1;
    // if frontmatter.sort includes time, sort by time
    if (currentSource?.frontmatter?.sort === 'time') {
      // put child that has frontmatter.date first
      if (a.frontmatter?.date && !b.frontmatter?.date) return -1;
      if (!a.frontmatter?.date && b.frontmatter?.date) return 1;
      // then sort by date
      if (a.frontmatter?.date && b.frontmatter?.date) {
        if (a.frontmatter.date > b.frontmatter.date) return -1;
        if (a.frontmatter.date < b.frontmatter.date) return 1;
      }
    }
    // then sort by name
    if (currentSource?.frontmatter?.sort === 'nameReverse') {
      if (a.path < b.path) return 1;
      if (a.path > b.path) return -1;
    } else {
      if (a.path < b.path) return -1;
      if (a.path > b.path) return 1;
    }
    return 0;
  });

  return (
    <Layout
      pathFragments={pathFragments}
      source={currentSource}
      title={currentSource.frontmatter?.title}
    >
      <div>
        {currentSource.frontmatter?.date}
      </div>
      <div>
        {currentSource.content}
      </div>
      {currentSource.children?.map((child) => {
        return <div key={child.path} style={{ margin: '0.5em 0' }}>
          {childDisplay(child, currentSource?.frontmatter?.childrenDisplay)}
        </div>
      })}
    </Layout>
  )
}