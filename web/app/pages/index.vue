<script setup lang="ts">
import type { Project, Service, ClientDoc } from '~/types/content'
import { HOME_PROJECTS_QUERY, HOME_STATS_QUERY, SERVICES_QUERY, CLIENTS_QUERY } from '~/utils/queries'

const { t } = useI18n()
const localePath = useLocalePath()
const contactLink = useContactLink()

const { data: projects } = useSanityData<Project[]>('home-projects', HOME_PROJECTS_QUERY)
const { data: services } = useSanityData<Service[]>('home-services', SERVICES_QUERY)
const { data: clients } = useSanityData<ClientDoc[]>('home-clients', CLIENTS_QUERY)
const { data: stats } = useSanityData<{ projects: number; completed: number; clients: number }>(
  'home-stats',
  HOME_STATS_QUERY,
)

const heroImage = computed(() => projects.value?.[0]?.coverImage ?? null)

const statItems = computed(() =>
  [
    { value: new Date().getFullYear() - 2006, suffix: '+', label: t('home.stats.years') },
    { value: stats.value?.projects ?? 0, suffix: '+', label: t('home.stats.projects') },
    { value: stats.value?.completed ?? 0, suffix: '', label: t('home.stats.completed') },
    { value: stats.value?.clients ?? 0, suffix: '+', label: t('home.stats.clients') },
  ].filter((s) => s.value > 0),
)

// Duplicate clients for a seamless marquee.
const marqueeClients = computed(() => {
  const c = clients.value ?? []
  return c.length ? [...c, ...c] : []
})

// Services bento: cells 1 and 4 of every group of four run wide, so a run of
// four services tiles a 3-col grid exactly (2+1 / 1+2) with no empty cell.
const isFeatureCell = (i: number) => i % 4 === 0 || i % 4 === 3

// siteSettings.defaultSeo lets the client retitle the home page from the Studio
// without a deploy; the i18n strings are the fallback.
const loc = useLocalized()
const { data: settings } = useSiteSettings()
useSeoMeta({
  title: () => loc(settings.value?.defaultSeo?.metaTitle) || t('meta.homeTitle'),
  description: () => loc(settings.value?.defaultSeo?.metaDescription) || t('meta.homeDescription'),
})
</script>

<template>
  <div>
    <HomeHero :image="heroImage" />

    <!-- Stats band: diagonal seam continuing the hero cut -->
    <section v-if="statItems.length" class="cut-t relative -mt-14 bg-accent pt-8 text-ink sm:-mt-16">
      <div
        class="mx-auto flex max-w-6xl flex-wrap items-start justify-center gap-x-16 gap-y-8 px-4 pb-12 pt-10"
      >
        <Reveal
          v-for="(s, i) in statItems"
          :key="s.label"
          :delay="i * 90"
          class="relative min-w-[8rem] text-center"
        >
          <p class="font-display text-6xl leading-none sm:text-7xl">
            <StatCounter :to="s.value" :suffix="s.suffix" />
          </p>
          <p class="mt-2 font-subtitle text-sm font-bold uppercase tracking-wide">{{ s.label }}</p>
          <span
            v-if="i < statItems.length - 1"
            class="absolute -right-8 top-2 hidden h-12 w-px rotate-12 bg-ink/20 lg:block"
            aria-hidden="true"
          />
        </Reveal>
      </div>
    </section>

    <!-- Featured projects -->
    <section class="mx-auto max-w-6xl px-4 py-20 sm:py-28">
      <div class="mb-12 flex items-end justify-between gap-4">
        <SectionHeading :eyebrow="t('home.featuredProjectsEyebrow')" :title="t('home.featuredProjects')" />
        <Reveal :delay="120" class="hidden shrink-0 sm:block">
          <NuxtLink
            :to="localePath('/proyectos')"
            class="group inline-flex items-center gap-2 font-subtitle text-sm font-semibold uppercase tracking-wide text-ink hover:text-danger"
          >
            {{ t('actions.viewProjects') }}
            <span class="transition-transform group-hover:translate-x-1">→</span>
          </NuxtLink>
        </Reveal>
      </div>

      <div v-if="projects?.length" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Reveal v-for="(p, i) in projects" :key="p._id" :delay="(i % 3) * 110" variant="wipe">
          <ProjectCard :project="p" />
        </Reveal>
      </div>
      <p v-else class="font-subtitle text-ink/50">{{ t('projects.empty') }}</p>
    </section>

    <!-- Services: asymmetric bento, wide cells carry the dark blueprint texture -->
    <section class="bg-background">
      <div class="mx-auto max-w-6xl px-4 py-20 sm:py-28">
        <SectionHeading :title="t('home.ourServices')" class="mb-14 max-w-2xl" />
        <div v-if="services?.length" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Reveal
            v-for="(s, i) in services"
            :key="s._id"
            :delay="(i % 4) * 90"
            :class="isFeatureCell(i) ? 'lg:col-span-2' : ''"
          >
            <ServiceCard :service="s" :feature="isFeatureCell(i)" />
          </Reveal>
        </div>
      </div>
    </section>

    <!-- Clients marquee -->
    <section v-if="marqueeClients.length" class="overflow-hidden bg-surface py-16 sm:py-20">
      <SectionHeading :title="t('home.ourClients')" align="center" class="mx-auto mb-10 max-w-2xl px-4" />
      <div class="relative flex w-full overflow-hidden">
        <div
          class="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-surface to-transparent"
          aria-hidden="true"
        />
        <div
          class="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-surface to-transparent"
          aria-hidden="true"
        />
        <div class="flex w-max animate-marquee items-center gap-14 pr-14">
          <div v-for="(c, i) in marqueeClients" :key="c._id + '-' + i" class="flex h-16 items-center">
            <AppImage
              v-if="c.logo"
              :source="c.logo"
              :alt="c.name"
              :widths="[160, 320]"
              sizes="160px"
              img-class="max-h-12 w-auto opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0"
            />
            <span v-else class="whitespace-nowrap font-display text-2xl tracking-wide text-ink/40">
              {{ c.name }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA band -->
    <section class="cut-t relative overflow-hidden bg-ink text-white">
      <div class="pointer-events-none absolute inset-0 bg-grid text-white/[0.05]" aria-hidden="true" />
      <span
        class="text-stroke pointer-events-none absolute -bottom-6 left-0 hidden select-none whitespace-nowrap font-display text-[10rem] leading-none tracking-widest text-white/[0.15] lg:block"
        aria-hidden="true"
        >CONSTRUIMOS</span
      >
      <div
        class="relative mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-24 sm:flex-row sm:items-center sm:justify-between sm:py-28"
      >
        <div>
          <Reveal>
            <h2 class="max-w-2xl font-display text-5xl sm:text-6xl">
              {{ t('home.cta.title') }}
            </h2>
          </Reveal>
          <Reveal :delay="100">
            <p class="mt-4 max-w-xl font-subtitle text-lg text-white/70">{{ t('home.cta.text') }}</p>
          </Reveal>
        </div>
        <Reveal :delay="160" variant="right" class="shrink-0">
          <UiButton :to="contactLink('general')" arrow>{{ t('actions.requestQuote') }}</UiButton>
        </Reveal>
      </div>
    </section>
  </div>
</template>
