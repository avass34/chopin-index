import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import { client } from "../../../lib/sanity.client";
import { getAllWorksQuery, getAllPodcastSnippetsQuery, getChopinProfileQuery } from "../../../lib/queries";

interface Work {
  _id: string;
  slug: string;
  pieceTitle: string;
  category: string;
  opusNumber?: string;
  yearOfComposition: number;
  duration: string;
  description: string;
  movements?: string[];
  notablePerformers?: { _id: string; name: string; slug: string }[];
  podcastHighlights?: { 
    spotifyTimestamp?: string;
    youtubeTimestamp?: string;
    podcast: { _id: string; title: string; description: string } 
  }[];
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
}

interface ChopinProfile {
  _id: string;
  profileImageUrl?: string;
  profileImageAlt?: string;
  birthDate: string;
  deathDate: string;
  biography: Array<{
    _type: string;
    children?: Array<{
      _type: string;
      text: string;
    }>;
  }>;
}

async function getWorks(): Promise<Work[]> {
  return await client.fetch(getAllWorksQuery);
}

async function getPodcastEpisodes(): Promise<PodcastEpisode[]> {
  return await client.fetch(getAllPodcastSnippetsQuery);
}

async function getChopinProfile(): Promise<ChopinProfile | null> {
  return await client.fetch(getChopinProfileQuery);
}



function formatPodcastDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function formatCategory(category: string): string {
  // Convert category value to display format
  const categoryMap: { [key: string]: string } = {
    'nocturne': 'Nocturne',
    'scherzo': 'Scherzo',
    'polonaise': 'Polonaise',
    'concerto': 'Concerto',
    'prelude': 'Prélude',
    'etude': 'Étude',
    'impromptu': 'Impromptu',
    'ballade': 'Ballade',
    'mazurka': 'Mazurka',
    'rondo': 'Rondo',
    'sonata': 'Sonata',
    'waltz': 'Waltz',
    'variations': 'Variations',
    'other': 'Other',
    'chamber': 'Chamber',
  };
  return categoryMap[category] || category;
}

function getCategoryStats(works: Work[]) {
  const categoryCounts: { [key: string]: number } = {};
  
  works.forEach(work => {
    const category = work.category;
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });
  
  return Object.entries(categoryCounts).map(([category, count]) => ({
    category,
    displayName: formatCategory(category),
    count
  })).sort((a, b) => b.count - a.count);
}

export default async function Home() {
  const [works, episodes, chopinProfile] = await Promise.all([
    getWorks(), 
    getPodcastEpisodes(), 
    getChopinProfile()
  ]);

  const categoryStats = getCategoryStats(works);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>Chopin Index</h1>
        
        <div className={styles.twoColumnLayout}>
          {/* Left Column - Chopin Details */}
          <div className={styles.leftColumn}>
            <div className={styles.chopinCard}>
              {chopinProfile?.profileImageUrl && (
                <div className={styles.profileImageContainer}>
                  <Image
                    src={chopinProfile.profileImageUrl}
                    alt={chopinProfile.profileImageAlt || "Portrait of Frédéric Chopin"}
                    width={200}
                    height={200}
                    className={styles.profileImage}
                  />
                </div>
              )}
              
              <div className={styles.chopinInfo}>
                <h2 className={styles.chopinName}>Frédéric Chopin</h2>
                <div className={styles.chopinDates}>
                  {chopinProfile?.birthDate && chopinProfile?.deathDate && (
                    <span className={styles.dates}>
                      {new Date(chopinProfile.birthDate).getFullYear()} - {new Date(chopinProfile.deathDate).getFullYear()}
                    </span>
                  )}
                </div>
                
                {chopinProfile?.biography && (
                  <div className={styles.biography}>
                    <p className={styles.biographyText}>
                      {chopinProfile.biography[0]?.children?.[0]?.text || 
                       "Frédéric Chopin was a Polish composer and virtuoso pianist of the Romantic period who wrote primarily for solo piano."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Work Categories */}
          <div className={styles.rightColumn}>
            <h2 className={styles.categoriesTitle}>Musical Categories</h2>
            <div className={styles.categoriesGrid}>
              {categoryStats.map((category) => (
                <Link 
                  key={category.category} 
                  href={`/works?category=${category.category}`} 
                  className={styles.categoryCard}
                >
                  <div className={styles.categoryContent}>
                    <h3 className={styles.categoryName}>{category.displayName}</h3>
                    <span className={styles.categoryCount}>{category.count} works</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Latest Podcast Episodes Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Latest Podcast Episodes</h2>
          
          {episodes.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No episodes found. Add some episodes in your Sanity Studio!</p>
              <a 
                href="/studio" 
                className={styles.primary}
              >
                Open Sanity Studio
              </a>
            </div>
          ) : (
            <div className={styles.episodesGrid}>
              {episodes.slice(0, 6).map((episode) => (
                <Link key={episode._id} href={`/episodes/podcasts/${episode.slug}`} className={styles.episodeCard}>
                  <div className={styles.episodeImage}>
                    {episode.imageUrl ? (
                      <Image
                        src={episode.imageUrl}
                        alt={`Cover art for ${episode.title}`}
                        width={200}
                        height={200}
                        className={styles.coverArt}
                      />
                    ) : (
                      <div className={styles.placeholderCover}>
                        <span className={styles.placeholderText}>
                          Episode {episode.episodeNumber}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className={styles.episodeInfo}>
                    <div className={styles.episodeHeader}>
                      <span className={styles.episodeNumber}>
                        S{episode.seasonNumber}E{episode.episodeNumber}
                      </span>
                      <span className={styles.episodeDuration}>
                        {formatPodcastDuration(episode.duration)}
                      </span>
                    </div>
                    <h3 className={styles.episodeTitle}>{episode.title}</h3>
                    <p className={styles.episodeDescription}>
                      {episode.description.length > 100 
                        ? `${episode.description.substring(0, 100)}...` 
                        : episode.description
                      }
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
