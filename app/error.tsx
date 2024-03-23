'use client' // Error components must be Client Components

import { useEffect } from 'react'
import Link from 'next/link'

import ExpandableTabs from './components/ExpandableTabs'

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
        <div>
            <span style={{ fontSize: '2em', fontWeight: 'bold', color: 'var(--normal)', }}>
                <Link href={'/'} style={{ textDecoration: 'none', color: 'var(--normal)', }}>/</Link>
                error
            </span>
            <hr style={{ border: 'none', borderTop: 'solid .2em', borderRadius: '.1em', }} />
            <p>{error.name}: {error.message}</p>
            <ExpandableTabs>
                <div title='more info'>
                    <p>digest: {error.digest}</p>
                    <p>{error.stack}</p>
                </div>
            </ExpandableTabs>
        </div>
    )
}