<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    to?: string
    href?: string
    variant?: 'accent' | 'dark' | 'outline' | 'machine'
    type?: 'button' | 'submit'
    arrow?: boolean
  }>(),
  { variant: 'accent', type: 'button', arrow: false },
)

// A darker layer wipes across on hover (before:) for a machined, deliberate feel.
const base =
  'group/btn relative inline-flex items-center justify-center gap-2 overflow-hidden px-7 py-3.5 font-subtitle text-sm font-semibold uppercase tracking-widest transition-colors duration-300 disabled:opacity-60 before:absolute before:inset-0 before:-translate-x-full before:transition-transform before:duration-300 before:ease-out hover:before:translate-x-0'
const variants: Record<string, string> = {
  accent: 'bg-accent text-ink before:bg-ink/10',
  dark: 'bg-ink text-white before:bg-white/10',
  outline: 'border-2 border-ink text-ink before:bg-ink hover:text-white',
  machine: 'bg-machine text-steel before:bg-steel/15',
}
const cls = computed(() => `${base} ${variants[props.variant]}`)
</script>

<template>
  <NuxtLink v-if="to" :to="to" :class="cls">
    <span class="relative z-10 inline-flex items-center gap-2">
      <slot />
      <span v-if="arrow" class="transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
    </span>
  </NuxtLink>
  <a v-else-if="href" :href="href" :class="cls">
    <span class="relative z-10 inline-flex items-center gap-2">
      <slot />
      <span v-if="arrow" class="transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
    </span>
  </a>
  <button v-else :type="type" :class="cls">
    <span class="relative z-10 inline-flex items-center gap-2">
      <slot />
      <span v-if="arrow" class="transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
    </span>
  </button>
</template>
