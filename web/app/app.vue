<script setup lang="ts">
// i18n head: sets <html lang>, dir, and hreflang alternate links for SEO.
const localeHead = useLocaleHead()
useHead(localeHead)
useHead({
  titleTemplate: (title?: string) => (title ? `${title} | Grupo INCONSA` : 'Grupo INCONSA'),
})

// Global social-share defaults (pages override og:image where they have a cover).
// The share image is editable in the Studio via siteSettings.defaultSeo.ogImage;
// public/og-default.jpg is the floor if the client never sets one.
const { public: pub } = useRuntimeConfig()
const siteUrl = (pub.siteUrl as string) || 'https://www.inconsa.mx'
const { data: settings } = useSiteSettings()
const img = useSanityImage()
const defaultOgImage = computed(() => {
  const custom = settings.value?.defaultSeo?.ogImage
  return custom?.asset?._ref
    ? img(custom).width(1200).height(630).fit('crop').auto('format').url()
    : `${siteUrl}/og-default.jpg`
})
useSeoMeta({
  ogType: 'website',
  ogSiteName: 'Grupo INCONSA',
  ogImage: () => defaultOgImage.value,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  twitterCard: 'summary_large_image',
})

// Organisation structured data (GeneralContractor / LocalBusiness). Awaited, and
// last, so the CMS values are resolved when the JSON-LD is serialized and no
// instance-dependent composable runs after the await. See the composable.
await useSiteIdentity()
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
