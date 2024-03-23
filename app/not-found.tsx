import Link from 'next/link'
import Layout from './layout'

export default function NotFound() {
    return (
        <Layout pathFragments={['404']} title="Not Found">
            <div>
                <p>Could not find requested resource.</p>
                <Link href="/">Return Home</Link>
            </div>
        </Layout>
    )
}