<script setup lang="ts">
import type { Project, Service, ClientDoc } from '~/types/content'
import { HOME_PROJECTS_QUERY, HOME_STATS_QUERY, SERVICES_QUERY, CLIENTS_QUERY } from '~/utils/queries'

const { t } = useI18n()
const localePath = useLocalePath()
const loc = useLocalized()

const { data: projects } = useSanityQuery<Project[]>(HOME_PROJECTS_QUERY)
const { data: services } = useSanityQuery<Service[]>(SERVICES_QUERY)
const { data: clients } = useSanityQuery<ClientDoc[]>(CLIENTS_QUERY)
const { data: stats } = useSanityQuery<{ projects: number; completed: number; clients: number }>(
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

useSeoMeta({ title: () => t('meta.homeTitle'), description: () => t('meta.homeDescription') })
</script>

<template>
  <div>
    <HomeHero :image="heroImage" />

    <!-- Stats band -->
    <section v-if="statItems.length" class="bg-accent text-ink">
      <div
        class="mx-auto flex max-w-6xl flex-wrap items-start justify-center gap-x-16 gap-y-8 px-4 py-12"
      >
        <Reveal v-for="(s, i) in statItems" :key="s.label" :delay="i * 90" class="min-w-[8rem] text-center">
          <p class="font-display text-5xl leading-none sm:text-6xl">
            <StatCounter :to="s.value" :suffix="s.suffix" />
          </p>
          <p class="mt-2 font-subtitle text-sm font-semibold uppercase tracking-wide">{{ s.label }}</p>
        </Reveal>
      </div>
    </section>

    <!-- Featured projects -->
    <section class="mx-auto max-w-6xl px-4 py-20 sm:py-24">
      <div class="mb-10 flex items-end justify-between gap-4">
        <SectionHeading :eyebrow="t('home.featuredProjectsEyebrow')" :title="t('home.featuredProjects')" />
        <Reveal :delay="120" class="hidden shrink-0 sm:block">
          <NuxtLink
            :to="localePath('/proyectos')"
            class="group inline-flex items-center gap-2 font-subtitle text-sm font-semibold uppercase tracking-wide text-ink hover:text-danger"
          >
            {{ t('actions.viewAll') }}
            <span class="transition-transform group-hover:translate-x-1">→</span>
          </NuxtLink>
        </Reveal>
      </div>

      <div v-if="projects?.length" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Reveal v-for="(p, i) in projects" :key="p._id" :delay="(i % 3) * 100">
          <ProjectCard :project="p" />
        </Reveal>
      </div>
      <p v-else class="font-subtitle text-ink/50">{{ t('projects.empty') }}</p>
    </section>

    <!-- Services -->
    <section class="bg-white">
      <div class="mx-auto max-w-6xl px-4 py-20 sm:py-24">
        <SectionHeading
          :eyebrow="t('home.servicesEyebrow')"
          :title="t('home.ourServices')"
          align="center"
          class="mx-auto mb-12 max-w-2xl"
        />
        <div v-if="services?.length" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Reveal v-for="(s, i) in services" :key="s._id" :delay="(i % 4) * 90">
            <ServiceCard :service="s" />
          </Reveal>
        </div>
      </div>
    </section>

    <!-- Clients marquee -->
    <section v-if="marqueeClients.length" class="overflow-hidden bg-background py-16">
      <SectionHeading
        :eyebrow="t('home.clientsEyebrow')"
        :title="t('home.ourClients')"
        align="center"
        class="mx-auto mb-10 max-w-2xl px-4"
      />
      <div class="relative flex w-full overflow-hidden">
        <div class="flex w-max animate-marquee items-center gap-14 pr-14">
          <div
            v-for="(c, i) in marqueeClients"
            :key="c._id + '-' + i"
            class="flex h-16 items-center"
          >
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
    <section class="relative overflow-hidden bg-ink text-white">
      <div class="pointer-events-none absolute inset-0 bg-grid text-white/[0.05]" aria-hidden="true" />
      <div
        class="relative mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-16 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <Reveal>
            <h2 class="font-display text-4xl tracking-wide sm:text-5xl">{{ t('home.cta.title') }}</h2>
          </Reveal>
          <Reveal :delay="100">
            <p class="mt-3 max-w-xl font-subtitle text-white/70">{{ t('home.cta.text') }}</p>
          </Reveal>
        </div>
        <Reveal :delay="160" class="shrink-0">
          <UiButton :to="localePath('/contacto')">{{ t('actions.requestQuote') }}</UiButton>
        </Reveal>
      </div>
    </section>
  </div>
</template>
