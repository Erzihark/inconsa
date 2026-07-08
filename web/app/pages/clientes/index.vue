<script setup lang="ts">
import type { ClientDoc } from '~/types/content'
import { CLIENTS_QUERY } from '~/utils/queries'

const { t } = useI18n()
const loc = useLocalized()
const { data: clients } = useSanityQuery<ClientDoc[]>(CLIENTS_QUERY)

useSeoMeta({ title: () => t('nav.clients'), description: () => t('meta.homeDescription') })
</script>

<template>
  <div>
    <PageHeader :eyebrow="t('home.clientsEyebrow')" :title="t('nav.clients')" />
    <section class="mx-auto max-w-6xl px-4 py-16">
      <div v-if="clients?.length" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Reveal
          v-for="(c, i) in clients"
          :key="c._id"
          :delay="(i % 3) * 90"
          class="flex h-full flex-col bg-surface p-6 shadow-sm ring-1 ring-ink/5"
        >
          <div class="mb-4 flex h-16 items-center">
            <AppImage
              v-if="c.logo"
              :source="c.logo"
              :alt="c.name"
              :widths="[160, 320]"
              sizes="160px"
              img-class="max-h-14 w-auto"
            />
            <span v-else class="font-display text-2xl tracking-wide text-ink">{{ c.name }}</span>
          </div>
          <h3 v-if="c.logo" class="font-display text-xl tracking-wide text-ink">{{ c.name }}</h3>
          <p v-if="loc(c.description)" class="mt-2 font-subtitle text-sm leading-relaxed text-ink/70">
            {{ loc(c.description) }}
          </p>
          <a
            v-if="c.website"
            :href="c.website"
            target="_blank"
            rel="noopener"
            class="mt-auto pt-3 font-subtitle text-sm font-semibold text-danger hover:underline"
          >
            {{ c.website.replace(/^https?:\/\//, '') }}
          </a>
        </Reveal>
      </div>
      <p v-else class="py-16 text-center font-subtitle text-ink/50">{{ t('projects.empty') }}</p>
    </section>
  </div>
</template>
