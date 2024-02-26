import Link from "next/link"
import Image from "next/image"
import styles from "./styles/detect.module.css"
export default function Detect(){
    return(
    <heading>
        <div className={styles.detect}>
        <Link href="/recommended">back</Link>

         </div>
    </heading>

       
    )
}