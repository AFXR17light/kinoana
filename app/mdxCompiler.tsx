import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import rehypePrism from 'rehype-prism-plus'
import './code.css'
import rehypeExternalLinks from 'rehype-external-links'
// import { Fancybox } from "@fancyapps/ui"
// import "@fancyapps/ui/dist/fancybox/fancybox.css"

import { frontmatter } from './types';
// mdx components
import Link from 'next/link';
import Archives from './components/Archives';
import { Icon } from './icons';
import ExpandableTabs from './components/ExpandableTabs';

export default async function compileMdx (source: string) {
    return await compileMDX<frontmatter>({
        source: source,
        options: {
            parseFrontmatter: true,
            mdxOptions: {
                remarkPlugins: [[remarkGfm, {singleTilde: false}], remarkMath,],
                rehypePlugins: [ [rehypeExternalLinks, {rel: ['nofollow', 'noopener'], target: ['blank']}], rehypePrism, rehypeKatex, ],
            }
        },
        components: { Link, Archives, Icon, ExpandableTabs }
    });
}
