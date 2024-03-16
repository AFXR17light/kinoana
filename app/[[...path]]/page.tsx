import { promises as fs } from 'fs';
import path from 'path';
import { notFound } from "next/navigation";
import { compileMDX } from 'next-mdx-remote/rsc';

import { FileOrDirectory } from '../types';
import Layout from '../layout';
import Link from 'next/link';

const contentDir = 'content';

async function fileSource() {
  let filesAndDirectories: FileOrDirectory[] = [];
  const getFile = async (filePath: string) => {
    let currentFireOrDir: FileOrDirectory = { type: '', path: '' };
    if ((await fs.stat(filePath)).isDirectory()) {
      currentFireOrDir = { type: 'directory', path: filePath };
      const files = await fs.readdir(filePath);
      await Promise.all(files.map(fileName => getFile(path.join(filePath, fileName))));
    } else {
      const filePathObj = path.parse(filePath);
      const strippedFilePath = path.join(filePathObj.dir, filePathObj.name);
      const fileContent = await fs.readFile(filePath, 'utf8');
      currentFireOrDir = { type: 'file', path: strippedFilePath, extension: filePathObj.ext, content: fileContent };
    }
    filesAndDirectories.push(currentFireOrDir);
  }
  await getFile(path.join(process.cwd(), contentDir));
  return filesAndDirectories;
}

export default async function Page({ params }: { params: { path: string[] } }) {
  const { path: currentPath } = params;
  const filesAndDirectories = await fileSource();
  console.log('currentPath: ', (path.join(...currentPath)))
  filesAndDirectories.map((fd) => {
    console.log(fd.path?.replace(path.join(process.cwd(), contentDir), '').substring(1))
  })
  let fileOrDir = filesAndDirectories.find((fd: FileOrDirectory) => fd.path?.replace(path.join(process.cwd(), contentDir), '').substring(1) == (path.join(...currentPath)));
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
        {filesAndDirectories.map((fd) => {
          return <div key={fd.path}>
            <Link href={fd.path?.replace(process.cwd() + contentDir, '')}>{fd.path}</Link>
          </div>
        })}
      </div>
      <br />
      {fileOrDir.content && (fileOrDir.extension === '.mdx' || fileOrDir.extension === '.md') && (
        <div>
          <div>current {fileOrDir.type}: &quot;{fileOrDir.path}{fileOrDir.extension}&quot;</div>
          <hr />
          {content}
        </div>
      )}
    </Layout>
  )
}