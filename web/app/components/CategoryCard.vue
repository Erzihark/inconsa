<script setup lang="ts">
import type { MachineCategory } from '~/types/content'
const props = defineProps<{ category: MachineCategory & { machineCount?: number } }>()
const loc = useLocalized()
const { t } = useI18n()
const localePath = useLocalePath()
const to = computed(() => localePath(`/arrendamiento/${props.category.slug?.current}`))
</script>

<template>
  <NuxtLink
    :to="to"
    class="group relative flex flex-col overflow-hidden bg-steel-2 ring-1 ring-white/5 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/40 hover:ring-machine/60"
  >
    <!-- corner brackets (spec-sheet look) -->
    <span
      class="pointer-events-none absolute left-3 top-3 z-10 h-5 w-5 border-l-2 border-t-2 border-machine opacity-0 transition-all duration-300 group-hover:opacity-100"
      aria-hidden="true"
    />
    <span
      class="pointer-events-none absolute bottom-3 right-3 z-10 h-5 w-5 border-b-2 border-r-2 border-machine opacity-0 transition-all duration-300 group-hover:opacity-100"
      aria-hidden="true"
    />

    <div class="relative aspect-[16/10] overflow-hidden bg-steel-3">
      <AppImage
        :source="category.image"
        :alt="loc(category.name) || ''"
        sizes="(min-width: 768px) 33vw, 100vw"
        img-class="h-full w-full object-cover opacity-90 transition-transform duration-[900ms] ease-out group-hover:scale-110"
      />
      <div
        class="pointer-events-none absolute inset-0 bg-gradient-to-t from-steel-2 via-transparent to-transparent"
        aria-hidden="true"
      />
      <span class="absolute left-0 top-0 h-1 w-16 bg-machine transition-all duration-500 group-hover:w-28" />
    </div>
    <div class="flex flex-1 flex-col p-6">
      <h3 class="font-display text-3xl leading-none text-white">{{ loc(category.name) }}</h3>
      <p v-if="loc(category.description)" class="mt-2.5 font-subtitle text-sm leading-relaxed text-white/55">
        {{ loc(category.description) }}
      </p>
      <span
        class="mt-5 inline-flex items-center gap-2 font-subtitle text-xs font-bold uppercase tracking-[0.2em] text-machine"
      >
        <span class="inline-block h-px w-6 bg-machine transition-all duration-300 group-hover:w-10" aria-hidden="true" />
        {{ t('leasing.viewMachines') }}
        <span class="transition-transform duration-300 group-hover:translate-x-1">→</span>
      </span>
    </div>
  </NuxtLink>
</template>
