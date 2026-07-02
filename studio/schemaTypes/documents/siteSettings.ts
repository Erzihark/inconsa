import { defineType, defineField } from 'sanity'

/**
 * Global, site-wide content edited as a single document (singleton): company
 * info, contact details, socials, policy texts and the downloadable CV/profile.
 */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  groups: [
    { name: 'company', title: 'Company', default: true },
    { name: 'contact', title: 'Contact & social' },
    { name: 'documents', title: 'Documents' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'companyName',
      title: 'Company name',
      type: 'string',
      group: 'company',
      initialValue: 'Grupo INCONSA',
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'logo', title: 'Logo', type: 'image', group: 'company' }),
    defineField({ name: 'about', title: 'About the company', type: 'localeBlock', group: 'company' }),
    defineField({
      name: 'founderMessage',
      title: "Founder's message",
      type: 'localeBlock',
      group: 'company',
    }),
    defineField({ name: 'qualityPolicy', title: 'Quality policy', type: 'localeBlock', group: 'company' }),
    defineField({ name: 'privacyPolicy', title: 'Privacy policy', type: 'localeBlock', group: 'company' }),
    defineField({
      name: 'contact',
      title: 'Contact details',
      type: 'object',
      group: 'contact',
      fields: [
        defineField({ name: 'address', title: 'Address', type: 'text', rows: 2 }),
        defineField({ name: 'phone', title: 'Phone', type: 'string' }),
        defineField({ name: 'emailContact', title: 'General email', type: 'string' }),
        defineField({ name: 'emailQuotes', title: 'Quotes email', type: 'string' }),
        defineField({ name: 'mapUrl', title: 'Google Maps URL', type: 'url' }),
      ],
    }),
    defineField({
      name: 'social',
      title: 'Social links',
      type: 'object',
      group: 'contact',
      fields: [
        defineField({ name: 'facebook', title: 'Facebook', type: 'url' }),
        defineField({ name: 'instagram', title: 'Instagram', type: 'url' }),
        defineField({ name: 'linkedin', title: 'LinkedIn', type: 'url' }),
      ],
    }),
    defineField({
      name: 'cv',
      title: 'CV / company profile (PDF)',
      type: 'localeFile',
      group: 'documents',
      description: 'The downloadable document. Upload a Spanish and (optionally) an English version.',
    }),
    defineField({
      name: 'defaultSeo',
      title: 'Default SEO',
      type: 'seo',
      group: 'seo',
      description: 'Fallback meta title/description and social image for pages without their own.',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Site settings' }
    },
  },
})
