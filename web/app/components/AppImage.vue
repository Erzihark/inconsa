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
const hasImage = computed(() => !!props.source?.asset?._ref)

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
    :alt="alt || ''"
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
