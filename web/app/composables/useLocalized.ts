/**
 * Returns a helper that resolves a localized field ({ es, en }) against the
 * active locale, falling back to Spanish (the base language).
 */
export function useLocalized() {
  const { locale } = useI18n()
  return <T = string>(field?: Record<string, T> | null): T | undefined => {
    if (!field) return undefined
    return field[locale.value] ?? field['es']
  }
}
