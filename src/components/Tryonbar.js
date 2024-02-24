import Link from "next/link"
import styles from "./styles/tryonbar.module.css"
export default function TryonBar({slug}) {
    return (
        <div className={styles.tryonbar}>
            <div className={styles.tryonContainer}>
                <div className={styles.tryonbox}>
                    <img src="/tryOnIcon.png" width={100} height={100} />
                    <Link href={`/tryon/${slug}`}>Try On</Link></div>
            </div>
        </div>
    )
}