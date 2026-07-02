import { defineType, defineField } from 'sanity'

/**
 * A standalone gallery image not tied to a specific project (the current site has
 * a general work gallery of ~40 photos).
 */
export const galleryImage = defineType({
  name: 'galleryImage',
  title: 'Gallery image',
  type: 'document',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'figure',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'Optional label to group gallery images (e.g. "Infraestructura").',
    }),
    defineField({
      name: 'order',
      title: 'Manual order',
      type: 'number',
      description: 'Lower numbers appear first.',
    }),
  ],
  orderings: [
    { title: 'Manual order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'image.alt.es', subtitle: 'category', media: 'image' },
    prepare({ title, subtitle, media }) {
      return { title: title || 'Gallery image', subtitle, media }
    },
  },
})
