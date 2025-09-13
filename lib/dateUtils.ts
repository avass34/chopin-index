// Utility functions for date calculations

export interface Work {
  yearOfComposition: number;
}

export interface Opus {
  works?: Work[];
}

/**
 * Calculate the date range for an opus based on its works
 * @param opus - The opus object containing works
 * @returns A string representing the date range (e.g., "1830 - 1832" or "1830") or null if no dates found
 */
export function calculateOpusDateRange(opus: Opus): string | null {
  if (!opus.works || opus.works.length === 0) {
    return null;
  }

  // Get all years from composition dates only
  const years: number[] = [];
  
  opus.works.forEach(work => {
    if (work.yearOfComposition) {
      years.push(work.yearOfComposition);
    }
  });

  if (years.length === 0) {
    return null;
  }

  // Sort years and get min/max
  const sortedYears = years.sort((a, b) => a - b);
  const minYear = sortedYears[0];
  const maxYear = sortedYears[sortedYears.length - 1];

  // Return range or single year
  if (minYear === maxYear) {
    return minYear.toString();
  } else {
    return `${minYear} - ${maxYear}`;
  }
}

/**
 * Get the earliest year from an opus for sorting purposes
 * @param opus - The opus object containing works
 * @returns The earliest year or 0 if no dates found
 */
export function getOpusEarliestYear(opus: Opus): number {
  if (!opus.works || opus.works.length === 0) {
    return 0;
  }

  const years: number[] = [];
  
  opus.works.forEach(work => {
    if (work.yearOfComposition) {
      years.push(work.yearOfComposition);
    }
  });

  if (years.length === 0) {
    return 0;
  }

  return Math.min(...years);
}

/**
 * Get all unique years from an opus for timeline display
 * @param opus - The opus object containing works
 * @returns Array of unique years or empty array if no dates found
 */
export function getOpusAllYears(opus: Opus): number[] {
  if (!opus.works || opus.works.length === 0) {
    return [];
  }

  const years: number[] = [];
  
  opus.works.forEach(work => {
    if (work.yearOfComposition) {
      years.push(work.yearOfComposition);
    }
  });

  // Return unique years, sorted
  return [...new Set(years)].sort((a, b) => a - b);
}
