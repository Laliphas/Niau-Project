import Link from "next/link"
import styles from "./styles/navbar.module.css"
export default function Navigator(){
    return(
    <nav>
        <div className={styles.navbar}>
            <Link href="/home"> Home</Link>
            <Link href="/recommended"> Recommended</Link>
            <Link href="/search" > Search</Link>
            <Link href="/profile">Profile</Link>
            <Link href="/tryon">Try on</Link>

         </div>
    </nav>

       
    )
}