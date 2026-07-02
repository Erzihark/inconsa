import type { SchemaTypeDefinition } from 'sanity'

// Localized field types + shared objects
import { localeString } from './objects/localeString'
import { localeText } from './objects/localeText'
import { localeBlock } from './objects/localeBlock'
import { localeFile } from './objects/localeFile'
import { figure } from './objects/figure'
import { seo } from './objects/seo'
import { specItem } from './objects/specItem'
import { rentalOptions } from './objects/rentalOptions'

// Documents
import { siteSettings } from './documents/siteSettings'
import { project } from './documents/project'
import { client } from './documents/client'
import { service } from './documents/service'
import { galleryImage } from './documents/galleryImage'
import { machineCategory } from './documents/machineCategory'
import { machine } from './documents/machine'

export const schemaTypes: SchemaTypeDefinition[] = [
  // objects
  localeString,
  localeText,
  localeBlock,
  localeFile,
  figure,
  seo,
  specItem,
  rentalOptions,
  // documents
  siteSettings,
  project,
  client,
  service,
  galleryImage,
  machineCategory,
  machine,
]

/** Document types that are singletons (exactly one instance, not creatable/deletable). */
export const singletonTypes = new Set<string>(['siteSettings'])
