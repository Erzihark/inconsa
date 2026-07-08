<script setup lang="ts">
import type { Service } from '~/types/content'
import { SERVICES_QUERY } from '~/utils/queries'

const { t } = useI18n()
const loc = useLocalized()
const localePath = useLocalePath()
const { data: services } = useSanityData<Service[]>('services', SERVICES_QUERY)

const groupOrder = ['infrastructure', 'urbanization', 'projects', 'equipment']
const ordered = computed(() => {
  const list = services.value ?? []
  return [...list].sort((a, b) => groupOrder.indexOf(a.group) - groupOrder.indexOf(b.group))
})

useSeoMeta({
  title: () => t('services.title'),
  description: () => t('meta.homeDescription'),
})
</script>

<template>
  <div>
    <PageHeader :eyebrow="t('home.servicesEyebrow')" :title="t('services.title')" />

    <section class="mx-auto max-w-6xl px-4 py-16 sm:py-20">
      <div class="space-y-16">
        <Reveal
          v-for="(s, i) in ordered"
          :key="s._id"
          class="grid items-center gap-8 md:grid-cols-2"
        >
          <div :class="i % 2 === 1 ? 'md:order-2' : ''">
            <div class="relative aspect-[4/3] overflow-hidden bg-ink">
              <AppImage
                :source="s.image"
                :alt="loc(s.title) || ''"
                sizes="(min-width: 768px) 50vw, 100vw"
                img-class="h-full w-full object-cover"
              />
              <span class="absolute left-0 top-0 h-1.5 w-24 bg-accent" />
            </div>
          </div>
          <div :class="i % 2 === 1 ? 'md:order-1' : ''">
            <p class="mb-2 font-subtitle text-sm font-semibold uppercase tracking-[0.2em] text-danger">
              {{ t(`services.groups.${s.group}`) }}
            </p>
            <h2 class="font-display text-4xl tracking-wide text-ink">{{ loc(s.title) }}</h2>
            <p v-if="loc(s.description)" class="mt-4 font-subtitle text-lg leading-relaxed text-ink/70">
              {{ loc(s.description) }}
            </p>
          </div>
        </Reveal>
      </div>

      <div class="mt-16 flex justify-center">
        <UiButton :to="localePath('/contacto')">{{ t('actions.requestQuote') }}</UiButton>
      </div>
    </section>
  </div>
</template>
