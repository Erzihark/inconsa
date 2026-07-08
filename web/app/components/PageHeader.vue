<script setup lang="ts">
withDefaults(defineProps<{ title?: string; eyebrow?: string; subtitle?: string }>(), {})
</script>

<template>
  <section class="relative overflow-hidden bg-ink text-white">
    <div class="pointer-events-none absolute inset-0 bg-grid text-white/[0.06]" aria-hidden="true" />
    <div
      class="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rotate-45 bg-accent/10"
      aria-hidden="true"
    />
    <div class="relative mx-auto max-w-6xl px-4 py-16 sm:py-20">
      <p
        v-if="eyebrow"
        class="rise mb-3 font-subtitle text-sm font-semibold uppercase tracking-[0.25em] text-accent"
      >
        {{ eyebrow }}
      </p>
      <h1
        class="rise font-display text-5xl leading-none tracking-wide sm:text-6xl"
        style="animation-delay: 80ms"
      >
        <slot>{{ title }}</slot>
      </h1>
      <p
        v-if="subtitle"
        class="rise mt-4 max-w-2xl font-subtitle text-lg text-white/70"
        style="animation-delay: 160ms"
      >
        {{ subtitle }}
      </p>
      <span class="mt-6 block h-1 w-20 bg-accent" />
    </div>
  </section>
</template>
