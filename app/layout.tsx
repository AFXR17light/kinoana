import type { Metadata } from "next";
import Head from "next/head";
import Link from 'next/link'
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

import { layoutProps } from "./types";
import "./globals.css";

export async function generateMetadata({ params: { path } }: { params: { path: string[] }}): Promise<Metadata> {
  console.log('received', path && path[path.length - 1]);
  return {
    title: path && path[path.length - 1] || '/',
    description: 'Kinoana is a personal wiki and blog.',
  }
}

export default function Layout({
  children, pathFragments, source, title,
}: layoutProps & { children: React.ReactNode }) {
  generateMetadata({ params: { path: pathFragments } });
  return (
    <html lang="en">
      <Head>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <body className={inter.className} style={{ margin: "6%", }}>
        {pathFragments?.length !== 0 ?
          (pathFragments?.map((fragment: string, index: number) => {
            let cumulativePath = '';
            for (let i = 0; i <= index; i++) {
              cumulativePath += '/' + pathFragments[i];
            }
            return <span key={fragment} style={{ fontSize: '2em', fontWeight: 'bold', }}>
              {index === 0 ? <Link href={'/'} style={{ textDecoration: 'none', }}>/</Link> : '/'}
              {index === pathFragments?.length - 1 ? fragment : <Link href={cumulativePath} style={{ textDecoration: 'none', }}>{fragment}</Link>}
            </span>
          }))
          : (<span style={{ fontSize: '2em', fontWeight: 'bold', textDecoration: 'none', }}>/</span>)}
        <h1>{title}</h1>
        {source && <hr style={{ border: 'none', borderTop: 'solid .2em', borderRadius: '.1em', }} />}
        {children}
      </body>
    </html>
  );
}
