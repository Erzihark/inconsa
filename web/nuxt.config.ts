import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'https://www.inconsa.mx'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-01',
  devtools: { enabled: true },

  modules: ['@nuxtjs/i18n', '@nuxtjs/sanity', '@nuxt/fonts', '@nuxtjs/seo'],

  css: ['~/assets/css/main.css'],

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
  },

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
    description:
      'Constructora en Cancún especializada en obra civil, urbanización e infraestructura desde 2006.',
    defaultLocale: 'es',
  },

  // Dynamic OG-image generation needs a native renderer; we ship a static default
  // share image (public/og-default.jpg) via useSeoMeta instead.
  ogImage: { enabled: false },

  // Sitemap: static routes are auto-discovered; CMS detail routes come from the
  // server source below (projects + machine categories, expanded per locale).
  sitemap: {
    sources: ['/api/__sitemap__/urls'],
    // Home + key hubs get a higher default priority.
    defaults: { changefreq: 'weekly', priority: 0.7 },
  },

  robots: {
    // Public marketing site: allow everything, keep internal endpoints out.
    disallow: ['/api/'],
  },

  // 301 redirects from the old site's URLs + ISR caching for the CMS-driven pages.
  routeRules: {
    // Cached SSR (Incremental Static Regeneration) — CMS edits appear within ~10 min.
    '/**': { isr: 60 * 10 },
    '/api/**': { isr: false },
    // Old → new URL migration (preserve SEO equity).
    '/acerca': { redirect: { to: '/nosotros', statusCode: 301 } },
    '/mensaje-de-nuestro-fundador': {
      redirect: { to: '/mensaje-del-fundador', statusCode: 301 },
    },
    '/mensaje-de-nuestro-fundador/**': {
      redirect: { to: '/mensaje-del-fundador', statusCode: 301 },
    },
    '/poltica-de-privacidad': { redirect: { to: '/politica-de-privacidad', statusCode: 301 } },
    '/poltica-de-calidad': { redirect: { to: '/politica-de-calidad', statusCode: 301 } },
    // Old auto-generated project slugs (from the previous site's sitemap) no longer
    // exist → send to the listing. Exact paths: radix3 route rules don't match
    // partial-segment wildcards, so we list them.
    '/proyectos/project-one-f5w4d-rky6a': { redirect: { to: '/proyectos', statusCode: 301 } },
    '/proyectos/project-two-ky966-m6d28': { redirect: { to: '/proyectos', statusCode: 301 } },
    '/proyectos/project-three-sng7y-w3md4': { redirect: { to: '/proyectos', statusCode: 301 } },
    '/proyectos/project-six-6f87e-jtbxg': { redirect: { to: '/proyectos', statusCode: 301 } },
  },

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
