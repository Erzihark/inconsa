import { defineType, defineField } from 'sanity'

/** A past/current client, shown in the clients section. */
export const client = defineType({
  name: 'client',
  title: 'Client',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'description', title: 'Description', type: 'localeText' }),
    defineField({ name: 'logo', title: 'Logo', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'website', title: 'Website', type: 'url' }),
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
  preview: { select: { title: 'name', media: 'logo' } },
})
