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

// Two alternating splits at most, then the layout changes: a longer run of
// left-image / right-image rows reads as a template.
const split = computed(() => ordered.value.slice(0, 2))
const grid = computed(() => ordered.value.slice(2))

useSeoMeta({
  title: () => t('services.title'),
  description: () => t('meta.homeDescription'),
})
</script>

<template>
  <div>
    <PageHeader :eyebrow="t('home.servicesEyebrow')" :title="t('services.title')" />

    <section class="mx-auto max-w-6xl px-4 py-16 sm:py-20">
      <!-- Lead services: alternating split, two rows only -->
      <div class="space-y-16">
        <Reveal
          v-for="(s, i) in split"
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
            <h2 class="font-display text-4xl text-ink sm:text-5xl">{{ loc(s.title) }}</h2>
            <p v-if="loc(s.description)" class="mt-4 max-w-[60ch] font-subtitle text-lg leading-relaxed text-ink/70">
              {{ loc(s.description) }}
            </p>
          </div>
        </Reveal>
      </div>

      <!-- Remaining services: card grid, so the page stops alternating -->
      <div v-if="grid.length" class="mt-16 grid gap-6 md:grid-cols-2">
        <Reveal
          v-for="(s, i) in grid"
          :key="s._id"
          :delay="i * 90"
          class="group flex h-full flex-col bg-surface shadow-sm ring-1 ring-ink/5 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-ink/20"
        >
          <div class="relative aspect-[16/10] overflow-hidden bg-ink">
            <AppImage
              :source="s.image"
              :alt="loc(s.title) || ''"
              sizes="(min-width: 768px) 50vw, 100vw"
              img-class="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
            />
            <span class="absolute left-0 top-0 h-1.5 w-24 bg-accent" />
          </div>
          <div class="flex flex-1 flex-col p-7">
            <h2 class="font-display text-3xl text-ink">{{ loc(s.title) }}</h2>
            <p v-if="loc(s.description)" class="mt-3 max-w-[60ch] font-subtitle leading-relaxed text-ink/70">
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
