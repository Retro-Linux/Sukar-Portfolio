import {defineField, defineType} from 'sanity'

export const artwork = defineType({
  name: 'artwork',
  title: 'Artwork',
  type: 'document',
  icon: () => '🖼️',
  fieldsets: [
    { name: 'general', title: '🎨 General Information', options: { collapsible: true, collapsed: false } },
    { name: 'arabic', title: '🌐 Arabic Translations', options: { collapsible: true, collapsed: true } },
    { name: 'meta', title: '⚙️ Metadata & Settings', options: { columns: 2, collapsible: true, collapsed: false } },
    { name: 'media', title: '🖼️ Media', options: { collapsible: true, collapsed: false } },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title (English)',
      type: 'string',
      fieldset: 'general',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title_ar',
      title: 'Title (Arabic)',
      type: 'string',
      fieldset: 'arabic',
      description: 'Auto-translated or manually entered Arabic title',
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
      fieldset: 'general',
      description: 'The year this artwork was created (e.g. 2024)',
    }),
    defineField({
      name: 'description',
      title: 'Description (English)',
      type: 'text',
      fieldset: 'general',
      description: 'A detailed description or the story behind the artwork',
    }),
    defineField({
      name: 'description_ar',
      title: 'Description (Arabic)',
      type: 'text',
      fieldset: 'arabic',
      description: 'Auto-translated or manually entered Arabic description',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      fieldset: 'general',
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
      fieldset: 'general',
      description: 'e.g. "Oil on canvas", "Graphite on paper", "Procreate"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'medium_ar',
      title: 'Medium (Arabic)',
      type: 'string',
      fieldset: 'arabic',
      description: 'Auto-translated or manually entered Arabic medium',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      fieldset: 'media',
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
    defineField({
      name: 'likes',
      title: 'Likes',
      type: 'number',
      fieldset: 'meta',
      description: 'The number of likes this artwork has received',
      initialValue: 0,
    }),
    defineField({
      name: 'isFeatured',
      title: 'Pin to Hero Section',
      type: 'boolean',
      fieldset: 'meta',
      description: 'Turn this on to display this artwork prominently in the homepage hero section.',
      initialValue: false,
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      fieldset: 'meta',
      options: {
        source: 'title',
        maxLength: 96,
      },
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
