import { defineType } from 'sanity'
import { supportedLanguages } from '../languages'

/**
 * A short single-line string, translated per language ({ es, en }).
 * Spanish is required; English is optional and the frontend falls back to Spanish.
 */
export const localeString = defineType({
  name: 'localeString',
  title: 'Localized string',
  type: 'object',
  fieldsets: [{ name: 'translations', title: 'Translations', options: { collapsible: true } }],
  fields: supportedLanguages.map((lang) => ({
    name: lang.id,
    title: lang.title,
    type: 'string',
    fieldset: 'translations',
    validation: lang.isDefault ? (Rule: any) => Rule.required() : undefined,
  })),
})
