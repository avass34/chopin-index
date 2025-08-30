import Link from 'next/link';
import { getAllWorksQuery } from '../../../../lib/queries';
import { client } from '../../../../lib/sanity.client';
import styles from './page.module.css';

interface Work {
  _id: string;
  slug: string;
  pieceTitle: string;
  category: string;
  opusNumber?: string;
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
    podcast: {
      _id: string;
      slug: string;
      title: string;
      description: string;
    };
  }>;
}

async function getWorks(): Promise<Work[]> {
  return await client.fetch(getAllWorksQuery);
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function formatCategory(category: string): string {
  const categoryMap: { [key: string]: string } = {
    'ballade': 'Ballade',
    'etude': 'Étude',
    'mazurka': 'Mazurka',
    'nocturne': 'Nocturne',
    'polonaise': 'Polonaise',
    'prelude': 'Prelude',
    'scherzo': 'Scherzo',
    'sonata': 'Sonata',
    'waltz': 'Waltz',
    'concerto': 'Concerto',
    'impromptu': 'Impromptu',
    'fantasy': 'Fantasy',
    'rondo': 'Rondo',
    'variations': 'Variations',
    'other': 'Other'
  };
  return categoryMap[category] || category;
}

export default async function WorksPage() {
  const works = await getWorks();

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>Chopin&apos;s Works</h1>
          <p className={styles.subtitle}>
            Explore the complete catalog of Chopin&apos;s compositions
          </p>
        </div>

        {works.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No works found. Add some works in your Sanity Studio!</p>
            <a href="/studio" className={styles.primary}>
              Open Sanity Studio
            </a>
          </div>
        ) : (
          <div className={styles.worksContainer}>
            <div className={styles.worksGrid}>
              {works.map((work) => (
                <Link key={work._id} href={`/works/${work.slug}`} className={styles.workCard}>
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
                    
                    {work.podcastHighlights && work.podcastHighlights.length > 0 && (
                      <div className={styles.podcastHighlights}>
                        <strong>Podcast Highlights:</strong>
                        <div className={styles.podcastList}>
                                                      {work.podcastHighlights.map((highlight) => (
                              <div key={highlight.podcast._id} className={styles.podcastItem}>
                                <Link 
                                  href={`/episodes/podcasts/${highlight.podcast.slug}`}
                                  className={styles.podcastTitle}
                                >
                                  {highlight.podcast.title}
                                </Link>
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
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
