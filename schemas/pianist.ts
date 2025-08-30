import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'pianist',
  title: 'Pianist',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
      description: 'URL-friendly identifier for the pianist (e.g., arthur-rubinstein)',
    }),
    defineField({
      name: 'dateBorn',
      title: 'Date Born',
      type: 'date',
      validation: (Rule) => Rule.required(),
      description: 'Birth date of the pianist',
    }),
    defineField({
      name: 'dateDead',
      title: 'Date Dead',
      type: 'date',
      description: 'Death date of the pianist (leave empty if still alive)',
    }),
    defineField({
      name: 'biography',
      title: 'Biography',
      type: 'text',
      validation: (Rule) => Rule.required().min(10).max(1000),
      description: 'A brief biography of the pianist (max 1000 characters)',
    }),
    defineField({
      name: 'image',
      title: 'Portrait',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Portrait or photo of the pianist',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      dateBorn: 'dateBorn',
      dateDead: 'dateDead',
      media: 'image',
    },
    prepare(selection) {
      const { title, dateBorn, dateDead } = selection
      const formatDate = (dateString: string) => {
        if (!dateString) return ''
        const date = new Date(dateString)
        return date.getFullYear().toString()
      }
      const bornYear = formatDate(dateBorn)
      const deadYear = dateDead ? formatDate(dateDead) : 'Present'
      const years = `${bornYear} - ${deadYear}`
      return { ...selection, subtitle: years }
    },
  },
})
