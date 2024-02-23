import Link from "next/link"
import Image from "next/image"
import styles from "./styles/heading.module.css"
export default function heading(){
    return(
    <heading>
        <div className={styles.heading}>
        <img src="/niaulogo.png"
                width={100} height={100} alt="not found"/>

         </div>
    </heading>

       
    )
}