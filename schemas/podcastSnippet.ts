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
      name: 'timestamp',
      title: 'Timestamp',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Timestamp in format HH:MM:SS',
    }),
    defineField({
      name: 'podcastUrl',
      title: 'Podcast URL',
      type: 'url',
      validation: (Rule) => Rule.required(),
      description: 'URL to the podcast episode or segment',
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
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Tags to categorize the podcast content',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      timestamp: 'timestamp',
      description: 'description',
    },
    prepare(selection) {
      const { title, timestamp, description } = selection
      return {
        title: title,
        subtitle: `${timestamp} - ${description?.substring(0, 50)}${description && description.length > 50 ? '...' : ''}`,
      }
    },
  },
})
