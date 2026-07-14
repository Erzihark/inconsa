<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()
const { data: settings } = useSiteSettings()

const nav = computed(() => [
  { to: localePath('/nosotros'), label: t('nav.about') },
  { to: localePath('/servicios'), label: t('nav.services') },
  { to: localePath('/proyectos'), label: t('nav.projects') },
  { to: localePath('/clientes'), label: t('nav.clients') },
  { to: localePath('/galeria'), label: t('nav.gallery') },
  { to: localePath('/arrendamiento'), label: t('nav.leasing') },
  { to: localePath('/contacto'), label: t('nav.contact') },
])

const cvUrl = computed(() => settings.value?.cv?.[locale.value] || settings.value?.cv?.es)

const open = ref(false)
const route = useRoute()
watch(() => route.fullPath, () => (open.value = false))
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-ink/10 bg-background/95 backdrop-blur">
    <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
      <NuxtLink :to="localePath('/')" class="flex items-center gap-2" aria-label="INCONSA">
        <AppImage
          v-if="settings?.logo"
          :source="settings.logo"
          alt="Grupo INCONSA"
          :widths="[120, 240]"
          sizes="140px"
          img-class="h-9 w-auto"
        />
        <span v-else class="font-display text-3xl leading-none tracking-widest text-ink">INCONSA</span>
      </NuxtLink>

      <!-- Desktop nav -->
      <nav class="hidden items-center gap-6 font-subtitle text-sm md:flex">
        <NuxtLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="text-ink/70 hover:text-ink"
          active-class="text-ink font-semibold"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="flex items-center gap-3">
        <UiButton v-if="cvUrl" :href="cvUrl" variant="dark" class="hidden sm:inline-flex">
          {{ t('actions.downloadCv') }}
        </UiButton>
        <LocaleSwitcher />
        <button
          class="md:hidden"
          :aria-label="open ? 'Close menu' : 'Open menu'"
          @click="open = !open"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <template v-if="!open"><path d="M3 6h18M3 12h18M3 18h18" /></template>
            <template v-else><path d="M6 6l12 12M6 18L18 6" /></template>
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile nav -->
    <nav v-if="open" class="border-t border-ink/10 bg-background md:hidden">
      <NuxtLink
        v-for="item in nav"
        :key="item.to"
        :to="item.to"
        class="block px-4 py-3 font-subtitle text-ink/80 hover:bg-ink/5"
      >
        {{ item.label }}
      </NuxtLink>
      <a
        v-if="cvUrl"
        :href="cvUrl"
        class="block px-4 py-3 font-subtitle font-semibold text-danger"
      >
        {{ t('actions.downloadCv') }}
      </a>
    </nav>
  </header>
</template>
