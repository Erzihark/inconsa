<script setup lang="ts">
const props = withDefaults(defineProps<{ to: number; suffix?: string; duration?: number }>(), {
  suffix: '',
  duration: 1600,
})
// Initialise to the target so SSR / no-JS / reduced-motion show the real number;
// on mount we reset to 0 and count up when scrolled into view.
const display = ref(props.to)
const el = ref<HTMLElement | null>(null)
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

onMounted(() => {
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  if (reduce) return
  display.value = 0
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return
        const start = performance.now()
        const step = (now: number) => {
          const p = Math.min(1, (now - start) / props.duration)
          display.value = Math.round(easeOut(p) * props.to)
          if (p < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
        io.disconnect()
      })
    },
    { threshold: 0.4 },
  )
  if (el.value) io.observe(el.value)
})
</script>

<template>
  <span ref="el"><span>{{ display }}</span>{{ suffix }}</span>
</template>
