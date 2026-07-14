<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    to?: string
    href?: string
    variant?: 'accent' | 'dark' | 'outline' | 'machine'
    type?: 'button' | 'submit'
  }>(),
  { variant: 'accent', type: 'button' },
)

const base =
  'inline-flex items-center justify-center gap-2 px-6 py-3 font-subtitle text-sm font-medium uppercase tracking-wide transition-colors disabled:opacity-60'
const variants: Record<string, string> = {
  accent: 'bg-accent text-ink hover:bg-accent/85',
  dark: 'bg-ink text-white hover:bg-ink-700',
  outline: 'border-2 border-ink text-ink hover:bg-ink hover:text-white',
  machine: 'bg-machine text-steel hover:bg-machine/85',
}
const cls = computed(() => `${base} ${variants[props.variant]}`)
</script>

<template>
  <NuxtLink v-if="to" :to="to" :class="cls"><slot /></NuxtLink>
  <a v-else-if="href" :href="href" :class="cls"><slot /></a>
  <button v-else :type="type" :class="cls"><slot /></button>
</template>
