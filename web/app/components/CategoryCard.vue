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
    class="group relative flex flex-col overflow-hidden bg-steel-2 ring-1 ring-white/5 transition-all duration-300 hover:-translate-y-1 hover:ring-machine/50"
  >
    <div class="relative aspect-[16/10] overflow-hidden bg-steel-3">
      <AppImage
        :source="category.image"
        :alt="loc(category.name) || ''"
        sizes="(min-width: 768px) 33vw, 100vw"
        img-class="h-full w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-110"
      />
      <span class="absolute left-0 top-0 h-1 w-16 bg-machine" />
    </div>
    <div class="flex flex-1 flex-col p-6">
      <h3 class="font-display text-2xl tracking-wide text-white">{{ loc(category.name) }}</h3>
      <p
        v-if="loc(category.description)"
        class="mt-2 font-subtitle text-sm leading-relaxed text-white/55"
      >
        {{ loc(category.description) }}
      </p>
      <span
        class="mt-5 inline-flex items-center gap-2 font-subtitle text-sm font-semibold uppercase tracking-wide text-machine"
      >
        {{ t('leasing.viewMachines') }}
        <span class="transition-transform group-hover:translate-x-1">→</span>
      </span>
    </div>
  </NuxtLink>
</template>
