/**
 * Contact form endpoint. Sends an email via Resend when NUXT_RESEND_API_KEY is set;
 * otherwise (local/dev) it logs the message and returns ok so the form is testable.
 */
export default defineEventHandler(async (event) => {
  const body = await readBody<{
    name?: string
    email?: string
    message?: string
    company?: string // honeypot
  }>(event)

  const name = body?.name?.trim()
  const email = body?.email?.trim()
  const message = body?.message?.trim()

  // Honeypot: silently accept bots without sending.
  if (body?.company) return { ok: true }

  const emailOk = !!email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  if (!name || !emailOk || !message) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid form submission' })
  }

  const config = useRuntimeConfig(event)
  const to = config.contactToEmail || 'contacto@inconsa.mx'

  if (!config.resendApiKey) {
    console.info('[contact] (no RESEND key set) message received:', { name, email, message })
    return { ok: true, dev: true }
  }

  await $fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${config.resendApiKey}` },
    body: {
      // TODO: replace the from address with a verified INCONSA domain sender.
      from: 'INCONSA Web <onboarding@resend.dev>',
      to: [to],
      reply_to: email,
      subject: `Nuevo mensaje de ${name} — inconsa.mx`,
      text: `${message}\n\n— ${name} <${email}>`,
    },
  })

  return { ok: true }
})
