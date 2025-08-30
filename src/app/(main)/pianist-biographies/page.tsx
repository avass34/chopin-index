import Link from 'next/link';
import Image from 'next/image';
import { getAllPianistsQuery } from '../../../../lib/queries';
import { client } from '../../../../lib/sanity.client';
import styles from './page.module.css';

interface Pianist {
  _id: string;
  name: string;
  slug: string;
  dateBorn: string;
  dateDead?: string;
  biography: string;
  imageUrl?: string;
}

async function getPianists(): Promise<Pianist[]> {
  return await client.fetch(getAllPianistsQuery);
}

function formatYear(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.getFullYear().toString();
}

export default async function PianistBiographiesPage() {
  const pianists = await getPianists();

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>Pianist Biographies</h1>
          <p className={styles.subtitle}>
            Discover the lives and legacies of the world's greatest pianists
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
                    <p className={styles.pianistYears}>
                      {formatYear(pianist.dateBorn)} - {pianist.dateDead ? formatYear(pianist.dateDead) : 'Present'}
                    </p>
                    <p className={styles.pianistBio}>
                      {pianist.biography.length > 200 
                        ? `${pianist.biography.substring(0, 200)}...` 
                        : pianist.biography
                      }
                    </p>
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
