<script setup lang="ts">
import type { Figure } from '~/types/content'

const props = defineProps<{ images: Figure[] }>()
const loc = useLocalized()

const activeIndex = ref<number | null>(null)
const isOpen = computed(() => activeIndex.value !== null)

function open(i: number) {
  activeIndex.value = i
}
function close() {
  activeIndex.value = null
}
function prev() {
  if (activeIndex.value === null) return
  activeIndex.value = (activeIndex.value + props.images.length - 1) % props.images.length
}
function next() {
  if (activeIndex.value === null) return
  activeIndex.value = (activeIndex.value + 1) % props.images.length
}

function onKey(e: KeyboardEvent) {
  if (!isOpen.value) return
  if (e.key === 'Escape') close()
  else if (e.key === 'ArrowLeft') prev()
  else if (e.key === 'ArrowRight') next()
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))

const active = computed(() => (activeIndex.value !== null ? props.images[activeIndex.value] : null))
</script>

<template>
  <div>
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
      <Reveal
        v-for="(img, i) in images"
        :key="i"
        :delay="(i % 3) * 80"
        variant="scale"
      >
        <button
          type="button"
          class="group relative block aspect-square w-full overflow-hidden bg-ink/5 focus-visible:outline-2 focus-visible:outline-accent"
          @click="open(i)"
        >
          <AppImage
            :source="img"
            :alt="loc(img.alt) || ''"
            :widths="[300, 600]"
            sizes="(min-width: 640px) 33vw, 50vw"
            img-class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          <span
            class="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
          <!-- zoom hint + caption on hover -->
          <span
            class="absolute inset-x-0 bottom-0 flex translate-y-2 items-center justify-between p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
          >
            <span class="truncate text-left font-subtitle text-xs text-white/90">{{
              loc(img.caption) || loc(img.alt) || ''
            }}</span>
            <span class="ml-2 flex h-7 w-7 shrink-0 items-center justify-center bg-accent text-ink">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3M8 11h6m-3-3v6" /></svg>
            </span>
          </span>
          <span
            class="absolute left-0 top-0 h-0.5 w-0 bg-accent transition-all duration-500 group-hover:w-full"
            aria-hidden="true"
          />
        </button>
      </Reveal>
    </div>

    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="isOpen"
          class="fixed inset-0 z-[60] flex items-center justify-center bg-ink/95 p-4"
          role="dialog"
          aria-modal="true"
          @click.self="close"
        >
          <button
            class="absolute right-4 top-4 text-white/70 hover:text-white"
            aria-label="Close"
            @click="close"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M6 18L18 6" /></svg>
          </button>
          <button
            v-if="images.length > 1"
            class="absolute left-3 text-white/70 hover:text-white sm:left-8"
            aria-label="Previous"
            @click="prev"
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 6l-6 6 6 6" /></svg>
          </button>
          <figure class="max-h-[85vh] max-w-5xl">
            <AppImage
              v-if="active"
              :source="active"
              :alt="loc(active.alt) || ''"
              :widths="[800, 1200, 1600]"
              sizes="90vw"
              loading="eager"
              img-class="max-h-[80vh] w-auto object-contain"
            />
            <figcaption
              v-if="active && loc(active.caption)"
              class="mt-3 text-center font-subtitle text-sm text-white/70"
            >
              {{ loc(active.caption) }}
            </figcaption>
          </figure>
          <button
            v-if="images.length > 1"
            class="absolute right-3 text-white/70 hover:text-white sm:right-8"
            aria-label="Next"
            @click="next"
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6" /></svg>
          </button>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
