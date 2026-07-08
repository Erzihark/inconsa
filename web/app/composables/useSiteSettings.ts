import type { SiteSettings } from '~/types/content'
import { SITE_SETTINGS_QUERY } from '~/utils/queries'

/**
 * Fetches the singleton site settings via useAsyncData (payload-hydrated, no
 * client refetch). The shared key 'site-settings' dedupes the header + footer
 * calls into a single request.
 */
export function useSiteSettings() {
  return useSanityData<SiteSettings | null>('site-settings', SITE_SETTINGS_QUERY)
}
