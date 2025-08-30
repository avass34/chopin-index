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
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'pieceTitle',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
      description: 'URL-friendly identifier for the work (e.g., chopin-nocturne-opus-9-eb-minor)',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          { title: 'Nocturne', value: 'nocturne' },
          { title: 'Scherzo', value: 'scherzo' },
          { title: 'Polonaise', value: 'polonaise' },
          { title: 'Concerto', value: 'concerto' },
          { title: 'Prélude', value: 'prelude' },
          { title: 'Étude', value: 'etude' },
          { title: 'Impromptu', value: 'impromptu' },
          { title: 'Ballade', value: 'ballade' },
          { title: 'Mazurka', value: 'mazurka' },
          { title: 'Rondo', value: 'rondo' },
          { title: 'Sonata', value: 'sonata' },
          { title: 'Waltz', value: 'waltz' },
          { title: 'Variations', value: 'variations' },
          { title: 'Other', value: 'other' },
          { title: 'Chamber', value: 'chamber' },
        ],
      },
      description: 'Musical category/genre of the piece',
    }),
    defineField({
      name: 'key',
      title: 'Key',
      type: 'string',
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          { title: 'C Major', value: 'C' },
          { title: 'C Minor', value: 'Cm' },
          { title: 'C♯ Major', value: 'C#' },
          { title: 'C♯ Minor', value: 'C#m' },
          { title: 'D Major', value: 'D' },
          { title: 'D Minor', value: 'Dm' },
          { title: 'D♯ Major', value: 'D#' },
          { title: 'D♯ Minor', value: 'D#m' },
          { title: 'E Major', value: 'E' },
          { title: 'E Minor', value: 'Em' },
          { title: 'F Major', value: 'F' },
          { title: 'F Minor', value: 'Fm' },
          { title: 'F♯ Major', value: 'F#' },
          { title: 'F♯ Minor', value: 'F#m' },
          { title: 'G Major', value: 'G' },
          { title: 'G Minor', value: 'Gm' },
          { title: 'G♯ Major', value: 'G#' },
          { title: 'G♯ Minor', value: 'G#m' },
          { title: 'A Major', value: 'A' },
          { title: 'A Minor', value: 'Am' },
          { title: 'A♯ Major', value: 'A#' },
          { title: 'A♯ Minor', value: 'A#m' },
          { title: 'B Major', value: 'B' },
          { title: 'B Minor', value: 'Bm' },
          { title: 'B♭ Major', value: 'Bb' },
          { title: 'B♭ Minor', value: 'Bbm' },
          { title: 'E♭ Major', value: 'Eb' },
          { title: 'E♭ Minor', value: 'Ebm' },
          { title: 'A♭ Major', value: 'Ab' },
          { title: 'A♭ Minor', value: 'Abm' },
          { title: 'D♭ Major', value: 'Db' },
          { title: 'D♭ Minor', value: 'Dbm' },
          { title: 'G♭ Major', value: 'Gb' },
          { title: 'G♭ Minor', value: 'Gbm' },
        ],
      },
      description: 'Musical key of the piece',
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
      name: 'imslpImage',
      title: 'IMSLP Image',
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
      description: 'Image from the International Music Score Library Project',
    }),
    defineField({
      name: 'imslpLink',
      title: 'IMSLP Link',
      type: 'url',
      description: 'Link to the piece on the International Music Score Library Project',
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
      of: [{
        type: 'object',
        fields: [
          {
            name: 'podcast',
            title: 'Podcast Snippet',
            type: 'reference',
            to: [{ type: 'podcastSnippet' }],
            validation: (Rule) => Rule.required(),
          },
          {
            name: 'spotifyTimestamp',
            title: 'Spotify Timestamp',
            type: 'string',
            description: 'Timestamp in format HH:MM:SS where this piece is discussed on Spotify',
          },
          {
            name: 'youtubeTimestamp',
            title: 'YouTube Timestamp',
            type: 'string',
            description: 'Timestamp in format HH:MM:SS where this piece is discussed on YouTube',
          },
        ],
        preview: {
          select: {
            title: 'podcast.title',
            spotifyTimestamp: 'spotifyTimestamp',
            youtubeTimestamp: 'youtubeTimestamp',
          },
          prepare(selection) {
            const { title, spotifyTimestamp, youtubeTimestamp } = selection
            const timestamps = [spotifyTimestamp, youtubeTimestamp].filter(Boolean)
            const subtitle = timestamps.length > 0 ? timestamps.join(' / ') : 'No timestamps'
            return {
              title: title || 'Untitled Podcast',
              subtitle: subtitle,
            }
          },
        },
      }],
      description: 'Select podcast snippets that discuss this piece with timestamps',
    }),
  ],
  preview: {
    select: {
      title: 'pieceTitle',
      category: 'category',
      key: 'key',
      opus: 'opusNumber',
      year: 'yearOfComposition',
    },
    prepare(selection) {
      const { title, category, key, opus, year } = selection
      const categoryTitle = category ? category.charAt(0).toUpperCase() + category.slice(1) : ''
      const subtitle = [categoryTitle, key, opus, year].filter(Boolean).join(' • ')
      return {
        title: title,
        subtitle: subtitle,
      }
    },
  },
})
