/**
 * Seeds the Sanity dataset with a starting set of content migrated from the old
 * inconsa.mx site: site settings (contact/social/about), the four service groups
 * and the current projects. Images, clients and gallery photos are intentionally
 * left out — the client uploads those in the Studio (that's the whole point).
 *
 * Idempotent: uses deterministic _ids + createOrReplace, so it's safe to re-run.
 *
 * Run (after `sanity login` and creating the project):
 *   npx sanity exec scripts/seed.ts --with-user-token
 */
import { getCliClient } from 'sanity/cli'

const client = getCliClient()

let keyCounter = 0
const key = () => `k${(keyCounter++).toString(36)}`

/** Build a single-paragraph Portable Text value. */
const block = (text: string) => [
  {
    _type: 'block',
    _key: key(),
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: key(), text, marks: [] }],
  },
]

const siteSettings = {
  _id: 'siteSettings',
  _type: 'siteSettings',
  companyName: 'Grupo INCONSA',
  about: {
    _type: 'localeBlock',
    es: block(
      'Somos una constructora fundada en 2006 en Cancún, Quintana Roo, por profesionales de la ingeniería y la construcción especializados en obra civil e infraestructura. Ofrecemos calidad, precios competitivos y cumplimiento en tiempo a través de un equipo interdisciplinario.',
    ),
    en: block(
      'We are a construction company founded in 2006 in Cancún, Quintana Roo, by engineering and construction professionals specializing in civil works and infrastructure. We deliver quality, competitive pricing and on-time completion through an interdisciplinary team.',
    ),
  },
  contact: {
    address: 'Calle Ceibo Lote 6, SM 23 MZ 51, CP 77500, Cancún, Quintana Roo, México',
    phone: '(998) 436-6811',
    emailContact: 'contacto@inconsa.mx',
    emailQuotes: 'cotizaciones@inconsa.mx',
  },
  social: {
    facebook: 'https://www.facebook.com/INCONSA',
    instagram: 'https://www.instagram.com/inconsa.mx',
    linkedin: 'https://www.linkedin.com/company/grupojrcl/',
  },
}

const services = [
  {
    _id: 'service.infrastructure',
    _type: 'service',
    group: 'infrastructure',
    order: 1,
    title: { _type: 'localeString', es: 'Infraestructura', en: 'Infrastructure' },
    description: {
      _type: 'localeText',
      es: 'Alcantarillado sanitario, agua potable, sistemas eléctricos y vialidades.',
      en: 'Sanitary sewer systems, potable water, electrical systems and roadways.',
    },
  },
  {
    _id: 'service.urbanization',
    _type: 'service',
    group: 'urbanization',
    order: 2,
    title: { _type: 'localeString', es: 'Urbanización', en: 'Urbanization' },
    description: {
      _type: 'localeText',
      es: 'Hoteles, naves industriales, edificios comerciales y vivienda residencial.',
      en: 'Hotels, industrial warehouses, commercial buildings and residential housing.',
    },
  },
  {
    _id: 'service.projects',
    _type: 'service',
    group: 'projects',
    order: 3,
    title: { _type: 'localeString', es: 'Proyectos', en: 'Projects' },
    description: {
      _type: 'localeText',
      es: 'Proyecto ejecutivo, estudios (topográficos, geohidrológicos), análisis y diseño estructural y peritajes.',
      en: 'Executive project design, studies (topographic, geo-hydrological), structural analysis and design, and expert appraisals.',
    },
  },
  {
    _id: 'service.equipment',
    _type: 'service',
    group: 'equipment',
    order: 4,
    title: { _type: 'localeString', es: 'Renta de equipo', en: 'Equipment rental' },
    description: {
      _type: 'localeText',
      es: 'Retroexcavadoras, zanjadoras de disco y de cuchilla, excavadoras y equipo mediano de construcción.',
      en: 'Backhoes, disk and blade trenchers, excavators and medium construction equipment.',
    },
  },
]

const projects = [
  {
    _id: 'project.ptar-norponiente-ii',
    slug: 'ptar-norponiente-ii',
    es: 'PTAR Norponiente II',
    en: 'PTAR Norponiente II',
    location: 'Cancún, Quintana Roo',
  },
  {
    _id: 'project.ptar-paraiso',
    slug: 'ptar-paraiso',
    es: 'PTAR Paraíso',
    en: 'PTAR Paraíso',
    location: 'Cancún, Quintana Roo',
  },
  {
    _id: 'project.prado-norte',
    slug: 'prado-norte',
    es: 'Prado Norte',
    en: 'Prado Norte',
    location: 'Quintana Roo',
  },
  {
    _id: 'project.desarrollo-sanam-tulum',
    slug: 'desarrollo-sanam-tulum',
    es: 'Desarrollo Sanam, Tulum',
    en: 'Sanam Development, Tulum',
    location: 'Tulum, Quintana Roo',
  },
].map((p, i) => ({
  _id: p._id,
  _type: 'project',
  status: 'in-progress',
  order: i + 1,
  title: { _type: 'localeString', es: p.es, en: p.en },
  slug: { _type: 'slug', current: p.slug },
  location: p.location,
}))

async function run() {
  const docs = [siteSettings, ...services, ...projects]
  const tx = docs.reduce((t, doc) => t.createOrReplace(doc as any), client.transaction())
  const res = await tx.commit()
  console.log(`Seeded ${docs.length} documents (${res.results.length} operations).`)
  console.log('Next: open the Studio and add cover images to the projects, plus clients & gallery photos.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
