import Link from 'next/link';
import Image from 'next/image';
import { getAllPodcastSnippetsQuery } from '../../../../lib/queries';
import { client } from '../../../../lib/sanity.client';
import styles from './page.module.css';

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

async function getPodcastEpisodes(): Promise<PodcastEpisode[]> {
  return await client.fetch(getAllPodcastSnippetsQuery);
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function groupEpisodesBySeason(episodes: PodcastEpisode[]) {
  const grouped = episodes.reduce((acc, episode) => {
    const season = episode.seasonNumber;
    if (!acc[season]) {
      acc[season] = [];
    }
    acc[season].push(episode);
    return acc;
  }, {} as { [key: number]: PodcastEpisode[] });

  // Sort episodes within each season by episode number
  Object.keys(grouped).forEach(season => {
    grouped[parseInt(season)].sort((a, b) => a.episodeNumber - b.episodeNumber);
  });

  return grouped;
}

export default async function EpisodesPage() {
  const episodes = await getPodcastEpisodes();
  const episodesBySeason = groupEpisodesBySeason(episodes);
  const seasons = Object.keys(episodesBySeason).map(Number).sort((a, b) => a - b);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>Podcast Episodes</h1>
          <p className={styles.subtitle}>
            Explore all episodes of the Chopin Index podcast, organized by season
          </p>
        </div>

        {episodes.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No episodes found. Add some episodes in your Sanity Studio!</p>
            <a href="/studio" className={styles.primary}>
              Open Sanity Studio
            </a>
          </div>
        ) : (
          <div className={styles.episodesContainer}>
            {seasons.map((season) => (
              <div key={season} className={styles.seasonSection}>
                <h2 className={styles.seasonTitle}>Season {season}</h2>
                <div className={styles.episodesGrid}>
                  {episodesBySeason[season].map((episode) => (
                    <div key={episode._id} className={styles.episodeCard}>
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
                            Episode {episode.episodeNumber}
                          </span>
                          <span className={styles.episodeDuration}>
                            {formatDuration(episode.duration)}
                          </span>
                        </div>
                        <h3 className={styles.episodeTitle}>{episode.title}</h3>
                        <p className={styles.episodeDescription}>
                          {episode.description.length > 150 
                            ? `${episode.description.substring(0, 150)}...` 
                            : episode.description
                          }
                        </p>
                        <div className={styles.episodeActions}>
                          <Link 
                            href={`/episodes/podcasts/${episode.slug}`} 
                            className={styles.listenButton}
                          >
                            Listen Now
                          </Link>
                          {episode.spotifyUrl && (
                            <a 
                              href={episode.spotifyUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className={styles.externalButton}
                            >
                              Spotify
                            </a>
                          )}
                          {episode.youtubeUrl && (
                            <a 
                              href={episode.youtubeUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className={styles.externalButton}
                            >
                              YouTube
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
