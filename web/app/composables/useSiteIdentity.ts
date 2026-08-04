/**
 * Site-wide schema.org identity: a GeneralContractor (a LocalBusiness subtype)
 * built from the Sanity site settings. @nuxtjs/seo already emits WebSite + WebPage;
 * this adds the organisation so search engines get the company, address, phone and
 * social profiles as structured data. Call once, in app.vue.
 *
 * Order matters here, twice over:
 *
 *  1. The settings must be *resolved* before `useSchemaOrg` runs. app.vue's setup
 *     sits outside the Suspense boundary that awaits page-level useAsyncData, and
 *     useSchemaOrg reads its argument when the head entry is registered rather
 *     than re-reading it at serialization. Registering first left every field on
 *     its fallback — no telephone, no email, `sameAs: []`, a truncated address —
 *     even though all of it is filled in the CMS.
 *  2. `useSchemaOrg` therefore has to run after an await, where the Nuxt instance
 *     is gone ("[nuxt] instance unavailable"), so it is wrapped in
 *     `nuxtApp.runWithContext()`.
 */
export async function useSiteIdentity() {
  const nuxtApp = useNuxtApp()
  const { public: pub } = useRuntimeConfig()
  const img = useSanityImage()
  const siteUrl = (pub.siteUrl as string) || 'https://www.inconsa.mx'

  const settings = useSiteSettings()
  await settings

  const build = () => {
    const s = settings.data.value
    const logoRef = s?.logo?.asset?._ref
    const sameAs = [s?.social?.facebook, s?.social?.instagram, s?.social?.linkedin].filter(
      Boolean,
    ) as string[]
    return [
      defineLocalBusiness({
        // GeneralContractor is a valid schema.org LocalBusiness subtype, and the
        // one Google documents for contractors, but nuxt-schema-org's
        // ValidLocalBusinessSubTypes union only lists LocalBusiness's direct
        // children and omits it. The emitted JSON-LD is correct either way
        // (`["Organization","LocalBusiness","GeneralContractor"]`); the cast just
        // stops the incomplete typing from failing `tsc`.
        '@type': 'GeneralContractor' as never,
        'name': s?.companyName || 'Grupo INCONSA',
        'description':
          'Constructora en Cancún especializada en obra civil, urbanización e infraestructura desde 2006.',
        'url': siteUrl,
        'logo': logoRef ? img(s!.logo!).width(400).url() : `${siteUrl}/og-default.jpg`,
        'image': `${siteUrl}/og-default.jpg`,
        'telephone': s?.contact?.phone || undefined,
        'email': s?.contact?.emailContact || undefined,
        'foundingDate': '2006',
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': s?.contact?.address || 'Calle Ceibo Lote 6, SM 23 MZ 51',
          'addressLocality': 'Cancún',
          'addressRegion': 'Quintana Roo',
          'postalCode': '77500',
          'addressCountry': 'MX',
        },
        'areaServed': 'Cancún, Quintana Roo, México',
        // Omit rather than emit `sameAs: []` — an empty array is noise in the graph.
        ...(sameAs.length ? { sameAs } : {}),
      }),
    ]
  }

  nuxtApp.runWithContext(() => useSchemaOrg(build()))
}
