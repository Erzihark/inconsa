import type { SiteSettings } from '~/types/content'
import { SITE_SETTINGS_QUERY } from '~/utils/queries'

/**
 * Fetches the singleton site settings. useSanityQuery dedupes by query key, so
 * calling this in multiple components triggers a single request.
 */
export function useSiteSettings() {
  return useSanityQuery<SiteSettings | null>(SITE_SETTINGS_QUERY)
}
