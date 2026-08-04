import { defineType, defineField, defineArrayMember } from 'sanity'

/** A specific leasable machine belonging to a category. Phase 2. */
export const machine = defineType({
  name: 'machine',
  title: 'Máquina',
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
    defineField({
      name: 'category',
      title: 'Categoría',
      type: 'reference',
      to: [{ type: 'machineCategory' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'description', title: 'Descripción', type: 'localeText' }),
    defineField({
      name: 'images',
      title: 'Imágenes',
      type: 'array',
      of: [defineArrayMember({ type: 'figure' })],
      options: { layout: 'grid' },
    }),
    defineField({
      name: 'specs',
      title: 'Especificaciones',
      type: 'array',
      of: [defineArrayMember({ type: 'specItem' })],
    }),
    defineField({ name: 'rental', title: 'Opciones de renta', type: 'rentalOptions' }),
    defineField({
      name: 'available',
      title: 'Disponible para renta',
      type: 'boolean',
      initialValue: true,
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
    select: { title: 'name.es', subtitle: 'category.name.es', media: 'images.0' },
  },
})
