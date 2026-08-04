import { defineType, defineField } from 'sanity'
import { altTextRules, altHint } from '../seoRules'

/**
 * An image with localized alt text (for accessibility + SEO) and an optional
 * localized caption. Reused for project galleries, covers and standalone gallery
 * images.
 *
 * Alt text is required: an image the client uploads without it is invisible to
 * screen readers and to image search, and there is no way for the frontend to
 * invent one.
 */
export const figure = defineType({
  name: 'figure',
  title: 'Imagen',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'alt',
      title: 'Texto alternativo',
      type: 'localeString',
      description: altHint,
      validation: altTextRules,
    }),
    defineField({ name: 'caption', title: 'Pie de foto', type: 'localeString' }),
  ],
})
