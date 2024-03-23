'use client' // Error components must be Client Components

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div>
            <span style={{ fontSize: '2em', fontWeight: 'bold', color: 'var(--normal)', }}>
                <Link href={'/'} style={{ textDecoration: 'none', color: 'var(--normal)', }}>/</Link>
                /error
            </span>
            <p>Something went wrong!</p>
            <button
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                }
            >
                Try again
            </button>
        </div>
    )
}