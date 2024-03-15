import type { Metadata } from "next";
import Link from 'next/link'
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "kinoana",
  description: "under construction",
};

export default function Layout({
  children, props,
}: Readonly<{
  children: React.ReactNode;
  props: {
    pathFragments: string[];
    fileOrDir: {
      type: string;
      path?: string;
      extension?: string;
      content?: string;
    };
    title?: string;
  };
}>) {
  const { pathFragments, fileOrDir, title } = { ...props };
  return (
    <html lang="en">
      <body className={inter.className}>
        {pathFragments?.length !== 0 ? 
        (pathFragments?.map((fragment: string, index: number) => {
          let cumulativePath = '';
          for (let i = 0; i <= index; i++) {
            cumulativePath += '/' + pathFragments[i];
          }
          return <Link style={{ fontSize: '2em', fontWeight: 'bold' }} key={fragment} href={cumulativePath}>/{fragment}</Link>
        }))
        : (<Link style={{ fontSize: '2em', fontWeight: 'bold' }} href='/'>/</Link>)}
        <h1>{title}</h1>
        {fileOrDir && <hr />}
        {children}
      </body>
    </html>
  );
}
