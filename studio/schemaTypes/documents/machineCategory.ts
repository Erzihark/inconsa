import { defineType, defineField } from 'sanity'

/** A category of leasable machinery (e.g. excavators, trenchers). Phase 2. */
export const machineCategory = defineType({
  name: 'machineCategory',
  title: 'Categoría de máquina',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'name.es', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'description', title: 'Descripción', type: 'localeText' }),
    defineField({ name: 'image', title: 'Imagen', type: 'image', options: { hotspot: true } }),
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
  preview: { select: { title: 'name.es', media: 'image' } },
})
