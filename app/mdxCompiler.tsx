import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import rehypePrism from 'rehype-prism-plus'
import './code.css'
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
// import { a11yDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
// import { Fancybox } from "@fancyapps/ui"
// import "@fancyapps/ui/dist/fancybox/fancybox.css"

import { frontmatter } from './types';

export default async function compileMdx (source: string) {
    return await compileMDX<frontmatter>({
        source: source,
        options: {
            parseFrontmatter: true,
            mdxOptions: {
                remarkPlugins: [[remarkGfm, {singleTilde: false}], remarkMath,],
                rehypePlugins: [ rehypePrism, rehypeKatex, ],
            }
        },
    });
}

/* import React, { useState } from "react";
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { a11yDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Fancybox } from "@fancyapps/ui"
import "@fancyapps/ui/dist/fancybox/fancybox.css"

const MdRenderer = ({ children }) => {

    const theme = useState(typeof window !== 'undefined' ? window.__theme : null)
    const codeTheme = theme[0] === 'light' || theme[0] === 'sky-day' ? oneLight : a11yDark;

    const customCodeStyle = {
        ...codeTheme,
        'pre[class*="language-"]': {
            background: 'var(--bgHover)',
            "fontFamily": "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
            "textAlign": "left",
            "whiteSpace": "pre",
            "wordSpacing": "normal",
            "wordBreak": "normal",
            "wordWrap": "normal",
            "lineHeight": "1.5",
            "MozTabSize": "4",
            "OTabSize": "4",
            "tabSize": "4",
            "WebkitHyphens": "none",
            "MozHyphens": "none",
            "msHyphens": "none",
            "hyphens": "none",
            "padding": "1em",
            "margin": "0.5em 0",
            "overflow": "auto",
            "borderRadius": "0.3em"
        },
        'code[class*="language-"]': {
            color: 'var(--normal)',
            background: 'transparent',
            "fontFamily": "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
            "textAlign": "left",
            "whiteSpace": "pre",
            "wordSpacing": "normal",
            "wordBreak": "normal",
            "wordWrap": "normal",
            "lineHeight": "1.5",
            "MozTabSize": "4",
            "OTabSize": "4",
            "tabSize": "4",
            "WebkitHyphens": "none",
            "MozHyphens": "none",
            "msHyphens": "none",
            "hyphens": "none"
        },
        ":not(pre) > code[class*=\"language-\"]": {
            "background": "var(--bgHover)",
            "padding": "0.1em",
            "borderRadius": "0.3em",
            "whiteSpace": "normal"
        },
    };
    const CustomRenderers = {
        // 处理链接
        a({ node, ...props }) {
            const { href, children } = props;
            // 为链接添加 target="_blank" rel="noopener noreferrer"
            return (
                <a
                    onTouchStart={(e) => e.stopPropagation()}
                    // onTouchStart={()=>console.log('touchstart')}
                    // onTouchCancel={()=>console.log('touchcancel')}
                    // onTouchEnd={()=>console.log('touchend')}
                    // onTouchMove={()=>console.log('touchmove')}
                    href={href} target="_blank" rel="noopener noreferrer">
                    {children}
                </a>
            );
        },
        // 代码高亮 & 彩蛋
        code(props) {
            const { children, className, node, inline, ...rest } = props;
            const match = /language-(\w+)/.exec(className || '')
            return !inline ? (
                <div
                    onTouchStart={(e) => e.stopPropagation()}
                    style={{
                        position: "relative",
                        borderRadius: "0.3em",
                        boxShadow: (match && (match[1])) === "Hikari" ? ".16em .16em .3em rgba(255, 220, 200, .25), -.16em -.16em .3em rgba(200, 220, 255, .25)" : '',
                        filter: (match && (match[1])) === "hikari" ? "drop-shadow( 0 0 .3em #f7d87c )" : '',
                    }}
                >
                    {match && (match[1]) === "Hikari" &&
                        <span className="language-Hikari-star">
                            <span
                                style={{
                                    opacity: "0.5",
                                    position: "absolute",
                                    top: "-11.2px", right: "-4.8px",
                                    transform: "rotate(20deg)",
                                    WebkitTransform: "rotate(20deg)",
                                    zIndex: "100",
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 576 512" fill="#f7d87c">
                                    <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
                                </svg>
                                <svg
                                    style={{
                                        transform: "rotate(20deg)",
                                    }}
                                    xmlns="http://www.w3.org/2000/svg" height="9.6px" viewBox="0 0 576 512" fill="#f7d87c">
                                    <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
                                </svg>
                            </span>
                            <span
                                style={{
                                    opacity: "0.3",
                                    position: "absolute",
                                    bottom: "-4.8px", left: "-8px",
                                    transform: "rotate(-10deg)",
                                    WebkitTransform: "rotate(-10deg)",
                                    zIndex: "100",
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" height="19.2px" viewBox="0 0 576 512" fill="#f7d87c">
                                    <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
                                </svg>
                            </span>
                        </span>
                    }
                    <span>
                        <SyntaxHighlighter
                            {...rest}
                            PreTag="div"
                            children={String(children).replace(/\n$/, '')}
                            language={match && match[1]}
                            style={customCodeStyle}
                        />
                    </span>
                </div>
            ) : (
                <code {...rest} className={className}
                    onTouchStart={(e) => e.stopPropagation()}
                    style={{
                        background: 'var(--bgHover)',
                        color: 'var(--normal)',
                        padding: '0.1em',
                        borderRadius: '0.3em',
                        whiteSpace: 'normal',
                        fontFamily: "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
                        overflow: 'auto',
                    }}
                >
                    {children}
                </code>
            )
        },
        // 图片使用 fancybox
        img({ node, ...props }) {
            Fancybox.bind("[data-fancybox]", {
                // fancybox 选项
                maxScale: 2,
            });
            const { src, alt } = props;
            return (
                <button
                    onTouchStart={(e) => e.stopPropagation()}
                    style={{
                        border: "none",
                        backgroundColor: 'transparent',
                        cursor: "pointer",
                    }}
                    data-fancybox="pictures"
                    data-src={src}
                    data-caption={alt}
                >
                    <img src={src} alt={alt} />
                </button>
            )
        },
    };

    return (
        <ReactMarkdown
            components={CustomRenderers}
            remarkPlugins={[remarkMath, [remarkGfm, { singleTilde: false }]]}
            rehypePlugins={[rehypeKatex, { strict: false }]}
        >
            {children}
        </ReactMarkdown>
    )
}

export default MdRenderer; */
