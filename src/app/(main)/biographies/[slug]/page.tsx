import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { client } from "../../../../../lib/sanity.client";
import { getPianistBySlugQuery, getWorksByPianistQuery, getAllPianistsQuery } from "../../../../../lib/queries";
import { notFound } from "next/navigation";
import styles from "./page.module.css";

interface Pianist {
  _id: string;
  slug: string;
  name: string;
  dateBorn: string;
  dateDead?: string;
  biography: string;
  imageUrl?: string;
}

interface Work {
  _id: string;
  slug: string;
  pieceTitle: string;
  nickname?: string;
  isPopular: boolean;
  yearOfComposition: number;
  duration: number;
  description: string;
  opus?: {
    _id: string;
    title: string;
    slug: string;
    date: string;
    category: {
      _id: string;
      name: string;
      pluralName: string;
      slug: string;
      imageUrl?: string;
      imageDescription?: string;
    };
  };
}

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getPianist(slug: string): Promise<Pianist | null> {
  return await client.fetch(getPianistBySlugQuery, { slug });
}

async function getWorksByPianist(pianistId: string): Promise<Work[]> {
  return await client.fetch(getWorksByPianistQuery, { pianistId });
}

async function getAllPianists(): Promise<Pianist[]> {
  return await client.fetch(getAllPianistsQuery);
}

// Generate static params for all pianists
export async function generateStaticParams() {
  const pianists = await getAllPianists();
  
  return pianists.map((pianist) => ({
    slug: pianist.slug,
  }));
}

// Generate metadata for each pianist page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const pianist = await getPianist(slug);
  
  if (!pianist) {
    return {
      title: 'Pianist Not Found | Chopin Index',
      description: 'The requested pianist could not be found.',
    };
  }
  
  return {
    title: `${pianist.name} | Chopin Index`,
    description: `Biography of ${pianist.name}, a notable pianist who performed Chopin's works. ${pianist.biography.substring(0, 160)}...`,
    openGraph: {
      title: `${pianist.name} | Chopin Index`,
      description: pianist.biography.substring(0, 160),
      type: 'article',
    },
  };
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}



function formatYear(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.getFullYear().toString();
}

// Revalidate every 24 hours (content rarely changes)
export const revalidate = 86400;

export default async function PianistPage({ params }: PageProps) {
  const { slug } = await params;
  const pianist = await getPianist(slug);

  if (!pianist) {
    notFound();
  }

  const associatedWorks = await getWorksByPianist(pianist._id);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.biographyCard}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerContent}>
              <h1 className={styles.title}>
                {pianist.name}
              </h1>
              <p className={styles.years}>
                {formatYear(pianist.dateBorn)} - {pianist.dateDead ? formatYear(pianist.dateDead) : 'Present'}
              </p>
              {pianist.imageUrl && (
                <Image
                  src={pianist.imageUrl}
                  alt={`Portrait of ${pianist.name}`}
                  width={200}
                  height={200}
                  className={styles.portrait}
                />
              )}
            </div>
          </div>

          {/* Content */}
          <div className={styles.content}>
            {/* Biography */}
            <div className={styles.biographySection}>
              <h2 className={styles.sectionTitle}>Biography</h2>
              <p className={styles.biographyText}>
                {pianist.biography}
              </p>
            </div>

            {/* Associated Repertoire */}
            <div className={styles.repertoireSection}>
              <h2 className={styles.repertoireTitle}>Associated Repertoire</h2>
              {associatedWorks.length === 0 ? (
                <p className={styles.noWorksText}>
                  No works are currently associated with this pianist.
                </p>
              ) : (
                <div className={styles.worksGrid}>
                  {associatedWorks.map((work) => (
                    <Link key={work._id} href={`/works/${work.slug}`} className={styles.workCard}>
                      <div className={styles.workInfo}>
                        <h3 className={styles.workTitle}>{work.pieceTitle}</h3>
                        <div className={styles.workMeta}>
                          {work.opus?.category && <span className={styles.category}>{work.opus.category.name}</span>}
                          {work.opus?.title && <span className={styles.opus}>{work.opus.title}</span>}
                          <span className={styles.year}>{work.yearOfComposition}</span>
                          <span className={styles.duration}>{formatDuration(work.duration)}</span>
                        </div>
                        <p className={styles.workDescription}>
                          {work.description.length > 120 
                            ? `${work.description.substring(0, 120)}...` 
                            : work.description
                          }
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
