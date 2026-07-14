<script setup lang="ts">
import type { Project } from '~/types/content'
const props = defineProps<{ project: Project }>()
const loc = useLocalized()
const localePath = useLocalePath()
const to = computed(() => localePath(`/proyectos/${props.project.slug?.current}`))
</script>

<template>
  <NuxtLink
    :to="to"
    class="group relative block overflow-hidden bg-surface shadow-sm ring-1 ring-ink/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
  >
    <div class="relative aspect-[4/3] overflow-hidden bg-ink">
      <AppImage
        :source="project.coverImage"
        :alt="loc(project.title) || ''"
        img-class="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
      />
      <div
        class="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/5 to-transparent opacity-80"
      />
      <div class="absolute left-3 top-3">
        <StatusBadge :status="project.status" />
      </div>
      <!-- yellow corner accent -->
      <div
        class="absolute bottom-0 right-0 h-0 w-0 border-b-[36px] border-l-[36px] border-b-accent border-l-transparent transition-all duration-300 group-hover:border-b-[52px] group-hover:border-l-[52px]"
      />
    </div>

    <div class="p-5">
      <h3 class="font-display text-2xl leading-tight tracking-wide text-ink">
        {{ loc(project.title) }}
      </h3>
      <p
        v-if="project.location"
        class="mt-1.5 flex items-center gap-1.5 font-subtitle text-sm text-ink/60"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M12 21s-7-6.5-7-11a7 7 0 0 1 14 0c0 4.5-7 11-7 11z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
        {{ project.location }}
      </p>
    </div>
  </NuxtLink>
</template>
