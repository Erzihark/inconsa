/**
 * One-off correction: two placeholder assets were uploaded from swapped/wrong
 * Unsplash ids (ph-blueprint got a programming photo; ph-site-sunset got the
 * drafting photo). Re-uploads the correct images, re-points every document
 * field that references the old assets, then deletes the bad assets.
 *
 * Run: npx sanity exec scripts/fix-placeholder-photos.ts --with-user-token
 */
import { getCliClient } from 'sanity/cli'

const client = getCliClient()

const FIXES: Record<string, string> = {
  'ph-site-sunset.jpg': 'photo-1531834685032-c34bf0d84c77', // crews on rebar towers
  'ph-blueprint.jpg': 'photo-1503387762-592deb58ef4e', // drafting plans
}

async function run() {
  for (const [filename, photoId] of Object.entries(FIXES)) {
    const oldId = await client.fetch<string | null>(
      `*[_type == "sanity.imageAsset" && originalFilename == $f][0]._id`,
      { f: filename },
    )
    if (!oldId) {
      console.log(`no existing asset for ${filename}, skipping`)
      continue
    }

    const res = await fetch(`https://images.unsplash.com/${photoId}?w=1800&q=80&fm=jpg`)
    if (!res.ok) throw new Error(`download failed: ${photoId} (${res.status})`)
    const buf = Buffer.from(await res.arrayBuffer())
    const fresh = await client.assets.upload('image', buf, {
      filename,
      contentType: 'image/jpeg',
    })
    if (fresh._id === oldId) {
      console.log(`${filename}: content already correct (same asset id)`)
      continue
    }

    // Repoint every reference to the old asset (covers, galleries, category images).
    const refs = await client.fetch<Array<{ _id: string }>>(`*[references($old)]{ _id }`, {
      old: oldId,
    })
    for (const { _id } of refs) {
      const doc = await client.getDocument(_id)
      const patched = JSON.parse(
        JSON.stringify(doc).replaceAll(`"${oldId}"`, `"${fresh._id}"`),
      )
      await client.createOrReplace(patched)
      console.log(`repointed ${_id}`)
    }

    await client.delete(oldId)
    console.log(`${filename}: replaced ${oldId} → ${fresh._id}`)
  }
  console.log('Done.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
