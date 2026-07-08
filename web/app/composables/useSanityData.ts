/**
 * Fetches Sanity content through Nuxt's useAsyncData so the result is serialized
 * into the payload and hydrated on the client (no refetch, no hydration mismatch).
 *
 * `@nuxtjs/sanity`'s useSanityQuery renders on the server but does not put the
 * data in the Nuxt payload, so the client re-fetches and briefly sees `null` —
 * which breaks v-if/v-else hydration. This helper avoids that.
 */
export function useSanityData<T>(
  key: string,
  query: string,
  params: Record<string, unknown> = {},
) {
  const sanity = useSanity()
  return useAsyncData<T>(key, () => sanity.fetch<T>(query, params) as Promise<T>)
}
