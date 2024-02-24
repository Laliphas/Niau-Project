import Link from "next/link"
import styles from "./styles/tryonbar.module.css"
export default function TryonBar({slug}) {
    return (
        <div className={styles.tryonbar}>
            <div className={styles.tryonContainer}>
                <div className={styles.tryonbox}>
                    <img src="/tryon.png" width={30} height={30} />
                    <Link href={`/tryon/${slug}`}>Try On</Link></div>
            </div>
        </div>
    )
}