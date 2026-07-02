import { defineType, defineField, defineArrayMember } from 'sanity'

/**
 * A construction project — the core of the site's work showcase. Projects are
 * either "in progress" or "completed" and carry a description + image gallery.
 */
export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'media', title: 'Media' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'localeString',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      group: 'content',
      options: { source: 'title.es', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'content',
      options: {
        list: [
          { title: 'In progress', value: 'in-progress' },
          { title: 'Completed', value: 'completed' },
        ],
        layout: 'radio',
      },
      initialValue: 'in-progress',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      group: 'content',
      description: 'e.g. "Cancún, Quintana Roo".',
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      group: 'content',
      description: 'Completion date, or start date for in-progress projects.',
      options: { dateFormat: 'YYYY-MM' },
    }),
    defineField({
      name: 'client',
      title: 'Client',
      type: 'reference',
      group: 'content',
      to: [{ type: 'client' }],
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'localeBlock',
      group: 'content',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'figure',
      group: 'media',
      description: 'Shown on cards and as the hero of the project page.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'images',
      title: 'Gallery',
      type: 'array',
      group: 'media',
      of: [defineArrayMember({ type: 'figure' })],
      options: { layout: 'grid' },
    }),
    defineField({
      name: 'featured',
      title: 'Featured on home page',
      type: 'boolean',
      group: 'content',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Manual order',
      type: 'number',
      group: 'content',
      description: 'Lower numbers appear first. Leave empty to sort by date.',
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
  ],
  orderings: [
    {
      title: 'Manual order',
      name: 'orderAsc',
      by: [
        { field: 'order', direction: 'asc' },
        { field: 'date', direction: 'desc' },
      ],
    },
  ],
  preview: {
    select: { title: 'title.es', subtitle: 'status', media: 'coverImage' },
    prepare({ title, subtitle, media }) {
      const label = subtitle === 'completed' ? 'Completed' : 'In progress'
      return { title, subtitle: label, media }
    },
  },
})
