import { defineType, defineField } from 'sanity'
import { metaTitleRules, metaDescriptionRules, titleHint, descriptionHint } from '../seoRules'

/**
 * Optional per-document SEO overrides. When empty, the frontend derives sensible
 * defaults from the document's own title/description, so leaving this collapsed
 * is a valid choice — the warnings only fire on what is actually filled in.
 */
export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Título meta',
      type: 'localeString',
      description: `Reemplaza el título de la pestaña y del resultado en Google. ${titleHint}`,
      validation: metaTitleRules,
    }),
    defineField({
      name: 'metaDescription',
      title: 'Descripción meta',
      type: 'localeText',
      description: `El resumen que aparece bajo el título en Google. ${descriptionHint}`,
      validation: metaDescriptionRules,
    }),
    defineField({
      name: 'ogImage',
      title: 'Imagen para redes sociales',
      type: 'image',
      description:
        'Se muestra al compartir la página en redes sociales. Ideal 1200x630 px. Si la dejas vacía se usa la imagen de portada.',
    }),
  ],
})
