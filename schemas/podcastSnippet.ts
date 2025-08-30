import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'podcastSnippet',
  title: 'Podcast Snippet',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Title of the podcast episode or segment',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
      description: 'URL-friendly identifier for the episode (e.g., season-1-episode-3-chopins-early-years)',
    }),
    defineField({
      name: 'seasonNumber',
      title: 'Season Number',
      type: 'number',
      validation: (Rule) => Rule.required().min(1),
      description: 'Season number of the podcast',
    }),
    defineField({
      name: 'episodeNumber',
      title: 'Episode Number',
      type: 'number',
      validation: (Rule) => Rule.required().min(1),
      description: 'Episode number within the season',
    }),
    defineField({
      name: 'image',
      title: 'Podcast Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Alternative text for accessibility',
          validation: (Rule) => Rule.required(),
        },
      ],
      description: 'Podcast artwork or related image',
    }),
    defineField({
      name: 'spotifyUrl',
      title: 'Spotify URL',
      type: 'url',
      description: 'URL to the podcast episode on Spotify',
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube URL',
      type: 'url',
      description: 'URL to the podcast episode on YouTube',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: (Rule) => Rule.required().min(10).max(500),
      description: 'Brief description of the podcast content (max 500 characters)',
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'string',
      description: 'Duration of the podcast segment in format HH:MM:SS',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      seasonNumber: 'seasonNumber',
      episodeNumber: 'episodeNumber',
      description: 'description',
      media: 'image',
    },
    prepare(selection) {
      const { title, seasonNumber, episodeNumber, description } = selection
      const episodeInfo = `S${seasonNumber}E${episodeNumber}`
      return {
        title: `${episodeInfo} - ${title}`,
        subtitle: description?.substring(0, 50) + (description && description.length > 50 ? '...' : ''),
        media: selection.media,
      }
    },
  },
})
