import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'work',
  title: 'Work',
  type: 'document',
  fields: [
    defineField({
      name: 'pieceTitle',
      title: 'Piece Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Title of the musical piece',
    }),
    defineField({
      name: 'opusNumber',
      title: 'Opus Number',
      type: 'string',
      description: 'Opus number of the piece (e.g., Op. 11)',
    }),
    defineField({
      name: 'yearOfComposition',
      title: 'Year of Composition',
      type: 'number',
      validation: (Rule) => Rule.required().min(1700).max(2024),
      description: 'Year when the piece was composed',
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Duration in format HH:MM:SS',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: (Rule) => Rule.required().min(10).max(1000),
      description: 'Description of the piece (max 1000 characters)',
    }),
    defineField({
      name: 'movements',
      title: 'Movements',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List of movements in the piece (leave empty for single-movement works)',
    }),
    defineField({
      name: 'notablePerformers',
      title: 'Notable Performers',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'pianist' }] }],
      description: 'Select pianists who have notably performed this piece',
    }),
    defineField({
      name: 'podcastHighlights',
      title: 'Podcast Highlights',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'podcastSnippet' }] }],
      description: 'Select podcast snippets that discuss this piece',
    }),
    defineField({
      name: 'image',
      title: 'Piece Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Image related to the piece (score, manuscript, etc.)',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Tags to categorize the piece',
    }),
  ],
  preview: {
    select: {
      title: 'pieceTitle',
      opus: 'opusNumber',
      year: 'yearOfComposition',
      media: 'image',
    },
    prepare(selection) {
      const { title, opus, year } = selection
      const subtitle = [opus, year].filter(Boolean).join(' • ')
      return {
        title: title,
        subtitle: subtitle,
        media: selection.media,
      }
    },
  },
})
