<script setup lang="ts">
// Scroll-reveal wrapper (fade + rise). Respects prefers-reduced-motion via @vueuse/motion.
const props = withDefaults(
  defineProps<{ delay?: number; y?: number; as?: string; duration?: number }>(),
  { delay: 0, y: 28, as: 'div', duration: 600 },
)
</script>

<template>
  <component
    :is="props.as"
    v-motion
    :initial="{ opacity: 0, y: props.y }"
    :visible-once="{
      opacity: 1,
      y: 0,
      transition: { duration: props.duration, delay: props.delay, ease: 'easeOut' },
    }"
  >
    <slot />
  </component>
</template>
