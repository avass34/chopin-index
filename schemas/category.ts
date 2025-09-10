import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Name of the musical category (e.g., Nocturne, Polonaise)',
    }),
    defineField({
      name: 'pluralName',
      title: 'Plural Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Plural form of the category name (e.g., Nocturnes, Polonaises)',
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
      description: 'URL-friendly identifier for the category',
    }),
    defineField({
      name: 'image',
      title: 'Category Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Image representing this musical category',
    }),
    defineField({
      name: 'imageDescription',
      title: 'Image Description',
      type: 'string',
      description: 'Detailed description of the category image',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
    },
    prepare(selection) {
      const { title, media } = selection
      return {
        title: title,
        subtitle: 'Musical Category',
        media: media,
      }
    },
  },
})
