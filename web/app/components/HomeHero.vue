<script setup lang="ts">
import type { SanityImage } from '~/types/content'
defineProps<{ image?: SanityImage | null }>()
const { t } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <section class="relative flex min-h-[88vh] items-center overflow-hidden bg-ink text-white">
    <!-- optional background image -->
    <AppImage
      v-if="image"
      :source="image"
      alt=""
      loading="eager"
      :widths="[768, 1280, 1920]"
      sizes="100vw"
      img-class="absolute inset-0 h-full w-full object-cover opacity-35"
    />
    <div class="pointer-events-none absolute inset-0 bg-grid text-white/[0.05]" aria-hidden="true" />
    <div
      class="pointer-events-none absolute inset-0 bg-gradient-to-tr from-ink via-ink/90 to-ink/40"
      aria-hidden="true"
    />
    <!-- angular yellow accent -->
    <div
      class="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rotate-12 bg-accent/10 blur-2xl"
      aria-hidden="true"
    />
    <div
      class="pointer-events-none absolute left-0 top-0 h-1.5 w-2/5 bg-accent"
      aria-hidden="true"
    />

    <div class="relative mx-auto w-full max-w-6xl px-4 py-24">
      <p
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }"
        class="mb-4 font-subtitle text-sm font-semibold uppercase tracking-[0.3em] text-accent"
      >
        Cancún, Q. Roo · Desde 2006
      </p>
      <h1
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 700, delay: 120 } }"
        class="max-w-4xl font-display text-6xl leading-[0.95] tracking-wide sm:text-7xl md:text-8xl"
      >
        {{ t('home.heroTitle') }}
      </h1>
      <p
        v-motion
        :initial="{ opacity: 0, y: 24 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 700, delay: 260 } }"
        class="mt-6 max-w-2xl font-subtitle text-lg text-white/75 sm:text-xl"
      >
        {{ t('home.heroSubtitle') }}
      </p>
      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 700, delay: 400 } }"
        class="mt-10 flex flex-wrap gap-4"
      >
        <UiButton :to="localePath('/proyectos')">{{ t('actions.viewProjects') }}</UiButton>
        <UiButton :to="localePath('/contacto')" variant="outline" class="border-white text-white hover:bg-white hover:text-ink">
          {{ t('actions.requestQuote') }}
        </UiButton>
      </div>
    </div>

    <!-- scroll cue -->
    <div class="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce text-white/50" aria-hidden="true">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M6 9l6 6 6-6" />
      </svg>
    </div>
  </section>
</template>
