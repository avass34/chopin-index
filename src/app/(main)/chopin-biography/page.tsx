import Image from "next/image";
import styles from "./page.module.css";
import { client } from "../../../../lib/sanity.client";
import { getChopinProfileQuery, getAllImageGalleryQuery } from "../../../../lib/queries";
import Navbar from "../../../components/Navbar";

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

interface ImageGalleryItem {
  _id: string;
  title: string;
  imageUrl: string;
}

async function getChopinProfile(): Promise<ChopinProfile | null> {
  return await client.fetch(getChopinProfileQuery);
}

async function getImageGallery(): Promise<ImageGalleryItem[]> {
  return await client.fetch(getAllImageGalleryQuery);
}

interface RichTextBlock {
  _type: string;
  style?: string;
  children?: Array<{ text: string }>;
  asset?: { url: string };
  alt?: string;
}

function renderRichText(content: RichTextBlock[]) {
  if (!content) return null;
  
  return content.map((block, index) => {
    if (block._type === 'block') {
      const text = block.children?.map((child) => child.text).join('') || '';
      
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
    
    if (block._type === 'image') {
      return (
        <div key={index} className={styles.biographyImageContainer}>
          <Image
            src={block.asset?.url || ''}
            alt={block.alt || 'Biography image'}
            width={600}
            height={400}
            className={styles.biographyImage}
          />
        </div>
      );
    }
    
    return null;
  });
}

export default async function ChopinBiography() {
  const [chopinProfile, imageGallery] = await Promise.all([
    getChopinProfile(),
    getImageGallery()
  ]);

  console.log('Extended Biography:', chopinProfile?.extendedBiography);
  console.log('Regular Biography:', chopinProfile?.biography);

  if (!chopinProfile) {
    return (
      <div className={styles.page}>
        <Navbar />
        <main className={styles.main}>
          <div className={styles.emptyState}>
            <h1>Chopin Biography</h1>
            <p>Biography information not available.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div 
      className={styles.page}
      style={{
        '--background-image': `url('${chopinProfile.backgroundImageUrl || "/ChopinBG.webp"}')`
      } as React.CSSProperties}
    >
      <Navbar />
      
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>Frédéric Chopin</h1>
            <div className={styles.heroDates}>
              {chopinProfile.birthDate && chopinProfile.deathDate ? (
                <span className={styles.dates}>
                  {new Date(chopinProfile.birthDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })} - {new Date(chopinProfile.deathDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              ) : (
                <span className={styles.dates}>
                  March 1, 1810 - October 17, 1849
                </span>
              )}
            </div>
            <div className={styles.biographyContent}>
              {chopinProfile.extendedBiography && chopinProfile.extendedBiography.length > 0 ? (
                renderRichText(chopinProfile.extendedBiography)
              ) : chopinProfile.biography && chopinProfile.biography.length > 0 ? (
                renderRichText(chopinProfile.biography)
              ) : (
                <p>Biography content not available.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <main className={styles.main} style={{ 
        maxWidth: 'none', 
        background: 'linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 1) 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>

        {/* Image Gallery Section */}
        {imageGallery.length > 0 && (
          <section className={styles.gallerySection}>
            <h2 className={styles.galleryTitle}>Image Gallery</h2>
            <div className={styles.galleryGrid}>
              {imageGallery.map((item) => (
                <div key={item._id} className={styles.galleryItem}>
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    width={400}
                    height={300}
                    className={styles.galleryImage}
                  />
                  <p className={styles.galleryCaption}>{item.title}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
