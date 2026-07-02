<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

// Full home layout (featured projects, services, clients) is built in Phase 3.
useSeoMeta({
  title: () => t('meta.homeTitle'),
  description: () => t('meta.homeDescription'),
})
</script>

<template>
  <section class="mx-auto max-w-6xl px-4 py-24 text-center">
    <h1 class="text-5xl leading-none md:text-7xl">{{ t('home.heroTitle') }}</h1>
    <p class="mx-auto mt-5 max-w-2xl font-subtitle text-lg text-ink/70">
      {{ t('home.heroSubtitle') }}
    </p>
    <div class="mt-9 flex flex-wrap justify-center gap-3">
      <UiButton :to="localePath('/proyectos')">{{ t('actions.viewProjects') }}</UiButton>
      <UiButton :to="localePath('/contacto')" variant="outline">{{ t('nav.contact') }}</UiButton>
    </div>
  </section>
</template>
