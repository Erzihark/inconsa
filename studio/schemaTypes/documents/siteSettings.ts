import { defineType, defineField } from 'sanity'

/**
 * Global, site-wide content edited as a single document (singleton): company
 * info, contact details, socials, policy texts and the downloadable CV/profile.
 */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Configuración del sitio',
  type: 'document',
  groups: [
    { name: 'company', title: 'Empresa', default: true },
    { name: 'contact', title: 'Contacto y redes sociales' },
    { name: 'documents', title: 'Documentos' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'companyName',
      title: 'Nombre de la empresa',
      type: 'string',
      group: 'company',
      initialValue: 'Grupo INCONSA',
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'logo', title: 'Logotipo', type: 'image', group: 'company' }),
    defineField({ name: 'about', title: 'Acerca de la empresa', type: 'localeBlock', group: 'company' }),
    defineField({
      name: 'founderMessage',
      title: 'Mensaje del fundador',
      type: 'localeBlock',
      group: 'company',
    }),
    defineField({ name: 'qualityPolicy', title: 'Política de calidad', type: 'localeBlock', group: 'company' }),
    defineField({ name: 'privacyPolicy', title: 'Política de privacidad', type: 'localeBlock', group: 'company' }),
    defineField({
      name: 'contact',
      title: 'Datos de contacto',
      type: 'object',
      group: 'contact',
      fields: [
        defineField({ name: 'address', title: 'Dirección', type: 'text', rows: 2 }),
        defineField({ name: 'phone', title: 'Teléfono', type: 'string' }),
        defineField({ name: 'emailContact', title: 'Correo general', type: 'string' }),
        defineField({ name: 'emailQuotes', title: 'Correo de cotizaciones', type: 'string' }),
        defineField({ name: 'mapUrl', title: 'URL de Google Maps', type: 'url' }),
      ],
    }),
    defineField({
      name: 'social',
      title: 'Redes sociales',
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
      title: 'CV / perfil de la empresa (PDF)',
      type: 'localeFile',
      group: 'documents',
      description: 'El documento descargable. Sube una versión en español y (opcionalmente) una en inglés.',
    }),
    defineField({
      name: 'defaultSeo',
      title: 'SEO predeterminado',
      type: 'seo',
      group: 'seo',
      description: 'Título/descripción meta y imagen social de respaldo para páginas sin los suyos propios.',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Configuración del sitio' }
    },
  },
})
