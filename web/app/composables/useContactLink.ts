/**
 * Deep links to /contacto that carry the context the visitor is coming from, so
 * the contact form can pre-fill a message that already says what they're after
 * (a specific machine, a project, the leasing fleet…).
 *
 * The context travels in the URL (`?topic=…&subject=…`) because that survives a
 * full page load and can be shared. Links without any context still work:
 * `useContactPrefill` falls back to inferring the topic from the previous route.
 */
export type ContactTopic =
  | 'machine'
  | 'machineCategory'
  | 'leasing'
  | 'project'
  | 'projects'
  | 'service'
  | 'services'
  | 'gallery'
  | 'clients'
  | 'about'
  | 'general'

export const CONTACT_TOPICS: ContactTopic[] = [
  'machine',
  'machineCategory',
  'leasing',
  'project',
  'projects',
  'service',
  'services',
  'gallery',
  'clients',
  'about',
  'general',
]

/** Topics whose message template needs a name; without one they degrade to a broader topic. */
export const TOPIC_FALLBACK: Partial<Record<ContactTopic, ContactTopic>> = {
  machine: 'leasing',
  machineCategory: 'leasing',
  project: 'projects',
  service: 'services',
}

export function useContactLink() {
  const localePath = useLocalePath()

  return (topic?: ContactTopic, subject?: string | null): string => {
    const path = localePath('/contacto')
    if (!topic) return path
    const params = new URLSearchParams({ topic })
    if (subject) params.set('subject', subject)
    return `${path}?${params.toString()}`
  }
}
