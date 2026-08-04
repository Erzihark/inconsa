<script setup lang="ts">
import type { Machine, MachineCategory } from '~/types/content'
import { MACHINE_CATEGORY_BY_SLUG_QUERY, MACHINES_BY_CATEGORY_QUERY } from '~/utils/queries'

const route = useRoute()
const { t } = useI18n()
const loc = useLocalized()
const localePath = useLocalePath()

const slug = route.params.slug as string
const { data: category } = await useSanityData<MachineCategory | null>(
  `machine-category-${slug}`,
  MACHINE_CATEGORY_BY_SLUG_QUERY,
  { slug },
)

if (!category.value) {
  throw createError({ statusCode: 404, statusMessage: 'Category not found', fatal: true })
}

const { data: machines } = await useSanityData<Machine[]>(
  `machines-${slug}`,
  MACHINES_BY_CATEGORY_QUERY,
  { slug },
)

const img = useSanityImage()
const ogImage = computed(() => {
  const i = category.value?.image
  return i?.asset?._ref ? img(i).width(1200).height(630).fit('crop').auto('format').url() : undefined
})

useSeoMeta({
  title: () => loc(category.value?.name) || t('leasing.title'),
  description: () => loc(category.value?.description) || t('leasing.subtitle'),
  ogTitle: () => `${loc(category.value?.name)}, ${t('leasing.title')}`,
  ogImage: () => ogImage.value,
})

useSchemaOrg([
  defineBreadcrumb({
    itemListElement: [
      { name: t('nav.home'), item: localePath('/') },
      { name: t('leasing.title'), item: localePath('/arrendamiento') },
      { name: loc(category.value?.name) || t('leasing.title') },
    ],
  }),
])
</script>

<template>
  <div v-if="category" class="min-h-screen bg-steel text-white">
    <!-- Header -->
    <section class="cut-b relative overflow-hidden bg-steel-2">
      <div v-if="category.image" class="absolute inset-0 overflow-hidden" aria-hidden="true">
        <AppImage
          :source="category.image"
          alt=""
          loading="eager"
          :widths="[768, 1280, 1920]"
          sizes="100vw"
          img-class="kenburns absolute inset-0 h-full w-full object-cover opacity-30"
        />
      </div>
      <div
        class="pointer-events-none absolute inset-0 bg-gradient-to-tr from-steel via-steel/70 to-steel/20"
        aria-hidden="true"
      />
      <div class="pointer-events-none absolute inset-0 bg-grid text-white/[0.04]" aria-hidden="true" />
      <div class="bg-stripes absolute left-0 top-0 h-2 w-full [--stripe:var(--color-machine)]" aria-hidden="true" />
      <div class="relative mx-auto max-w-6xl px-4 pb-20 pt-32 sm:pb-24 sm:pt-40">
        <NuxtLink
          :to="localePath('/arrendamiento')"
          class="rise mb-6 inline-flex items-center gap-2 font-subtitle text-sm text-white/60 hover:text-machine"
        >
          <span>←</span> {{ t('leasing.backToLeasing') }}
        </NuxtLink>
        <h1 class="rise font-display text-6xl leading-none sm:text-7xl" style="animation-delay: 80ms">
          {{ loc(category.name) }}
        </h1>
        <p
          v-if="loc(category.description)"
          class="rise mt-4 max-w-2xl font-subtitle text-lg text-white/65"
          style="animation-delay: 160ms"
        >
          {{ loc(category.description) }}
        </p>
        <Reveal variant="none"><span class="grow-line mt-7 block h-1 w-24 bg-machine" /></Reveal>
      </div>
    </section>

    <!-- Machines -->
    <section class="mx-auto max-w-6xl px-4 py-16">
      <div v-if="machines?.length" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Reveal
          v-for="(m, i) in machines"
          :key="m._id"
          :delay="(i % 3) * 100"
          variant="wipe"
          style="--wipe-color: var(--color-steel-3)"
        >
          <MachineCard :machine="m" />
        </Reveal>
      </div>
      <div v-else class="bg-steel-2 p-10 text-center ring-1 ring-white/5">
        <p class="font-subtitle text-white/60">{{ t('leasing.noMachines') }}</p>
        <UiButton :to="localePath('/contacto')" variant="machine" class="mt-6">
          {{ t('actions.requestQuote') }}
        </UiButton>
      </div>
    </section>
  </div>
</template>
