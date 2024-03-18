import type { Metadata } from "next";
import Link from 'next/link'
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

import { LayoutProps } from "./types";
import "./globals.css";

export const metadata: Metadata = {
  title: "kinoana",
  description: "under construction",
};

export default function Layout({
  children, pathFragments, fileOrDir, title,
}: LayoutProps & { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {pathFragments?.length !== 0 ?
          (pathFragments?.map((fragment: string, index: number) => {
            let cumulativePath = '';
            for (let i = 0; i <= index; i++) {
              cumulativePath += '/' + pathFragments[i];
            }
            return <span key={fragment} style={{ fontSize: '2em', fontWeight: 'bold', }}>
              {index === 0 ? <Link href={'/'} style={{ textDecoration: 'none', }}>/</Link> : '/'}
              <Link href={cumulativePath} style={{ textDecoration: 'none', }}>{fragment}</Link>
            </span>
          }))
          : (<Link style={{ fontSize: '2em', fontWeight: 'bold', textDecoration: 'none', }} href='/'>/</Link>)}
        <h1>{title}</h1>
        {fileOrDir && <hr />}
        {children}
      </body>
    </html>
  );
}
