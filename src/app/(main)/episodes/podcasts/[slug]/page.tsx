import Image from "next/image";
import { client } from "../../../../../../lib/sanity.client";
import { getPodcastSnippetBySlugQuery } from "../../../../../../lib/queries";
import { notFound } from "next/navigation";

interface PodcastSnippet {
  _id: string;
  title: string;
  seasonNumber: number;
  episodeNumber: number;
  description: string;
  duration?: string;
  imageUrl?: string;
  podcastUrl: string;
}

interface PageProps {
  params: {
    slug: string;
  };
}

async function getPodcastSnippet(slug: string): Promise<PodcastSnippet | null> {
  return await client.fetch(getPodcastSnippetBySlugQuery, { slug });
}

function formatDuration(duration: string): string {
  const parts = duration.split(':');
  if (parts.length === 3) {
    const hours = parseInt(parts[0]);
    const minutes = parseInt(parts[1]);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }
  return duration;
}

export default async function PodcastPage({ params }: PageProps) {
  const podcast = await getPodcastSnippet(params.slug);

  if (!podcast) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="relative h-64 bg-gradient-to-r from-purple-600 to-blue-600">
            {podcast.imageUrl && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src={podcast.imageUrl}
                  alt={`Podcast artwork for ${podcast.title}`}
                  width={200}
                  height={200}
                  className="rounded-lg border-4 border-white shadow-lg"
                />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="px-6 py-8">
            <div className="text-center mb-8">
              <div className="mb-4">
                <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                  Season {podcast.seasonNumber}, Episode {podcast.episodeNumber}
                </span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {podcast.title}
              </h1>
              {podcast.duration && (
                <p className="text-lg text-gray-600">
                  Duration: {formatDuration(podcast.duration)}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="prose prose-lg max-w-none mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {podcast.description}
              </p>
            </div>

            {/* Listen Button */}
            <div className="text-center">
              <a
                href={podcast.podcastUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-lg font-medium"
              >
                <svg className="mr-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Listen to Episode
              </a>
            </div>

            {/* Additional sections can be added here */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Episode Notes</h2>
              <p className="text-gray-600">
                Additional episode notes and timestamps will be displayed here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
