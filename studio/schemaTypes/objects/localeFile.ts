import { defineType } from 'sanity'
import { supportedLanguages } from '../languages'

/**
 * A downloadable file per language ({ es, en }) — used for the CV / company
 * profile PDF so the admin can upload a Spanish and an English version.
 */
export const localeFile = defineType({
  name: 'localeFile',
  title: 'Localized file',
  type: 'object',
  fieldsets: [{ name: 'translations', title: 'Translations', options: { collapsible: true } }],
  fields: supportedLanguages.map((lang) => ({
    name: lang.id,
    title: lang.title,
    type: 'file',
    options: { accept: '.pdf' },
    fieldset: 'translations',
  })),
})
