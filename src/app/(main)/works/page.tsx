import { getAllWorksQuery } from '../../../../lib/queries';
import { client } from '../../../../lib/sanity.client';
import WorkCard from '../../../components/WorkCard';
import styles from './page.module.css';

interface Work {
  _id: string;
  slug: string;
  pieceTitle: string;
  category: {
    _id: string;
    name: string;
    pluralName: string;
    slug: string;
    imageUrl?: string;
  };
  isPopular: boolean;
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
      pageLink?: string;
    };
  }>;
}

async function getWorks(): Promise<Work[]> {
  return await client.fetch(getAllWorksQuery);
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
                <WorkCard key={work._id} work={work} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
