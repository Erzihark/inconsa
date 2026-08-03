<script setup lang="ts">
// i18n head: sets <html lang>, dir, and hreflang alternate links for SEO.
const localeHead = useLocaleHead()
useHead(localeHead)
useHead({
  titleTemplate: (title?: string) => (title ? `${title} · Grupo INCONSA` : 'Grupo INCONSA'),
})

// Organisation structured data (GeneralContractor / LocalBusiness).
useSiteIdentity()

// Global social-share defaults (pages override og:image where they have a cover).
const { public: pub } = useRuntimeConfig()
const siteUrl = (pub.siteUrl as string) || 'https://www.inconsa.mx'
useSeoMeta({
  ogType: 'website',
  ogSiteName: 'Grupo INCONSA',
  ogImage: `${siteUrl}/og-default.jpg`,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
