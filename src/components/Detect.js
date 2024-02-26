import Link from "next/link";
import { useRouter } from 'next/router';
import styles from "./styles/detect.module.css";

export default function Detect() {
    const router = useRouter();

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
