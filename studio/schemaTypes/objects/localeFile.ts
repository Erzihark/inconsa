import { defineType } from 'sanity'
import { supportedLanguages } from '../languages'

/**
 * A downloadable file per language ({ es, en }) — used for the CV / company
 * profile PDF so the admin can upload a Spanish and an English version.
 */
export const localeFile = defineType({
  name: 'localeFile',
  title: 'Archivo localizado',
  type: 'object',
  fieldsets: [{ name: 'translations', title: 'Traducciones', options: { collapsible: true } }],
  fields: supportedLanguages.map((lang) => ({
    name: lang.id,
    title: lang.title,
    type: 'file',
    options: { accept: '.pdf' },
    fieldset: 'translations',
  })),
})
