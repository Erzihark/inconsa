<script setup lang="ts">
import type { SanityImage } from '~/types/content'
defineProps<{ image?: SanityImage | null }>()
const { t } = useI18n()
const localePath = useLocalePath()
const contactLink = useContactLink()

// Word-level stagger for the headline; the last word gets the accent color.
// Deterministic from the i18n string → identical SSR/client markup.
const words = computed(() => t('home.heroTitle').split(' '))
</script>

<template>
  <section class="cut-b relative flex min-h-svh items-center overflow-hidden bg-ink text-white">
    <!-- background image with slow push-in -->
    <div v-if="image" class="absolute inset-0 overflow-hidden" aria-hidden="true">
      <AppImage
        :source="image"
        alt=""
        loading="eager"
        :widths="[768, 1280, 1920]"
        sizes="100vw"
        img-class="kenburns absolute inset-0 h-full w-full object-cover opacity-45"
      />
    </div>
    <div class="pointer-events-none absolute inset-0 bg-grid text-white/[0.05]" aria-hidden="true" />
    <div
      class="pointer-events-none absolute inset-0 bg-gradient-to-tr from-ink via-ink/85 to-ink/30"
      aria-hidden="true"
    />
    <!-- giant outlined watermark -->
    <span
      class="text-stroke pointer-events-none absolute -bottom-7 right-2 hidden select-none font-display text-[11rem] leading-none tracking-widest text-white/[0.16] lg:block"
      aria-hidden="true"
      >INCONSA</span
    >
    <!-- angular yellow accents -->
    <div
      class="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rotate-12 bg-accent/10 blur-2xl"
      aria-hidden="true"
    />
    <div class="pointer-events-none absolute left-0 top-0 h-1.5 w-2/5 bg-accent" aria-hidden="true" />

    <div class="relative mx-auto w-full max-w-6xl px-4 pb-32 pt-28">
      <p class="rise mb-5 inline-flex items-center gap-3 font-subtitle text-sm font-semibold uppercase tracking-[0.3em] text-accent">
        <span class="inline-block h-px w-10 bg-accent" aria-hidden="true" />
        Cancún, Q. Roo · Desde 2006
      </p>
      <h1 class="max-w-5xl font-display text-6xl leading-[0.92] tracking-wide sm:text-7xl md:text-[7.5rem]">
        <span
          v-for="(w, i) in words"
          :key="i"
          class="rise inline-block"
          :class="i === words.length - 1 ? 'text-accent' : ''"
          :style="{ animationDelay: `${120 + i * 70}ms` }"
          >{{ w }}<template v-if="i < words.length - 1">&nbsp;</template></span
        >
      </h1>
      <p class="rise mt-7 max-w-2xl font-subtitle text-lg text-white/75 sm:text-xl" style="animation-delay: 620ms">
        {{ t('home.heroSubtitle') }}
      </p>
      <div class="rise mt-10 flex flex-wrap gap-4" style="animation-delay: 760ms">
        <UiButton :to="localePath('/proyectos')" arrow>{{ t('actions.viewProjects') }}</UiButton>
        <UiButton
          :to="contactLink('general')"
          variant="outline"
          class="border-white text-white before:!bg-white hover:!text-ink"
        >
          {{ t('actions.requestQuote') }}
        </UiButton>
      </div>
    </div>

    <!-- scroll cue -->
    <div
      class="rise absolute bottom-16 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/50 sm:flex"
      style="animation-delay: 1000ms"
      aria-hidden="true"
    >
      <span class="font-subtitle text-[0.65rem] uppercase tracking-[0.25em]">Scroll</span>
      <span class="relative block h-10 w-px overflow-hidden bg-white/20">
        <span class="absolute inset-x-0 top-0 h-4 animate-bounce bg-accent" />
      </span>
    </div>
  </section>
</template>
