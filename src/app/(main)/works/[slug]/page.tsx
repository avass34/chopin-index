'use client';

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { client } from "../../../../../lib/sanity.client";
import { getWorkBySlugQuery } from "../../../../../lib/queries";
import { notFound } from "next/navigation";
import styles from "./page.module.css";
import Navbar from "../../../../components/Navbar";

interface Work {
  _id: string;
  slug: string;
  pieceTitle: string;
  nickname?: string;
  isPopular: boolean;
  yearOfComposition: number;
  duration: string;
  description: string;
  movements?: string[];
  key: string;
  imslpImageUrl?: string;
  imslpLink?: string;
  notablePerformers?: { _id: string; name: string; slug: string }[];
  podcastHighlights?: { 
    spotifyTimestamp?: string;
    youtubeTimestamp?: string;
    appleTimestamp?: string;
    title?: string;
    transcript?: RichTextBlock[];
    podcast: { 
      _id: string; 
      title: string; 
      description: string;
      seasonNumber: number;
      episodeNumber: number;
      imageUrl?: string;
      pageLink?: string;
      spotifyUrl?: string;
      youtubeUrl?: string;
      applePodcastUrl?: string;
    } 
  }[];
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






function formatDuration(duration: string): string {
  const parts = duration.split(':');
  if (parts.length === 3) {
    const hours = parseInt(parts[0]);
    const minutes = parseInt(parts[1]);
    if (hours > 0) {
      return `${hours}h ${minutes} Minutes`;
    }
    return `${minutes} Minutes`;
  }
  return duration;
}

function formatKey(key: string): string {
  const keyMap: { [key: string]: string } = {
    'C': 'C Major',
    'Cm': 'C Minor',
    'C#': 'C-sharp Major',
    'C#m': 'C-sharp Minor',
    'D': 'D Major',
    'Dm': 'D Minor',
    'D#': 'D-sharp Major',
    'D#m': 'D-sharp Minor',
    'E': 'E Major',
    'Em': 'E Minor',
    'F': 'F Major',
    'Fm': 'F Minor',
    'F#': 'F-sharp Major',
    'F#m': 'F-sharp Minor',
    'G': 'G Major',
    'Gm': 'G Minor',
    'G#': 'G-sharp Major',
    'G#m': 'G-sharp Minor',
    'A': 'A Major',
    'Am': 'A Minor',
    'A#': 'A-sharp Major',
    'A#m': 'A-sharp Minor',
    'B': 'B Major',
    'Bm': 'B Minor',
    'Bb': 'B-flat Major',
    'Bbm': 'B-flat Minor',
    'Eb': 'E-flat Major',
    'Ebm': 'E-flat Minor',
    'Ab': 'A-flat Major',
    'Abm': 'A-flat Minor',
    'Db': 'D-flat Major',
    'Dbm': 'D-flat Minor',
    'Gb': 'G-flat Major',
    'Gbm': 'G-flat Minor',
  };
  
  return keyMap[key] || key;
}

function convertTimestampToSeconds(timestamp: string): number {
  // Handle different timestamp formats from CMS
  if (!timestamp) return 0;
  
  // If it's already just a number (seconds), return it
  if (/^\d+$/.test(timestamp)) {
    return parseInt(timestamp);
  }
  
  // Handle MM:SS format
  if (/^\d{1,2}:\d{2}$/.test(timestamp)) {
    const [minutes, seconds] = timestamp.split(':').map(Number);
    return minutes * 60 + seconds;
  }
  
  // Handle HH:MM:SS format
  if (/^\d{1,2}:\d{2}:\d{2}$/.test(timestamp)) {
    const [hours, minutes, seconds] = timestamp.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  }
  
  // If format is not recognized, try to extract numbers
  const numbers = timestamp.match(/\d+/g);
  if (numbers && numbers.length >= 2) {
    const [first, second] = numbers.map(Number);
    if (numbers.length === 2) {
      // Assume MM:SS
      return first * 60 + second;
    } else if (numbers.length === 3) {
      // Assume HH:MM:SS
      const [hours, minutes, seconds] = numbers.map(Number);
      return hours * 3600 + minutes * 60 + seconds;
    }
  }
  
  // Fallback: try to parse as seconds
  const parsed = parseInt(timestamp);
  return isNaN(parsed) ? 0 : parsed;
}

function extractYouTubeVideoId(url: string): string {
  if (!url) return '';
  
  // Handle various YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    /youtu\.be\/([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  // If no pattern matches, return empty string
  return '';
}

// Type definitions for rich text content
interface RichTextChild {
  _type: string;
  text: string;
  marks?: string[];
  markDefs?: Array<{
    _type: string;
    href?: string;
  }>;
}

interface RichTextBlock {
  _type: string;
  style?: string;
  children?: RichTextChild[];
  listItem?: string;
}

interface RichTextListItem {
  _type: string;
  children?: RichTextBlock[];
}

// Rich text rendering function for transcripts
function renderRichTextTranscript(content: RichTextBlock[] | string) {
  if (!content) return null;
  
  // Handle plain string content
  if (typeof content === 'string') {
    return <p className={styles.transcriptParagraph}>{content}</p>;
  }
  
  // Handle rich text array content
  if (Array.isArray(content)) {
    return content.map((block, index) => {
      if (block._type === 'block') {
        // Render children with inline formatting
        const renderChildren = (children: RichTextChild[]) => {
          return children.map((child: RichTextChild, childIndex: number) => {
            let element: React.ReactNode = child.text;
            
            // Apply inline formatting
            if (child.marks) {
              child.marks.forEach((mark: string) => {
                switch (mark) {
                  case 'strong':
                    element = <strong key={childIndex}>{element}</strong>;
                    break;
                  case 'em':
                    element = <em key={childIndex}>{element}</em>;
                    break;
                  case 'underline':
                    element = <u key={childIndex}>{element}</u>;
                    break;
                  case 'strike-through':
                    element = <s key={childIndex}>{element}</s>;
                    break;
                  case 'code':
                    element = <code key={childIndex}>{element}</code>;
                    break;
                }
              });
            }
            
            // Handle links
            if (child.markDefs) {
              child.markDefs.forEach((markDef: { _type: string; href?: string }) => {
                if (markDef._type === 'link') {
                  element = (
                    <a 
                      key={childIndex} 
                      href={markDef.href} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.transcriptLink}
                    >
                      {element}
                    </a>
                  );
                }
              });
            }
            
            return element;
          });
        };
        
        const children = block.children ? renderChildren(block.children) : [];
        
        // Handle different block styles
        switch (block.style) {
          case 'h1':
            return <h1 key={index} className={styles.transcriptH1}>{children}</h1>;
          case 'h2':
            return <h2 key={index} className={styles.transcriptH2}>{children}</h2>;
          case 'h3':
            return <h3 key={index} className={styles.transcriptH3}>{children}</h3>;
          case 'h4':
            return <h4 key={index} className={styles.transcriptH4}>{children}</h4>;
          case 'h5':
            return <h5 key={index} className={styles.transcriptH5}>{children}</h5>;
          case 'h6':
            return <h6 key={index} className={styles.transcriptH6}>{children}</h6>;
          case 'blockquote':
            return <blockquote key={index} className={styles.transcriptBlockquote}>{children}</blockquote>;
          case 'normal':
          default:
            return <p key={index} className={styles.transcriptParagraph}>{children}</p>;
        }
      }
      
      // Handle lists
      if (block._type === 'list') {
        if (block.listItem === 'bullet') {
          return (
            <ul key={index} className={styles.transcriptBulletList}>
              {block.children?.map((listItem: RichTextListItem, itemIndex: number) => (
                <li key={itemIndex} className={styles.transcriptBulletItem}>
                  {listItem.children?.map((child: RichTextBlock) => {
                    return renderRichTextTranscript([child]);
                  })}
                </li>
              ))}
            </ul>
          );
        } else if (block.listItem === 'number') {
          return (
            <ol key={index} className={styles.transcriptNumberedList}>
              {block.children?.map((listItem: RichTextListItem, itemIndex: number) => (
                <li key={itemIndex} className={styles.transcriptNumberedItem}>
                  {listItem.children?.map((child: RichTextBlock) => {
                    return renderRichTextTranscript([child]);
                  })}
                </li>
              ))}
            </ol>
          );
        }
      }
      
      return null;
    });
  }
  
