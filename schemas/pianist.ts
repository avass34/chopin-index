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
      name: 'nationality',
      title: 'Nationality',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Nationality of the pianist (e.g., Polish, Russian, American)',
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
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
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
      validation: (Rule) => Rule.required().min(1),
      description: 'Detailed biography of the pianist with rich text formatting',
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
