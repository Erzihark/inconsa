<script setup lang="ts">
import type { ProjectStatus } from '~/types/content'
const props = defineProps<{ status: ProjectStatus }>()
const { t } = useI18n()
const isDone = computed(() => props.status === 'completed')
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 px-2.5 py-1 font-subtitle text-xs font-semibold uppercase tracking-wide shadow-sm"
    :class="isDone ? 'bg-ink text-white' : 'bg-accent text-ink'"
  >
    <span
      v-if="!isDone"
      class="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-ink"
      aria-hidden="true"
    />
    <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true">
      <path d="M5 13l4 4L19 7" />
    </svg>
    {{ isDone ? t('projects.statusCompleted') : t('projects.statusInProgress') }}
  </span>
</template>
