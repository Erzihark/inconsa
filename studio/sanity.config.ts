import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes, singletonTypes } from './schemaTypes'
import { structure } from './structure'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'placeholder-project-id'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

export default defineConfig({
  name: 'inconsa',
  title: 'INCONSA',
  projectId,
  dataset,
  plugins: [structureTool({ structure }), visionTool()],
  schema: {
    types: schemaTypes,
    // Hide singletons from the global "create new" menu.
    templates: (templates) => templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
  document: {
    // Remove create/delete actions for singleton documents.
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({ action }) => action && ['publish', 'discardChanges', 'restore'].includes(action))
        : input,
  },
})
