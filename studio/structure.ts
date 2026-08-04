import type { StructureResolver } from 'sanity/structure'

/**
 * Custom Studio structure: pins "Site settings" as a single editable document and
 * groups the construction content separately from the (Phase 2) leasing content.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Contenido')
    .items([
      S.listItem()
        .title('Configuración del sitio')
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.divider(),
      S.documentTypeListItem('project').title('Proyectos'),
      S.documentTypeListItem('client').title('Clientes'),
      S.documentTypeListItem('service').title('Servicios'),
      S.documentTypeListItem('galleryImage').title('Galería'),
      S.divider(),
      S.listItem()
        .title('Arrendamiento')
        .child(
          S.list()
            .title('Arrendamiento')
            .items([
              S.documentTypeListItem('machineCategory').title('Categorías de máquinas'),
              S.documentTypeListItem('machine').title('Máquinas'),
            ]),
        ),
    ])
