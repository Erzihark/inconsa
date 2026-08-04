/**
 * Asserts that the SEO validation rules fire at the level they claim to.
 *
 * `sanity documents validate` reports every marker at "warning" regardless of
 * the rule's own level, so it cannot answer "does this block publishing?".
 * This runs Sanity's own `validateDocument` against synthetic documents and
 * prints the real level per marker.
 *
 * Run with:  npx sanity exec scripts/check-validation-levels.ts
 */
import { validateDocument, createSchema } from 'sanity'
import { schemaTypes } from '../schemaTypes'

// createSchema (not @sanity/schema's Schema.compile) so the Studio's built-in
// types — slug, image, block — are registered alongside ours.
const schema = createSchema({ name: 'inconsa', types: schemaTypes as never })

const cases: { label: string; doc: Record<string, unknown> }[] = [
  {
    label: 'project with no description, no alt, no EN title',
    doc: {
      _id: 'x1',
      _type: 'project',
      title: { es: 'PTAR Paraíso' },
      slug: { current: 'ptar-paraiso' },
      status: 'in-progress',
      coverImage: { _type: 'figure', asset: { _ref: 'image-abc-100x100-jpg' } },
    },
  },
  {
    label: 'project with an invalid slug',
    doc: {
      _id: 'x2',
      _type: 'project',
      title: { es: 'Obra', en: 'Works' },
      slug: { current: 'Obra Nueva_2024' },
      status: 'completed',
      description: { es: [{ _type: 'block', children: [{ text: 'x' }] }] },
      coverImage: {
        _type: 'figure',
        asset: { _ref: 'image-abc-100x100-jpg' },
        alt: { es: 'Vista general de la obra terminada' },
      },
    },
  },
  {
    label: 'machineCategory with a too-short description',
    doc: {
      _id: 'x3',
      _type: 'machineCategory',
      name: { es: 'Excavadoras', en: 'Excavators' },
      slug: { current: 'excavadoras' },
      description: { es: 'Excavadoras hidráulicas.' },
      image: { _type: 'figure', asset: { _ref: 'image-abc-100x100-jpg' }, alt: { es: 'Una excavadora' } },
    },
  },
  {
    label: 'seo override with an overlong meta title and short description',
    doc: {
      _id: 'x4',
      _type: 'project',
      title: { es: 'Obra', en: 'Works' },
      slug: { current: 'obra' },
      status: 'completed',
      description: { es: [{ _type: 'block', children: [{ text: 'x' }] }] },
      coverImage: {
        _type: 'figure',
        asset: { _ref: 'image-abc-100x100-jpg' },
        alt: { es: 'Vista general de la obra terminada' },
      },
      seo: {
        metaTitle: { es: 'Un título meta deliberadamente larguísimo que Google va a recortar sin dudarlo' },
        metaDescription: { es: 'Muy corta.' },
      },
    },
  },
]

const run = async () => {
  let errors = 0
  for (const { label, doc } of cases) {
    const markers = await validateDocument({
      document: doc as never,
      // A minimal stand-in for a Studio workspace: validateDocument only reads
      // `schema` and `i18n` off it, and leaving i18n undefined makes it fall
      // back to the built-in locale source.
      workspace: { schema } as never,
      // Sanity's built-in slug rule does a uniqueness fetch via client.withConfig();
      // its query returns true when the slug is free.
      getClient: () =>
        ({ withConfig: () => ({ fetch: async () => true }), fetch: async () => true }) as never,
      getDocumentExists: async () => true,
    })
    console.log(`\n## ${label}`)
    if (!markers.length) console.log('   (no markers)')
    for (const m of markers) {
      const path = (m.path || []).map(String).join('.')
      if (m.level === 'error') errors++
      console.log(`   [${m.level.toUpperCase().padEnd(7)}] ${path.padEnd(24)} ${m.message}`)
    }
  }
  console.log(`\nTotal error-level markers (these block publishing): ${errors}`)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
