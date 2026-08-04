import { defineType } from 'sanity'
import { supportedLanguages } from '../languages'

/** A multi-line plain-text string, translated per language ({ es, en }). */
export const localeText = defineType({
  name: 'localeText',
  title: 'Texto largo localizado',
  type: 'object',
  fieldsets: [{ name: 'translations', title: 'Traducciones', options: { collapsible: true } }],
  fields: supportedLanguages.map((lang) => ({
    name: lang.id,
    title: lang.title,
    type: 'text',
    rows: 4,
    fieldset: 'translations',
    validation: lang.isDefault ? (Rule: any) => Rule.required() : undefined,
  })),
})
