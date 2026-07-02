import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

/**
 * Returns a Sanity image-URL builder bound to the configured project/dataset.
 * Usage: const img = useSanityImage(); img(source).width(800).url()
 */
export function useSanityImage() {
  const { config } = useSanity()
  const builder = imageUrlBuilder({
    projectId: config.projectId as string,
    dataset: config.dataset as string,
  })
  return (source: SanityImageSource) => builder.image(source)
}
