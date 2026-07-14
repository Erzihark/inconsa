<script setup lang="ts">
const { t } = useI18n()
const loc = useLocalized()
const { data: settings } = useSiteSettings()
const content = computed(() => loc(settings.value?.privacyPolicy))

useSeoMeta({ title: () => t('footer.privacy'), description: () => t('footer.privacy') })
</script>

<template>
  <div>
    <PageHeader :title="t('footer.privacy')" />
    <section class="mx-auto max-w-3xl px-4 py-16">
      <div v-if="content?.length" class="rich"><SanityContent :blocks="content" /></div>
      <p v-else class="py-16 text-center font-subtitle text-ink/50">{{ t('projects.empty') }}</p>
    </section>
  </div>
</template>
