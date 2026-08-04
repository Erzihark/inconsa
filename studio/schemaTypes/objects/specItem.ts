import { defineType, defineField } from 'sanity'

/** A single technical spec (label + value) for a leasable machine. */
export const specItem = defineType({
  name: 'specItem',
  title: 'Especificación',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Etiqueta', type: 'localeString' }),
    defineField({ name: 'value', title: 'Valor', type: 'string' }),
  ],
  preview: {
    select: { title: 'label.es', subtitle: 'value' },
  },
})
