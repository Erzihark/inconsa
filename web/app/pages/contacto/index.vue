<script setup lang="ts">
const { t } = useI18n()
const { data: settings } = useSiteSettings()

const form = reactive({ name: '', email: '', message: '', company: '' })
const state = ref<'idle' | 'sending' | 'success' | 'error'>('idle')

async function submit() {
  if (state.value === 'sending') return
  state.value = 'sending'
  try {
    await $fetch('/api/contact', { method: 'POST', body: { ...form } })
    state.value = 'success'
    form.name = form.email = form.message = ''
  } catch {
    state.value = 'error'
  }
}

const contact = computed(() => settings.value?.contact)

useSeoMeta({ title: () => t('contact.title'), description: () => t('contact.subtitle') })
</script>

<template>
  <div>
    <PageHeader :eyebrow="t('contact.subtitle')" :title="t('contact.title')" />

    <section class="mx-auto grid max-w-6xl gap-12 px-4 py-16 lg:grid-cols-5">
      <!-- Form -->
      <div class="lg:col-span-3">
        <h2 class="mb-6 font-display text-3xl tracking-wide text-ink">{{ t('contact.formTitle') }}</h2>
        <form class="space-y-5" @submit.prevent="submit">
          <div class="grid gap-5 sm:grid-cols-2">
            <label class="block">
              <span class="mb-1.5 block font-subtitle text-sm font-semibold text-ink">{{ t('contact.name') }}</span>
              <input
                v-model="form.name"
                type="text"
                required
                class="w-full border border-ink/15 bg-white px-4 py-3 font-subtitle text-ink outline-none focus:border-ink"
              />
            </label>
            <label class="block">
              <span class="mb-1.5 block font-subtitle text-sm font-semibold text-ink">{{ t('contact.email') }}</span>
              <input
                v-model="form.email"
                type="email"
                required
                class="w-full border border-ink/15 bg-white px-4 py-3 font-subtitle text-ink outline-none focus:border-ink"
              />
            </label>
          </div>
          <label class="block">
            <span class="mb-1.5 block font-subtitle text-sm font-semibold text-ink">{{ t('contact.message') }}</span>
            <textarea
              v-model="form.message"
              rows="6"
              required
              class="w-full border border-ink/15 bg-white px-4 py-3 font-subtitle text-ink outline-none focus:border-ink"
            />
          </label>
          <!-- honeypot -->
          <input v-model="form.company" type="text" tabindex="-1" autocomplete="off" class="hidden" aria-hidden="true" />

          <div class="flex items-center gap-4">
            <UiButton type="submit" :disabled="state === 'sending'">
              {{ state === 'sending' ? t('contact.sending') : t('actions.send') }}
            </UiButton>
            <p v-if="state === 'success'" class="font-subtitle text-sm font-semibold text-ink">
              {{ t('contact.success') }}
            </p>
            <p v-else-if="state === 'error'" class="font-subtitle text-sm font-semibold text-danger">
              {{ t('contact.error') }}
            </p>
          </div>
        </form>
      </div>

      <!-- Info -->
      <aside class="lg:col-span-2">
        <div class="bg-ink p-8 text-white">
          <h2 class="mb-6 font-display text-2xl tracking-wide">{{ t('contact.infoTitle') }}</h2>
          <ul class="space-y-4 font-subtitle text-sm">
            <li v-if="contact?.address" class="flex gap-3">
              <span class="text-accent">▹</span><span>{{ contact.address }}</span>
            </li>
            <li v-if="contact?.phone" class="flex gap-3">
              <span class="text-accent">▹</span>
              <a :href="`tel:${contact.phone}`" class="hover:text-accent">{{ contact.phone }}</a>
            </li>
            <li v-if="contact?.emailContact" class="flex gap-3">
              <span class="text-accent">▹</span>
              <a :href="`mailto:${contact.emailContact}`" class="hover:text-accent">{{ contact.emailContact }}</a>
            </li>
            <li v-if="contact?.emailQuotes" class="flex gap-3">
              <span class="text-accent">▹</span>
              <a :href="`mailto:${contact.emailQuotes}`" class="hover:text-accent">{{ contact.emailQuotes }}</a>
            </li>
          </ul>
          <a
            v-if="contact?.mapUrl"
            :href="contact.mapUrl"
            target="_blank"
            rel="noopener"
            class="mt-6 inline-block font-subtitle text-sm font-semibold text-accent hover:underline"
          >
            Google Maps →
          </a>
        </div>
      </aside>
    </section>
  </div>
</template>
