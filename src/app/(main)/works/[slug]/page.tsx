import Image from "next/image";
import Link from "next/link";
import { client } from "../../../../../lib/sanity.client";
import { getWorkBySlugQuery } from "../../../../../lib/queries";
import { notFound } from "next/navigation";
import styles from "./page.module.css";

interface Work {
  _id: string;
  pieceTitle: string;
  category: string;
  opusNumber?: string;
  yearOfComposition: number;
  duration: string;
  description: string;
  movements?: string[];
  key: string;
  imslpImageUrl?: string;
  imslpLink?: string;
  notablePerformers?: { _id: string; name: string; slug: string }[];
  podcastHighlights?: { 
    spotifyTimestamp?: string;
    youtubeTimestamp?: string;
    podcast: { 
      _id: string; 
      title: string; 
      description: string;
      seasonNumber: number;
      episodeNumber: number;
      imageUrl?: string;
    } 
  }[];
}

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getWork(slug: string): Promise<Work | null> {
  return await client.fetch(getWorkBySlugQuery, { slug });
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

export default async function WorkPage({ params }: PageProps) {
  const { slug } = await params;
  const work = await getWork(slug);

  if (!work) {
    notFound();
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.workCard}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerContent}>
              <h1 className={styles.title}>
                {work.pieceTitle}
              </h1>
              <div className={styles.metaTags}>
                <span className={styles.metaTag}>
                  {formatCategory(work.category)}
                </span>
                {work.key && (
                  <span className={styles.metaTag}>
                    {work.key}
                  </span>
                )}
                {work.opusNumber && (
                  <span className={styles.metaTag}>
                    {work.opusNumber}
                  </span>
                )}
                <span className={styles.metaTag}>
                  {work.yearOfComposition}
                </span>
                <span className={styles.metaTag}>
                  {formatDuration(work.duration)}
                </span>
              </div>
              {work.imslpImageUrl && (
                <Image
                  src={work.imslpImageUrl}
                  alt={`Score image for ${work.pieceTitle}`}
                  width={300}
                  height={200}
                  className={styles.scoreImage}
                />
              )}
            </div>
          </div>

          {/* Content */}
          <div className={styles.content}>

            {/* Description */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Description</h2>
              <p className={styles.description}>
                {work.description}
              </p>
            </div>

            {/* Movements */}
            {work.movements && work.movements.length > 0 && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Movements</h2>
                <div className={styles.movementsList}>
                  {work.movements.map((movement, index) => (
                    <div key={index} className={styles.movementItem}>
                      <div className={styles.movementNumber}>
                        {index + 1}
                      </div>
                      <span className={styles.movementText}>{movement}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notable Performers */}
            {work.notablePerformers && work.notablePerformers.length > 0 && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Notable Performers</h2>
                <div className={styles.performersGrid}>
                  {work.notablePerformers.map((performer) => (
                    <Link
                      key={performer._id}
                      href={`/biographies/${performer.slug}`}
                      className={styles.performerCard}
                    >
                      <h3 className={styles.performerName}>{performer.name}</h3>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Podcast Highlights */}
            {work.podcastHighlights && work.podcastHighlights.length > 0 && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Podcast Highlights</h2>
                <div className={styles.podcastHighlights}>
                  {work.podcastHighlights.map((highlight) => (
                    <div key={highlight.podcast._id} className={styles.podcastCard}>
                      <div className={styles.podcastHeader}>
                        {highlight.podcast.imageUrl && (
                          <Image
                            src={highlight.podcast.imageUrl}
                            alt={`Podcast artwork for ${highlight.podcast.title}`}
                            width={80}
                            height={80}
                            className={styles.podcastImage}
                          />
                        )}
                        <div className={styles.podcastInfo}>
                          <h3 className={styles.podcastTitle}>
                            S{highlight.podcast.seasonNumber}E{highlight.podcast.episodeNumber} - {highlight.podcast.title}
                          </h3>
                          <p className={styles.podcastDescription}>{highlight.podcast.description}</p>
                          <div className={styles.timestamps}>
                            {highlight.spotifyTimestamp && (
                              <span className={styles.timestamp}>
                                Spotify: {highlight.spotifyTimestamp}
                              </span>
                            )}
                            {highlight.youtubeTimestamp && (
                              <span className={styles.timestamp}>
                                YouTube: {highlight.youtubeTimestamp}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* IMSLP Link */}
            {work.imslpLink && (
              <div className={styles.imslpSection}>
                <h2 className={styles.sectionTitle}>Sheet Music</h2>
                <a
                  href={work.imslpLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.imslpButton}
                >
                  View on IMSLP
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
