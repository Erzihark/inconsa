import { defineType, defineField, defineArrayMember } from 'sanity'
import { headingRules, slugRules } from '../seoRules'

/**
 * A construction project — the core of the site's work showcase. Projects are
 * either "in progress" or "completed" and carry a description + image gallery.
 */
export const project = defineType({
  name: 'project',
  title: 'Proyecto',
  type: 'document',
  groups: [
    { name: 'content', title: 'Contenido', default: true },
    { name: 'media', title: 'Multimedia' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'localeString',
      group: 'content',
      description: 'Se usa como título de la página y como encabezado H1.',
      validation: headingRules,
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      group: 'content',
      description:
        'La URL del proyecto. Una vez publicado, cambiarlo rompe los enlaces existentes: procura dejarlo fijo.',
      options: { source: 'title.es', maxLength: 80 },
      validation: slugRules,
    }),
    defineField({
      name: 'status',
      title: 'Estatus',
      type: 'string',
      group: 'content',
      options: {
        list: [
          { title: 'En proceso', value: 'in-progress' },
          { title: 'Completado', value: 'completed' },
        ],
        layout: 'radio',
      },
      initialValue: 'in-progress',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Ubicación',
      type: 'string',
      group: 'content',
      description: 'ej. "Cancún, Quintana Roo".',
    }),
    defineField({
      name: 'date',
      title: 'Fecha',
      type: 'date',
      group: 'content',
      description: 'Fecha de finalización, o de inicio para proyectos en proceso.',
      options: { dateFormat: 'YYYY-MM' },
    }),
    defineField({
      name: 'client',
      title: 'Cliente',
      type: 'reference',
      group: 'content',
      to: [{ type: 'client' }],
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'localeBlock',
      group: 'content',
      description:
        'El texto de la página del proyecto. También alimenta la descripción en Google cuando no defines una propia en la pestaña SEO.',
      validation: (Rule) =>
        Rule.custom((value: unknown) => {
          const blocks = (value as { es?: unknown[] } | undefined)?.es
          return Array.isArray(blocks) && blocks.length
            ? true
            : 'Escribe la descripción en español. Sin ella la página del proyecto queda casi vacía para Google.'
        }),
    }),
    defineField({
      name: 'coverImage',
      title: 'Imagen de portada',
      type: 'figure',
      group: 'media',
      description: 'Se muestra en las tarjetas y como imagen principal de la página del proyecto.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'images',
      title: 'Galería',
      type: 'array',
      group: 'media',
      of: [defineArrayMember({ type: 'figure' })],
      options: { layout: 'grid' },
    }),
    defineField({
      name: 'featured',
      title: 'Destacado en la página de inicio',
      type: 'boolean',
      group: 'content',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Orden manual',
      type: 'number',
      group: 'content',
      description: 'Los números más bajos aparecen primero. Déjalo vacío para ordenar por fecha.',
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
  ],
  orderings: [
    {
      title: 'Orden manual',
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
      const label = subtitle === 'completed' ? 'Completado' : 'En proceso'
      return { title, subtitle: label, media }
    },
  },
})
