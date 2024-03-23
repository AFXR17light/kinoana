'use client' // Error components must be Client Components

import { useEffect } from 'react'
import Link from 'next/link'
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export default function Error({
    error,
}: {
    error: Error & { digest?: string }
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div className={inter.className} style={{ margin: "6%", }}>
            <span style={{ fontSize: '2em', fontWeight: 'bold', color: 'var(--normal)', }}>
                <Link href={'/'} style={{ textDecoration: 'none', color: 'var(--normal)', }}>/</Link>
                error
            </span>
            <hr style={{ border: 'none', borderTop: 'solid .2em', borderRadius: '.1em', }} />
            <p>{error.message}</p>
        </div>
    )
}