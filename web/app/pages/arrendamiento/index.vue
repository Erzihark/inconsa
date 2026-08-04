<script setup lang="ts">
import type { MachineCategory } from '~/types/content'
import { MACHINE_CATEGORIES_QUERY } from '~/utils/queries'

const { t } = useI18n()
const localePath = useLocalePath()
const loc = useLocalized()
const { data: categories } = useSanityData<(MachineCategory & { machineCount?: number })[]>(
  'machine-categories',
  MACHINE_CATEGORIES_QUERY,
)

// Hero background: first category image (excavator placeholder until replaced).
const heroImage = computed(() => categories.value?.[0]?.image ?? null)

// A 3-up grid leaves a hole whenever the category count is not a multiple of 3.
// Cells are 2/6 wide normally; the final short row stretches to fill the row.
const spanFor = (i: number, total: number) => {
  const rem = total % 3
  if (rem === 0 || i < total - rem) return 'lg:col-span-2'
  return rem === 2 ? 'lg:col-span-3' : 'lg:col-span-6'
}

const marqueeWords = computed(() =>
  categories.value?.length
    ? categories.value.map((c) => loc(c.name) || '').filter(Boolean)
    : ['Excavadoras', 'Retroexcavadoras', 'Zanjadoras'],
)

useSeoMeta({ title: () => t('leasing.title'), description: () => t('leasing.subtitle') })
</script>

