/**
 * Site-wide schema.org identity: a GeneralContractor (a LocalBusiness subtype)
 * built from the Sanity site settings. @nuxtjs/seo already emits WebSite + WebPage;
 * this adds the organisation so search engines get the company, address, phone and
 * social profiles as structured data. Call once, in app.vue.
 */
export function useSiteIdentity() {
  const { data: settings } = useSiteSettings()
  const { public: pub } = useRuntimeConfig()
  const img = useSanityImage()
  const siteUrl = (pub.siteUrl as string) || 'https://www.inconsa.mx'

  const nodes = computed(() => {
    const s = settings.value
    const logoRef = s?.logo?.asset?._ref
    return [
      defineLocalBusiness({
        '@type': 'GeneralContractor',
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
        'sameAs': [s?.social?.facebook, s?.social?.instagram, s?.social?.linkedin].filter(
          Boolean,
        ) as string[],
      }),
    ]
  })

  useSchemaOrg(nodes)
}
