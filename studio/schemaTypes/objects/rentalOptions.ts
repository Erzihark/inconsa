import { defineType, defineField } from 'sanity'

/**
 * How a machine can be rented: by the hour and/or per project. Rates are optional
 * (the client may prefer "request a quote"). Currency is MXN by convention.
 */
export const rentalOptions = defineType({
  name: 'rentalOptions',
  title: 'Rental options',
  type: 'object',
  fields: [
    defineField({ name: 'hourly', title: 'Available by the hour', type: 'boolean', initialValue: false }),
    defineField({
      name: 'hourlyRate',
      title: 'Hourly rate (MXN)',
      type: 'number',
      hidden: ({ parent }) => !parent?.hourly,
    }),
    defineField({ name: 'perProject', title: 'Available per project', type: 'boolean', initialValue: true }),
    defineField({
      name: 'notes',
      title: 'Pricing notes',
      type: 'localeText',
      description: 'Optional clarifications shown next to the rental options.',
    }),
  ],
})
