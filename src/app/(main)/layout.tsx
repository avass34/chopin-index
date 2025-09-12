import Image from "next/image";
import Link from "next/link";
import styles from "../layout.module.css";

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <div className={styles.footerLogo}>
            <Image
              src="/OpusLibrary.png"
              alt="Chopin Index"
              height={60}
              width={200}
              unoptimized
            />
          </div>
          <p className={styles.footerDescription}>
            Discover the world of Chopin through his works, the pianists who interpret them, and insightful podcast discussions.
          </p>
        </div>
        
        <div className={styles.footerSection}>
          <h4 className={styles.footerSectionTitle}>Explore</h4>
          <nav className={styles.footerNav}>
            <Link href="/" className={styles.footerLink}>
              Home
            </Link>
            <Link href="/chopin-biography" className={styles.footerLink}>
              Chopin Biography
            </Link>
            <Link href="/works" className={styles.footerLink}>
              Works
            </Link>
            <Link href="https://www.chopinpodcast.com/" className={styles.footerLink} target="_blank" rel="noopener noreferrer">
              The Chopin Podcast
            </Link>
          </nav>
        </div>
        
      </div>
      
      <div className={styles.footerBottom}>
        <p className={styles.copyright}>
          © {new Date().getFullYear()} The Chopin Podcast. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.layout}>
      <main className={styles.main}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
