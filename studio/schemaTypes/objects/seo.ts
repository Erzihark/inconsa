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
    defineField({ name: 'metaTitle', title: 'Título meta', type: 'localeString' }),
    defineField({ name: 'metaDescription', title: 'Descripción meta', type: 'localeText' }),
    defineField({
      name: 'ogImage',
      title: 'Imagen para redes sociales',
      type: 'image',
      description: 'Se muestra al compartir la página en redes sociales (usa la imagen de portada como respaldo).',
    }),
  ],
})
