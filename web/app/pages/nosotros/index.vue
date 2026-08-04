<script setup lang="ts">
const { t } = useI18n()
const loc = useLocalized()
const { data: settings } = useSiteSettings()

const about = computed(() => loc(settings.value?.about))
const founder = computed(() => loc(settings.value?.founderMessage))

useSeoMeta({ title: () => t('meta.aboutTitle'), description: () => t('meta.aboutDescription') })
</script>

<template>
  <div>
    <PageHeader :eyebrow="'Grupo INCONSA'" :title="t('nav.about')" />
    <section class="mx-auto max-w-3xl px-4 py-16">
      <div v-if="about?.length" class="rich"><SanityContent :value="about" /></div>

      <div v-if="founder?.length" class="mt-14 border-t border-ink/10 pt-10">
        <SectionHeading :title="t('footer.founder')" class="mb-6" />
        <div class="rich"><SanityContent :value="founder" /></div>
      </div>
    </section>
  </div>
</template>
