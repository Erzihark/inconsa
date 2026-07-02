import { defineType, defineField, defineArrayMember } from 'sanity'

/** A specific leasable machine belonging to a category. Phase 2. */
export const machine = defineType({
  name: 'machine',
  title: 'Machine',
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
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'machineCategory' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'description', title: 'Description', type: 'localeText' }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [defineArrayMember({ type: 'figure' })],
      options: { layout: 'grid' },
    }),
    defineField({
      name: 'specs',
      title: 'Specifications',
      type: 'array',
      of: [defineArrayMember({ type: 'specItem' })],
    }),
    defineField({ name: 'rental', title: 'Rental options', type: 'rentalOptions' }),
    defineField({
      name: 'available',
      title: 'Available for rent',
      type: 'boolean',
      initialValue: true,
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
    select: { title: 'name.es', subtitle: 'category.name.es', media: 'images.0' },
  },
})
