<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <!-- Keyboard users land here first: jump past the fixed nav. -->
    <a
      href="#main"
      class="sr-only font-subtitle text-sm font-semibold uppercase tracking-widest focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-accent focus:px-5 focus:py-3 focus:text-ink"
    >
      {{ t('a11y.skipToContent') }}
    </a>
    <AppHeader />
    <main id="main" class="flex-1">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
