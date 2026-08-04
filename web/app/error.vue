<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const { t } = useI18n()
const localePath = useLocalePath()

const isNotFound = computed(() => props.error?.statusCode === 404)
const code = computed(() => String(props.error?.statusCode ?? 500))

useSeoMeta({
  title: () => (isNotFound.value ? t('error.notFoundTitle') : t('error.genericTitle')),
  robots: 'noindex',
})
</script>

<template>
  <div class="relative flex min-h-svh flex-col overflow-hidden bg-ink text-white">
    <div class="pointer-events-none absolute inset-0 bg-grid text-white/[0.05]" aria-hidden="true" />
    <div class="absolute inset-x-0 top-0 h-1.5 bg-accent" aria-hidden="true" />
    <!-- oversized status code as the page's own watermark -->
    <span
      class="text-stroke pointer-events-none absolute -bottom-10 right-0 hidden select-none font-display text-[16rem] leading-none tracking-widest text-white/[0.14] lg:block"
      aria-hidden="true"
      >{{ code }}</span
    >

    <div class="relative mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 py-24">
      <p class="rise font-subtitle text-sm font-semibold uppercase tracking-[0.3em] text-accent">
        {{ code }}
      </p>
      <h1 class="rise mt-4 max-w-3xl font-display text-5xl leading-none sm:text-7xl" style="animation-delay: 80ms">
        {{ isNotFound ? t('error.notFoundTitle') : t('error.genericTitle') }}
      </h1>
      <p
        class="rise mt-5 max-w-xl font-subtitle text-lg text-white/70"
        style="animation-delay: 160ms"
      >
        {{ isNotFound ? t('error.notFoundText') : t('error.genericText') }}
      </p>
      <span class="mt-8 block h-1 w-24 bg-accent" aria-hidden="true" />

      <div class="rise mt-10 flex flex-wrap gap-4" style="animation-delay: 240ms">
        <UiButton :to="localePath('/')" arrow>{{ t('actions.backHome') }}</UiButton>
        <UiButton
          :to="localePath('/contacto')"
          variant="outline"
          class="border-white text-white before:!bg-white hover:!text-ink"
        >
          {{ t('nav.contact') }}
        </UiButton>
      </div>
    </div>
  </div>
</template>
