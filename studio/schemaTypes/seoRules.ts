import { baseLanguage } from './languages'

/**
 * Shared SEO validation used across the schemas, so the rules — and the numbers
 * behind them — live in one place.
 *
 * Two levels, used deliberately:
 *  - **error** blocks publishing. Reserved for things that are simply broken for
 *    search engines or screen readers: a missing alt text, a page with no
 *    description at all, a malformed URL slug.
 *  - **warning** still publishes but flags the field in the Studio. Used for
 *    length guidance, where the editor's judgement should be able to win.
 *
 * Length targets follow what Google actually renders:
 *  - Title ~60 characters. The site appends " | Grupo INCONSA" (16 chars) via
 *    `titleTemplate`, so the editable part gets TITLE_MAX.
 *  - Description 70-160. Under ~70 Google usually discards it and writes its own
 *    snippet; over ~160 it truncates.
 *
 * Sanity's `Rule` generics do not narrow well through helpers, so these take an
 * untyped rule and return it — the same shortcut `localeString` already uses.
 */
export const TITLE_MAX = 44
export const DESC_MIN = 70
export const DESC_MAX = 160
export const ALT_MAX = 125

const BASE = baseLanguage?.id ?? 'es'

type LocaleValue = Record<string, string | undefined> | undefined

/** The base-language (Spanish) value of a localeString/localeText object. */
const baseText = (value: LocaleValue) => (value?.[BASE] ?? '').trim()

/* Hints rendered under the field, so the editor sees the target before writing. */
export const titleHint = `Máximo ${TITLE_MAX} caracteres. El sitio añade " | Grupo INCONSA" al final y Google corta los títulos cerca de los 60.`
export const descriptionHint = `Entre ${DESC_MIN} y ${DESC_MAX} caracteres. Más corta, Google suele ignorarla y escribir su propio resumen; más larga, la recorta.`
export const altHint = `Describe en una frase lo que se ve. Lo leen los lectores de pantalla y es como Google entiende la foto. Máximo ${ALT_MAX} caracteres.`

/** Meta title: optional, but warn when it would be cut off in results. */
export const metaTitleRules = (Rule: any) => [
  Rule.custom((value: LocaleValue) => {
    const text = baseText(value)
    if (!text || text.length <= TITLE_MAX) return true
    return `${text.length} caracteres. Recórtalo a ${TITLE_MAX} o menos para que no se corte en Google.`
  }).warning(),
]

/** Meta description: optional, but warn outside the useful range. */
export const metaDescriptionRules = (Rule: any) => [
  Rule.custom((value: LocaleValue) => {
    const text = baseText(value)
    if (!text) return true
    if (text.length < DESC_MIN)
      return `${text.length} caracteres. Con menos de ${DESC_MIN}, Google casi siempre la descarta y escribe la suya.`
    if (text.length > DESC_MAX) return `${text.length} caracteres; Google la recorta cerca de los ${DESC_MAX}.`
    return true
  }).warning(),
]

/**
 * For a field that *is* the page's description: required in Spanish (error),
 * with the same length guidance as a meta description (warning).
 */
export const requiredDescriptionRules = (Rule: any) => [
  Rule.custom((value: LocaleValue) =>
    baseText(value) ? true : 'Escribe una descripción en español. Es lo que aparece en Google y al compartir en redes.',
  ),
  Rule.custom((value: LocaleValue) => {
    const text = baseText(value)
    if (!text) return true
    if (text.length < DESC_MIN)
      return `Solo ${text.length} caracteres. Apunta a ${DESC_MIN}-${DESC_MAX} para que Google la use tal cual.`
    if (text.length > DESC_MAX) return `${text.length} caracteres; Google recorta cerca de los ${DESC_MAX}.`
    return true
  }).warning(),
]

/** Alt text: required (accessibility + indexing), with a length ceiling. */
export const altTextRules = (Rule: any) => [
  Rule.custom((value: LocaleValue) => {
    const text = baseText(value)
    if (!text) return 'Falta el texto alternativo en español. Descríbela en una frase.'
    if (text.length > ALT_MAX) return `${text.length} caracteres; máximo ${ALT_MAX}.`
    return true
  }),
  Rule.custom((value: LocaleValue) => {
    const text = baseText(value)
    if (text && text.length < 10) return 'Muy corto para describir la imagen. Escribe una frase completa.'
    return true
  }).warning(),
]

/**
 * Slugs are permanent URLs: enforce lowercase, hyphens and no stray edges so a
 * typo does not become a live URL that later needs a redirect.
 */
export const slugRules = (Rule: any) => [
  Rule.required().custom((value: { current?: string } | undefined) => {
    const slug = value?.current
    if (!slug) return true
    if (slug.length > 80) return 'Demasiado largo. Mantén la URL por debajo de 80 caracteres.'
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
      return 'Usa solo minúsculas, números y guiones simples, sin acentos ni espacios (ej. "ptar-norponiente-ii").'
    return true
  }),
]

/**
 * Required base-language text, without the meta-description length window.
 * For short body copy (service blurbs, client notes) that is not itself a
 * page description but still needs to exist for the page to say anything.
 */
export const requiredLocaleRule =
  (message: string, level: 'error' | 'warning' = 'error') =>
  (Rule: any) => {
    const rule = Rule.custom((value: LocaleValue) => (baseText(value) ? true : message))
    return level === 'warning' ? [rule.warning()] : [rule]
  }

/**
 * A localized portable-text field that is the entire body of a public page.
 * Empty means an indexable URL with nothing on it but a heading, which is how
 * the policy and founder pages ended up at ~10 words.
 */
export const requiredBlockRule = (pageName: string) => (Rule: any) =>
  Rule.custom((value: { es?: unknown[] } | undefined) =>
    Array.isArray(value?.es) && value.es.length
      ? true
      : `Escribe el contenido en español. Sin él, ${pageName} se publica prácticamente vacía y Google la trata como página sin contenido.`,
  )

/**
 * Warns when the English translation is missing on a field that ends up in the
 * page title or description. The site publishes /en URLs regardless and falls
 * back to Spanish, so an untranslated document ships two indexed pages with
 * identical titles and descriptions.
 */
export const translationRule = (Rule: any) =>
  Rule.custom((value: LocaleValue) =>
    (value?.en ?? '').trim()
      ? true
      : 'Falta la traducción al inglés. La página /en se publica igual, pero con el texto en español: dos URLs con el mismo título y la misma descripción.',
  ).warning()

/** A headline-style localized field: required in Spanish, warn when overlong. */
export const headingRules = (Rule: any) => [
  Rule.custom((value: LocaleValue) => (baseText(value) ? true : 'El título en español es obligatorio.')),
  Rule.custom((value: LocaleValue) => {
    const text = baseText(value)
    if (text && text.length > 70) return `${text.length} caracteres. Los títulos largos se cortan en Google.`
    return true
  }).warning(),
  translationRule(Rule),
]
