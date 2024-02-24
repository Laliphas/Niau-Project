import Link from "next/link"
import styles from "./styles/tryonbar.module.css"
export default function TryonBar() {
    return (
        <div className={styles.tryonbar}>
            <div className={styles.tryonContainer}>
                <div className={styles.tryonbox}>
                    
                    <Link href="/tryon"><img src="/tryOn.png" width={50} height={50} /></Link>
                    <Link href="/tryon">Try On</Link>
                    </div>
            </div>
        </div>
    )
}