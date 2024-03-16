import { promises as fs } from 'fs';
import path from 'path';
import { notFound } from "next/navigation";
import { compileMDX } from 'next-mdx-remote/rsc';

import { FileSystem } from '../types';
import Layout from '../layout';
import Link from 'next/link';

const contentDir = 'content';

async function fileSource() {
  let contents: FileSystem[] = [];
  const getFile = async (filePath: string) => {
    if ((await fs.stat(filePath)).isDirectory()) {
      // directory
      let indexFile, extension;
      try {
        indexFile = await fs.readFile(path.join(filePath, 'index.mdx'), 'utf8');
        extension = 'mdx';
      } catch (error: any) {
        if (error.code === 'ENOENT') {
          // console.error('index.mdx not found in: ', filePath);
        } else {
          throw error;
        }
      }
      contents.push({ type: 'directory', path: filePath, content: indexFile, extension: extension });
      const files = await fs.readdir(filePath);
      await Promise.all(files.map(fileName => getFile(path.join(filePath, fileName))));
    } else {
      // file
      const filePathObj = path.parse(filePath);
      if (filePathObj.name === 'index') {
        // look for parent directory
      } else {
        const strippedFilePath = path.join(filePathObj.dir, filePathObj.name);
        const fileContent = await fs.readFile(filePath, 'utf8');
        contents.push({ type: 'file', path: strippedFilePath, extension: filePathObj.ext, content: fileContent });
      }
    }
  }
  await getFile(path.join(process.cwd(), contentDir));
  return contents;
}

export default async function Page({ params }: { params: { path: string[] } }) {
  const { path: currentPath } = params;
  const filesAndDirectories = await fileSource();
  let fileOrDir = filesAndDirectories.find(
    (fs: FileSystem) =>
      fs.path?.replace(path.join(process.cwd(), contentDir), '').substring(1) == (currentPath ? path.join(...currentPath) : ''));
  if (!fileOrDir) notFound();
  const { content, frontmatter } = await compileMDX<{ title: string }>({
    source: fileOrDir.content || '',
    options: { parseFrontmatter: true },
  })
  return (
    <Layout
      pathFragments={currentPath ? currentPath : []}
      fileOrDir={fileOrDir}
      title={frontmatter?.title}
    >
      <div>
        <span>page list: </span>
        {filesAndDirectories.map((fs) => {
          return <div key={fs.path}>
            <Link href={fs.path?.replace(path.join(process.cwd(), contentDir), '').substring(1)}>
              * {fs.path?.replace(path.join(process.cwd(), contentDir), '')}
            </Link>
          </div>
        })}
      </div>
      <br />
      {fileOrDir.content ? (
        <div>
          <div>current {fileOrDir.type}: &quot;{fileOrDir.path}{fileOrDir.extension}&quot;</div>
          <hr />
          {content}
        </div>
      ):(
        <div>No index.mdx found, default layout (todo).</div>
      )}
    </Layout>
  )
}