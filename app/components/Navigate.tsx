import Link from "next/link";

const Navigate = ( to: string, ) => {
    return (
        <Link href={to}>
            {to}
        </Link>
    )
}