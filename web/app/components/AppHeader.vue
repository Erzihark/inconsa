<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()
const { data: settings } = useSiteSettings()
const route = useRoute()
const scrolled = useScrolled(24)

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

// The leasing section carries its own industrial accent — the header follows.
const isLeasing = computed(() => route.path.includes('/arrendamiento'))

const open = ref(false)
watch(
  () => route.fullPath,
  () => (open.value = false),
)
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-40 transition-all duration-300"
    :class="[
      scrolled || open
        ? isLeasing
          ? 'bg-steel/95 shadow-lg shadow-black/20 backdrop-blur'
          : 'bg-ink/95 shadow-lg shadow-ink/20 backdrop-blur'
        : 'bg-transparent',
    ]"
  >
    <!-- top accent hairline -->
    <span
      class="absolute inset-x-0 top-0 h-0.5 transition-colors duration-300"
      :class="isLeasing ? 'bg-machine' : 'bg-accent'"
      aria-hidden="true"
    />

    <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
      <NuxtLink :to="localePath('/')" class="group/logo flex items-center gap-2" aria-label="INCONSA">
        <AppImage
          v-if="settings?.logo"
          :source="settings.logo"
          alt="Grupo INCONSA"
          :widths="[120, 240]"
          sizes="140px"
          img-class="h-9 w-auto"
        />
        <span v-else class="font-display text-3xl leading-none tracking-widest text-white">
          INCONSA<span
            class="inline-block transition-colors"
            :class="isLeasing ? 'text-machine' : 'text-accent'"
            >.</span
          >
        </span>
      </NuxtLink>

      <!-- Desktop nav -->
      <nav class="hidden items-center gap-6 font-subtitle text-sm lg:flex">
        <NuxtLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="group/link relative py-1 text-white/75 hover:text-white"
          active-class="!text-white [&>span]:scale-x-100"
        >
          {{ item.label }}
          <span
            class="absolute inset-x-0 -bottom-0.5 h-0.5 origin-left scale-x-0 transition-transform duration-300 group-hover/link:scale-x-100"
            :class="isLeasing ? 'bg-machine' : 'bg-accent'"
          />
        </NuxtLink>
      </nav>

      <div class="flex items-center gap-3">
        <UiButton
          v-if="cvUrl"
          :href="cvUrl"
          :variant="isLeasing ? 'machine' : 'accent'"
          class="hidden !px-5 !py-2.5 sm:inline-flex"
        >
          {{ t('actions.downloadCv') }}
        </UiButton>
        <LocaleSwitcher class="text-white" />
        <button
          class="text-white lg:hidden"
          :aria-label="open ? 'Close menu' : 'Open menu'"
          :aria-expanded="open"
          @click="open = !open"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <template v-if="!open"><path d="M3 6h18M3 12h18M3 18h18" /></template>
            <template v-else><path d="M6 6l12 12M6 18L18 6" /></template>
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile nav: full-width dark panel with display-type links -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="-translate-y-3 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="-translate-y-3 opacity-0"
    >
      <nav
        v-if="open"
        class="border-t border-white/10 lg:hidden"
        :class="isLeasing ? 'bg-steel' : 'bg-ink'"
      >
        <NuxtLink
          v-for="(item, i) in nav"
          :key="item.to"
          :to="item.to"
          class="group/m flex items-center justify-between border-b border-white/5 px-5 py-4 font-display text-2xl tracking-wide text-white/85 hover:text-white"
          :style="{ transitionDelay: `${i * 30}ms` }"
        >
          {{ item.label }}
          <span
            class="opacity-0 transition group-hover/m:translate-x-1 group-hover/m:opacity-100"
            :class="isLeasing ? 'text-machine' : 'text-accent'"
            >→</span
          >
        </NuxtLink>
        <a
          v-if="cvUrl"
          :href="cvUrl"
          class="block px-5 py-4 font-subtitle text-sm font-bold uppercase tracking-widest"
          :class="isLeasing ? 'text-machine' : 'text-accent'"
        >
          {{ t('actions.downloadCv') }} ↓
        </a>
      </nav>
    </Transition>
  </header>
</template>
