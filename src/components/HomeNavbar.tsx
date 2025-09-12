'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";
import styles from "../app/layout.module.css";

export default function HomeNavbar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFixedNavbar, setShowFixedNavbar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      
      setIsExpanded(scrollY > window.innerHeight * 0.5);
      
      const scrollableNavbar = document.querySelector('[data-scrollable-navbar]');
      if (scrollableNavbar) {
        const scrollableNavbarRect = scrollableNavbar.getBoundingClientRect();
        setShowFixedNavbar(scrollableNavbarRect.top <= 2 * 16);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div className={`${styles.navbarContainer} ${showFixedNavbar ? styles.navbarContainerVisible : styles.navbarContainerHidden}`}>
        <nav className={`${styles.navbar} ${isExpanded ? styles.navbarExpanded : styles.navbarCollapsed}`}>
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
            
            <div className={`${styles.navbarLinks} ${isExpanded ? styles.navbarLinksVisible : styles.navbarLinksHidden}`}>
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

      <div className={`${styles.scrollableNavbarContainer} ${showFixedNavbar ? styles.scrollableNavbarHidden : styles.scrollableNavbarVisible}`}>
        <nav className={`${styles.navbar} ${styles.navbarCollapsed}`} data-scrollable-navbar>
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
          </div>
        </nav>
      </div>
    </>
  );
}
