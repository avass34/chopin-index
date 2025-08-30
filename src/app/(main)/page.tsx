import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import { client } from "../../../lib/sanity.client";
import { getAllWorksQuery, getAllPodcastSnippetsQuery } from "../../../lib/queries";

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

async function getWorks(): Promise<Work[]> {
  return await client.fetch(getAllWorksQuery);
}

async function getPodcastEpisodes(): Promise<PodcastEpisode[]> {
  return await client.fetch(getAllPodcastSnippetsQuery);
}

function formatDuration(duration: string): string {
  // Convert HH:MM:SS to readable format
  const parts = duration.split(':');
  if (parts.length === 3) {
    const hours = parseInt(parts[0]);
    const minutes = parseInt(parts[1]);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }
  return duration;
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

export default async function Home() {
  const [works, episodes] = await Promise.all([getWorks(), getPodcastEpisodes()]);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>Chopin Index</h1>
        
        {/* Works Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Musical Works</h2>
          
          {works.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No works found. Add some works in your Sanity Studio!</p>
              <a 
                href="/studio" 
                className={styles.primary}
              >
                Open Sanity Studio
              </a>
            </div>
          ) : (
            <div className={styles.worksGrid}>
              {works.map((work) => (
                <div key={work._id} className={styles.workCard}>
                  <Link href={`/works/${work.slug}`} className={styles.workLink}>
                    <div className={styles.workInfo}>
                      <h3 className={styles.workTitle}>{work.pieceTitle}</h3>
                      <div className={styles.workMeta}>
                        <span className={styles.category}>{formatCategory(work.category)}</span>
                        {work.opusNumber && <span className={styles.opus}>{work.opusNumber}</span>}
                        <span className={styles.year}>{work.yearOfComposition}</span>
                        <span className={styles.duration}>{formatDuration(work.duration)}</span>
                      </div>
                      <p className={styles.workDescription}>{work.description}</p>
                      
                      {work.movements && work.movements.length > 0 && (
                        <div className={styles.movements}>
                          <strong>Movements:</strong>
                          <ul>
                            {work.movements.map((movement, index) => (
                              <li key={index}>{movement}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {work.podcastHighlights && work.podcastHighlights.length > 0 && (
                        <div className={styles.podcastHighlights}>
                          <strong>Podcast Highlights:</strong>
                          <div className={styles.podcastList}>
                            {work.podcastHighlights.map((highlight) => (
                              <div key={highlight.podcast._id} className={styles.podcastItem}>
                                <span className={styles.podcastTitle}>{highlight.podcast.title}</span>
                                <div className={styles.podcastTimestamps}>
                                  {highlight.spotifyTimestamp && (
                                    <span className={styles.podcastTimestamp}>Spotify: {highlight.spotifyTimestamp}</span>
                                  )}
                                  {highlight.youtubeTimestamp && (
                                    <span className={styles.podcastTimestamp}>YouTube: {highlight.youtubeTimestamp}</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </Link>
                  
                  {work.notablePerformers && work.notablePerformers.length > 0 && (
                    <div className={styles.performers}>
                      <strong>Notable Performers:</strong>
                      <div className={styles.performerTags}>
                        {work.notablePerformers.map((performer) => (
                          <Link
                            key={performer._id}
                            href={`/biographies/${performer.slug}`}
                            className={styles.performerTag}
                          >
                            {performer.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Podcast Episodes Section */}
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
