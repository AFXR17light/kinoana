import fs from 'fs';
import path from 'path';
import { notFound } from "next/navigation";
import { compileMDX } from 'next-mdx-remote/rsc';

import Layout from '../layout';

const contentDir = 'content';

interface FileOrDirectory {
  type: string;
  path?: string;
  extension?: string;
  content?: string;
}

function fileSource() {
  let filesAndDirectories: FileOrDirectory[] = [];
  const getFile = (filePath: string) => {
    if (fs.statSync(filePath).isDirectory()) {
      filesAndDirectories.push({ type: 'directory', path: filePath.replace(contentDir + path.sep, '') });
      fs.readdirSync(filePath).forEach(fileName => getFile(path.join(filePath, fileName)));
    } else {
      const filePathObj = path.parse(filePath);
      const strippedFilePath = path.join(filePathObj.dir, filePathObj.name).replace(contentDir + path.sep, '');
      const fileContent = fs.readFileSync(filePath, 'utf8');
      filesAndDirectories.push({ type: 'file', path: strippedFilePath, extension: filePathObj.ext, content: fileContent });
    }
  }
  getFile(contentDir);
  return filesAndDirectories;
}

export default async function Page({ params }: { params: { path: string[] } }) {
  const { path } = params;
  let filesAndDirectories = fileSource();
  let fileOrDir = filesAndDirectories.find((fd: FileOrDirectory) => fd.path == (path ? path.join('\\') : 'index'));
  if (!fileOrDir) notFound();
  const { content, frontmatter } = await compileMDX<{ title: string }>({
    source: fileOrDir.content || '',
    options: { parseFrontmatter: true },
  })
  return (
    <Layout props={{
      pathFragments: path ? path : [],
      fileOrDir: fileOrDir,
      title: frontmatter?.title,
    }}>
      {fileOrDir.content && (fileOrDir.extension === '.mdx' || fileOrDir.extension === '.md') && (
        <div>
          <div>* {fileOrDir.type}: &quot;{fileOrDir.path}{fileOrDir.extension}&quot;</div>
          {content}
        </div>
      )}
    </Layout>
  )
}