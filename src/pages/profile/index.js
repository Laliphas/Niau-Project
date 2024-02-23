import Navigator from "../../components/NavigatorBar"
import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import styles from "./profile.module.css"

export default function profile(){
    return(
        <div>
      <Head>
        <title>My Profile</title>
        <meta name="description" content="My profile page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <div className={styles.profile}>
          <div className={styles.avatar}>
            <Image
              src="/user.svg"
              alt="Profile Picture"
              width={200}
              height={200}
              className={styles.image}
            />
          </div>
          <div className={styles.details}>
            <h1 className={styles.name}>John Doe</h1>
            <p className={styles.email}>john.doe@example.com</p>
            <p className={styles.bio}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>
        </div>
      </main>
    </div>
    
    )

}