'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from 'react';
import styles from "./page.module.css";
import { client, getPopularWorks } from "../../../lib/sanity.client";
import { getAllPodcastSnippetsQuery, getChopinProfileQuery, getAllCategoriesQuery, getAllOpusesQuery } from "../../../lib/queries";
import PodcastSeasonToggle from "../../components/PodcastSeasonToggle";
import HomeNavbar from "../../components/HomeNavbar";

interface Work {
  _id: string;
  slug: string;
  pieceTitle: string;
  nickname?: string;
  key: string;
  isPopular: boolean;
  yearOfComposition: number;
  duration: number;
  description: string;
  movements?: string[];
  opus?: {
    _id: string;
    title: string;
    date: string;
  };
  notablePerformers?: Array<{
    _id: string;
    name: string;
    slug: string;
  }>;
  podcastHighlights?: Array<{
    spotifyTimestamp?: string;
    youtubeTimestamp?: string;
    podcast: {
      _id: string;
      slug: string;
      title: string;
      description: string;
      pageLink?: string;
    };
  }>;
}

interface Category {
  _id: string;
  name: string;
  pluralName: string;
  slug: string;
  imageUrl?: string;
  imageDescription?: string;
}

interface Opus {
  _id: string;
  title: string;
  slug: string;
  date: string;
  category: {
    _id: string;
    name: string;
    pluralName: string;
    slug: string;
    imageUrl?: string;
    imageDescription?: string;
  };
  works: Array<{
    _id: string;
    pieceTitle: string;
    slug: string;
  }>;
}

interface PodcastEpisode {
  _id: string;
  slug: string;
  title: string;
  seasonNumber: number;
  episodeNumber: number;
  description: string;
  duration: number;
  imageUrl?: string;
  spotifyUrl?: string;
  youtubeUrl?: string;
  applePodcastUrl?: string;
  pageLink?: string;
}

interface ChopinProfile {
  _id: string;
  profileImageUrl?: string;
  profileImageAlt?: string;
  backgroundImageUrl?: string;
  backgroundImageAlt?: string;
  birthDate: string;
  deathDate: string;
  biography: Array<{
    _key: string;
    _type: string;
    children?: Array<{
      _key: string;
      _type: string;
      text: string;
      marks?: string[];
    }>;
    markDefs?: unknown[];
    style?: string;
  }>;
  extendedBiography?: Array<{
    _key: string;
    _type: string;
    children?: Array<{
      _key: string;
      _type: string;
      text: string;
      marks?: string[];
    }>;
    markDefs?: unknown[];
    style?: string;
  }>;
}


async function getPodcastEpisodes(): Promise<PodcastEpisode[]> {
  return await client.fetch(getAllPodcastSnippetsQuery);
}

async function getChopinProfile(): Promise<ChopinProfile | null> {
  return await client.fetch(getChopinProfileQuery);
}

async function getPopularWorksData(): Promise<Work[]> {
  return await getPopularWorks();
}

async function getCategories(): Promise<Category[]> {
  return await client.fetch(getAllCategoriesQuery);
}

async function getOpuses(): Promise<Opus[]> {
  return await client.fetch(getAllOpusesQuery);
}

function formatKey(key: string): string {
  const keyMap: { [key: string]: string } = {
    'C': 'C Major',
    'Cm': 'C Minor',
    'C#': 'C-sharp Major',
    'C#m': 'C-sharp Minor',
    'D': 'D Major',
    'Dm': 'D Minor',
    'D#': 'D-sharp Major',
    'D#m': 'D-sharp Minor',
    'E': 'E Major',
    'Em': 'E Minor',
    'F': 'F Major',
    'Fm': 'F Minor',
    'F#': 'F-sharp Major',
    'F#m': 'F-sharp Minor',
    'G': 'G Major',
    'Gm': 'G Minor',
    'G#': 'G-sharp Major',
    'G#m': 'G-sharp Minor',
    'A': 'A Major',
    'Am': 'A Minor',
    'A#': 'A-sharp Major',
    'A#m': 'A-sharp Minor',
    'B': 'B Major',
    'Bm': 'B Minor',
    'Bb': 'B-flat Major',
    'Bbm': 'B-flat Minor',
    'Eb': 'E-flat Major',
    'Ebm': 'E-flat Minor',
    'Ab': 'A-flat Major',
    'Abm': 'A-flat Minor',
    'Db': 'D-flat Major',
    'Dbm': 'D-flat Minor',
    'Gb': 'G-flat Major',
    'Gbm': 'G-flat Minor',
  };
  
  return keyMap[key] || key;
}

