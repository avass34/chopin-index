import Image from "next/image";
import styles from "./page.module.css";
import { client } from "../../lib/sanity.client";
import { getAllPianistsQuery } from "../../lib/queries";

interface Pianist {
  _id: string;
  name: string;
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

export default async function Home() {
  const pianists = await getPianists();

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>Chopin Index - Pianists</h1>
        
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
                  <h2 className={styles.pianistName}>{pianist.name}</h2>
                  <p className={styles.pianistYears}>
                    {formatYear(pianist.dateBorn)} - {pianist.dateDead ? formatYear(pianist.dateDead) : 'Present'}
                  </p>
                  <p className={styles.pianistBio}>{pianist.biography}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
