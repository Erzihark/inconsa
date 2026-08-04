import { defineType, defineField } from 'sanity'

/**
 * An image with localized alt text (for accessibility + SEO) and an optional
 * localized caption. Reused for project galleries, covers and standalone gallery
 * images.
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
      description: 'Describe la imagen para lectores de pantalla y motores de búsqueda.',
    }),
    defineField({ name: 'caption', title: 'Pie de foto', type: 'localeString' }),
  ],
})
