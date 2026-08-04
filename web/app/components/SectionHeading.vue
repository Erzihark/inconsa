<script setup lang="ts">
withDefaults(
  defineProps<{ eyebrow?: string; title?: string; align?: 'left' | 'center'; light?: boolean }>(),
  { align: 'left', light: false },
)
</script>

<template>
  <div :class="align === 'center' ? 'text-center' : 'text-left'">
    <Reveal variant="none">
      <p
        v-if="eyebrow"
        class="reveal mb-3 flex items-center gap-3 font-subtitle text-sm font-semibold uppercase tracking-[0.2em]"
        :class="[light ? 'text-accent' : 'text-danger', align === 'center' ? 'justify-center' : '']"
      >
        <span class="grow-line inline-block h-0.5 w-10 bg-accent" aria-hidden="true" />
        {{ eyebrow }}
        <span
          v-if="align === 'center'"
          class="grow-line inline-block h-0.5 w-10 bg-accent"
          aria-hidden="true"
        />
      </p>
      <h2
        class="reveal font-display text-4xl leading-none sm:text-5xl"
        :class="light ? 'text-white' : 'text-ink'"
        style="transition-delay: 80ms"
      >
        <slot>{{ title }}</slot>
      </h2>
    </Reveal>
  </div>
</template>
