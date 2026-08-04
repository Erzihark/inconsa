import { defineType, defineField } from 'sanity'

/**
 * How a machine can be rented: by the hour and/or per project. Rates are optional
 * (the client may prefer "request a quote"). Currency is MXN by convention.
 */
export const rentalOptions = defineType({
  name: 'rentalOptions',
  title: 'Opciones de renta',
  type: 'object',
  fields: [
    defineField({ name: 'hourly', title: 'Disponible por hora', type: 'boolean', initialValue: false }),
    defineField({
      name: 'hourlyRate',
      title: 'Tarifa por hora (MXN)',
      type: 'number',
      hidden: ({ parent }) => !parent?.hourly,
    }),
    defineField({ name: 'perProject', title: 'Disponible por proyecto', type: 'boolean', initialValue: true }),
    defineField({
      name: 'notes',
      title: 'Notas de precios',
      type: 'localeText',
      description: 'Aclaraciones opcionales que se muestran junto a las opciones de renta.',
    }),
  ],
})
