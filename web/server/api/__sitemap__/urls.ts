/**
 * Dynamic sitemap source: the CMS-driven detail routes (projects + machine
 * categories). Static pages are discovered automatically by @nuxtjs/sitemap.
 * `_i18nTransform: true` lets the module expand each URL across locales (ES + EN)
 * and emit the hreflang alternates.
 *
 * Runs on the server, so it reads Sanity over HTTP (no browser client here).
 */
export default defineSitemapEventHandler(async () => {
  const cfg = useRuntimeConfig()
  const sanity = (cfg.public as { sanity?: { projectId?: string; dataset?: string } }).sanity
  const projectId = sanity?.projectId || process.env.NUXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = sanity?.dataset || process.env.NUXT_PUBLIC_SANITY_DATASET || 'production'

  if (!projectId || projectId === 'placeholder') return []

  const query = `{
    "projects": *[_type == "project" && defined(slug.current)].slug.current,
    "categories": *[_type == "machineCategory" && defined(slug.current)].slug.current
  }`
  const url = `https://${projectId}.apicdn.sanity.io/v2024-10-01/data/query/${dataset}?query=${encodeURIComponent(query)}`

  try {
    const { result } = await $fetch<{ result: { projects: string[]; categories: string[] } }>(url)
    return [
      ...(result.projects || []).map((slug) => ({
        loc: `/proyectos/${slug}`,
        _i18nTransform: true,
        changefreq: 'monthly' as const,
        priority: 0.8 as const,
      })),
      ...(result.categories || []).map((slug) => ({
        loc: `/arrendamiento/${slug}`,
        _i18nTransform: true,
        changefreq: 'monthly' as const,
        priority: 0.6 as const,
      })),
    ]
  } catch {
    // Never let a Sanity hiccup break sitemap generation.
    return []
  }
})
