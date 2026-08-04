import { defineType, defineField } from 'sanity'
import { headingRules, requiredLocaleRule } from '../seoRules'

/** A service the company offers, grouped into one of four categories. */
export const service = defineType({
  name: 'service',
  title: 'Servicio',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'localeString',
      validation: headingRules,
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'localeText',
      description:
        'Una o dos frases sobre el servicio. Es prácticamente todo el texto de la página "Servicios", así que sin ella la página queda vacía para Google.',
      validation: requiredLocaleRule(
        'Escribe la descripción en español. Es el contenido de la página "Servicios".',
      ),
    }),
    defineField({ name: 'image', title: 'Imagen', type: 'figure' }),
    defineField({
      name: 'group',
      title: 'Grupo',
      type: 'string',
      options: {
        list: [
          { title: 'Infraestructura', value: 'infrastructure' },
          { title: 'Urbanización', value: 'urbanization' },
          { title: 'Proyectos', value: 'projects' },
          { title: 'Renta de equipo', value: 'equipment' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Orden manual',
      type: 'number',
      description: 'Los números más bajos aparecen primero.',
    }),
  ],
  orderings: [
    { title: 'Orden manual', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'title.es', subtitle: 'group', media: 'image' },
  },
})
