import { promises as fs } from 'fs';
import path from 'path';
import { notFound } from "next/navigation";
import Link from 'next/link';
import { compileMDX } from 'next-mdx-remote/rsc';

import { source, frontmatter } from '../types';
import Layout from '../layout';
import { icons } from '../icons';
import exp from 'constants';

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
  const { content, frontmatter } = await compileMDX<frontmatter>({
    source: currentSource?.content || '',
    options: { parseFrontmatter: true },
  })
  const pathToName = (inputPath: string) => inputPath.replace(path.join(process.cwd(), contentDir), '').replace(/\\/g, '/').slice(1).split('/').pop();
  const pathToLink = (inputPath: string) => inputPath.replace(path.join(process.cwd(), contentDir), '').replace(/\\/g, '/');

  const childDisplay = async (child: source, type: string | string[] = 'list', nesting: number = 0,) => {
    // type: 'list' | 'expand' | 'content' | 'preview' | 'date'
    // alias: 'post' -> ['date', 'preview']
    if (type === 'post') type = ['date', 'preview'];
    if (typeof type === 'string') type = [type];
    if (type.includes('none')) return (<></>);
    let expand = false;
    if (type.includes('expand')) expand = true;
    // link
    const href = pathToLink(child.path);
    const name = pathToName(child.path);
    // read content
    let content, frontmatter;
    if (child?.content) {
      const result = await compileMDX<frontmatter>({
        source: child.content,
        options: { parseFrontmatter: true },
      });
      content = result.content;
      frontmatter = result.frontmatter;
    }
    // display: content
    if (type.includes('content')) {
      if (content) return (
        <div key={child.path}>
          <div>{pathToName(child.path)}</div>
          <div style={{ border: '1px solid', borderRadius: '4px', margin: '1em 0', padding: '0 1em', }}>
            {content}
          </div>
        </div>
      );
    } else return (
      <div key={child.path} style={{ margin: `0.25em 0 0.25em ${expand ? nesting : 0}em` }}> {/* top right bottom left */}
        {/* file */}
        {!child.children && child.extension &&
          <>
            <Link href={href}>
              {child.extension === '.md' && icons.md}
              {child.extension === '.mdx' && icons.mdx}
              {' ' + name}
            </Link>
            {type.includes('date') && <span>{frontmatter?.date}</span>}
            {type.includes('preview') && <div>{frontmatter?.preview}</div>}
          </>}
        {/* directory */}
        {child.children &&
          <>
            <Link href={href}>
              {icons.folder}
              {' ' + name}
            </Link>
            <div key={child.path} style={{ marginBottom: '0em' }}>
              {expand && child.children.map((child) => childDisplay(child, type, (expand ? nesting + 1 : -1)))}
            </div>
            {type.includes('content') && content &&
              <div key={child.path}>
                <div>{pathToName(child.path)}</div>
                <div style={{ border: '1px solid', borderRadius: '4px', margin: '1em 0', padding: '0 1em', }}>
                  {content}
                </div>
              </div>}
          </>}
      </div>
    );
  }
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
      {currentSource.children?.map((child) => childDisplay(child, frontmatter?.childrenDisplay))}
    </Layout>
  )
}