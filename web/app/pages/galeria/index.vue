<script setup lang="ts">
import type { GalleryImage } from '~/types/content'
import { GALLERY_QUERY } from '~/utils/queries'

const { t } = useI18n()
const { data: gallery } = useSanityQuery<GalleryImage[]>(GALLERY_QUERY)
const figures = computed(() => (gallery.value ?? []).map((g) => g.image).filter(Boolean))

useSeoMeta({ title: () => t('nav.gallery'), description: () => t('meta.homeDescription') })
</script>

<template>
  <div>
    <PageHeader :title="t('nav.gallery')" />
    <section class="mx-auto max-w-6xl px-4 py-16">
      <ImageGallery v-if="figures.length" :images="figures" />
      <p v-else class="py-16 text-center font-subtitle text-ink/50">{{ t('projects.empty') }}</p>
    </section>
  </div>
</template>
