<<<<<<< HEAD
import Link from "next/link"


import styles from "./styles/detect.module.css"
export default function Detect(){
    return(

        <div className={styles.detect}>
         
          <Link href="/recommended">
            back</Link>
            
            

         </div>
    
=======
import Link from "next/link";
import { useRouter } from 'next/router';
import styles from "./styles/detect.module.css";

export default function Detect() {
    const router = useRouter();
>>>>>>> 624ce6a883e6a98c6325aaac003b53fd8775ec88

    // Function to handle going back
    const handleGoBack = () => {
        router.back(); // Go back to the previous page
    };

    return (
        <heading>
            <div className={styles.detect}>
                <button onClick={handleGoBack}>Back</button>
            </div>
        </heading>
    );
}
