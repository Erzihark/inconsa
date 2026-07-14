<script setup lang="ts">
withDefaults(defineProps<{ title?: string; eyebrow?: string; subtitle?: string; watermark?: string }>(), {})
</script>

<template>
  <section class="cut-b relative overflow-hidden bg-ink text-white">
    <div class="pointer-events-none absolute inset-0 bg-grid text-white/[0.06]" aria-hidden="true" />
    <div
      class="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rotate-45 bg-accent/10"
      aria-hidden="true"
    />
    <!-- outlined ghost word (defaults to the title) -->
    <span
      v-if="watermark || title"
      class="text-stroke pointer-events-none absolute -bottom-4 right-0 hidden max-w-full select-none overflow-hidden whitespace-nowrap font-display text-9xl leading-none tracking-widest text-white/[0.14] md:block"
      aria-hidden="true"
      >{{ watermark || title }}</span
    >
    <div class="relative mx-auto max-w-6xl px-4 pb-20 pt-32 sm:pb-24 sm:pt-40">
      <p
        v-if="eyebrow"
        class="rise mb-3 flex items-center gap-3 font-subtitle text-sm font-semibold uppercase tracking-[0.25em] text-accent"
      >
        <span class="inline-block h-px w-10 bg-accent" aria-hidden="true" />
        {{ eyebrow }}
      </p>
      <h1
        class="rise font-display text-6xl leading-none tracking-wide sm:text-7xl"
        style="animation-delay: 80ms"
      >
        <slot>{{ title }}</slot>
      </h1>
      <p
        v-if="subtitle"
        class="rise mt-5 max-w-2xl font-subtitle text-lg text-white/70"
        style="animation-delay: 160ms"
      >
        {{ subtitle }}
      </p>
      <Reveal variant="none"><span class="grow-line mt-7 block h-1 w-24 bg-accent" /></Reveal>
    </div>
  </section>
</template>
