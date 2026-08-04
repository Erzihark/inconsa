import { defineType, defineField } from 'sanity'
import { requiredBlockRule } from '../seoRules'

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
    defineField({
      name: 'logo',
      title: 'Logotipo',
      type: 'image',
      group: 'company',
      description:
        'Google lo usa en el panel de conocimiento de la empresa. Sin él, los datos estructurados caen a la imagen genérica del sitio.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'about',
      title: 'Acerca de la empresa',
      type: 'localeBlock',
      group: 'company',
      description: 'El texto de la página "Nosotros".',
      validation: requiredBlockRule('la página "Nosotros"'),
    }),
    defineField({
      name: 'founderMessage',
      title: 'Mensaje del fundador',
      type: 'localeBlock',
      group: 'company',
      description: 'El texto de la página "Mensaje del fundador".',
      validation: requiredBlockRule('la página "Mensaje del fundador"'),
    }),
    defineField({
      name: 'qualityPolicy',
      title: 'Política de calidad',
      type: 'localeBlock',
      group: 'company',
      validation: requiredBlockRule('la página "Política de calidad"'),
    }),
    defineField({
      name: 'privacyPolicy',
      title: 'Política de privacidad',
      type: 'localeBlock',
      group: 'company',
      validation: requiredBlockRule('la página "Política de privacidad"'),
    }),
    defineField({
      name: 'contact',
      title: 'Datos de contacto',
      type: 'object',
      group: 'contact',
      fields: [
        // These three feed the LocalBusiness structured data Google reads for
        // the local pack, so they are required rather than merely encouraged.
        defineField({
          name: 'address',
          title: 'Dirección',
          type: 'text',
          rows: 2,
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'phone',
          title: 'Teléfono',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'emailContact',
          title: 'Correo general',
          type: 'string',
          validation: (Rule) => Rule.required().email(),
        }),
        defineField({
          name: 'emailQuotes',
          title: 'Correo de cotizaciones',
          type: 'string',
          validation: (Rule) => Rule.email(),
        }),
        defineField({ name: 'mapUrl', title: 'URL de Google Maps', type: 'url' }),
      ],
    }),
    defineField({
      name: 'social',
      title: 'Redes sociales',
      type: 'object',
      group: 'contact',
      description:
        'Se publican como `sameAs` en los datos estructurados: así Google confirma que estos perfiles son de la misma empresa.',
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
