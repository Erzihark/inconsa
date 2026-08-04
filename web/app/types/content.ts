/** Shapes of the content returned from Sanity (kept intentionally light). */

export interface LocaleString {
  es?: string
  en?: string
}
export type LocaleText = LocaleString

export interface PortableBlock {
  _type: string
  [key: string]: unknown
}
export interface LocaleBlock {
  es?: PortableBlock[]
  en?: PortableBlock[]
}

export interface SanityImage {
  _type?: 'image'
  asset?: { _ref: string; _type?: 'reference' }
  hotspot?: unknown
  crop?: unknown
}
export interface Figure extends SanityImage {
  alt?: LocaleString
  caption?: LocaleString
}

export type ProjectStatus = 'in-progress' | 'completed'

export interface Project {
  _id: string
  title: LocaleString
  slug: { current: string }
  status: ProjectStatus
  location?: string
  date?: string
  description?: LocaleBlock
  coverImage?: Figure
  images?: Figure[]
  featured?: boolean
  client?: { name: string } | string | null
  seo?: Seo
  /** Portable-text description flattened to plain text, for meta descriptions. */
  excerpt?: LocaleString
}

export interface Service {
  _id: string
  title: LocaleString
  description?: LocaleText
  group: 'infrastructure' | 'urbanization' | 'projects' | 'equipment'
  image?: Figure
}

export interface ClientDoc {
  _id: string
  name: string
  description?: LocaleText
  logo?: Figure
  website?: string
}

export interface GalleryImage {
  _id: string
  image: Figure
  category?: string
}

export interface Seo {
  metaTitle?: LocaleString
  metaDescription?: LocaleText
  ogImage?: SanityImage
}

export interface SiteSettings {
  companyName: string
  logo?: SanityImage
  about?: LocaleBlock
  founderMessage?: LocaleBlock
  qualityPolicy?: LocaleBlock
  privacyPolicy?: LocaleBlock
  contact?: {
    address?: string
    phone?: string
    emailContact?: string
    emailQuotes?: string
    mapUrl?: string
  }
  social?: { facebook?: string; instagram?: string; linkedin?: string }
  cv?: { es?: string; en?: string }
  defaultSeo?: Seo
}

export interface MachineCategory {
  _id: string
  name: LocaleString
  slug: { current: string }
  description?: LocaleText
  image?: Figure
  seo?: Seo
}

export interface Machine {
  _id: string
  name: LocaleString
  slug: { current: string }
  category?: { name: LocaleString; slug: { current: string } }
  description?: LocaleText
  images?: Figure[]
  specs?: { label?: LocaleString; value?: string }[]
  rental?: {
    hourly?: boolean
    hourlyRate?: number
    perProject?: boolean
    notes?: LocaleText
  }
}
