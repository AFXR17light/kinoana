import Link from "next/link";

import { source } from "./types";
import { icons } from "./icons";

const pathToName = (inputPath: string) => inputPath.replace(/\\/g, '/').slice(1).split('/').pop();
const pathToLink = (inputPath: string) => inputPath.replace(/\\/g, '/');

const childDisplay = async (child: source, type: string | string[] = 'list', nesting: number = 0,) => {
  // type: 'list' | 'expand' | 'content' | 'preview' | 'date' | 'title' | 'none' | 'hide'
  // alias: 'post' -> ['date', 'preview', 'title']
  if (type === 'post') type = ['date', 'preview', 'title'];
  if (typeof type === 'string') type = [type];
  if (type.includes('none')) return undefined;
  let expand = false;
  if (type.includes('expand')) expand = true;
  // link
  const href = pathToLink(child.path);
  const name = pathToName(child.path);
  // content
  const content = child.content;
  const frontmatter = child.frontmatter;
  if (frontmatter?.hide === true) return undefined;
  return (
    <div key={child.path} style={{ margin: `0.25em 0 0.25em ${expand ? nesting : 0}em` }}> {/* top right bottom left */}
      {/* file */}
      {!child.children && child.extension &&
        <>
          <Link href={href}>
            {child.extension === '.md' && icons.md}
            {child.extension === '.mdx' && icons.mdx}
            {' ' + name}
            {type.includes('title') && ` | ${frontmatter?.title && frontmatter.title}`}
          </Link>
          {type.includes('date') && <span>{' | '}{frontmatter?.date && new Date(frontmatter.date).toLocaleDateString()}</span>}
          {type.includes('preview') && <div style={{ margin: '.5em 0 1em 1.1em' }}>{frontmatter?.preview}</div>}{/* top right bottom left */}
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
        </>}
      {/* content */}
      {type.includes('content') && content &&
        <div key={child.path}>
          <div style={{ border: '1px solid', borderRadius: '4px', margin: '1em 0', padding: '0 1em', }}>
            {content}
          </div>
        </div>}
    </div>
  );
}

export default childDisplay;
