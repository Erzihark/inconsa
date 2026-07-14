<script setup lang="ts">
import type { MachineCategory } from '~/types/content'
import { MACHINE_CATEGORIES_QUERY } from '~/utils/queries'

const { t } = useI18n()
const localePath = useLocalePath()
const { data: categories } = useSanityData<(MachineCategory & { machineCount?: number })[]>(
  'machine-categories',
  MACHINE_CATEGORIES_QUERY,
)

useSeoMeta({ title: () => t('leasing.title'), description: () => t('leasing.subtitle') })
</script>

<template>
  <div class="bg-steel text-white">
    <!-- Hero -->
    <section class="relative overflow-hidden bg-steel">
      <div class="pointer-events-none absolute inset-0 bg-grid text-white/[0.04]" aria-hidden="true" />
      <div
        class="pointer-events-none absolute left-0 top-0 h-2 w-full"
        style="
          background: repeating-linear-gradient(
            45deg,
            #f2820c 0,
            #f2820c 22px,
            #14171d 22px,
            #14171d 44px
          );
        "
        aria-hidden="true"
      />
      <div
        class="pointer-events-none absolute -right-24 top-10 h-80 w-80 rotate-12 bg-machine/10 blur-3xl"
        aria-hidden="true"
      />
      <div class="relative mx-auto max-w-6xl px-4 py-24 sm:py-28">
        <p class="rise mb-4 font-subtitle text-sm font-semibold uppercase tracking-[0.3em] text-machine">
          {{ t('leasing.eyebrow') }}
        </p>
        <h1
          class="rise max-w-4xl font-display text-6xl leading-[0.95] tracking-wide sm:text-7xl"
          style="animation-delay: 100ms"
        >
          {{ t('leasing.title') }}
        </h1>
        <p
          class="rise mt-6 max-w-2xl font-subtitle text-lg text-white/65"
          style="animation-delay: 220ms"
        >
          {{ t('leasing.intro') }}
        </p>
        <div class="rise mt-10 flex flex-wrap gap-4" style="animation-delay: 340ms">
          <UiButton :to="localePath('/contacto')" variant="machine">{{ t('actions.requestQuote') }}</UiButton>
          <a
            href="#categorias"
            class="inline-flex items-center justify-center gap-2 border-2 border-white/25 px-6 py-3 font-subtitle text-sm font-medium uppercase tracking-wide text-white transition-colors hover:border-machine hover:text-machine"
          >
            {{ t('leasing.categories') }}
          </a>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section class="border-t border-white/5 bg-steel-2">
      <div class="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <h2 class="mb-10 font-display text-4xl tracking-wide text-white">{{ t('leasing.howItWorks') }}</h2>
        <div class="grid gap-6 md:grid-cols-2">
          <Reveal class="flex gap-5 bg-steel p-7 ring-1 ring-white/5">
            <div class="flex h-14 w-14 shrink-0 items-center justify-center bg-machine/15 text-machine">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" stroke-linecap="round" /></svg>
            </div>
            <div>
              <h3 class="font-display text-2xl tracking-wide text-white">{{ t('leasing.byHour') }}</h3>
              <p class="mt-2 font-subtitle text-sm leading-relaxed text-white/60">{{ t('leasing.hourDesc') }}</p>
            </div>
          </Reveal>
          <Reveal :delay="120" class="flex gap-5 bg-steel p-7 ring-1 ring-white/5">
            <div class="flex h-14 w-14 shrink-0 items-center justify-center bg-machine/15 text-machine">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 7h18M3 12h18M3 17h12" stroke-linecap="round" /></svg>
            </div>
            <div>
              <h3 class="font-display text-2xl tracking-wide text-white">{{ t('leasing.byProject') }}</h3>
              <p class="mt-2 font-subtitle text-sm leading-relaxed text-white/60">{{ t('leasing.projectDesc') }}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>

    <!-- Categories -->
    <section id="categorias" class="scroll-mt-24">
      <div class="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <div class="mb-10">
          <p class="mb-2 font-subtitle text-sm font-semibold uppercase tracking-[0.2em] text-machine">
            {{ t('leasing.categoriesSubtitle') }}
          </p>
          <h2 class="font-display text-4xl tracking-wide text-white sm:text-5xl">{{ t('leasing.categories') }}</h2>
        </div>
        <div v-if="categories?.length" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Reveal v-for="(c, i) in categories" :key="c._id" :delay="(i % 3) * 90">
            <CategoryCard :category="c" />
          </Reveal>
        </div>
        <p v-else class="py-12 font-subtitle text-white/50">{{ t('leasing.noMachines') }}</p>
      </div>
    </section>

    <!-- CTA -->
    <section class="border-t border-white/5 bg-machine text-steel">
      <div class="mx-auto flex max-w-6xl flex-col items-start gap-5 px-4 py-14 sm:flex-row sm:items-center sm:justify-between">
        <h2 class="font-display text-4xl tracking-wide sm:text-5xl">{{ t('home.cta.title') }}</h2>
        <UiButton :to="localePath('/contacto')" variant="dark">{{ t('actions.requestQuote') }}</UiButton>
      </div>
    </section>
  </div>
</template>
