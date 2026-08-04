import { defineType, defineField } from 'sanity'

/**
 * A standalone gallery image not tied to a specific project (the current site has
 * a general work gallery of ~40 photos).
 */
export const galleryImage = defineType({
  name: 'galleryImage',
  title: 'Imagen de galería',
  type: 'document',
  fields: [
    defineField({
      name: 'image',
      title: 'Imagen',
      type: 'figure',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Categoría',
      type: 'string',
      description: 'Etiqueta opcional para agrupar imágenes de la galería (ej. "Infraestructura").',
    }),
    defineField({
      name: 'order',
      title: 'Orden manual',
      type: 'number',
      description: 'Los números más bajos aparecen primero.',
    }),
  ],
  orderings: [
    { title: 'Orden manual', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'image.alt.es', subtitle: 'category', media: 'image' },
    prepare({ title, subtitle, media }) {
      return { title: title || 'Imagen de galería', subtitle, media }
    },
  },
})
