import type { StructureResolver } from 'sanity/structure'

/**
 * Custom Studio structure: pins "Site settings" as a single editable document and
 * groups the construction content separately from the (Phase 2) leasing content.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site settings')
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.divider(),
      S.documentTypeListItem('project').title('Projects'),
      S.documentTypeListItem('client').title('Clients'),
      S.documentTypeListItem('service').title('Services'),
      S.documentTypeListItem('galleryImage').title('Gallery'),
      S.divider(),
      S.listItem()
        .title('Leasing')
        .child(
          S.list()
            .title('Leasing')
            .items([
              S.documentTypeListItem('machineCategory').title('Machine categories'),
              S.documentTypeListItem('machine').title('Machines'),
            ]),
        ),
    ])
