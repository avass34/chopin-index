import Link from "next/link";
import styles from "../layout.module.css";

function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContent}>
        <Link href="/" className={styles.navbarBrand}>
          <span className={styles.brandText}>Chopin Index</span>
        </Link>
        
        <div className={styles.navbarLinks}>
          <Link href="/" className={styles.navLink}>
            Home
          </Link>
          <Link href="/works" className={styles.navLink}>
            Works
          </Link>
          <Link href="/pianist-biographies" className={styles.navLink}>
            Pianists
          </Link>
          <Link href="/episodes" className={styles.navLink}>
            Episodes
          </Link>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h3 className={styles.footerTitle}>Chopin Index</h3>
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
            <Link href="/works" className={styles.footerLink}>
              Works
            </Link>
            <Link href="/pianist-biographies" className={styles.footerLink}>
              Pianist Biographies
            </Link>
            <Link href="/episodes" className={styles.footerLink}>
              Podcast Episodes
            </Link>
          </nav>
        </div>
        
      </div>
      
      <div className={styles.footerBottom}>
        <p className={styles.copyright}>
          © {new Date().getFullYear()} Chopin Index. All rights reserved.
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
      <Navbar />
      <main className={styles.main}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
