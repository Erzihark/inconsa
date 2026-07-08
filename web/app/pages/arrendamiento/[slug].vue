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

useSeoMeta({
  title: () => loc(category.value?.name) || t('leasing.title'),
  description: () => loc(category.value?.description) || t('leasing.subtitle'),
})
</script>

<template>
  <div v-if="category" class="min-h-screen bg-steel text-white">
    <!-- Header -->
    <section class="relative overflow-hidden bg-steel-2">
      <AppImage
        v-if="category.image"
        :source="category.image"
        alt=""
        loading="eager"
        :widths="[768, 1280, 1920]"
        sizes="100vw"
        img-class="absolute inset-0 h-full w-full object-cover opacity-25"
      />
      <div class="pointer-events-none absolute inset-0 bg-grid text-white/[0.04]" aria-hidden="true" />
      <div class="relative mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <NuxtLink
          :to="localePath('/arrendamiento')"
          class="mb-6 inline-flex items-center gap-2 font-subtitle text-sm text-white/60 hover:text-machine"
        >
          <span>←</span> {{ t('leasing.backToLeasing') }}
        </NuxtLink>
        <h1 class="font-display text-5xl leading-none tracking-wide sm:text-6xl">{{ loc(category.name) }}</h1>
        <p v-if="loc(category.description)" class="mt-4 max-w-2xl font-subtitle text-lg text-white/65">
          {{ loc(category.description) }}
        </p>
        <span class="mt-6 block h-1 w-20 bg-machine" />
      </div>
    </section>

    <!-- Machines -->
    <section class="mx-auto max-w-6xl px-4 py-16">
      <div v-if="machines?.length" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Reveal v-for="(m, i) in machines" :key="m._id" :delay="(i % 3) * 90">
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
