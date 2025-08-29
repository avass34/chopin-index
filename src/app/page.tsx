import Image from "next/image";
import styles from "./page.module.css";
import { client } from "../../lib/sanity.client";
import { getAllPianistsQuery, getAllWorksQuery } from "../../lib/queries";

interface Pianist {
  _id: string;
  name: string;
  dateBorn: string;
  dateDead?: string;
  biography: string;
  imageUrl?: string;
}

interface Work {
  _id: string;
  pieceTitle: string;
  opusNumber?: string;
  yearOfComposition: number;
  duration: string;
  description: string;
  movements: string[];
  imageUrl?: string;
  notablePerformers: { _id: string; name: string }[];
  podcastHighlights: { _id: string; title: string; timestamp: string; description: string }[];
}

async function getPianists(): Promise<Pianist[]> {
  return await client.fetch(getAllPianistsQuery);
}

async function getWorks(): Promise<Work[]> {
  return await client.fetch(getAllWorksQuery);
}

function formatYear(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.getFullYear().toString();
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

export default async function Home() {
  const [pianists, works] = await Promise.all([getPianists(), getWorks()]);

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
                  {work.imageUrl && (
                    <div className={styles.workImage}>
                      <Image
                        src={work.imageUrl}
                        alt={`${work.pieceTitle} score or manuscript`}
                        width={200}
                        height={150}
                        className={styles.workImage}
                      />
                    </div>
                  )}
                  <div className={styles.workInfo}>
                    <h3 className={styles.workTitle}>{work.pieceTitle}</h3>
                    <div className={styles.workMeta}>
                      {work.opusNumber && <span className={styles.opus}>{work.opusNumber}</span>}
                      <span className={styles.year}>{work.yearOfComposition}</span>
                      <span className={styles.duration}>{formatDuration(work.duration)}</span>
                    </div>
                    <p className={styles.workDescription}>{work.description}</p>
                    
                    {work.movements.length > 0 && (
                      <div className={styles.movements}>
                        <strong>Movements:</strong>
                        <ul>
                          {work.movements.map((movement, index) => (
                            <li key={index}>{movement}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {work.notablePerformers.length > 0 && (
                      <div className={styles.performers}>
                        <strong>Notable Performers:</strong>
                        <div className={styles.performerTags}>
                          {work.notablePerformers.map((performer) => (
                            <span key={performer._id} className={styles.performerTag}>
                              {performer.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {work.podcastHighlights.length > 0 && (
                      <div className={styles.podcastHighlights}>
                        <strong>Podcast Highlights:</strong>
                        <div className={styles.podcastList}>
                          {work.podcastHighlights.map((highlight) => (
                            <div key={highlight._id} className={styles.podcastItem}>
                              <span className={styles.podcastTitle}>{highlight.title}</span>
                              <span className={styles.podcastTimestamp}>{highlight.timestamp}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Pianists Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Pianists</h2>
          
          {pianists.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No pianists found. Add some pianists in your Sanity Studio!</p>
              <a 
                href="/studio" 
                className={styles.primary}
              >
                Open Sanity Studio
              </a>
            </div>
          ) : (
            <div className={styles.pianistsGrid}>
              {pianists.map((pianist) => (
                <div key={pianist._id} className={styles.pianistCard}>
                  {pianist.imageUrl && (
                    <div className={styles.pianistImage}>
                      <Image
                        src={pianist.imageUrl}
                        alt={`Portrait of ${pianist.name}`}
                        width={200}
                        height={200}
                        className={styles.portrait}
                      />
                    </div>
                  )}
                  <div className={styles.pianistInfo}>
                    <h3 className={styles.pianistName}>{pianist.name}</h3>
                    <p className={styles.pianistYears}>
                      {formatYear(pianist.dateBorn)} - {pianist.dateDead ? formatYear(pianist.dateDead) : 'Present'}
                    </p>
                    <p className={styles.pianistBio}>{pianist.biography}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
