import Link from 'next/link';
import { Metadata } from 'next';
import { getAllOpusesQuery, getAllCategoriesQuery } from '../../../../../lib/queries';
import { client } from '../../../../../lib/sanity.client';
import styles from './page.module.css';
import Navbar from '../../../../components/Navbar';

// Rich text rendering function
interface RichTextBlock {
  _type: string;
  style?: string;
  children?: Array<{ text: string }>;
}

function renderRichText(content: RichTextBlock[]) {
  if (!content) return null;
  
  return content.map((block, index) => {
    if (block._type === 'block') {
      const text = block.children?.map((child) => child.text).join('') || '';
      
      switch (block.style) {
        case 'h2':
          return <h2 key={index} className={styles.workDescriptionHeading}>{text}</h2>;
        case 'h3':
          return <h3 key={index} className={styles.workDescriptionSubheading}>{text}</h3>;
        case 'blockquote':
          return <blockquote key={index} className={styles.workDescriptionQuote}>{text}</blockquote>;
        default:
          return <p key={index} className={styles.workDescription}>{text}</p>;
      }
    }
    
    return null;
  });
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
  description: RichTextBlock[];
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

interface Opus {
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
  };
  works: Work[];
}

interface Category {
  _id: string;
  name: string;
  pluralName: string;
  slug: string;
  imageUrl?: string;
  imageDescription?: string;
}

interface PageProps {
  params: Promise<{
    category: string;
  }>;
}

async function getAllOpuses(): Promise<Opus[]> {
  return await client.fetch(getAllOpusesQuery);
}

async function getAllCategories(): Promise<Category[]> {
  return await client.fetch(getAllCategoriesQuery);
}

// Generate static params for all categories
export async function generateStaticParams() {
  const categories = await getAllCategories();
  
  return categories
    .filter((category) => category.slug) // Only include categories with slugs
    .map((category) => ({
      category: category.slug,
    }));
}

// Generate metadata for each category page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const categories = await getAllCategories();
  const categoryData = categories.find(cat => cat.slug && cat.slug === category);
  
  if (!categoryData) {
    return {
      title: 'Category Not Found | Chopin Index',
      description: 'The requested category could not be found.',
    };
  }
  
  return {
    title: `${categoryData.pluralName} | Chopin Index`,
    description: `Explore all of Chopin's ${categoryData.name.toLowerCase()} works. Discover ${categoryData.pluralName.toLowerCase()} with detailed information, performances, and analysis.`,
    openGraph: {
      title: `${categoryData.pluralName} | Chopin Index`,
      description: `Explore all of Chopin's ${categoryData.name.toLowerCase()} works.`,
      type: 'website',
    },
  };
}

// Revalidate every 24 hours (content rarely changes)
export const revalidate = 86400;

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  
  const [opuses, categories] = await Promise.all([
    getAllOpuses(),
    getAllCategories()
  ]);

  console.log('Category slug from URL:', category);
  console.log('Available categories:', categories.map(c => ({ name: c.name, slug: c.slug })));

  // Find the category by slug
  const categoryData = categories.find(cat => cat.slug && cat.slug === category);
  
  if (!categoryData) {
    return (
      <div className={styles.page}>
        <Navbar />
        <main className={styles.main}>
          <div className={styles.errorState}>
            <h1 className={styles.errorTitle}>Category Not Found</h1>
            <p className={styles.errorText}>
              The category &quot;{category}&quot; could not be found.
            </p>
            <Link href="/works" className={styles.backLink}>
              View All Works
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // Filter opuses that belong to the selected category
  const categoryOpuses = opuses.filter(opus => 
    opus.category && opus.category._id === categoryData._id
  );

  // Sort opuses by date
  categoryOpuses.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className={styles.page}>
      <Navbar />
      
      {/* Fixed Background Image */}
      {categoryData.imageUrl && (
        <div 
          className={styles.backgroundImage}
          style={{ '--background-image': `url('${categoryData.imageUrl}')` } as React.CSSProperties}
        >
          {/* Image Description Overlay */}
          {categoryData.imageDescription && (
            <div className={styles.imageDescription}>
              {categoryData.imageDescription}
            </div>
          )}
        </div>
      )}
      
      {/* Black Gradient Overlay */}
      <div className={styles.blackOverlay} />
      
      <main className={styles.main}>
        <div className={styles.heroSection}>
          <div className={styles.heroContent}>
            <Link href="/works" className={styles.backLink}>
              ← All Works
            </Link>
            <h1 className={styles.heroTitle}>{categoryData.pluralName}</h1>
            <p className={styles.heroDescription}>
              Explore all of Chopin&apos;s {categoryData.name.toLowerCase()} works
            </p>
          </div>
        </div>

        {categoryOpuses.length === 0 ? (
          <div className={styles.emptyState}>
            <h2 className={styles.emptyTitle}>No {categoryData.name.toLowerCase()} works found</h2>
            <p>There are currently no {categoryData.name.toLowerCase()} works in the collection.</p>
          </div>
        ) : (
          <div className={styles.opusList}>
            {categoryOpuses.map((opus) => (
              <div key={opus._id} className={styles.opusItem}>
                <div className={styles.opusDate}>
                  {new Date(opus.date).getFullYear()}
                </div>
                <h3 className={styles.opusTitle}>
                  Opus {opus.title}
                </h3>
                {opus.works && opus.works.length > 0 && (
                  <ul className={`${styles.worksList} ${opus.works.length === 1 ? styles.singleWork : styles.multipleWorks}`}>
                    {opus.works.map((work, index) => (
                      <li key={work._id} className={styles.workItem}>
                        {opus.works.length > 1 && index === 0 && <span className={styles.stapleTop}>┌</span>}
                        {opus.works.length > 1 && index === opus.works.length - 1 && <span className={styles.stapleBottom}>└</span>}
                        {opus.works.length > 1 && index > 0 && index < opus.works.length - 1 && <span className={styles.stapleMiddle}>├</span>}
                        <Link href={`/works/${work.slug}`} className={styles.workLink}>
                          {work.pieceTitle} in {work.key}
                          {work.nickname && (
                            <span className={styles.workNickname}> &ldquo;{work.nickname}&rdquo;</span>
                          )}
                        </Link>
                        {work.description && work.description.length > 0 && (
                          <div className={styles.workDescriptionContainer}>
                            {renderRichText(work.description)}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
