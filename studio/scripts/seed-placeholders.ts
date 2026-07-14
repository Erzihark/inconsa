/**
 * Seeds PLACEHOLDER photography (Unsplash, free license) so the site looks finished
 * before the client uploads real project photos. Idempotent:
 *  - assets are reused by originalFilename if already uploaded
 *  - documents are only patched where the image field is still empty
 * The client simply replaces these images in the Studio — nothing else to do.
 *
 * Run: npx sanity exec scripts/seed-placeholders.ts --with-user-token
 */
import { getCliClient } from 'sanity/cli'

const client = getCliClient()

/** Verified construction-themed Unsplash photos (ids checked by hand). */
const PHOTOS: Record<string, string> = {
  'ph-crane-sky': 'photo-1541888946425-d81bb19240f5', // aerial site + crew
  'ph-steel-workers': 'photo-1504307651254-35680f356dfd', // rebar crew from above
  'ph-site-sunset': 'photo-1531834685032-c34bf0d84c77', // crews on rebar towers
  'ph-machines-aerial': 'photo-1517089596392-fb9a9033e05b', // CAT fleet earthworks aerial
  'ph-crane-crew': 'photo-1516216628859-9bccecab13ca', // crew climbing orange boom
  'ph-building-modern': 'photo-1487958449943-2429e8be8625', // finished architecture
  'ph-blueprint': 'photo-1503387762-592deb58ef4e', // drafting plans
  'ph-electrician': 'photo-1621905251189-08b45d6a269e', // technician at panel
  'ph-excavator': 'photo-1580901368919-7738efb0f87e', // excavator close-up
  'ph-dozer-cat': 'photo-1621922688758-359fc864071e', // CAT dozer low angle
}

const url = (id: string) => `https://images.unsplash.com/${id}?w=1800&q=80&fm=jpg`

