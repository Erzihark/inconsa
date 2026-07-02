import { defineType, defineField } from 'sanity'

/** A category of leasable machinery (e.g. excavators, trenchers). Phase 2. */
export const machineCategory = defineType({
  name: 'machineCategory',
  title: 'Machine category',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'name.es', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'description', title: 'Description', type: 'localeText' }),
    defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
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
  preview: { select: { title: 'name.es', media: 'image' } },
})
