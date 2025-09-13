'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { getOpusBySlugQuery } from '../../../../../lib/queries';
import { calculateOpusDateRange } from '../../../../../lib/dateUtils';
import { client } from '../../../../../lib/sanity.client';
import styles from './page.module.css';
import Navbar from '../../../../components/Navbar';

interface Work {
  _id: string;
  pieceTitle: string;
  slug: string;
  key: string;
  nickname?: string;
  yearOfComposition: number;
  duration: number;
  description: string;
  movements?: string[];
  notablePerformers?: Array<{
    _id: string;
    name: string;
    slug: string;
  }>;
  podcastHighlights?: Array<{
    spotifyTimestamp?: string;
    youtubeTimestamp?: string;
    appleTimestamp?: string;
    title?: string;
    transcript?: any;
    podcast: {
      _id: string;
      title: string;
      description: string;
      seasonNumber: number;
      episodeNumber: number;
      spotifyUrl?: string;
      youtubeUrl?: string;
      applePodcastUrl?: string;
    };
  }>;
}

interface Opus {
  _id: string;
  title: string;
  slug: string;
  works?: Work[];
  category?: {
    _id: string;
    name: string;
    pluralName: string;
    slug: string;
    imageUrl: string;
    imageDescription?: string;
  };
}

interface RichTextBlock {
  _type: string;
  children?: Array<{ text: string }>;
  style?: string;
  listItem?: string;
  markDefs?: Array<{
    _type: string;
    _key: string;
    href?: string;
  }>;
}

function formatKey(key: string): string {
  const keyMap: Record<string, string> = {
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

export default function OpusPage({ params }: { params: Promise<{ slug: string }> }) {
  const [opus, setOpus] = useState<Opus | null>(null);
  const [loading, setLoading] = useState(true);

  const resolvedParams = use(params);

  useEffect(() => {
    async function fetchOpus() {
      try {
        const opusData = await client.fetch(getOpusBySlugQuery, { slug: resolvedParams.slug });
        setOpus(opusData);
      } catch (error) {
        console.error('Error fetching opus:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchOpus();
  }, [resolvedParams.slug]);

  if (loading) {
    return (
      <div className={styles.page}>
        <Navbar />
        <main className={styles.main}>
          <div className={styles.loading}>Loading...</div>
        </main>
      </div>
    );
  }

  if (!opus) {
    return (
      <div className={styles.page}>
        <Navbar />
        <main className={styles.main}>
          <div className={styles.notFound}>Opus not found</div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.container}>
          {/* Hero Section */}
          <div className={styles.heroSection}>
            <div className={styles.heroContent}>
              <h1 className={styles.heroTitle}>
                Opus {opus.title}
              </h1>
              <div className={styles.heroMeta}>
                {(() => {
                  const dateRange = calculateOpusDateRange(opus);
                  return dateRange && (
                    <div className={styles.metaBubble}>
                      <span className={styles.metaLabel}>Year</span>
                      <span className={styles.metaValue}>
                        {dateRange}
                      </span>
                    </div>
                  );
                })()}
                {opus.category && (
                  <Link href={`/categories/${opus.category.slug}`} className={styles.metaBubbleLink}>
                    <span className={styles.metaLabel}>Category</span>
                    <span className={styles.metaValue}>{opus.category.name}</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}