import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

/**
 * Returns a Sanity image-URL builder bound to the configured project/dataset.
 * Usage: const img = useSanityImage(); img(source).width(800).url()
 *
 * Reads `useSanityConfig()` (a thin runtimeConfig wrapper) rather than
 * `useSanity()`, which would pull @sanity/client + the visual-editing loader
 * into the browser bundle just to read two strings. See useSanityData.ts.
 */
export function useSanityImage() {
  const { projectId, dataset } = useSanityConfig()
  const builder = imageUrlBuilder({
    projectId: projectId as string,
    dataset: dataset as string,
  })
  return (source: SanityImageSource) => builder.image(source)
}
