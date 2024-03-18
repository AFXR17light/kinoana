import { promises as fs } from 'fs';
import path from 'path';
import { notFound } from "next/navigation";
import { compileMDX } from 'next-mdx-remote/rsc';

import { FileSystem } from '../types';
import Layout from '../layout';
import Link from 'next/link';

const contentDir = 'content';
const fileExtensions = ['.mdx', '.md']; //mdx has higher priority

async function fileSource() {
  let contents: FileSystem[] = [];
  const getFile = async (filePath: string) => {
    if ((await fs.stat(filePath)).isDirectory()) {
      // directory
      let indexFile, indexExtension;
      const files = await fs.readdir(filePath);
      if (files.includes('index.mdx') || files.includes('index.md')) {
        indexFile = await fs.readFile(path.join(filePath, files.includes('index.mdx') ? 'index.mdx' : 'index.md'), 'utf8');
        indexExtension = files.includes('index.mdx') ? '.mdx' : '.md';
      }
      let type = 'directory';
      if (files.length === 1 && (files[0] === 'index.mdx' || files[0] === 'index.md')) {
        type = 'file';
      }
      contents.push({ type: type, path: filePath, fileContent: indexFile, extension: indexExtension, dirContent: files });
      await Promise.all(files.map(fileName => getFile(path.join(filePath, fileName))));
    } else {
      // file
      const filePathObj = path.parse(filePath);
      if (filePathObj.name !== 'index') {
        const strippedFilePath = path.join(filePathObj.dir, filePathObj.name);
        const fileContent = await fs.readFile(filePath, 'utf8');
        contents.push({ type: 'file', path: strippedFilePath, extension: filePathObj.ext, fileContent: fileContent });
      }
    }
  }
  await getFile(path.join(process.cwd(), contentDir));
  return contents;
}

export default async function Page({ params }: { params: { path: string[] } }) {
  let { path: currentPath } = params;
  if (!currentPath) currentPath = [];
  const filesAndDirectories = await fileSource();
  let fileOrDir = filesAndDirectories.find(
    (fs: FileSystem) =>
      fs.path?.replace(path.join(process.cwd(), contentDir), '').substring(1) == (currentPath.length ? path.join(...currentPath) : ''));
  console.log('fileOrDir: ', fileOrDir);
  console.log('currentPath: ', currentPath);
  if (fileOrDir === undefined) notFound();
  const { content, frontmatter } = await compileMDX<{ title: string, hideSubdir?: boolean }>({
    source: fileOrDir?.fileContent || '',
    options: { parseFrontmatter: true },
  })
  return (
    <Layout
      pathFragments={currentPath}
      fileOrDir={fileOrDir}
      title={frontmatter?.title}
    >
      {(fileOrDir.extension && fileExtensions.includes(fileOrDir.extension)) && (
        <div>
          {content}
        </div>
      )}
      {!frontmatter?.hideSubdir && fileOrDir.dirContent?.map((dir) => {
        if ((dir !== 'index.mdx') && (dir !== 'index.md')) return (
          <div key={dir}>
            <Link href={`/${[...currentPath, dir.replace(/\.[^/.]+$/, "")].join("/")}`}>
              {'/' + dir.replace(/\.[^/.]+$/, "")}
            </Link>
          </div>
        );
      })}
    </Layout>
  )
}