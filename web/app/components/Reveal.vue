<script setup lang="ts">
// Scroll-reveal wrapper. Hidden→visible styling lives in CSS (gated on
// `scripting: enabled`) so SSR and client markup match exactly; this component
// only toggles `.in-view` when the element scrolls into the viewport.
//
// Variants map to the CSS system in main.css:
//   up (default) | left | right | scale | wipe (image wipe panel) | none
// `none` renders no hidden state itself — useful when only nested .grow-line
// elements should animate on view.
const props = withDefaults(
  defineProps<{ delay?: number; as?: string; variant?: 'up' | 'left' | 'right' | 'scale' | 'wipe' | 'none' }>(),
  { delay: 0, as: 'div', variant: 'up' },
)

const variantClass = {
  up: 'reveal',
  left: 'reveal-left',
  right: 'reveal-right',
  scale: 'reveal-scale',
  wipe: 'img-wipe',
  none: '',
}[props.variant]

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
    :class="variantClass"
    :style="props.delay ? { transitionDelay: `${props.delay}ms` } : undefined"
  >
    <slot />
  </component>
</template>
