import Link from 'next/link';
import styles from './WorkCard.module.css';

interface WorkCardProps {
  work: {
    _id: string;
    slug: string;
    pieceTitle: string;
    nickname?: string;
    isPopular: boolean;
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
  };
  showPerformers?: boolean;
  showPodcasts?: boolean;
  showMovements?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
}

export default function WorkCard({ 
  work, 
  variant = 'default' 
}: WorkCardProps) {
  return (
    <div className={`${styles.workCard} ${styles[variant]}`}>
      <Link href={`/works/${work.slug}`} className={styles.workLink}>
        <div className={styles.workInfo}>
          <h3 className={styles.workTitle}>
            {work.pieceTitle}
            {work.nickname && <span className={styles.nickname}> ({work.nickname})</span>}
          </h3>
          
          <div className={styles.workMeta}>
            <span className={styles.year}>{work.yearOfComposition}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
