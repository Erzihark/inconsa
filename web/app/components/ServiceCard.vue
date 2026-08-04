<script setup lang="ts">
import type { Service } from '~/types/content'
const props = withDefaults(defineProps<{ service: Service; feature?: boolean }>(), {
  feature: false,
})
const loc = useLocalized()

// A simple line-icon per service group.
const iconPaths: Record<string, string> = {
  infrastructure: 'M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6',
  urbanization: 'M4 21V9l6-4 6 4v12M4 21h16M9 13h2m-2 4h2m4-4h2m-2 4h2',
  projects: 'M9 3v18M3 9h18M4 4l4 4m8-4-4 4',
  equipment: 'M3 17h9l3-4h6v4M6 17a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm11 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM3 17V8h6l3 5',
}
const icon = computed(() => iconPaths[props.service.group] || iconPaths.projects)
</script>

<template>
  <div
    class="group relative flex h-full flex-col overflow-hidden p-7 shadow-sm ring-1 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-ink/30 sm:p-8"
    :class="feature ? 'bg-ink text-white ring-white/10' : 'bg-surface ring-ink/5 hover:bg-ink'"
  >
    <!-- Feature cells carry a blueprint texture so the grid is not four flat boxes. -->
    <div
      v-if="feature"
      class="pointer-events-none absolute inset-0 bg-grid text-white/[0.06]"
      aria-hidden="true"
    />
    <!-- top accent bar grows on hover -->
    <span
      class="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100"
    />
    <div
      class="relative mb-5 flex h-14 w-14 items-center justify-center transition-colors duration-500"
      :class="
        feature
          ? 'bg-accent text-ink'
          : 'bg-ink text-accent group-hover:bg-accent group-hover:text-ink'
      "
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
        <path :d="icon" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </div>
    <h3
      class="relative font-display tracking-[0.01em] transition-colors duration-500"
      :class="feature ? 'text-3xl text-white sm:text-4xl' : 'text-2xl text-ink group-hover:text-white'"
    >
      {{ loc(service.title) }}
    </h3>
    <p
      v-if="loc(service.description)"
      class="relative mt-2 max-w-[55ch] font-subtitle text-sm leading-relaxed transition-colors duration-500"
      :class="feature ? 'text-white/70' : 'text-ink/70 group-hover:text-white/70'"
    >
      {{ loc(service.description) }}
    </p>
  </div>
</template>
