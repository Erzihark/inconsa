import { CONTACT_TOPICS, TOPIC_FALLBACK, type ContactTopic } from './useContactLink'

/** Path (locale prefix already stripped) → topic, first match wins. */
const PATH_TOPICS: Array<[RegExp, ContactTopic]> = [
  [/^\/arrendamiento\/.+/, 'machineCategory'],
  [/^\/arrendamiento\/?$/, 'leasing'],
  [/^\/proyectos\/.+/, 'project'],
  [/^\/proyectos\/?$/, 'projects'],
  [/^\/servicios/, 'services'],
  [/^\/galeria/, 'gallery'],
  [/^\/clientes/, 'clients'],
  [/^\/(nosotros|mensaje-del-fundador)/, 'about'],
  [/^\/?$/, 'general'],
]

/**
 * Works out what the visitor most likely wants to write about, from the
 * `?topic=&subject=` params a CTA attached — or, for context-less links such as
 * the header nav, from the page they navigated in from.
 *
 * Resolution runs on the client only (it depends on browser history and must not
 * leak into the ISR-cached HTML), so callers apply it in `onMounted`.
 */
export function useContactPrefill() {
  const route = useRoute()
  const router = useRouter()
  const { t, locales } = useI18n()

  const prefixes = computed(() =>
    (locales.value as Array<{ code: string }>).map((l) => `/${l.code}`),
  )

  function stripLocale(path: string): string {
    const p = prefixes.value.find((pre) => path === pre || path.startsWith(`${pre}/`))
    return (p ? path.slice(p.length) : path) || '/'
  }

  function topicFromPath(url?: string | null): ContactTopic | undefined {
    if (!url) return undefined
    const path = stripLocale(url.split('?')[0]!.split('#')[0]!).replace(/\/$/, '') || '/'
    return PATH_TOPICS.find(([re]) => re.test(path))?.[1]
  }

  /** Resolved topic + subject, from the query first, then from the previous route. */
  function resolve(): { topic: ContactTopic; subject?: string } | undefined {
    const q = route.query
    const subject = typeof q.subject === 'string' ? q.subject.trim().slice(0, 120) || undefined : undefined
    let topic =
      typeof q.topic === 'string' && CONTACT_TOPICS.includes(q.topic as ContactTopic)
        ? (q.topic as ContactTopic)
        : undefined

    if (!topic) {
      topic = topicFromPath(router.options.history.state.back as string | undefined)
    }
    if (!topic) return undefined

    // A named topic without a name reads badly ("interested in renting .") — widen it.
    if (!subject && TOPIC_FALLBACK[topic]) topic = TOPIC_FALLBACK[topic]!

    return { topic, subject }
  }

  /** The message to drop into the textarea, or `undefined` when there's no useful context. */
  function message(): string | undefined {
    const ctx = resolve()
    if (!ctx) return undefined
    return t(`contact.prefill.${ctx.topic}`, { subject: ctx.subject ?? '' })
  }

  return { resolve, message }
}
