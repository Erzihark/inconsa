<script setup lang="ts">
import type { Service } from '~/types/content'
const props = defineProps<{ service: Service; index?: number }>()
const loc = useLocalized()

// A simple line-icon per service group.
const iconPaths: Record<string, string> = {
  infrastructure: 'M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6',
  urbanization: 'M4 21V9l6-4 6 4v12M4 21h16M9 13h2m-2 4h2m4-4h2m-2 4h2',
  projects: 'M9 3v18M3 9h18M4 4l4 4m8-4-4 4',
  equipment: 'M3 17h9l3-4h6v4M6 17a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm11 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM3 17V8h6l3 5',
}
const icon = computed(() => iconPaths[props.service.group] || iconPaths.projects)
const num = computed(() =>
  props.index !== undefined ? String(props.index + 1).padStart(2, '0') : null,
)
</script>

<template>
  <div
    class="group relative flex h-full flex-col overflow-hidden bg-surface p-7 shadow-sm ring-1 ring-ink/5 transition-all duration-500 hover:-translate-y-1.5 hover:bg-ink hover:shadow-2xl hover:shadow-ink/30"
  >
    <!-- top accent bar grows on hover -->
    <span
      class="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100"
    />
    <!-- ghost index number -->
    <span
      v-if="num"
      class="text-stroke pointer-events-none absolute -right-1 -top-2 select-none font-display text-7xl tracking-widest text-ink/50 transition-colors duration-500 group-hover:text-white/60"
      aria-hidden="true"
      >{{ num }}</span
    >
    <div
      class="mb-5 flex h-14 w-14 items-center justify-center bg-ink text-accent transition-colors duration-500 group-hover:bg-accent group-hover:text-ink"
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
        <path :d="icon" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </div>
    <h3 class="font-display text-2xl tracking-wide text-ink transition-colors duration-500 group-hover:text-white">
      {{ loc(service.title) }}
    </h3>
    <p
      v-if="loc(service.description)"
      class="mt-2 font-subtitle text-sm leading-relaxed text-ink/70 transition-colors duration-500 group-hover:text-white/70"
    >
      {{ loc(service.description) }}
    </p>
  </div>
</template>
