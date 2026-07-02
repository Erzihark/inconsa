<script setup lang="ts">
// i18n head: sets <html lang>, dir, and hreflang alternate links for SEO.
const localeHead = useLocaleHead()
useHead(localeHead)
useHead({
  titleTemplate: (title?: string) => (title ? `${title} · Grupo INCONSA` : 'Grupo INCONSA'),
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
