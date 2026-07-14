<script setup lang="ts">
import type { Project, ProjectStatus } from '~/types/content'
import { PROJECTS_QUERY } from '~/utils/queries'

const { t } = useI18n()
const { data: projects } = useSanityData<Project[]>('projects-all', PROJECTS_QUERY)

type FilterValue = 'all' | ProjectStatus
const filter = ref<FilterValue>('all')

const countOf = (s: ProjectStatus) => (projects.value ?? []).filter((p) => p.status === s).length

const filters = computed(() => [
  { value: 'all' as FilterValue, label: t('projects.filterAll'), count: projects.value?.length ?? 0 },
  { value: 'in-progress' as FilterValue, label: t('projects.filterInProgress'), count: countOf('in-progress') },
  { value: 'completed' as FilterValue, label: t('projects.filterCompleted'), count: countOf('completed') },
])

const filtered = computed(() => {
  const list = projects.value ?? []
  return filter.value === 'all' ? list : list.filter((p) => p.status === filter.value)
})

useSeoMeta({ title: () => t('projects.title'), description: () => t('projects.subtitle') })
</script>

<template>
  <div>
    <PageHeader :eyebrow="t('projects.subtitle')" :title="t('projects.title')" />

    <section class="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <!-- filter tabs -->
      <div class="mb-10 flex flex-wrap gap-2">
        <button
          v-for="opt in filters"
          :key="opt.value"
          type="button"
          class="inline-flex items-center gap-2 px-4 py-2 font-subtitle text-sm font-semibold uppercase tracking-wide transition-colors"
          :class="
            filter === opt.value
              ? 'bg-ink text-white'
              : 'bg-white text-ink/70 ring-1 ring-ink/10 hover:text-ink'
          "
          @click="filter = opt.value"
        >
          {{ opt.label }}
          <span
            class="rounded-full px-1.5 text-xs"
            :class="filter === opt.value ? 'bg-accent text-ink' : 'bg-ink/5 text-ink/50'"
          >
            {{ opt.count }}
          </span>
        </button>
      </div>

      <TransitionGroup
        v-if="filtered.length"
        tag="div"
        name="grid"
        class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <ProjectCard v-for="(p, i) in filtered" :key="p._id" :project="p" :index="i" />
      </TransitionGroup>
      <p v-else class="py-16 text-center font-subtitle text-ink/50">{{ t('projects.empty') }}</p>
    </section>
  </div>
</template>

<style scoped>
.grid-move,
.grid-enter-active,
.grid-leave-active {
  transition: all 0.4s ease;
}
.grid-enter-from,
.grid-leave-to {
  opacity: 0;
  transform: translateY(16px);
}
.grid-leave-active {
  position: absolute;
}
</style>
