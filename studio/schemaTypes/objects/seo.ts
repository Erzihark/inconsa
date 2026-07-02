import { defineType, defineField } from 'sanity'

/**
 * Optional per-document SEO overrides. When empty, the frontend derives sensible
 * defaults from the document's title/description.
 */
export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({ name: 'metaTitle', title: 'Meta title', type: 'localeString' }),
    defineField({ name: 'metaDescription', title: 'Meta description', type: 'localeText' }),
    defineField({
      name: 'ogImage',
      title: 'Social share image',
      type: 'image',
      description: 'Shown when the page is shared on social media (falls back to the cover image).',
    }),
  ],
})
