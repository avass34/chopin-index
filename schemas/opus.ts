import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'opus',
  title: 'Opus',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Opus Number',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Opus number (e.g., "Op. 9", "Op. 11", "Op. 28")',
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
      description: 'URL-friendly identifier for the opus (e.g., opus-9, opus-11)',
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
      description: 'Date when the opus was published or completed',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (Rule) => Rule.required(),
      description: 'Select the musical category/genre for this opus',
    }),
    defineField({
      name: 'works',
      title: 'Works in this Opus',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'work' }] }],
      description: 'Select all works that belong to this opus',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      date: 'date',
      works: 'works',
      category: 'category.name',
    },
    prepare(selection) {
      const { title, date, works, category } = selection
      const workCount = works ? works.length : 0
      const subtitle = `${category || 'No category'} • ${date || 'No date'} • ${workCount} work${workCount !== 1 ? 's' : ''}`
      return {
        title: title || 'Untitled Opus',
        subtitle: subtitle,
      }
    },
  },
})
