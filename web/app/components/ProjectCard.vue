<script setup lang="ts">
import type { Project } from '~/types/content'
const props = defineProps<{ project: Project }>()
const loc = useLocalized()
const { t } = useI18n()
const localePath = useLocalePath()
const to = computed(() => localePath(`/proyectos/${props.project.slug?.current}`))
</script>

<template>
  <NuxtLink
    :to="to"
    class="group relative block overflow-hidden bg-ink shadow-sm ring-1 ring-ink/5 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-ink/30"
  >
    <div class="relative aspect-[4/5] overflow-hidden sm:aspect-[3/4]">
      <AppImage
        :source="project.coverImage"
        :alt="loc(project.title) || ''"
        img-class="h-full w-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-110"
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
      />
      <!-- permanent legibility gradient, deepens on hover -->
      <div
        class="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100"
      />
      <div class="absolute left-4 top-4">
        <StatusBadge :status="project.status" />
      </div>
      <!-- caption block over the image -->
      <div class="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        <h3
          class="font-display text-3xl leading-none text-white transition-transform duration-500 group-hover:-translate-y-1"
        >
          {{ loc(project.title) }}
        </h3>
        <p
          v-if="project.location"
          class="mt-2 flex items-center gap-1.5 font-subtitle text-sm text-white/70"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M12 21s-7-6.5-7-11a7 7 0 0 1 14 0c0 4.5-7 11-7 11z" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
          {{ project.location }}
        </p>
        <!-- reveal-on-hover arrow line -->
        <p
          class="mt-3 flex items-center gap-2 font-subtitle text-xs font-bold uppercase tracking-[0.2em] text-accent opacity-0 transition-all duration-500 group-hover:translate-x-1 group-hover:opacity-100"
        >
          <span class="inline-block h-px w-6 bg-accent" aria-hidden="true" />
          {{ t('actions.viewProject') }} →
        </p>
      </div>

      <!-- yellow corner accent -->
      <div
        class="absolute bottom-0 right-0 h-0 w-0 border-b-[36px] border-l-[36px] border-b-accent border-l-transparent transition-all duration-300 group-hover:border-b-[56px] group-hover:border-l-[56px]"
      />
    </div>
  </NuxtLink>
</template>