function getCategoryStats(opuses: Opus[], categories: Category[]) {
  const categoryCounts: { [key: string]: number } = {};
  
  // Initialize all categories with 0
  categories.forEach(category => {
    categoryCounts[category._id] = 0;
  });
  
  // Count works in each category through opuses
  opuses.forEach(opus => {
    if (opus.category && opus.works) {
      const categoryId = opus.category._id;
      const workCount = opus.works.length;
      if (categoryCounts.hasOwnProperty(categoryId)) {
        categoryCounts[categoryId] += workCount;
      }
    }
  });
  
  return categories.map(category => ({
    category: category._id,
    displayName: category.pluralName,
    count: categoryCounts[category._id] || 0
  })).sort((a, b) => b.count - a.count);
}

export default function Home() {
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([]);
  const [chopinProfile, setChopinProfile] = useState<ChopinProfile | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [popularWorks, setPopularWorks] = useState<Work[]>([]);
  const [opuses, setOpuses] = useState<Opus[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCategoryId, setHoveredCategoryId] = useState<string | null>(null);

  const handleCategoryHover = (categoryData: Category | undefined) => {
    const background = document.getElementById('categoryImageBackground');
    const blackSheet = document.getElementById('blackSheet');
    if (background && blackSheet && categoryData?.imageUrl) {
      background.style.backgroundImage = `url("${categoryData.imageUrl}")`;
      blackSheet.style.opacity = '0';
    }
    if (categoryData) {
      setHoveredCategoryId(categoryData._id);
    }
  };

  const handleCategoryLeave = () => {
    const background = document.getElementById('categoryImageBackground');
    const blackSheet = document.getElementById('blackSheet');
    if (blackSheet && background) {
      blackSheet.style.opacity = '1';
    }
    if (background) {
      background.style.backgroundImage = '';
    }
    setHoveredCategoryId(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [episodesData, chopinProfileData, categoriesData, popularWorksData, opusesData] = await Promise.all([
          getPodcastEpisodes(), 
          getChopinProfile(),
          getCategories(),
          getPopularWorksData(),
          getOpuses()
        ]);
        
        console.log('Popular works data:', popularWorksData);
        console.log('Opuses data:', opusesData);
        
        setEpisodes(episodesData);
        setChopinProfile(chopinProfileData);
        setCategories(categoriesData);
        setPopularWorks(popularWorksData);
        setOpuses(opusesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const categoryStats = getCategoryStats(opuses, categories);

  if (loading) {
    return (
      <div className={styles.page}>
        <HomeNavbar />
        <main className={styles.main}>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <HomeNavbar />
      {/* Hero Section */}
      <section className={styles.heroSection} data-hero-section>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Chopin Index</h1>
          <p className={styles.heroDescription}>
            Discover the complete works of Frédéric Chopin. Explore his compositions, 
            learn about his life, and dive deep into the world of classical piano music.
          </p>
          <Link href="/works" className={styles.browseButton}>
            Browse Works
          </Link>
        </div>
      </section>

      <main className={styles.main}>
         <div style={{ zIndex: 9 }}>
           {/* Chopin Biography Section - Full Width Below */}
           <div className={styles.chopinBioSection}>
             <div className={`${styles.chopinCard} ${hoveredCategoryId ? styles.faded : ''}`}>
               <div className={styles.chopinContent}>
                 {chopinProfile?.profileImageUrl && (
                   <div className={styles.profileImageContainer}>
                     <Image
                       src={chopinProfile.profileImageUrl}
                       alt={chopinProfile.profileImageAlt || "Frédéric Chopin"}
                       width={250}
                       height={250}
                       className={styles.profileImage}
                     />
                   </div>
                 )}
                 
                 <div className={styles.chopinInfo}>
                   <h2 className={styles.chopinName}>Frédéric Chopin</h2>
                   
                   {chopinProfile?.biography && (
                     <div className={styles.biography}>
                       <p className={`${styles.biographyText} ${hoveredCategoryId ? styles.faded : ''}`}>
                         {chopinProfile.biography[0]?.children?.[0]?.text ? 
                         chopinProfile.biography[0].children[0].text :
                         "Frédéric Chopin was a Polish composer and virtuoso pianist of the Romantic period who wrote primarily for solo piano."}
                       </p>
                     </div>
                   )}
                   {!chopinProfile?.biography && (
                     <div className={styles.biography}>
                       <p className={`${styles.biographyText} ${hoveredCategoryId ? styles.faded : ''}`}>
                         Frédéric Chopin was a Polish composer and virtuoso pianist of the Romantic period who wrote primarily for solo piano.
                       </p>
                     </div>
                   )}
                   
                   <div className={styles.bioLinkContainer}>
                     <Link href="/chopin-biography" className={`${styles.bioLink} ${hoveredCategoryId ? styles.faded : ''}`}>
                       View Biography
                     </Link>
                   </div>
                 </div>
               </div>
             </div>
           </div>
           {popularWorks.length > 0 && (
             <div className={styles.popularWorksRow}>
               <h2 className={`${styles.popularWorksTitle} ${hoveredCategoryId ? styles.faded : ''}`}>Popular Works</h2>
               <div className={`${styles.popularWorksList} ${hoveredCategoryId ? styles.faded : ''}`}>
                 {popularWorks.map((work) => {
                   // Find the opus that contains this work
                   const workOpus = opuses.find(opus => 
                     opus.works && opus.works.some(opusWork => opusWork._id === work._id)
                   );
                   
                   return (
                     <div key={work._id} className={styles.popularWorkItem}>
                       {workOpus && (
                         <p className={styles.popularWorkOpus}>
                           {workOpus.title.startsWith('Op.') ? workOpus.title : `Op. ${workOpus.title}`}
                         </p>
                       )}
                       <Link href={`/works/${work.slug}`} className={styles.popularWorkLink}>
                         {work.pieceTitle} in {formatKey(work.key)}
                         {work.nickname && (
                           <span className={styles.popularWorkNickname}> &ldquo;{work.nickname}&rdquo;</span>
                         )}
                       </Link>
                       <div className={styles.popularWorkMeta}>
                         <span className={styles.popularWorkYear}>
                           {work.yearOfComposition}
                         </span>
                       </div>
                     </div>
                   );
                 })}
               </div>
             </div>
           )}
          {/* Work Categories - Full Width Below */}
          <div className={styles.categoriesRow}>
            <div className={styles.categoriesGrid}>
              {categoryStats.map((category) => {
                // Find the actual category data to get the correct slug
                const categoryData = categories.find(cat => cat._id === category.category);
                return (
                  <Link 
                    key={category.category} 
                    href={`/categories/${categoryData?.slug || category.displayName.toLowerCase().replace(/\s+/g, '-')}`} 
                    className={`${styles.categoryCard} ${hoveredCategoryId && hoveredCategoryId !== category.category ? styles.faded : ''}`}
                    onMouseEnter={() => handleCategoryHover(categoryData)}
                    onMouseLeave={handleCategoryLeave}
                  >
                  <div className={styles.categoryContent}>
                    <h3 className={styles.categoryName}>{category.displayName}</h3>
                  </div>
                </Link>
              );
              })}
            </div>
          </div>

          <div className={`${hoveredCategoryId ? styles.faded : ''}`}>
            <PodcastSeasonToggle episodes={episodes} />
          </div>
        </div>

        {/* Category Image Background */}
        <div className={styles.categoryImageBackground} id="categoryImageBackground">
        </div>
        
        {/* Black Sheet */}
        <div className={`${styles.blackSheet} ${styles.visible}`} id="blackSheet">
        </div>
        
        {/* Black Gradient Overlay */}
        <div className={styles.blackOverlay} id="blackOverlay">
        </div>
      </main>
    </div>
  );
}
