import Link from "next/link";
import { Metadata } from "next";
import { client } from "../../../../../lib/sanity.client";
import { getPianistBySlugQuery, getWorksByPianistQuery, getAllPianistsQuery } from "../../../../../lib/queries";
import { notFound } from "next/navigation";
import styles from "./page.module.css";
import Navbar from "../../../../components/Navbar";

interface RichTextBlock {
  _type: string;
  style?: string;
  children?: RichTextChild[];
}

interface RichTextChild {
  text: string;
}

// Rich text rendering function
function renderRichText(content: RichTextBlock[] | string) {
  if (!content) return null;
  
  // Handle plain string content
  if (typeof content === 'string') {
    return <p className={styles.biographyParagraph}>{content}</p>;
  }
  
  // Handle rich text array content
  if (Array.isArray(content)) {
    return content.map((block, index) => {
      if (block._type === 'block') {
        const text = block.children?.map((child: RichTextChild) => child.text).join('') || '';
        
        switch (block.style) {
          case 'h2':
            return <h2 key={index} className={styles.biographyHeading}>{text}</h2>;
          case 'h3':
            return <h3 key={index} className={styles.biographySubheading}>{text}</h3>;
          case 'blockquote':
            return <blockquote key={index} className={styles.biographyQuote}>{text}</blockquote>;
          default:
            return <p key={index} className={styles.biographyParagraph}>{text}</p>;
        }
      }
      
      return null;
    });
  }
  
  return null;
}

interface Pianist {
  _id: string;
  slug: string;
  name: string;
  nationality: string;
  dateBorn: string;
  dateDead?: string;
  biography: string | RichTextBlock[];
  imageUrl?: string;
}

interface Work {
  _id: string;
  slug: string;
  pieceTitle: string;
  nickname?: string;
  key: string;
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
    description: `Biography of ${pianist.name}, a notable pianist who performed Chopin's works.`,
    openGraph: {
      title: `${pianist.name} | Chopin Index`,
      description: `Biography of ${pianist.name}, a notable pianist who performed Chopin's works.`,
      type: 'article',
    },
  };
}




function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
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
      <Navbar />
      
      {/* Fixed Background Image */}
      {pianist.imageUrl && (
        <div 
          className={styles.backgroundImage}
          style={{ '--background-image': `url('${pianist.imageUrl}')` } as React.CSSProperties}
        />
      )}
      
      {/* Black Gradient Overlay */}
      <div className={styles.blackOverlay} />
      
      <main className={styles.main}>
        <div className={styles.heroSection}>
          <div className={styles.heroContent}>
            <Link href="/pianist-biographies" className={styles.backLink}>
              ← All Pianists
            </Link>
            <h1 className={styles.heroTitle}>{pianist.name}</h1>
            <p className={styles.heroNationality}>{pianist.nationality}</p>
            <p className={styles.heroDescription}>
              {formatDate(pianist.dateBorn)} - {pianist.dateDead ? formatDate(pianist.dateDead) : 'Present'}
            </p>
          </div>
        </div>

        <div className={styles.biographySection}>
          <div className={styles.biographyContent}>
            {pianist.biography && (
              <div className={styles.biographyContainer}>
                {renderRichText(pianist.biography)}
              </div>
            )}
          </div>
        </div>

        {associatedWorks.length > 0 && (
          <div className={styles.worksSection}>
            <h2 className={styles.worksTitle}>Associated Repertoire</h2>
            <div className={styles.worksList}>
              {associatedWorks.map((work) => (
                <div key={work._id} className={styles.workItem}>
                  <Link href={`/works/${work.slug}`} className={styles.workLink}>
                    {work.pieceTitle} in {work.key}
                    {work.nickname && (
                      <span className={styles.workNickname}> &ldquo;{work.nickname}&rdquo;</span>
                    )}
                  </Link>
                  {work.opus && (
                    <div className={styles.workMeta}>
                      <span className={styles.opusInfo}>
                        Opus {work.opus.title} ({work.yearOfComposition})
                      </span>
                      {work.opus.category && (
                        <span className={styles.categoryInfo}>
                          {work.opus.category.name}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