async function ensureAsset(key: string): Promise<string> {
  const filename = `${key}.jpg`
  const existing = await client.fetch<string | null>(
    `*[_type == "sanity.imageAsset" && originalFilename == $f][0]._id`,
    { f: filename },
  )
  if (existing) {
    console.log(`asset exists   ${filename}`)
    return existing
  }
  const res = await fetch(url(PHOTOS[key]))
  if (!res.ok) throw new Error(`download failed for ${key}: ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  const asset = await client.assets.upload('image', buf, {
    filename,
    contentType: 'image/jpeg',
  })
  console.log(`asset uploaded ${filename} → ${asset._id}`)
  return asset._id
}

const figure = (assetId: string, altEs: string, altEn: string) => ({
  _type: 'figure',
  asset: { _type: 'reference', _ref: assetId },
  alt: { _type: 'localeString', es: altEs, en: altEn },
})

const image = (assetId: string) => ({
  _type: 'image',
  asset: { _type: 'reference', _ref: assetId },
})

let keyCounter = 0
const key = () => `ph${(keyCounter++).toString(36)}`

async function run() {
  const ids: Record<string, string> = {}
  for (const k of Object.keys(PHOTOS)) ids[k] = await ensureAsset(k)

  // ---- Projects: cover + a small gallery each (only when still empty) --------
  const projectMedia: Record<string, { cover: string; gallery: string[]; altEs: string; altEn: string }> = {
    'project-ptar-norponiente-ii': {
      cover: 'ph-crane-sky',
      gallery: ['ph-steel-workers', 'ph-machines-aerial'],
      altEs: 'Obra de infraestructura en proceso',
      altEn: 'Infrastructure work in progress',
    },
    'project-ptar-paraiso': {
      cover: 'ph-machines-aerial',
      gallery: ['ph-crane-sky', 'ph-crane-crew'],
      altEs: 'Maquinaria pesada en movimiento de tierras',
      altEn: 'Heavy machinery earthworks',
    },
    'project-prado-norte': {
      cover: 'ph-site-sunset',
      gallery: ['ph-steel-workers', 'ph-blueprint'],
      altEs: 'Cuadrilla trabajando en estructura',
      altEn: 'Crew working on structure',
    },
    'project-desarrollo-sanam-tulum': {
      cover: 'ph-building-modern',
      gallery: ['ph-blueprint', 'ph-electrician'],
      altEs: 'Desarrollo urbano terminado',
      altEn: 'Completed urban development',
    },
  }

  for (const [docId, m] of Object.entries(projectMedia)) {
    const doc = await client.fetch<{ cover: boolean; gallery: boolean } | null>(
      `*[_id == $id][0]{ "cover": defined(coverImage.asset), "gallery": count(images) > 0 }`,
      { id: docId },
    )
    if (!doc) {
      console.log(`skip (missing) ${docId}`)
      continue
    }
    const patch = client.patch(docId)
    let changed = false
    if (!doc.cover) {
      patch.set({ coverImage: { ...figure(ids[m.cover], m.altEs, m.altEn), _key: undefined } })
      changed = true
    }
    if (!doc.gallery) {
      patch.set({
        images: m.gallery.map((g) => ({ ...figure(ids[g], m.altEs, m.altEn), _key: key() })),
      })
      changed = true
    }
    if (changed) {
      await patch.commit()
      console.log(`patched        ${docId}`)
    } else console.log(`already set    ${docId}`)
  }

  // ---- Machine categories ---------------------------------------------------
  const categoryMedia: Record<string, string> = {
    'machinecat-excavadoras': 'ph-excavator',
    'machinecat-retroexcavadoras': 'ph-dozer-cat',
    'machinecat-zanjadoras-de-disco': 'ph-machines-aerial',
    'machinecat-zanjadoras-de-cuchilla': 'ph-crane-crew',
    'machinecat-equipo-mediano': 'ph-steel-workers',
  }
  for (const [docId, imgKey] of Object.entries(categoryMedia)) {
    const has = await client.fetch<boolean | null>(
      `*[_id == $id][0].image.asset._ref != null`,
      { id: docId },
    )
    if (has === null) {
      console.log(`skip (missing) ${docId}`)
      continue
    }
    if (has) {
      console.log(`already set    ${docId}`)
      continue
    }
    await client.patch(docId).set({ image: image(ids[imgKey]) }).commit()
    console.log(`patched        ${docId}`)
  }

  // ---- Standalone gallery ---------------------------------------------------
  const galleryEntries: Array<{ img: string; es: string; en: string; cat: string }> = [
    { img: 'ph-crane-sky', es: 'Supervisión de obra', en: 'Site supervision', cat: 'Infraestructura' },
    { img: 'ph-steel-workers', es: 'Acero de refuerzo', en: 'Rebar work', cat: 'Infraestructura' },
    { img: 'ph-site-sunset', es: 'Estructura en proceso', en: 'Structure in progress', cat: 'Infraestructura' },
    { img: 'ph-machines-aerial', es: 'Movimiento de tierras', en: 'Earthworks', cat: 'Urbanización' },
    { img: 'ph-crane-crew', es: 'Montaje de grúa', en: 'Crane assembly', cat: 'Infraestructura' },
    { img: 'ph-building-modern', es: 'Proyecto terminado', en: 'Completed project', cat: 'Proyectos' },
    { img: 'ph-blueprint', es: 'Planeación y proyecto', en: 'Planning & design', cat: 'Proyectos' },
    { img: 'ph-excavator', es: 'Maquinaria pesada', en: 'Heavy machinery', cat: 'Renta de equipo' },
  ]
  for (let i = 0; i < galleryEntries.length; i++) {
    const g = galleryEntries[i]
    await client.createIfNotExists({
      _id: `galleryimg-ph-${i + 1}`,
      _type: 'galleryImage',
      image: figure(ids[g.img], g.es, g.en),
      category: g.cat,
      order: i + 1,
    })
  }
  console.log(`gallery        ensured ${galleryEntries.length} placeholder images`)

  console.log('\nDone. These are placeholders — replace them in the Studio with real photos.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
