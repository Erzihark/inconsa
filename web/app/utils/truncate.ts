/**
 * Trims text to `max` characters without cutting a word in half, appending an
 * ellipsis when anything was removed. Used for meta descriptions derived from
 * CMS prose, where a hard slice would leave a dangling fragment in the SERP.
 */
export function truncateAtWord(text: string, max: number) {
  if (text.length <= max) return text
  const cut = text.slice(0, max)
  const lastSpace = cut.lastIndexOf(' ')
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[,;:.]$/, '')}…`
}
