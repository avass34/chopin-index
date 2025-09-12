'use client';

import Link from "next/link";
import { getAllCategoriesQuery, getAllOpusesQuery } from '../../../../lib/queries';
import { client } from '../../../../lib/sanity.client';
import styles from './page.module.css';
import Navbar from '../../../components/Navbar';
import { useEffect, useState } from 'react';

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
    nickname?: string;
    slug: string;
    key: string;
  }>;
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

export default function WorksPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [opuses, setOpuses] = useState<Opus[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'genres' | 'timeline'>('genres');
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
        const [categoriesData, opusesData] = await Promise.all([
          getCategories(),
          getOpuses()
        ]);
        
        setCategories(categoriesData);
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
        <Navbar />
        <main className={styles.main}>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Navbar />
      
      {/* Timeline */}
      {viewMode === 'timeline' && (
        <div className={styles.timeline}>
          <div className={styles.timelineContainer}>
            {(() => {
              // Group opuses by year
              const opusesByYear = opuses.reduce((acc, opus) => {
                const year = new Date(opus.date).getFullYear();
                if (!acc[year]) {
                  acc[year] = [];
                }
                acc[year].push(opus);
                return acc;
              }, {} as Record<number, typeof opuses>);

              // Get all years and sort them
              const years = Object.keys(opusesByYear).map(Number).sort((a, b) => a - b);
              
              return years.map((year, yearIndex) => {
                // Calculate proportional spacing based on year gaps
                const getSpacing = () => {
                  if (yearIndex === 0) return 0; // First year
                  
                  const prevYear = years[yearIndex - 1];
                  const yearGap = year - prevYear;
                  
                  // Base spacing for consecutive years (gap = 1)
                  const baseSpacing = 80; // pixels
                  return baseSpacing * yearGap;
                };
                
                return (
                  <div 
                    key={year} 
                    className={styles.yearGroup}
                    style={{ marginLeft: yearIndex === 0 ? 0 : `${getSpacing()}px` }}
                  >
                    <div className={styles.opusStack}>
                      {opusesByYear[year].length > 1 && (
                        <div className={styles.opusCount}>({opusesByYear[year].length})</div>
                      )}
                      {opusesByYear[year].map((opus) => (
                        <Link key={opus._id} href={`/works/${opus.works[0]?.slug || '#'}`} className={styles.timelineItem}>
                          <div className={styles.opusLabel}>Op. {opus.title}</div>
                        </Link>
                      ))}
                    </div>
                    <div className={styles.opusDot}></div>
                    <div className={styles.yearLabel}>{year}</div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      )}
      
      <main className={styles.main}>
        <div className={styles.contentWrapper}>

          {/* Category Cards Section */}
          <div className={styles.categoriesSection}>
            <div className={styles.CategoriesWrapper}>
            <div className={styles.categoriesContent}>
              <h2 className={styles.categoriesTitle}>Browse by Category</h2>
              <p className={styles.categoriesDescription}>
                Explore Chopin&apos;s works organized by musical form and style. Each category represents a distinct aspect of his compositional genius.
              </p>
              <div className={styles.toggleButtons}>
                <button 
                  className={`${styles.toggleButton} ${viewMode === 'genres' ? styles.active : ''}`}
                  onClick={() => setViewMode('genres')}
                >
                  Genres
                </button>
                <button 
                  className={`${styles.toggleButton} ${viewMode === 'timeline' ? styles.active : ''}`}
                  onClick={() => setViewMode('timeline')}
                >
                  Timeline
                </button>
              </div>
            </div>
            </div>
            {viewMode === 'genres' && (
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
            )}
          </div>

          {/* All Opuses Section */}
          <div className={styles.worksSection}>
            <h2 className={`${styles.worksTitle} ${hoveredCategoryId ? styles.faded : ''}`}>
              All Opuses
            </h2>
            {opuses.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No opuses found. Add some opuses in your Sanity Studio!</p>
                <a href="/studio" className={styles.primary}>
                  Open Sanity Studio
                </a>
              </div>
            ) : (
              <div className={styles.opusesList}>
                {opuses.map((opus) => (
                  <div 
                    key={opus._id} 
                    className={`${styles.opusItem} ${hoveredCategoryId ? styles.faded : ''}`}
                  >
                    <div className={styles.opusDate}>
                      {new Date(opus.date).getFullYear()}
                    </div>
                    <h3 className={styles.opusTitle}>
                      Opus {opus.title}
                    </h3>
                {opus.works && opus.works.length > 0 && (
                  <ul className={`${styles.worksList} ${opus.works.length === 1 ? styles.singleWork : styles.multipleWorks}`}>
                    {opus.works.map((work, index) => (
                      <li key={work._id} className={styles.workItem}>
                        {opus.works.length > 1 && index === 0 && <span className={styles.stapleTop}>┌</span>}
                        {opus.works.length > 1 && index === opus.works.length - 1 && <span className={styles.stapleBottom}>└</span>}
                        {opus.works.length > 1 && index > 0 && index < opus.works.length - 1 && <span className={styles.stapleMiddle}>├</span>}
                        <Link 
                          href={`/works/${work.slug}`} 
                          className={styles.workLink}
                        >
                          {work.pieceTitle} in {formatKey(work.key)}
                          {work.nickname && (
                            <span className={styles.workNickname}> - {work.nickname}</span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
                  </div>
                ))}
              </div>
            )}
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
