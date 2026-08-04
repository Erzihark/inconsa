<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const { data: settings } = useSiteSettings()
const year = new Date().getFullYear()

import { PhFacebookLogo, PhInstagramLogo, PhLinkedinLogo } from '@phosphor-icons/vue'

const socials = computed(() => {
  const s = settings.value?.social
  return [
    { key: 'facebook', label: 'Facebook', icon: PhFacebookLogo, url: s?.facebook },
    { key: 'instagram', label: 'Instagram', icon: PhInstagramLogo, url: s?.instagram },
    { key: 'linkedin', label: 'LinkedIn', icon: PhLinkedinLogo, url: s?.linkedin },
  ].filter((x) => !!x.url)
})

function backToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <footer class="relative mt-24 overflow-hidden bg-ink text-white/80">
    <!-- hazard accent seam -->
    <div class="bg-stripes h-2 w-full opacity-90" aria-hidden="true" />

    <!-- giant outlined wordmark -->
    <div class="pointer-events-none select-none overflow-hidden" aria-hidden="true">
      <p
        class="text-stroke -mb-4 whitespace-nowrap text-center font-display text-[clamp(4rem,14vw,12rem)] leading-none tracking-widest text-white/[0.12]"
      >
        GRUPO INCONSA
      </p>
    </div>

    <div class="relative mx-auto grid max-w-6xl gap-10 px-4 pb-14 pt-10 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <span class="font-display text-3xl tracking-widest text-white">INCONSA<span class="text-accent">.</span></span>
        <p class="mt-3 font-subtitle text-sm leading-relaxed text-white/60">
          {{ t('home.heroSubtitle') }}
        </p>
        <div v-if="socials.length" class="mt-5 flex gap-2">
          <a
            v-for="s in socials"
            :key="s.key"
            :href="s.url"
            target="_blank"
            rel="noopener"
            :aria-label="s.label"
            class="flex h-9 w-9 items-center justify-center bg-white/10 text-white/80 transition hover:-translate-y-0.5 hover:bg-accent hover:text-ink"
          >
            <component :is="s.icon" :size="18" weight="fill" aria-hidden="true" />
          </a>
        </div>
      </div>

      <div>
        <h3 class="flex items-center gap-2 font-display text-xl tracking-wide text-white">
          <span class="h-0.5 w-6 bg-accent" aria-hidden="true" />{{ t('nav.contact') }}
        </h3>
        <ul class="mt-4 space-y-2.5 font-subtitle text-sm">
          <li v-if="settings?.contact?.address" class="leading-relaxed">{{ settings.contact.address }}</li>
          <li v-if="settings?.contact?.phone">
            <a :href="`tel:${settings.contact.phone}`" class="hover:text-accent">{{ settings.contact.phone }}</a>
          </li>
          <li v-if="settings?.contact?.emailContact">
            <a :href="`mailto:${settings.contact.emailContact}`" class="hover:text-accent">
              {{ settings.contact.emailContact }}
            </a>
          </li>
          <li v-if="settings?.contact?.emailQuotes">
            <a :href="`mailto:${settings.contact.emailQuotes}`" class="hover:text-accent">
              {{ settings.contact.emailQuotes }}
            </a>
          </li>
        </ul>
      </div>

      <div>
        <h3 class="flex items-center gap-2 font-display text-xl tracking-wide text-white">
          <span class="h-0.5 w-6 bg-accent" aria-hidden="true" />{{ t('nav.services') }}
        </h3>
        <ul class="mt-4 space-y-2.5 font-subtitle text-sm">
          <li><NuxtLink :to="localePath('/proyectos')" class="hover:text-accent">{{ t('nav.projects') }}</NuxtLink></li>
          <li><NuxtLink :to="localePath('/servicios')" class="hover:text-accent">{{ t('nav.services') }}</NuxtLink></li>
          <li><NuxtLink :to="localePath('/galeria')" class="hover:text-accent">{{ t('nav.gallery') }}</NuxtLink></li>
          <li><NuxtLink :to="localePath('/arrendamiento')" class="hover:text-machine">{{ t('nav.leasing') }}</NuxtLink></li>
        </ul>
      </div>

      <div>
        <h3 class="flex items-center gap-2 font-display text-xl tracking-wide text-white">
          <span class="h-0.5 w-6 bg-accent" aria-hidden="true" />{{ t('nav.about') }}
        </h3>
        <ul class="mt-4 space-y-2.5 font-subtitle text-sm">
          <li><NuxtLink :to="localePath('/nosotros')" class="hover:text-accent">{{ t('nav.about') }}</NuxtLink></li>
          <li><NuxtLink :to="localePath('/politica-de-calidad')" class="hover:text-accent">{{ t('footer.quality') }}</NuxtLink></li>
          <li><NuxtLink :to="localePath('/politica-de-privacidad')" class="hover:text-accent">{{ t('footer.privacy') }}</NuxtLink></li>
          <li><NuxtLink :to="localePath('/mensaje-del-fundador')" class="hover:text-accent">{{ t('footer.founder') }}</NuxtLink></li>
        </ul>
      </div>
    </div>

    <div class="border-t border-white/10">
      <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5">
        <p class="font-subtitle text-xs text-white/50">
          © {{ year }} {{ settings?.companyName || 'Grupo INCONSA' }}. {{ t('footer.rights') }}
        </p>
        <button
          class="flex h-10 w-10 items-center justify-center bg-white/10 text-white transition hover:-translate-y-1 hover:bg-accent hover:text-ink"
          aria-label="Back to top"
          @click="backToTop"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 15l-6-6-6 6" />
          </svg>
        </button>
      </div>
    </div>
  </footer>
</template>
