/**
 * Languages the site is translated into. Spanish is the default/base language;
 * English is secondary. Used to generate the localized field types below so we
 * only declare the language list once.
 */
export type Language = { id: string; title: string; isDefault?: boolean }

export const supportedLanguages: readonly Language[] = [
  { id: 'es', title: 'Español', isDefault: true },
  { id: 'en', title: 'English' },
]

export const baseLanguage = supportedLanguages.find((l) => l.isDefault)
