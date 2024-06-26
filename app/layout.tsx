import type { Metadata } from "next";
import Link from 'next/link'
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import NextTopLoader from 'nextjs-toploader';

import { layoutProps } from "./types";
import "./globals.css";

export async function generateMetadata({ params: { path } }: { params: { path: string[] } }): Promise<Metadata> {
  // console.log('received', (path && path[path.length - 1]) || '/');
  return {
    title: (path && path[path.length - 1]) || 'Kinoana',
    description: 'Kinoana is a personal wiki and blog.',
  }
}

export default function Layout({
  children, pathFragments, title,
}: layoutProps & { children: React.ReactNode }) {
  generateMetadata({ params: { path: pathFragments } });
  return (
    <html lang="en">
      <head><meta name="darkreader-lock" /></head>
      <body className={inter.className} style={{ margin: "6%", marginBottom: '30vh' }}>
        <NextTopLoader
          color="var(--link)"
          showSpinner={false}
        />
        {/* <div style={{ overflowX: 'auto', overflowY: 'hidden', }}> */}
        {pathFragments?.length !== 0 ?
          (pathFragments?.map((fragment: string, index: number) => {
            let cumulativePath = '';
            for (let i = 0; i <= index; i++) {
              cumulativePath += '/' + pathFragments[i];
            }
            return <span key={fragment} style={{ fontSize: '2em', fontWeight: 'bold', color: 'var(--normal)', }}>
              {index === 0 ? <Link href={'/'} style={{ textDecoration: 'none', color: 'var(--normal)', }}>/</Link> : '/'}
              {index === pathFragments?.length - 1 ?
                fragment : <Link href={cumulativePath} style={{ textDecoration: 'none', color: 'var(--normal)', }}>{fragment}</Link>}
            </span>
          }))
          : (<span style={{ fontSize: '2em', fontWeight: 'bold', textDecoration: 'none', }}>/</span>)}
        <h1>{title}</h1>
        {/* </div> */}
        {pathFragments && <hr style={{ border: 'none', borderTop: 'solid .2em', borderRadius: '.1em', }} />}
        {children}
        {/* <BackToTopButton /> */}
      </body>
    </html>
  );
}