<template>
  <div class="bg-steel text-white">
    <!-- Hero -->
    <section class="relative flex min-h-[92svh] items-center overflow-hidden bg-steel">
      <div v-if="heroImage" class="absolute inset-0 overflow-hidden" aria-hidden="true">
        <AppImage
          :source="heroImage"
          alt=""
          loading="eager"
          :widths="[768, 1280, 1920]"
          sizes="100vw"
          img-class="kenburns absolute inset-0 h-full w-full object-cover opacity-40"
        />
      </div>
      <div class="pointer-events-none absolute inset-0 bg-grid text-white/[0.04]" aria-hidden="true" />
      <div
        class="pointer-events-none absolute inset-0 bg-gradient-to-tr from-steel via-steel/85 to-steel/30"
        aria-hidden="true"
      />
      <!-- hazard stripe seam -->
      <div class="bg-stripes absolute left-0 top-0 h-2 w-full [--stripe:var(--color-machine)]" aria-hidden="true" />
      <span
        class="text-stroke pointer-events-none absolute -bottom-6 right-2 hidden select-none font-display text-[10rem] leading-none tracking-widest text-white/[0.14] lg:block"
        aria-hidden="true"
        >MAQUINARIA</span
      >
      <div
        class="pointer-events-none absolute -right-24 top-10 h-80 w-80 rotate-12 bg-machine/10 blur-3xl"
        aria-hidden="true"
      />

      <div class="relative mx-auto w-full max-w-6xl px-4 pb-24 pt-32">
        <p class="rise mb-5 inline-flex items-center gap-3 font-subtitle text-sm font-semibold uppercase tracking-[0.3em] text-machine">
          <span class="inline-block h-px w-10 bg-machine" aria-hidden="true" />
          {{ t('leasing.eyebrow') }}
        </p>
        <h1
          class="rise max-w-4xl font-display text-6xl leading-[0.92] sm:text-7xl md:text-8xl"
          style="animation-delay: 100ms"
        >
          {{ t('leasing.title') }}
        </h1>
        <p class="rise mt-6 max-w-2xl font-subtitle text-lg text-white/65" style="animation-delay: 220ms">
          {{ t('leasing.intro') }}
        </p>
        <div class="rise mt-10 flex flex-wrap gap-4" style="animation-delay: 340ms">
          <UiButton :to="localePath('/contacto')" variant="machine" arrow>{{ t('actions.requestQuote') }}</UiButton>
          <a
            href="#categorias"
            class="inline-flex items-center justify-center gap-2 border-2 border-white/25 px-7 py-3.5 font-subtitle text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:border-machine hover:text-machine"
          >
            {{ t('leasing.categories') }}
          </a>
        </div>
      </div>
    </section>

    <!-- Orange outlined marquee -->
    <section class="overflow-hidden border-y border-white/5 bg-steel-2 py-5" aria-hidden="true">
      <div class="flex w-max animate-marquee-slow items-center gap-10 whitespace-nowrap pr-10">
        <template v-for="n in 3">
          <template v-for="(w, i) in marqueeWords" :key="`${n}-${i}`">
            <span class="text-stroke font-display text-5xl uppercase tracking-widest text-machine/70 sm:text-6xl">
              {{ w }}
            </span>
            <span class="h-2.5 w-2.5 rotate-45 bg-machine" />
          </template>
        </template>
      </div>
    </section>

    <!-- How it works -->
    <section class="bg-steel-2">
      <div class="mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <h2 class="mb-10 flex items-center gap-3 font-display text-4xl text-white">
          <span class="h-0.5 w-10 bg-machine" aria-hidden="true" />{{ t('leasing.howItWorks') }}
        </h2>
        <div class="grid gap-6 md:grid-cols-2">
          <Reveal
            variant="left"
            class="group flex gap-5 bg-steel p-7 ring-1 ring-white/5 transition-all duration-300 hover:-translate-y-1 hover:ring-machine/40"
          >
            <div
              class="flex h-14 w-14 shrink-0 items-center justify-center bg-machine/15 text-machine transition-colors duration-300 group-hover:bg-machine group-hover:text-steel"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" stroke-linecap="round" /></svg>
            </div>
            <div>
              <h3 class="font-display text-2xl tracking-wide text-white">{{ t('leasing.byHour') }}</h3>
              <p class="mt-2 font-subtitle text-sm leading-relaxed text-white/60">{{ t('leasing.hourDesc') }}</p>
            </div>
          </Reveal>
          <Reveal
            variant="right"
            :delay="100"
            class="group flex gap-5 bg-steel p-7 ring-1 ring-white/5 transition-all duration-300 hover:-translate-y-1 hover:ring-machine/40"
          >
            <div
              class="flex h-14 w-14 shrink-0 items-center justify-center bg-machine/15 text-machine transition-colors duration-300 group-hover:bg-machine group-hover:text-steel"
            >
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
      <div class="mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <div class="mb-12">
          <p class="mb-3 flex items-center gap-3 font-subtitle text-sm font-semibold uppercase tracking-[0.2em] text-machine">
            <span class="h-0.5 w-10 bg-machine" aria-hidden="true" />
            {{ t('leasing.categoriesSubtitle') }}
          </p>
          <h2 class="font-display text-4xl text-white sm:text-6xl">{{ t('leasing.categories') }}</h2>
        </div>
        <div v-if="categories?.length" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-6">
          <Reveal
            v-for="(c, i) in categories"
            :key="c._id"
            :delay="(i % 3) * 100"
            variant="wipe"
            :class="spanFor(i, categories.length)"
            style="--wipe-color: var(--color-steel-3)"
          >
            <CategoryCard :category="c" />
          </Reveal>
        </div>
        <p v-else class="py-12 font-subtitle text-white/50">{{ t('leasing.noMachines') }}</p>
      </div>
    </section>

    <!-- CTA -->
    <section class="cut-t relative overflow-hidden bg-machine text-steel">
      <span
        class="text-stroke pointer-events-none absolute -bottom-5 left-0 hidden select-none whitespace-nowrap font-display text-[9rem] leading-none tracking-widest text-steel/20 lg:block"
        aria-hidden="true"
        >COTIZA HOY</span
      >
      <div
        class="relative mx-auto flex max-w-6xl flex-col items-start gap-5 px-4 py-20 sm:flex-row sm:items-center sm:justify-between sm:py-24"
      >
        <Reveal>
          <h2 class="font-display text-5xl sm:text-6xl">{{ t('home.cta.title') }}</h2>
        </Reveal>
        <Reveal :delay="120" variant="right">
          <UiButton :to="localePath('/contacto')" variant="dark" arrow>{{ t('actions.requestQuote') }}</UiButton>
        </Reveal>
      </div>
    </section>
  </div>
</template>
