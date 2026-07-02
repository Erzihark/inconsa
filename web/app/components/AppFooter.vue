<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const { data: settings } = useSiteSettings()
const year = new Date().getFullYear()

const socials = computed(() => {
  const s = settings.value?.social
  return [
    { key: 'facebook', url: s?.facebook },
    { key: 'instagram', url: s?.instagram },
    { key: 'linkedin', url: s?.linkedin },
  ].filter((x) => !!x.url)
})
</script>

<template>
  <footer class="mt-20 bg-ink text-white/80">
    <div class="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <span class="font-display text-3xl tracking-widest text-white">INCONSA</span>
        <p class="mt-3 font-subtitle text-sm leading-relaxed text-white/60">
          {{ t('home.heroSubtitle') }}
        </p>
      </div>

      <div>
        <h3 class="font-display text-xl tracking-wide text-white">{{ t('nav.contact') }}</h3>
        <ul class="mt-3 space-y-2 font-subtitle text-sm">
          <li v-if="settings?.contact?.address">{{ settings.contact.address }}</li>
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
        <h3 class="font-display text-xl tracking-wide text-white">{{ t('nav.services') }}</h3>
        <ul class="mt-3 space-y-2 font-subtitle text-sm">
          <li><NuxtLink :to="localePath('/proyectos')" class="hover:text-accent">{{ t('nav.projects') }}</NuxtLink></li>
          <li><NuxtLink :to="localePath('/servicios')" class="hover:text-accent">{{ t('nav.services') }}</NuxtLink></li>
          <li><NuxtLink :to="localePath('/galeria')" class="hover:text-accent">{{ t('nav.gallery') }}</NuxtLink></li>
          <li><NuxtLink :to="localePath('/arrendamiento')" class="hover:text-accent">{{ t('nav.leasing') }}</NuxtLink></li>
        </ul>
      </div>

      <div>
        <h3 class="font-display text-xl tracking-wide text-white">{{ t('nav.about') }}</h3>
        <ul class="mt-3 space-y-2 font-subtitle text-sm">
          <li><NuxtLink :to="localePath('/politica-de-calidad')" class="hover:text-accent">{{ t('footer.quality') }}</NuxtLink></li>
          <li><NuxtLink :to="localePath('/politica-de-privacidad')" class="hover:text-accent">{{ t('footer.privacy') }}</NuxtLink></li>
          <li><NuxtLink :to="localePath('/mensaje-del-fundador')" class="hover:text-accent">{{ t('footer.founder') }}</NuxtLink></li>
        </ul>
        <div v-if="socials.length" class="mt-4 flex gap-3">
          <a
            v-for="s in socials"
            :key="s.key"
            :href="s.url"
            target="_blank"
            rel="noopener"
            :aria-label="s.key"
            class="text-white/70 hover:text-accent"
          >
            <span class="font-subtitle text-sm capitalize">{{ s.key }}</span>
          </a>
        </div>
      </div>
    </div>

    <div class="border-t border-white/10">
      <p class="mx-auto max-w-6xl px-4 py-5 font-subtitle text-xs text-white/50">
        © {{ year }} {{ settings?.companyName || 'Grupo INCONSA' }}. {{ t('footer.rights') }}
      </p>
    </div>
  </footer>
</template>
