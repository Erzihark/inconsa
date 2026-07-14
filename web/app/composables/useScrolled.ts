/**
 * Reactive "page has been scrolled" flag for the fixed header. Starts false on
 * SSR and only updates after mount, so hydration markup always matches.
 */
export function useScrolled(threshold = 24) {
  const scrolled = ref(false)

  onMounted(() => {
    const onScroll = () => (scrolled.value = window.scrollY > threshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
  })

  return scrolled
}
