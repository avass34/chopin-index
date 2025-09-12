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
          
          <div className={styles.socialMediaIcons}>
            <a href="https://youtube.com/playlist?list=PLEuPQmNTsCRGgOmyRgU4kgY05x8CMqI9z&si=8FmcqQnI70nh0zbI" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
              <Image
                src="/YouTube.png"
                alt="YouTube"
                width={32}
                height={32}
                unoptimized
                style={{ height: 'auto' }}
              />
            </a>
            <a href="https://open.spotify.com/show/1iML5oPZ1LV4jnH8xCUsn4?si=464cd0e15bf64613" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
              <Image
                src="/Spotify.png"
                alt="Spotify"
                width={32}
                height={32}
                unoptimized
                style={{ height: 'auto' }}
              />
            </a>
            <a href="https://podcasts.apple.com/us/podcast/the-chopin-podcast/id1765998900" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
              <Image
                src="/ApplePodcasts.png"
                alt="Apple Podcasts"
                width={32}
                height={32}
                unoptimized
                style={{ height: 'auto' }}
              />
            </a>
            <a href="https://www.instagram.com/benlawdy/" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
              <Image
                src="/Instagram.png"
                alt="Instagram"
                width={32}
                height={32}
                unoptimized
                style={{ height: 'auto' }}
              />
            </a>
            <a href="https://facebook.com/chopinpodcast" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
              <Image
                src="/Facebook.png"
                alt="Facebook"
                width={32}
                height={32}
                unoptimized
                style={{ height: 'auto' }}
              />
            </a>
          </div>
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
