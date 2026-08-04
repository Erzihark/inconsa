import { defineType, defineField } from 'sanity'
import { headingRules, slugRules, requiredDescriptionRules, descriptionHint } from '../seoRules'

/**
 * A category of leasable machinery (e.g. excavators, trenchers). Phase 2.
 *
 * These have their own indexed URL, so they carry the same SEO surface as a
 * project: a required description and an optional per-page override.
 */
export const machineCategory = defineType({
  name: 'machineCategory',
  title: 'Categoría de máquina',
  type: 'document',
  groups: [
    { name: 'content', title: 'Contenido', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre',
      type: 'localeString',
      group: 'content',
      validation: headingRules,
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      group: 'content',
      description:
        'La URL de la categoría. Una vez publicada, cambiarla rompe los enlaces existentes: procura dejarla fija.',
      options: { source: 'name.es', maxLength: 80 },
      validation: slugRules,
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'localeText',
      group: 'content',
      description: `Se muestra en la página de la categoría y es su descripción en Google. ${descriptionHint}`,
      validation: requiredDescriptionRules,
    }),
    // `figure` rather than a bare image so the photo carries alt text like every
    // other image on the site.
    defineField({ name: 'image', title: 'Imagen', type: 'figure', group: 'content' }),
    defineField({
      name: 'order',
      title: 'Orden manual',
      type: 'number',
      group: 'content',
      description: 'Los números más bajos aparecen primero.',
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
  ],
  orderings: [
    { title: 'Orden manual', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: { select: { title: 'name.es', media: 'image' } },
})
