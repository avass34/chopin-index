'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './PodcastSeasonToggle.module.css'

interface PodcastEpisode {
  _id: string;
  slug: string;
  title: string;
  seasonNumber: number;
  episodeNumber: number;
  description: string;
  duration: number | string;
  imageUrl?: string;
  spotifyUrl?: string;
  youtubeUrl?: string;
  applePodcastUrl?: string;
  pageLink?: string;
}

interface PodcastSeasonToggleProps {
  episodes: PodcastEpisode[];
}

function formatPodcastDuration(duration: number | string): string {
  // Handle time format like "02:37:00" (hours:minutes:seconds)
  if (typeof duration === 'string' && duration.includes(':')) {
    const parts = duration.split(':');
    if (parts.length === 3) {
      // Format: HH:MM:SS
      const hours = parseInt(parts[0], 10);
      const minutes = parseInt(parts[1], 10);
      const seconds = parseInt(parts[2], 10);
      
      if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      } else {
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
      }
    } else if (parts.length === 2) {
      // Format: MM:SS
      return duration;
    }
  }
  
  // Handle numeric input (seconds)
  const seconds = typeof duration === 'string' ? parseFloat(duration) : duration;
  
  if (isNaN(seconds) || seconds < 0) {
    return '0:00';
  }
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export default function PodcastSeasonToggle({ episodes }: PodcastSeasonToggleProps) {
  // Get unique seasons and sort them
  const seasons = Array.from(new Set(episodes.map(ep => ep.seasonNumber))).sort((a, b) => a - b);
  
  // State for current season
  const [currentSeason, setCurrentSeason] = useState(seasons[0] || 1);
  
  // Filter episodes for current season and sort by episode number
  const currentSeasonEpisodes = episodes
    .filter(ep => ep.seasonNumber === currentSeason)
    .sort((a, b) => a.episodeNumber - b.episodeNumber);
  
  // Navigation functions
  const goToPreviousSeason = () => {
    const currentIndex = seasons.indexOf(currentSeason);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : seasons.length - 1;
    setCurrentSeason(seasons[prevIndex]);
  };
  
  const goToNextSeason = () => {
    const currentIndex = seasons.indexOf(currentSeason);
    const nextIndex = currentIndex < seasons.length - 1 ? currentIndex + 1 : 0;
    setCurrentSeason(seasons[nextIndex]);
  };

  if (episodes.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No episodes found. Add some episodes in your Sanity Studio!</p>
        <a href="/studio" className={styles.primary}>
          Open Sanity Studio
        </a>
      </div>
    );
  }

  return (
    <div className={styles.podcastSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Podcast Episodes</h2>
        <div className={styles.seasonControls}>
          <button 
            className={styles.navButton} 
            onClick={goToPreviousSeason}
            aria-label="Previous season"
          >
            ←
          </button>
          <div className={styles.seasonInfo}>
            <span className={styles.seasonLabel}>Season {currentSeason}</span>
          </div>
          <button 
            className={styles.navButton} 
            onClick={goToNextSeason}
            aria-label="Next season"
          >
            →
          </button>
        </div>
      </div>
      
      <div className={styles.episodesContainer}>
        <div className={styles.episodesGrid}>
          {currentSeasonEpisodes.map((episode) => (
            <Link 
              key={episode._id} 
              href={episode.pageLink || `/episodes/podcasts/${episode.slug}`} 
              className={styles.episodeCard}
              target={episode.pageLink ? "_blank" : "_self"}
            >
              <div className={styles.episodeImage}>
                {episode.imageUrl ? (
                  <Image
                    src={episode.imageUrl}
                    alt={`Cover art for ${episode.title}`}
                    width={200}
                    height={200}
                    className={styles.coverArt}
                  />
                ) : (
                  <div className={styles.placeholderCover}>
                    <span className={styles.placeholderText}>
                      Episode {episode.episodeNumber}
                    </span>
                  </div>
                )}
              </div>
              <div className={styles.episodeInfo}>
                <div className={styles.episodeHeader}>
                  <span className={styles.episodeNumber}>
                    Episode {episode.episodeNumber}
                  </span>
                  <span className={styles.episodeDuration}>
                    {formatPodcastDuration(episode.duration)}
                  </span>
                </div>
                <h3 className={styles.episodeTitle}>{episode.title}</h3>
                <p className={styles.episodeDescription}>
                  {episode.description.length > 100 
                    ? `${episode.description.substring(0, 100)}...` 
                    : episode.description
                  }
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
