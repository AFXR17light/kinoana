import Link from "next/link";

import { source } from "./types";
import { icons } from "./icons";

const pathToName = (inputPath: string) => inputPath.replace(/\\/g, '/').slice(1).split('/').pop();
const pathToLink = (inputPath: string) => inputPath.replace(/\\/g, '/');

const childDisplay = async (child: source, type: string | string[] = 'list', nesting: number = 0,) => {
  // type: 'list' | 'expand' | 'content' | 'preview' | 'date' | 'title' | 'none' | 'hide'
  //     additional: 'noLink' | 'noIcon'
  //     alias: 'post' -> ['date', 'preview', 'title']
  if (typeof type === 'string') type = [type];
  if (type.includes('post')) type.push('date', 'preview', 'title');
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
    <span key={child.path} style={{ margin: `0.25em 0 0.25em ${expand ? nesting * 2 : 0}em` }}> {/* top right bottom left */}
      {/* file */}
      {(child.children || child.content) && <>
        {!type.includes('noLink') &&
          <Link href={href} style={{ fontWeight: 'bold', }}>
            {!type.includes('noIcon') &&
              <>
                {!child.children && child.extension === '.md' && icons.md}
                {!child.children && child.extension === '.mdx' && icons.mdx}
                {child.children && icons.folder}
              </>}
            {' ' + name}
            <span style={{ color: 'var(--grey)' }}>
              {type.includes('title') && frontmatter?.title && ` | ${frontmatter.title && frontmatter.title}`}
            </span>
          </Link>}
        {type.includes('noLink') && <>
          {!type.includes('noIcon') &&
            <>
              {!child.children && child.extension === '.md' && icons.md}
              {!child.children && child.extension === '.mdx' && icons.mdx}
              {child.children && icons.folder}
            </>}
          {' ' + name}{type.includes('title') && frontmatter?.title && ` | ${frontmatter.title && frontmatter.title}`}
        </>}
        {type.includes('date') &&
          frontmatter?.date &&
          <span style={{ marginLeft: '1.5em', fontFamily: 'serif', color: 'var(--grey)', fontWeight: 'bold' }}>
            {frontmatter.date && new Date(frontmatter.date).toLocaleDateString()}
          </span>}
        {type.includes('preview') && frontmatter?.preview && <span style={{ margin: '.5em 0 1em 0', display: 'block' }}>{frontmatter.preview}</span>}{/* top right bottom left */}
        {child.children && expand &&
          <span key={child.path} style={{ position: 'relative', display: 'block' }}>
            <span style={{ position: 'absolute', height: '100%', top: '-.5em', margin: `0.25em 0 0.25em ${nesting * 2 + .5}em`, borderLeft: '3px dashed var(--grey)' }}/>
            {child.children.map((child: source) => {
              return <span key={child.path} style={{ margin: '0.5em 0', display: 'block' }}>
                {(child.children || child.content) && childDisplay(child, type, (expand ? nesting + 1 : -1))}
              </span>
            })}
          </span>}
      </>}
      {/* content */}
      {type.includes('content') && content &&
        <span key={child.path}>
          <span style={{ border: '1px solid var(--border)', background: 'var(--bgHover)', borderRadius: '.2em', margin: '1em 0', padding: '0 1em', display: 'block' }}>
            {content}
          </span>
        </span>}
    </span>
  );
}

export default childDisplay;
