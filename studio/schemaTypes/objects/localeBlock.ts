import { defineType } from 'sanity'
import { supportedLanguages } from '../languages'

/** Rich text (Portable Text), translated per language ({ es, en }). */
export const localeBlock = defineType({
  name: 'localeBlock',
  title: 'Localized rich text',
  type: 'object',
  fieldsets: [{ name: 'translations', title: 'Translations', options: { collapsible: true } }],
  fields: supportedLanguages.map((lang) => ({
    name: lang.id,
    title: lang.title,
    type: 'array',
    of: [{ type: 'block' }],
    fieldset: 'translations',
  })),
})
