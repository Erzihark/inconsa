<script setup lang="ts">
import type { Machine } from '~/types/content'
defineProps<{ machine: Machine }>()
const loc = useLocalized()
const { t } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <div class="group flex flex-col overflow-hidden bg-steel-2 ring-1 ring-white/5">
    <div class="relative aspect-[4/3] overflow-hidden bg-steel-3">
      <AppImage
        :source="machine.images?.[0]"
        :alt="loc(machine.name) || ''"
        sizes="(min-width: 768px) 33vw, 100vw"
        img-class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <span
        v-if="machine.rental?.hourly || machine.rental?.perProject"
        class="absolute right-3 top-3 bg-machine px-2 py-1 font-subtitle text-xs font-semibold uppercase tracking-wide text-steel"
      >
        {{ t('leasing.available') }}
      </span>
    </div>

    <div class="flex flex-1 flex-col p-6">
      <h3 class="font-display text-2xl tracking-wide text-white">{{ loc(machine.name) }}</h3>
      <p v-if="loc(machine.description)" class="mt-1 font-subtitle text-sm text-white/55">
        {{ loc(machine.description) }}
      </p>

      <ul v-if="machine.specs?.length" class="mt-4 space-y-1 font-subtitle text-sm">
        <li
          v-for="(s, i) in machine.specs"
          :key="i"
          class="flex justify-between gap-3 border-b border-white/5 py-1.5"
        >
          <span class="text-white/45">{{ loc(s.label) }}</span>
          <span class="text-white/80">{{ s.value }}</span>
        </li>
      </ul>

      <div class="mt-4 flex flex-wrap gap-2">
        <span
          v-if="machine.rental?.hourly"
          class="bg-machine/15 px-2.5 py-1 font-subtitle text-xs font-semibold uppercase tracking-wide text-machine"
        >
          {{ t('leasing.byHour') }}
          <template v-if="machine.rental.hourlyRate">
            ${{ machine.rental.hourlyRate }} {{ t('leasing.perHour') }}</template
          >
        </span>
        <span
          v-if="machine.rental?.perProject"
          class="bg-white/10 px-2.5 py-1 font-subtitle text-xs font-semibold uppercase tracking-wide text-white/80"
        >
          {{ t('leasing.byProject') }}
        </span>
      </div>

      <UiButton :to="localePath('/contacto')" variant="machine" class="mt-6 w-full">
        {{ t('actions.requestQuote') }}
      </UiButton>
    </div>
  </div>
</template>
