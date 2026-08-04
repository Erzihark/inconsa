/**
 * Fetches Sanity content through Nuxt's useAsyncData so the result is serialized
 * into the payload and hydrated on the client (no refetch, no hydration mismatch).
 *
 * `@nuxtjs/sanity`'s useSanityQuery renders on the server but does not put the
 * data in the Nuxt payload, so the client re-fetches and briefly sees `null` —
 * which breaks v-if/v-else hydration. This helper avoids that.
 *
 * It calls Sanity's GROQ HTTP endpoint with plain `$fetch` instead of
 * `useSanity()`. `useSanity()` statically imports `@sanity/core-loader` (visual
 * editing), which drags xstate + rxjs + comlink + an EventSource polyfill into
 * the browser bundle: ~240 kB of code this site never runs, since visual editing
 * is off. This is the same endpoint `@sanity/client` calls, so CDN caching and
 * the published-only anonymous perspective are unchanged.
 */
function buildQueryUrl(query: string, params: Record<string, unknown>) {
  const { projectId, dataset, apiVersion, useCdn } = useSanityConfig()
  const host = useCdn === false ? 'api.sanity.io' : 'apicdn.sanity.io'
  const version = String(apiVersion || '1').startsWith('v') ? apiVersion : `v${apiVersion}`

  const search = new URLSearchParams({ query })
  for (const [key, value] of Object.entries(params)) {
    // GROQ params are JSON-encoded, matching @sanity/client's encoding.
    search.set(`$${key}`, JSON.stringify(value))
  }
  return `https://${projectId}.${host}/${version}/data/query/${dataset}?${search}`
}

export function useSanityData<T>(
  key: string,
  query: string,
  params: Record<string, unknown> = {},
) {
  return useAsyncData<T>(key, async () => {
    const { result } = await $fetch<{ result: T }>(buildQueryUrl(query, params))
    return result
  })
}
