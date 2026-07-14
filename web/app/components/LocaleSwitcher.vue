<script setup lang="ts">
const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()
</script>

<template>
  <div class="flex items-center gap-1 font-subtitle text-sm">
    <NuxtLink
      v-for="l in locales"
      :key="l.code"
      :to="switchLocalePath(l.code)"
      :class="[
        'px-1.5 py-0.5 uppercase',
        l.code === locale ? 'font-bold text-white' : 'text-white/50 hover:text-white',
      ]"
    >
      {{ l.code }}
    </NuxtLink>
  </div>
</template>
