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
        <h2 class="mb-6 font-display text-3xl text-ink">{{ t('contact.formTitle') }}</h2>
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
            <!-- Status is announced to screen readers, not just shown. -->
            <p
              role="status"
              aria-live="polite"
              class="font-subtitle text-sm font-semibold"
              :class="state === 'error' ? 'text-danger' : 'text-ink'"
            >
              <template v-if="state === 'success'">{{ t('contact.success') }}</template>
              <template v-else-if="state === 'error'">{{ t('contact.error') }}</template>
            </p>
          </div>
        </form>
      </div>

      <!-- Info -->
      <aside class="lg:col-span-2">
        <div class="bg-ink p-8 text-white">
          <h2 class="mb-6 font-display text-2xl tracking-wide">{{ t('contact.infoTitle') }}</h2>
          <!-- Labelled rows read better than a glyph-bulleted list. -->
          <dl class="space-y-5 font-subtitle text-sm">
            <div v-if="contact?.address">
              <dt class="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                {{ t('contact.address') }}
              </dt>
              <dd class="mt-1 text-white/85">{{ contact.address }}</dd>
            </div>
            <div v-if="contact?.phone">
              <dt class="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                {{ t('contact.phone') }}
              </dt>
              <dd class="mt-1">
                <a :href="`tel:${contact.phone}`" class="text-white/85 hover:text-accent">{{ contact.phone }}</a>
              </dd>
            </div>
            <div v-if="contact?.emailContact || contact?.emailQuotes">
              <dt class="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                {{ t('contact.email') }}
              </dt>
              <dd v-if="contact?.emailContact" class="mt-1">
                <a :href="`mailto:${contact.emailContact}`" class="text-white/85 hover:text-accent">
                  {{ contact.emailContact }}
                </a>
              </dd>
              <dd v-if="contact?.emailQuotes" class="mt-1">
                <a :href="`mailto:${contact.emailQuotes}`" class="text-white/85 hover:text-accent">
                  {{ contact.emailQuotes }}
                </a>
              </dd>
            </div>
          </dl>
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
