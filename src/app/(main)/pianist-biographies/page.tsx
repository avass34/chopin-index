import Link from 'next/link';
import Image from 'next/image';
import { getAllPianistsQuery } from '../../../../lib/queries';
import { client } from '../../../../lib/sanity.client';
import styles from './page.module.css';
import Navbar from '../../../components/Navbar';

interface RichTextBlock {
  _type: string;
  style?: string;
  children?: Array<{ text: string }>;
}

interface Pianist {
  _id: string;
  name: string;
  slug: string;
  nationality: string;
  dateBorn: string;
  dateDead?: string;
  biography: string | RichTextBlock[];
  imageUrl?: string;
}

async function getPianists(): Promise<Pianist[]> {
  return await client.fetch(getAllPianistsQuery);
}


export default async function PianistBiographiesPage() {
  const pianists = await getPianists();

  return (
    <div className={styles.page}>
      <Navbar />
      <Image
        src="/ChopinBG.webp"
        alt="Background"
        fill
        priority
        unoptimized
        className={styles.backgroundImage}
      />
      <div className={styles.blackOverlay} />
      <main className={styles.main}>
        <div className={styles.heroSection}>
          <h1 className={styles.heroTitle}>Pianist Biographies</h1>
          <p className={styles.heroDescription}>
            Discover the lives and legacies of the world&apos;s greatest pianists
          </p>
        </div>

        {pianists.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No pianists found. Add some pianists in your Sanity Studio!</p>
            <a href="/studio" className={styles.primary}>
              Open Sanity Studio
            </a>
          </div>
        ) : (
          <div className={styles.pianistsContainer}>
            <div className={styles.pianistsGrid}>
              {pianists.map((pianist) => (
                <Link key={pianist._id} href={`/biographies/${pianist.slug}`} className={styles.pianistCard}>
                  <div className={styles.pianistImage}>
                    {pianist.imageUrl ? (
                      <Image
                        src={pianist.imageUrl}
                        alt={`Portrait of ${pianist.name}`}
                        width={200}
                        height={200}
                        className={styles.portrait}
                      />
                    ) : (
                      <div className={styles.placeholderImage}>
                        <span className={styles.placeholderText}>
                          {pianist.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className={styles.pianistInfo}>
                    <h3 className={styles.pianistName}>{pianist.name}</h3>
                    <p className={styles.pianistNationality}>{pianist.nationality}</p>
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
