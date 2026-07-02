import { defineType, defineField } from 'sanity'

/**
 * An image with localized alt text (for accessibility + SEO) and an optional
 * localized caption. Reused for project galleries, covers and standalone gallery
 * images.
 */
export const figure = defineType({
  name: 'figure',
  title: 'Image',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'localeString',
      description: 'Describe the image for screen readers and search engines.',
    }),
    defineField({ name: 'caption', title: 'Caption', type: 'localeString' }),
  ],
})
