import { defineType, defineField } from 'sanity'

/** A past/current client, shown in the clients section. */
export const client = defineType({
  name: 'client',
  title: 'Cliente',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'description', title: 'Descripción', type: 'localeText' }),
    defineField({ name: 'logo', title: 'Logotipo', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'website', title: 'Sitio web', type: 'url' }),
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
  preview: { select: { title: 'name', media: 'logo' } },
})
