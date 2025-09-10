import Link from 'next/link';
import { Metadata } from 'next';
import { getAllOpusesQuery, getAllCategoriesQuery } from '../../../../../lib/queries';
import { client } from '../../../../../lib/sanity.client';
import WorkCard from '../../../../components/WorkCard';
import styles from './page.module.css';

interface Work {
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

  // Extract works from opuses that belong to the selected category
  const categoryWorks: Work[] = [];
  opuses.forEach(opus => {
    if (opus.category && opus.category._id === categoryData._id) {
      categoryWorks.push(...opus.works);
    }
  });

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.header}>
          <Link href="/works" className={styles.backLink}>
            ← All Works
          </Link>
          <h1 className={styles.title}>{categoryData.pluralName}</h1>
          <p className={styles.subtitle}>
            Explore all of Chopin&apos;s {categoryData.name.toLowerCase()} works
          </p>
        </div>

        {categoryWorks.length === 0 ? (
          <div className={styles.emptyState}>
            <h2 className={styles.emptyTitle}>No {categoryData.name.toLowerCase()} works found</h2>
            <p>There are currently no {categoryData.name.toLowerCase()} works in the collection.</p>
            <Link href="/works" className={styles.primary}>
              View All Works
            </Link>
          </div>
        ) : (
          <div className={styles.worksContainer}>
            <div className={styles.worksGrid}>
              {categoryWorks.map((work) => (
                <WorkCard key={work._id} work={work} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
