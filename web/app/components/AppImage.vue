<script setup lang="ts">
import type { Figure, SanityImage } from '~/types/content'

const props = withDefaults(
  defineProps<{
    source?: Figure | SanityImage | null
    alt?: string
    sizes?: string
    widths?: number[]
    loading?: 'lazy' | 'eager'
    /** Set 'high' on the hero/LCP image so it outranks the JS bundle. */
    fetchpriority?: 'high' | 'low' | 'auto'
    imgClass?: string
  }>(),
  {
    sizes: '100vw',
    widths: () => [400, 800, 1200, 1600],
    loading: 'lazy',
    fetchpriority: 'auto',
  },
)

const img = useSanityImage()
const loc = useLocalized()
const hasImage = computed(() => !!props.source?.asset?._ref)

/**
 * Alt text, best available first: the editor's own description on the figure,
 * then whatever the caller derived (a title, a client name), then empty.
 *
 * `alt=""` passed explicitly is a decorative image (hero backgrounds sitting
 * inside `aria-hidden` wrappers) and short-circuits — announcing those would
 * just repeat the heading next to them.
 */
const resolvedAlt = computed(() => {
  if (props.alt === '') return ''
  return loc((props.source as Figure | null | undefined)?.alt) || props.alt || ''
})

const srcset = computed(() =>
  hasImage.value
    ? props.widths
        .map((w) => `${img(props.source!).width(w).auto('format').quality(75).url()} ${w}w`)
        .join(', ')
    : '',
)
const fallbackSrc = computed(() =>
  hasImage.value ? img(props.source!).width(1200).auto('format').quality(75).url() : '',
)
</script>

<template>
  <img
    v-if="hasImage"
    :src="fallbackSrc"
    :srcset="srcset"
    :sizes="sizes"
    :alt="resolvedAlt"
    :loading="loading"
    :fetchpriority="fetchpriority"
    :class="imgClass"
    decoding="async"
  />
  <div
    v-else
    :class="['flex items-center justify-center bg-ink/5 text-ink/25', imgClass]"
    aria-hidden="true"
  >
    <span class="font-display text-2xl tracking-widest">INCONSA</span>
  </div>
</template>
