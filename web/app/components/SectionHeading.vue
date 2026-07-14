<script setup lang="ts">
withDefaults(
  defineProps<{ eyebrow?: string; title?: string; align?: 'left' | 'center'; light?: boolean }>(),
  { align: 'left', light: false },
)
</script>

<template>
  <div :class="align === 'center' ? 'text-center' : 'text-left'">
    <Reveal>
      <p
        v-if="eyebrow"
        class="mb-2 font-subtitle text-sm font-semibold uppercase tracking-[0.2em]"
        :class="light ? 'text-accent' : 'text-danger'"
      >
        <span class="mr-2 inline-block h-2 w-2 -translate-y-0.5 bg-accent" />{{ eyebrow }}
      </p>
    </Reveal>
    <Reveal :delay="80">
      <h2
        class="font-display text-4xl leading-none tracking-wide sm:text-5xl"
        :class="light ? 'text-white' : 'text-ink'"
      >
        <slot>{{ title }}</slot>
      </h2>
    </Reveal>
  </div>
</template>
