import { promises as fs } from 'fs';
import path from 'path';
import git from 'isomorphic-git'
import http from 'isomorphic-git/http/node'

import { source } from './types';
import compileMdx from './mdxCompiler';
const LOCAL_SCR_TEST = process.env.LOCAL_SCR_TEST;
const GIT_URL = process.env.GIT_URL;
const GIT_USERNAME = process.env.GIT_USERNAME;
const GIT_TOKEN = process.env.GIT_TOKEN;

let contentDir = "content";
let fullContentDir = path.join(process.cwd(), contentDir);
const acceptExtensions = ['.mdx', '.md']; //mdx has higher priority

export async function getSource() {
    if (GIT_URL && (LOCAL_SCR_TEST === 'true' || process.env.NODE_ENV === 'production')) {
        LOCAL_SCR_TEST === 'true' ? contentDir = path.join(process.cwd(), 'git-content') : contentDir = '/tmp/git-content';
        fullContentDir = contentDir;
        if (await fs.stat(path.join(contentDir, '.git')).catch(() => false)) {
            await git.pull({ fs, http, dir: contentDir, url: GIT_URL, onAuth: () => ({ username: GIT_USERNAME, password: GIT_TOKEN }), author: { name: GIT_USERNAME } });
        } else {
            await git.clone({ fs, http, dir: contentDir, url: GIT_URL, onAuth: () => ({ username: GIT_USERNAME, password: GIT_TOKEN }) });
        }
        return fileSource(fullContentDir);
    } else {
        return fileSource();
    }
}

export async function fileSource(filePath: string = fullContentDir, fileExtensions: string[] = acceptExtensions): Promise<source> {
    if (filePath === path.join(fullContentDir, '.git') ||
        filePath.replace(fullContentDir, '').startsWith('__')) return { path: '', }; // ignore .git and __* files
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
            path: filePath.replace(fullContentDir, ''),
            extension: indexExtension,
            content: content,
            frontmatter: frontmatter,
            children: singleIndex ? undefined : children,
        }
    } else { // file
        const filePathObj = path.parse(filePath);
        if (filePathObj.name !== 'index' && fileExtensions.includes(filePathObj.ext)) {
            const strippedFilePath = path.join(filePathObj.dir, filePathObj.name).replace(fullContentDir, '');
            const fileContent = await fs.readFile(filePath, 'utf8');
            const { frontmatter, content: compiledContent } = await compileMdx(fileContent);
            return { path: strippedFilePath, extension: filePathObj.ext, content: compiledContent, frontmatter: frontmatter }; // file
        }
    }
    return { path: '', }
}