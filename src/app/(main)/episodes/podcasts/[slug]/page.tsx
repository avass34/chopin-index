import Image from "next/image";
import Link from "next/link";
import { client } from "../../../../../../lib/sanity.client";
import { getPodcastSnippetBySlugQuery, getWorksByPodcastQuery } from "../../../../../../lib/queries";
import { notFound } from "next/navigation";
import styles from "./page.module.css";

interface PodcastSnippet {
  _id: string;
  title: string;
  seasonNumber: number;
  episodeNumber: number;
  description: string;
  duration?: string;
  imageUrl?: string;
  spotifyUrl?: string;
  youtubeUrl?: string;
}

interface Work {
  _id: string;
  slug: string;
  pieceTitle: string;
  category: string;
  opusNumber?: string;
  yearOfComposition: number;
  duration: number;
  description: string;
  spotifyTimestamp?: string;
  youtubeTimestamp?: string;
}

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getPodcastSnippet(slug: string): Promise<PodcastSnippet | null> {
  return await client.fetch(getPodcastSnippetBySlugQuery, { slug });
}

async function getWorksByPodcast(podcastId: string): Promise<Work[]> {
  return await client.fetch(getWorksByPodcastQuery, { podcastId });
}

function formatDuration(duration: string): string {
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

function formatCategory(category: string): string {
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

function formatDurationFromSeconds(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export default async function PodcastPage({ params }: PageProps) {
  const { slug } = await params;
  const podcast = await getPodcastSnippet(slug);

  if (!podcast) {
    notFound();
  }

  const referencedWorks = await getWorksByPodcast(podcast._id);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.podcastCard}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerContent}>
              <div className={styles.podcastMeta}>
                <span className={styles.seasonEpisode}>
                  Season {podcast.seasonNumber}, Episode {podcast.episodeNumber}
                </span>
                {podcast.duration && (
                  <span className={styles.duration}>
                    Duration: {formatDuration(podcast.duration)}
                  </span>
                )}
              </div>
              <h1 className={styles.title}>{podcast.title}</h1>
            </div>
            {podcast.imageUrl && (
              <div className={styles.imageContainer}>
                <Image
                  src={podcast.imageUrl}
                  alt={`Podcast artwork for ${podcast.title}`}
                  width={200}
                  height={200}
                  className={styles.podcastImage}
                />
              </div>
            )}
          </div>

          {/* Description */}
          <div className={styles.description}>
            <h2 className={styles.sectionTitle}>Description</h2>
            <p className={styles.descriptionText}>{podcast.description}</p>
          </div>

          {/* Listen Links */}
          <div className={styles.listenSection}>
            <h2 className={styles.sectionTitle}>Listen</h2>
            <div className={styles.listenButtons}>
              {podcast.spotifyUrl && (
                <a
                  href={podcast.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.listenButton}
                >
                  <span className={styles.buttonIcon}>🎵</span>
                  Listen on Spotify
                </a>
              )}
              {podcast.youtubeUrl && (
                <a
                  href={podcast.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.listenButton}
                >
                  <span className={styles.buttonIcon}>📺</span>
                  Watch on YouTube
                </a>
              )}
            </div>
          </div>

          {/* Referenced Works */}
          <div className={styles.worksSection}>
            <h2 className={styles.sectionTitle}>
              Featured Works ({referencedWorks.length})
            </h2>
            {referencedWorks.length === 0 ? (
              <p className={styles.noWorksText}>
                No works are currently associated with this podcast episode.
              </p>
            ) : (
              <div className={styles.worksGrid}>
                {referencedWorks.map((work) => (
                  <Link key={work._id} href={`/works/${work.slug}`} className={styles.workCard}>
                    <div className={styles.workInfo}>
                      <h3 className={styles.workTitle}>{work.pieceTitle}</h3>
                      <div className={styles.workMeta}>
                        <span className={styles.category}>{formatCategory(work.category)}</span>
                        {work.opusNumber && <span className={styles.opus}>{work.opusNumber}</span>}
                        <span className={styles.year}>{work.yearOfComposition}</span>
                        <span className={styles.duration}>{formatDurationFromSeconds(work.duration)}</span>
                      </div>
                      <p className={styles.workDescription}>{work.description}</p>
                      
                      <div className={styles.timestamps}>
                        {work.spotifyTimestamp && (
                          <span className={styles.timestamp}>
                            Spotify: {work.spotifyTimestamp}
                          </span>
                        )}
                        {work.youtubeTimestamp && (
                          <span className={styles.timestamp}>
                            YouTube: {work.youtubeTimestamp}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
