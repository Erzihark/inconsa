import { defineType, defineField } from 'sanity'

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
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'description', title: 'Descripción', type: 'localeText' }),
    defineField({ name: 'image', title: 'Imagen', type: 'image', options: { hotspot: true } }),
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
