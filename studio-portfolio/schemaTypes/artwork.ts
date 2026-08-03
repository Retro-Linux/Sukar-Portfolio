import {defineField, defineType} from 'sanity'

export const artwork = defineType({
  name: 'artwork',
  title: 'Artwork',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title (English)',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title_ar',
      title: 'Title (Arabic)',
      type: 'string',
      description: 'Auto-translated or manually entered Arabic title',
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
      description: 'The year this artwork was created (e.g. 2024)',
    }),
    defineField({
      name: 'description',
      title: 'Description (English)',
      type: 'text',
      description: 'A detailed description or the story behind the artwork',
    }),
    defineField({
      name: 'description_ar',
      title: 'Description (Arabic)',
      type: 'text',
      description: 'Auto-translated or manually entered Arabic description',
    }),
    defineField({
      name: 'likes',
      title: 'Likes',
      type: 'number',
      description: 'The number of likes this artwork has received',
      initialValue: 0,
    }),
    defineField({
      name: 'isFeatured',
      title: 'Pin to Hero Section',
      type: 'boolean',
      description: 'Turn this on to display this artwork prominently in the homepage hero section.',
      initialValue: false,
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Sketches', value: 'Sketches'},
          {title: 'Paintings', value: 'Paintings'},
          {title: 'Digital Art', value: 'Digital Art'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'medium',
      title: 'Medium',
      type: 'string',
      description: 'e.g. "Oil on canvas", "Graphite on paper", "Procreate"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
          description: 'Important for SEO and accessibility. Will fallback to the title if left blank.',
        }),
      ],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
      media: 'image',
    },
  },
})
