import { promises as fs } from 'fs';
import path from 'path';
import { notFound } from "next/navigation";
import { compileMDX } from 'next-mdx-remote/rsc';

import Layout from '../layout';

const contentDir = '\\content';

interface FileOrDirectory {
  type: string;
  path?: string;
  extension?: string;
  content?: string;
}

async function fileSource() {
  let filesAndDirectories: FileOrDirectory[] = [];
  const getFile = async (filePath: string) => {
    // console.log('curent path: ', filePath);
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
    // console.log('------------------ current fod path: ', currentFireOrDir.path);
    filesAndDirectories.push(currentFireOrDir);
  }
  await getFile(process.cwd() + contentDir);
  // console.log(filesAndDirectories);
  return filesAndDirectories;
}

export default async function Page({ params }: { params: { path: string[] } }) {
  const { path } = params;
  const filesAndDirectories = await fileSource();
  // console.log(filesAndDirectories[2].path?.replace(process.cwd() + contentDir, ''));
  // console.log('path: ', '\\' + path.join('\\'));
  let fileOrDir = filesAndDirectories.find((fd: FileOrDirectory) => fd.path?.replace(process.cwd() + contentDir, '') == (path ? '\\' + path.join('\\') : '\\index'));
  if (!fileOrDir) notFound();
  const { content, frontmatter } = await compileMDX<{ title: string }>({
    source: fileOrDir.content || '',
    options: { parseFrontmatter: true },
  })
  return (
    <Layout
      props={{
        pathFragments: path ? path : [],
        fileOrDir: fileOrDir,
        title: frontmatter?.title,
      }}
    >
      {fileOrDir.content && (fileOrDir.extension === '.mdx' || fileOrDir.extension === '.md') && (
        <div>
          <div>* {fileOrDir.type}: &quot;{fileOrDir.path}{fileOrDir.extension}&quot;</div>
          {content}
        </div>
      )}
    </Layout>
  )
}