import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import { client, getPopularWorks } from "../../../lib/sanity.client";
import { getAllPodcastSnippetsQuery, getChopinProfileQuery, getAllCategoriesQuery, getAllOpusesQuery } from "../../../lib/queries";
import WorkCard from "../../components/WorkCard";
import PodcastSeasonToggle from "../../components/PodcastSeasonToggle";

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

interface Category {
  _id: string;
  name: string;
  pluralName: string;
  slug: string;
  imageUrl?: string;
  imageDescription?: string;
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
    imageDescription?: string;
  };
  works: Array<{
    _id: string;
    pieceTitle: string;
    slug: string;
  }>;
}

interface PodcastEpisode {
  _id: string;
  slug: string;
  title: string;
  seasonNumber: number;
  episodeNumber: number;
  description: string;
  duration: number;
  imageUrl?: string;
  spotifyUrl?: string;
  youtubeUrl?: string;
  applePodcastUrl?: string;
  pageLink?: string;
}

interface ChopinProfile {
  _id: string;
  profileImageUrl?: string;
  profileImageAlt?: string;
  backgroundImageUrl?: string;
  backgroundImageAlt?: string;
  birthDate: string;
  deathDate: string;
  biography: Array<{
    _key: string;
    _type: string;
    children?: Array<{
      _key: string;
      _type: string;
      text: string;
      marks?: string[];
    }>;
    markDefs?: unknown[];
    style?: string;
  }>;
  extendedBiography?: Array<{
    _key: string;
    _type: string;
    children?: Array<{
      _key: string;
      _type: string;
      text: string;
      marks?: string[];
    }>;
    markDefs?: unknown[];
    style?: string;
  }>;
}


async function getPodcastEpisodes(): Promise<PodcastEpisode[]> {
  return await client.fetch(getAllPodcastSnippetsQuery);
}

async function getChopinProfile(): Promise<ChopinProfile | null> {
  return await client.fetch(getChopinProfileQuery);
}

async function getPopularWorksData(): Promise<Work[]> {
  return await getPopularWorks();
}

async function getCategories(): Promise<Category[]> {
  return await client.fetch(getAllCategoriesQuery);
}

async function getOpuses(): Promise<Opus[]> {
  return await client.fetch(getAllOpusesQuery);
}

function getCategoryStats(opuses: Opus[], categories: Category[]) {
  const categoryCounts: { [key: string]: number } = {};
  
  // Initialize all categories with 0
  categories.forEach(category => {
    categoryCounts[category._id] = 0;
  });
  
  // Count works in each category through opuses
  opuses.forEach(opus => {
    if (opus.category && opus.works) {
      const categoryId = opus.category._id;
      const workCount = opus.works.length;
      if (categoryCounts.hasOwnProperty(categoryId)) {
        categoryCounts[categoryId] += workCount;
      }
    }
  });
  
  return categories.map(category => ({
    category: category._id,
    displayName: category.pluralName,
    count: categoryCounts[category._id] || 0
  })).sort((a, b) => b.count - a.count);
}

export default async function Home() {
  const [episodes, chopinProfile, categories, popularWorks, opuses] = await Promise.all([
    getPodcastEpisodes(), 
    getChopinProfile(),
    getCategories(),
    getPopularWorksData(),
    getOpuses()
  ]);



  const categoryStats = getCategoryStats(opuses, categories);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.twoColumnLayout}>
          {/* Left Column - 75% */}
          <div className={styles.leftColumn}>
            {/* Popular Works Section */}
            {popularWorks.length > 0 && (
              <div className={styles.popularWorksRow}>
                <h2 className={styles.popularWorksTitle}>Popular Works</h2>
                <div className={styles.popularWorksGrid}>
                  {popularWorks.map((work) => (
                    <WorkCard key={work._id} work={work} variant="compact" />
                  ))}
                </div>
              </div>
            )}

            {/* Work Categories */}
            <div className={styles.categoriesRow}>
              <div className={styles.categoriesGrid}>
                {categoryStats.map((category) => {
                  // Find the actual category data to get the correct slug
                  const categoryData = categories.find(cat => cat._id === category.category);
                  return (
                    <Link 
                      key={category.category} 
                      href={`/categories/${categoryData?.slug || category.displayName.toLowerCase().replace(/\s+/g, '-')}`} 
                      className={styles.categoryCard}
                    >
                    <div className={styles.categoryContent}>
                      <h3 className={styles.categoryName}>{category.displayName}</h3>
                      <span className={styles.categoryCount}>{category.count} works</span>
                    </div>
                  </Link>
                );
                })}
              </div>
            </div>
          </div>

          {/* Right Column - 25% */}
          <div className={styles.rightColumn}>
            <div className={styles.chopinCard}>
              {chopinProfile?.profileImageUrl && (
                <div className={styles.profileImageContainer}>
                  <Image
                    src={chopinProfile.profileImageUrl}
                    alt={chopinProfile.profileImageAlt || "Frédéric Chopin"}
                    width={200}
                    height={200}
                    className={styles.profileImage}
                  />
                </div>
              )}
              
              <div className={styles.chopinInfo}>
                <h2 className={styles.chopinName}>Frédéric Chopin</h2>
                <div className={styles.chopinDates}>
                  {chopinProfile?.birthDate && chopinProfile?.deathDate ? (
                    <span className={styles.dates}>
                      {new Date(chopinProfile.birthDate).getFullYear()} - {new Date(chopinProfile.deathDate).getFullYear()}
                    </span>
                  ) : (
                    <span className={styles.dates}>
                      1810 - 1849
                    </span>
                  )}
                </div>
                
                {chopinProfile?.biography && (
                  <div className={styles.biography}>
                    <p className={styles.biographyText}>
                      {chopinProfile.biography[0]?.children?.[0]?.text ? 
                       chopinProfile.biography[0].children[0].text :
                       "Frédéric Chopin was a Polish composer and virtuoso pianist of the Romantic period who wrote primarily for solo piano."}
                    </p>
                  </div>
                )}
                {!chopinProfile?.biography && (
                  <div className={styles.biography}>
                    <p className={styles.biographyText}>
                      Frédéric Chopin was a Polish composer and virtuoso pianist of the Romantic period who wrote primarily for solo piano.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Podcast Episodes Section with Season Toggle */}
        <PodcastSeasonToggle episodes={episodes} />
      </main>
    </div>
  );
}
