import Link from "next/link";
import Image from "next/image";
import styles from "../app/layout.module.css";

export default function Navbar() {
  return (
    <div className={styles.mainNavbarContainer}>
      <nav className={`${styles.navbar} ${styles.navbarExpanded}`}>
        <div className={styles.navbarContent}>
          <Link href="/" className={styles.navbarBrand}>
            <Image 
              src="/OpusLibrary.png" 
              alt="Opus Library" 
              width={60} 
              height={60}
              className={styles.brandLogo}
              unoptimized
            />
          </Link>
          
          <div className={styles.navbarLinksVisible}>
            <Link href="/chopin-biography" className={styles.navLink}>
              Chopin
            </Link>
            <Link href="/works" className={styles.navLink}>
              Works
            </Link>
            <Link href="https://www.chopinpodcast.com/" className={styles.navLink} target="_blank" rel="noopener noreferrer">
              Podcast
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}