  return null;
}




export default function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const [work, setWork] = useState<Work | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'youtube' | 'spotify' | 'apple'>('youtube');
  const [currentPodcastIndex, setCurrentPodcastIndex] = useState(0);

  useEffect(() => {
    const fetchWork = async () => {
      try {
        const resolvedParams = await params;
        const workData = await client.fetch(getWorkBySlugQuery, { slug: resolvedParams.slug });
        if (!workData) {
          notFound();
        }
        setWork(workData);
        console.log('Work data:', workData);
        console.log('Podcast highlights:', workData.podcastHighlights);
      } catch (error) {
        console.error('Error fetching work:', error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchWork();
  }, [params]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!work) {
    notFound();
  }

  const podcastHighlights = work.podcastHighlights || [];
  const currentPodcast = podcastHighlights[currentPodcastIndex];
  const hasMultiplePodcasts = podcastHighlights.length > 1;


  const goToNextPodcast = () => {
    setCurrentPodcastIndex((prev) => 
      prev === podcastHighlights.length - 1 ? 0 : prev + 1
    );
  };

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
        <div className={styles.twoColumnLayout}>
          {/* Left Column - Work Details */}
          <div className={styles.leftColumn}>
            {/* Hero Section */}
            <div className={styles.heroSection}>
              <div className={styles.heroContent}>
                <Link href="/works" className={styles.backLink}>
                  ← All Works
                </Link>
                <h1 className={styles.heroTitle}>
                  {work.pieceTitle} Op. {work.opus?.title} in {formatKey(work.key)}
                  {work.nickname && (
                    <span className={styles.heroNickname}> &ldquo;{work.nickname}&rdquo;</span>
                  )}
                  </h1>
                  <div className={styles.heroMeta}>
                  {work.opus?.category && (
                    <Link href={`/categories/${work.opus.category.slug}`} className={styles.metaBubbleLink}>
                      <div className={styles.metaBubble}>
                        <div className={styles.metaLabel}>Genre</div>
                        <div className={styles.metaValue}>{work.opus.category.name}</div>
                      </div>
                    </Link>
                  )}
                  <div className={styles.metaBubble}>
                    <div className={styles.metaLabel}>Year of Comp.</div>
                    <div className={styles.metaValue}>{work.yearOfComposition}</div>
                  </div>
                  <div className={styles.metaBubble}>
                    <div className={styles.metaLabel}>Duration</div>
                    <div className={styles.metaValue}>c. {formatDuration(work.duration)}</div>
                  </div>
                </div>
              </div>
            </div>
            
            {currentPodcast && (
              <div className={styles.podcastTranscriptSection}>
                {currentPodcast.title && (
                  <div className={styles.podcastHighlightTitle}>
                    <strong>{currentPodcast.title}</strong>
                  </div>
                )}
                
                {currentPodcast.transcript && (
                  <div className={styles.podcastTranscript}>
                    <div className={styles.transcriptContent}>
                      {renderRichTextTranscript(currentPodcast.transcript)}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Piece Description Section */}
            <div className={styles.descriptionSection}>
              <div className={styles.descriptionToggle}>
                About {work.pieceTitle} Op. {work.opus?.title} in {formatKey(work.key)}
              </div>
              <div className={styles.description}>
                {work.description}
              </div>
            </div>
          </div>
          
          {/* Right Column - Podcast Details */}
          <div className={styles.rightColumn}>
            <div className={styles.podcastDetails}>
              {currentPodcast ? (
                <div className={styles.podcastHighlight}>
                  <div className={styles.podcastNavigation}>
                    <a 
                      href={currentPodcast.podcast.pageLink || '#'} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.podcastHighlightLink}
                    >
                      <div className={styles.podcastEpisodeHeader}>
                        <div className={styles.podcastEpisodeLayout}>
                          {currentPodcast.podcast.imageUrl && (
                            <div className={styles.podcastImageContainer}>
                              <Image
                                src={currentPodcast.podcast.imageUrl}
                                alt={`${currentPodcast.podcast.title} episode image`}
                                width={80}
                                height={80}
                                className={styles.podcastImage}
                              />
                            </div>
                          )}
                          <div className={styles.podcastEpisodeInfo}>
                            <h4 className={styles.podcastEpisodeTitle}>
                              S{currentPodcast.podcast.seasonNumber}E{currentPodcast.podcast.episodeNumber} - {currentPodcast.podcast.title}
                            </h4>
                            <p className={styles.podcastEpisodeDescription}>
                              {currentPodcast.podcast.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </a>
                    
                    {hasMultiplePodcasts && (
                      <button 
                        className={styles.podcastNavButton}
                        onClick={goToNextPodcast}
                        title="Next podcast"
                      >
                        →
                      </button>
                    )}
                  </div>
                    
                  <div className={styles.podcastTabs}>
                    <div className={styles.tabButtons}>
                      {currentPodcast.youtubeTimestamp && (
                        <button
                          className={`${styles.tabButton} ${activeTab === 'youtube' ? styles.tabButtonActive : ''}`}
                          onClick={() => setActiveTab('youtube')}
                          title="YouTube"
                        >
                          <Image
                            src="/YouTube.png"
                            alt="YouTube"
                            width={20}
                            height={20}
                            className={styles.tabIcon}
                          />
                        </button>
                      )}
                      {currentPodcast.spotifyTimestamp && (
                        <button
                          className={`${styles.tabButton} ${activeTab === 'spotify' ? styles.tabButtonActive : ''}`}
                          onClick={() => setActiveTab('spotify')}
                          title="Spotify"
                        >
                          <Image
                            src="/Spotify.png"
                            alt="Spotify"
                            width={20}
                            height={20}
                            className={styles.tabIcon}
                          />
                        </button>
                      )}
                      {currentPodcast.appleTimestamp && (
                        <button
                          className={`${styles.tabButton} ${activeTab === 'apple' ? styles.tabButtonActive : ''}`}
                          onClick={() => setActiveTab('apple')}
                          title="Apple Podcasts"
                        >
                          <Image
                            src="/ApplePodcasts.png"
                            alt="Apple Podcasts"
                            width={20}
                            height={20}
                            className={styles.tabIcon}
                          />
                        </button>
                      )}
                    </div>
                    
                    <div className={styles.tabContent}>
                      {activeTab === 'youtube' && currentPodcast.youtubeTimestamp && (
                        <div className={styles.embedContainer}>
                          <iframe
                            width="100%"
                            height="315"
                            src={`https://www.youtube.com/embed/${extractYouTubeVideoId(currentPodcast.podcast.youtubeUrl || '')}?start=${convertTimestampToSeconds(currentPodcast.youtubeTimestamp)}`}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                            className={styles.embedIframe}
                          />
                        </div>
                      )}
                      {activeTab === 'spotify' && currentPodcast.spotifyTimestamp && (
                        <div className={styles.embedContainer}>
                          <iframe
                            data-testid="embed-iframe"
                            style={{borderRadius: '12px'}}
                            src={`${currentPodcast.podcast.spotifyUrl?.replace('open.spotify.com', 'open.spotify.com/embed') || '#'}&t=${convertTimestampToSeconds(currentPodcast.spotifyTimestamp)}`}
                            width="100%"
                            height="352"
                            frameBorder="0"
                            allowFullScreen
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                            className={styles.embedIframe}
                          />
                        </div>
                      )}
                      {activeTab === 'apple' && currentPodcast.appleTimestamp && (
                        <div className={styles.embedContainer}>
                          <iframe
                            allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
                            frameBorder="0"
                            height="175"
                            style={{width: '100%', maxWidth: '660px', overflow: 'hidden', borderRadius: '10px'}}
                            sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
                            src={`${currentPodcast.podcast.applePodcastUrl || '#'}&r=${convertTimestampToSeconds(currentPodcast.appleTimestamp)}`}
                            className={styles.embedIframe}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className={styles.noPodcastContent}>
                  <p>No podcast discussion available for this work.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
