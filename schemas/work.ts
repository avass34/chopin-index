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
      name: 'nickname',
      title: 'Nickname',
      type: 'string',
      description: 'Common nickname or alternative title for the piece (e.g., "Raindrop" for Prelude Op. 28, No. 15)',
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
      name: 'isPopular',
      title: 'Is Popular',
      type: 'boolean',
      initialValue: false,
      description: 'Toggle to mark this work as popular/frequently performed',
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
          {
            name: 'appleTimestamp',
            title: 'Apple Timestamp',
            type: 'string',
            description: 'Timestamp in format HH:MM:SS where this piece is discussed on Apple Podcasts',
          },
          {
            name: 'title',
            title: 'Title',
            type: 'string',
            description: 'Title for this specific podcast highlight segment',
          },
          {
            name: 'transcript',
            title: 'Transcript',
            type: 'array',
            of: [
              {
                type: 'block',
                styles: [
                  { title: 'Normal', value: 'normal' },
                  { title: 'H1', value: 'h1' },
                  { title: 'H2', value: 'h2' },
                  { title: 'H3', value: 'h3' },
                  { title: 'Quote', value: 'blockquote' },
                ],
                lists: [
                  { title: 'Bullet', value: 'bullet' },
                  { title: 'Number', value: 'number' },
                ],
                marks: {
                  decorators: [
                    { title: 'Strong', value: 'strong' },
                    { title: 'Emphasis', value: 'em' },
                    { title: 'Code', value: 'code' },
                  ],
                  annotations: [
                    {
                      title: 'URL',
                      name: 'link',
                      type: 'object',
                      fields: [
                        {
                          title: 'URL',
                          name: 'href',
                          type: 'url',
                        },
                      ],
                    },
                  ],
                },
              },
            ],
            description: 'Transcript of the podcast segment discussing this piece',
          },
        ],
        preview: {
          select: {
            title: 'podcast.title',
            highlightTitle: 'title',
            spotifyTimestamp: 'spotifyTimestamp',
            youtubeTimestamp: 'youtubeTimestamp',
            appleTimestamp: 'appleTimestamp',
          },
          prepare(selection) {
            const { title, highlightTitle, spotifyTimestamp, youtubeTimestamp, appleTimestamp } = selection
            const timestamps = [spotifyTimestamp, youtubeTimestamp, appleTimestamp].filter(Boolean)
            const subtitle = timestamps.length > 0 ? timestamps.join(' / ') : 'No timestamps'
            const displayTitle = highlightTitle || title || 'Untitled Podcast'
            return {
              title: displayTitle,
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
      nickname: 'nickname',
      key: 'key',
      year: 'yearOfComposition',
    },
    prepare(selection) {
      const { title, nickname, key, year } = selection
      const displayTitle = nickname ? `${title} (${nickname})` : title
      const subtitle = [key, year].filter(Boolean).join(' • ')
      return {
        title: displayTitle,
        subtitle: subtitle,
      }
    },
  },
})
