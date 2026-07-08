<script setup lang="ts">
// Scroll-reveal wrapper. The hidden→visible styling lives in CSS (gated on
// `scripting: enabled`), so SSR and client markup match exactly (no hydration
// mismatch) and no-JS visitors still see content. We only toggle `.in-view`.
const props = withDefaults(defineProps<{ delay?: number; as?: string }>(), {
  delay: 0,
  as: 'div',
})

const el = ref<HTMLElement | null>(null)
let io: IntersectionObserver | null = null

onMounted(() => {
  const node = el.value
  if (!node) return
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    node.classList.add('in-view')
    return
  }
  io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          node.classList.add('in-view')
          io?.disconnect()
        }
      }
    },
    { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
  )
  io.observe(node)
})

onBeforeUnmount(() => io?.disconnect())
</script>

<template>
  <component
    :is="props.as"
    ref="el"
    class="reveal"
    :style="props.delay ? { transitionDelay: `${props.delay}ms` } : undefined"
  >
    <slot />
  </component>
</template>
