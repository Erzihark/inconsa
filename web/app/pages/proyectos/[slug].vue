<script setup lang="ts">
import type { Project } from '~/types/content'
import { PROJECT_BY_SLUG_QUERY } from '~/utils/queries'

const route = useRoute()
const { t, locale } = useI18n()
const loc = useLocalized()
const localePath = useLocalePath()

const { data: project } = await useSanityQuery<Project | null>(PROJECT_BY_SLUG_QUERY, {
  slug: route.params.slug as string,
})

if (!project.value) {
  throw createError({ statusCode: 404, statusMessage: 'Project not found', fatal: true })
}

const clientName = computed(() => {
  const c = project.value?.client
  return c && typeof c === 'object' ? c.name : typeof c === 'string' ? c : null
})

const formattedDate = computed(() => {
  if (!project.value?.date) return null
  const d = new Date(project.value.date)
  if (Number.isNaN(d.getTime())) return project.value.date
  return d.toLocaleDateString(locale.value === 'en' ? 'en-US' : 'es-MX', {
    year: 'numeric',
    month: 'long',
  })
})

const description = computed(() => loc(project.value?.description))

useSeoMeta({
  title: () => loc(project.value?.title) || t('projects.title'),
  description: () =>
    loc(project.value?.seo?.metaDescription) ||
    `${loc(project.value?.title)} — ${project.value?.location || 'Grupo INCONSA'}`,
})
</script>

<template>
  <div v-if="project">
    <!-- Hero cover -->
    <section class="relative overflow-hidden bg-ink text-white">
      <AppImage
        v-if="project.coverImage"
        :source="project.coverImage"
        :alt="loc(project.title) || ''"
        loading="eager"
        :widths="[768, 1280, 1920]"
        sizes="100vw"
        img-class="absolute inset-0 h-full w-full object-cover opacity-40"
      />
      <div
        class="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30"
        aria-hidden="true"
      />
      <div class="relative mx-auto max-w-6xl px-4 pb-14 pt-20 sm:pt-28">
        <NuxtLink
          :to="localePath('/proyectos')"
          class="mb-6 inline-flex items-center gap-2 font-subtitle text-sm text-white/70 hover:text-accent"
        >
          <span>←</span> {{ t('actions.backToProjects') }}
        </NuxtLink>
        <div class="mb-4"><StatusBadge :status="project.status" /></div>
        <h1 class="max-w-4xl font-display text-5xl leading-none tracking-wide sm:text-6xl">
          {{ loc(project.title) }}
        </h1>
        <div class="mt-5 flex flex-wrap gap-x-8 gap-y-2 font-subtitle text-sm text-white/70">
          <span v-if="project.location" class="inline-flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-7-6.5-7-11a7 7 0 0 1 14 0c0 4.5-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>
            {{ project.location }}
          </span>
          <span v-if="clientName">{{ t('projects.client') }}: {{ clientName }}</span>
          <span v-if="formattedDate">{{ formattedDate }}</span>
        </div>
        <span class="mt-6 block h-1 w-20 bg-accent" />
      </div>
    </section>

    <!-- Description -->
    <section v-if="description?.length" class="mx-auto max-w-3xl px-4 py-16">
      <SectionHeading :title="t('projects.aboutProject')" class="mb-6" />
      <div class="rich">
        <SanityContent :blocks="description" />
      </div>
    </section>

    <!-- Gallery -->
    <section v-if="project.images?.length" class="mx-auto max-w-6xl px-4 pb-20" :class="{ 'pt-4': description?.length }">
      <SectionHeading :title="t('projects.gallery')" class="mb-8" />
      <Reveal><ImageGallery :images="project.images" /></Reveal>
    </section>

    <!-- CTA -->
    <section class="bg-accent">
      <div class="mx-auto flex max-w-6xl flex-col items-start gap-5 px-4 py-12 sm:flex-row sm:items-center sm:justify-between">
        <h2 class="font-display text-3xl tracking-wide text-ink sm:text-4xl">{{ t('home.cta.title') }}</h2>
        <UiButton :to="localePath('/contacto')" variant="dark">{{ t('actions.requestQuote') }}</UiButton>
      </div>
    </section>
  </div>
</template>
