import { defineType, defineField } from 'sanity'
import { requiredLocaleRule } from '../seoRules'

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
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'localeText',
      description: 'Una frase sobre el cliente o la obra que le entregamos. Da contenido a la página "Clientes".',
      validation: requiredLocaleRule(
        'Sin descripción, la página "Clientes" queda casi sin texto para Google.',
        'warning',
      ),
    }),
    defineField({ name: 'logo', title: 'Logotipo', type: 'figure' }),
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
