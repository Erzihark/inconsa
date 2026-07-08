import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'https://www.inconsa.mx'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-01',
  devtools: { enabled: true },

  modules: ['@nuxtjs/i18n', '@nuxtjs/sanity', '@nuxt/fonts', '@nuxtjs/seo'],

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  runtimeConfig: {
    // Server-only (contact form email) — set via NUXT_* env vars.
    resendApiKey: '',
    contactToEmail: 'contacto@inconsa.mx',
    public: {
      siteUrl,
    },
  },

  // Public site metadata (drives sitemap, robots, canonical, hreflang, og).
  site: {
    url: siteUrl,
    name: 'Grupo INCONSA',
    defaultLocale: 'es',
  },

  // Dynamic OG-image generation needs a native renderer; static og:image via
  // useSeoMeta is enough for now. Revisit in Phase 5 if we want generated images.
  ogImage: { enabled: false },

  sanity: {
    projectId: process.env.NUXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder',
    dataset: process.env.NUXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-10-01',
    useCdn: true,
  },

  i18n: {
    strategy: 'prefix_except_default',
    defaultLocale: 'es',
    locales: [
      { code: 'es', language: 'es-MX', name: 'Español', file: 'es.json' },
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
    ],
    langDir: 'locales',
    baseUrl: siteUrl,
    // Canonical, prefix-based URLs are best for SEO; skip auto browser redirects.
    detectBrowserLanguage: false,
  },

  fonts: {
    families: [
      { name: 'Bebas Neue', provider: 'google', weights: [400] },
      { name: 'Roboto', provider: 'google', weights: [400, 500, 700] },
      { name: 'Montserrat', provider: 'google', weights: [400, 500, 600, 700] },
    ],
  },
})
