import { promises as fs } from 'fs';
import path from 'path';

import { source } from './types';
import compileMdx from './mdxCompiler';

const contentDir = "content";
const acceptExtensions = ['.mdx', '.md']; //mdx has higher priority

export async function fileSource(filePath: string = path.join(process.cwd(), contentDir), fileExtensions: string[] = acceptExtensions ): Promise<source> {
    if ((await fs.stat(filePath)).isDirectory()) { // directory
        // index check
        let indexFile, indexExtension;
        const files = await fs.readdir(filePath);
        if (files.includes('index.mdx') || files.includes('index.md')) {
            indexFile = await fs.readFile(path.join(filePath, files.includes('index.mdx') ? 'index.mdx' : 'index.md'), 'utf8');
            indexExtension = files.includes('index.mdx') ? '.mdx' : '.md';
        }
        const children = await Promise.all(files.map(fileName => fileSource(path.join(filePath, fileName), fileExtensions)));
        let content, frontmatter;
        if (indexFile) {
            const result = await compileMdx(indexFile);
            content = result.content;
            frontmatter = result.frontmatter;
        }
        let singleIndex = false;
        if (files.length === 1 && (files[0] === 'index.mdx' || files[0] === 'index.md')) singleIndex = true;
        return { // directory
            path: filePath.replace(path.join(process.cwd(), contentDir), ''),
            extension: indexExtension,
            content: content,
            frontmatter: frontmatter,
            children: singleIndex ? undefined : children,
        }
    } else { // file
        const filePathObj = path.parse(filePath);
        if (filePathObj.name !== 'index' && fileExtensions.includes(filePathObj.ext)) {
            const strippedFilePath = path.join(filePathObj.dir, filePathObj.name).replace(path.join(process.cwd(), contentDir), '');
            const fileContent = await fs.readFile(filePath, 'utf8');
            const { frontmatter, content: compiledContent } = await compileMdx(fileContent);
            return { path: strippedFilePath, extension: filePathObj.ext, content: compiledContent, frontmatter: frontmatter }; // file
        }
    }
    return { path: '', }
}