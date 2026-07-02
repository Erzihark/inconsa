/** GROQ queries. Images keep their raw asset refs so the URL builder can transform them. */

export const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0]{
  companyName, logo, about, founderMessage, qualityPolicy, privacyPolicy,
  contact, social,
  "cv": { "es": cv.es.asset->url, "en": cv.en.asset->url },
  defaultSeo
}`

export const PROJECTS_QUERY = `*[_type == "project"] | order(coalesce(order, 999) asc, date desc){
  _id, title, slug, status, location, date, coverImage, "client": client->name
}`

export const FEATURED_PROJECTS_QUERY = `*[_type == "project" && featured == true] | order(coalesce(order, 999) asc, date desc)[0...6]{
  _id, title, slug, status, location, coverImage
}`

export const PROJECT_BY_SLUG_QUERY = `*[_type == "project" && slug.current == $slug][0]{
  _id, title, slug, status, location, date, description, coverImage, images,
  "client": client->{name}, seo
}`

export const PROJECT_SLUGS_QUERY = `*[_type == "project" && defined(slug.current)].slug.current`

export const SERVICES_QUERY = `*[_type == "service"] | order(coalesce(order, 999) asc){
  _id, title, description, group, image
}`

export const CLIENTS_QUERY = `*[_type == "client"] | order(coalesce(order, 999) asc){
  _id, name, description, logo, website
}`

export const GALLERY_QUERY = `*[_type == "galleryImage"] | order(coalesce(order, 999) asc){
  _id, image, category
}`

export const MACHINE_CATEGORIES_QUERY = `*[_type == "machineCategory"] | order(coalesce(order, 999) asc){
  _id, name, slug, description, image
}`

export const MACHINES_QUERY = `*[_type == "machine" && available == true] | order(coalesce(order, 999) asc){
  _id, name, slug, "category": category->{name, slug}, description, images, specs, rental
}`

export const MACHINES_BY_CATEGORY_QUERY = `*[_type == "machine" && available == true && category->slug.current == $slug] | order(coalesce(order, 999) asc){
  _id, name, slug, description, images, specs, rental
}`
