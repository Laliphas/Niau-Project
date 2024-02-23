import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css"

export default function Home() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Welcome to Niau</h1>
      </header>
      <main className={styles.main}>
        <section className={styles.section}>
          <h2>About Us</h2>
          <p>Our Group project is Cosmetics filter test for everyone who loves shopping for makeup.</p>
          <p>This application will make your life a lot easier.</p>
        </section>
        <section className={styles.section}>
          <h2>Contact Us</h2>
          <p>If you have any questions or need assistance, please don't hesitate to reach out to us.</p>
          <p>We're here to ensure you have a comfortable and enjoyable experience.</p>
          <p>contact niau@niau.com</p>
        </section>
      </main>
      <footer className={styles.footer}>
        <p>Thank you for visiting. We hope to see you again soon!</p>
      </footer>
    </div>
  );
}
