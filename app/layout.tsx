import type { Metadata } from "next";
import Link from 'next/link'
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

import { layoutProps } from "./types";
import "./globals.css";

export const metadata: Metadata = {
  title: "kinoana",
  description: "under construction",
};

export default function Layout({
  children, pathFragments, source, title,
}: layoutProps & { children: React.ReactNode }) {
  return (
    <html lang="en">
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
        {source && <hr style={{ border: 'none', borderTop: 'solid .2em grey', borderRadius: '.1em', }} />}
        {children}
      </body>
    </html>
  );
}
