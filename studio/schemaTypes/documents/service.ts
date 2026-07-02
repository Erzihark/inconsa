import { defineType, defineField } from 'sanity'

/** A service the company offers, grouped into one of four categories. */
export const service = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'description', title: 'Description', type: 'localeText' }),
    defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'group',
      title: 'Group',
      type: 'string',
      options: {
        list: [
          { title: 'Infrastructure', value: 'infrastructure' },
          { title: 'Urbanization', value: 'urbanization' },
          { title: 'Projects', value: 'projects' },
          { title: 'Equipment rental', value: 'equipment' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
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
    select: { title: 'title.es', subtitle: 'group', media: 'image' },
  },
})
