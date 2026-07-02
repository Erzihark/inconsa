import { defineType, defineField } from 'sanity'

/** A single technical spec (label + value) for a leasable machine. */
export const specItem = defineType({
  name: 'specItem',
  title: 'Specification',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'localeString' }),
    defineField({ name: 'value', title: 'Value', type: 'string' }),
  ],
  preview: {
    select: { title: 'label.es', subtitle: 'value' },
  },
})
