import styles from "./recom.module.css";
import Link from "next/link";
import Navigator from "@/components/NavigatorBar"
export default function warm() {
  return (
    <div className={styles.body}>
      <Navigator/>
        <div className={styles.head1}>
          <h2>Warm Tone</h2>
        </div>
        <Link href="/" className={styles.warm}>
          Warm Tone
        </Link>
        <Link href="/naturaltone" className={styles.natural}>
          Natural Tone
        </Link>
        <Link href="/cooltone" className={styles.cool}>
          Cool Tone
        </Link>
        <Link href="/lip1" className={styles.lip1}>
          <img src="https://api.watsons.co.th/medias/zoom-front-208727.jpg?context=bWFzdGVyfGltYWdlc3w4OTI4MzF8aW1hZ2UvanBlZ3xhRFZpTDJneVlpODVOREV4TWpFMU5UVTJOak00TDFkVVExUklMVEl3T0RjeU55MW1jbTl1ZEM1cWNHY3w1ZTI4NGNiMTI0MjE4NWI3YmQ3YmFjYjM2NDc5NGYzODM1YzkzZTE0MjY1ZTZiNDJlNTEwNTk4ZmI2NjNlYjEw"
          width={200} height={200} alt="not found"/>
        </Link>
        <Link href="/lip2" className={styles.lip2}>
          <img src="https://api.watsons.co.th/medias/zoom-side-147603.jpg?context=bWFzdGVyfGltYWdlc3w5MDA0MzR8aW1hZ2UvanBlZ3xhR0UzTDJobVl5ODVOREV4TVRneE16YzVOakUwTDFkVVExUklMVEUwTnpZd015MXphV1JsTG1wd1p3fDMxZTU1ZTljODBmYTFiZmJlZWQzM2MwNGU2N2RkNGMwMjI3N2Y5ZmNjYmNiMmE2MmE5MGUyYzYzOGRkM2EwNTM"
          width={200} height={200} alt="not found"/>
        </Link>
        <Link href="/lip3" className={styles.lip3}>
          <img src="https://s2.konvy.com/static/team/2022/1101/16672988798216.jpg"
          width={200} height={200} alt="not found"/>
        </Link>
        <Link href="/lip4" className={styles.lip4}>
          <img src="https://www.konvy.com/static/team/2023/0912/16944916915750_600x600.jpg"
          width={200} height={200} alt="not found"/>
        </Link>
        <Link href="/lip5" className={styles.lip5}>
          <img src="https://media.multybeauty.com/v1/file/kkmhv1664367532498.png"
          width={200} height={200} alt="not found"/>
        </Link>
        <Link href="/lip6" className={styles.lip6}>
          <img src="https://www.konvy.com/static/team/2023/0221/16769669283355_600x600.jpg"
          width={200} height={200} alt="not found"/>
        </Link>
        <Link href="/lip7" className={styles.lip7}>
          <img src="https://m.media-amazon.com/images/I/41bTiKvIw0L._AC_UF1000,1000_QL80_.jpg"
          width={200} height={200} alt="not found"/>
        </Link>
        <Link href="/lip1" className={styles.lipp1}>
          REVLON Matte Lipstick<br></br>009 Fabulous Fig<br></br>189 baht
        </Link>
        <Link href="/lip2" className={styles.lipp2}>
          REVLON Matte Lipstick<br></br>365 Mango Blossom<br></br>189 baht
        </Link>
        <Link href="/lip3" className={styles.lipp3}>
          KATE Lip Monster<br></br>05 Dark Fig<br></br>436 baht
        </Link>
        <Link href="/lip4" className={styles.lipp4}>
          Maybeline New York<br></br>Superstay Vinyl Ink Longwear Liquid<br></br>130 Extra<br></br>289 baht
        </Link>
        <Link href="/lip5" className={styles.lipp5}>
          2P Original<br></br>Oh My Tint Velvet And Smooth<br></br>OMT 09<br></br>89 baht
        </Link>
        <Link href="/lip6" className={styles.lipp6}>
          Barenbliss<br></br>Peach Makes Perfect Lip Tint<br></br>03 Take Change<br></br>199 baht
        </Link>
        <Link href="/lip7" className={styles.lipp7}>
          BBIA Glow Lip Tint<br></br>06 Sand<br></br>285 baht
        </Link>
    </div>
  )
}
