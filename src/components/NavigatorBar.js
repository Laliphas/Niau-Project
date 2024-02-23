import Link from "next/link"
import styles from "./styles/navbar.module.css"
export default function Navigator() {
    return (
        <div className={styles.navbar}>
            <div className={styles.navbarContainer}>
                <div className={styles.navbox}>
                    <img src="home.svg" />
                    <Link href="/"> Home</Link></div>

                <div className={styles.navbox}>
                    <img src="recom.svg" />
                    <Link href="/recommended"> Recommended</Link></div>

                <div className={styles.navbox}>
                    <img src="search.svg" />
                    <Link href="/search" > Search</Link></div>

                <div className={styles.navbox}>
                    <img src="user.svg" />
                    <Link href="/profile">Profile</Link></div>

            </div>
        </div>
    )
}