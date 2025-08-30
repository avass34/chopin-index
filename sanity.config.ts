import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './schemas'

// Define the actions that should be available for singleton documents
const singletonActions = new Set(['publish', 'discardChanges', 'restore'])

// Define the singleton document types
const singletonTypes = new Set(['chopinProfile'])

export default defineConfig({
  name: 'default',
  title: 'Chopin Index',
  
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,

  basePath: '/studio',

  plugins: [
    structureTool({
      structure: (S: any) =>
        S.list()
          .title('Content')
          .items([
            // Our singleton type has a list item with a custom child
            S.listItem()
              .title('Chopin Profile')
              .id('chopinProfile')
              .child(
                // Instead of rendering a list of documents, we render a single
                // document, specifying the `documentId` manually to ensure
                // that we're editing the single instance of the document
                S.document()
                  .schemaType('chopinProfile')
                  .documentId('chopin-profile')
              ),
            S.divider(),
            // Regular document types
            ...S.documentTypeListItems().filter(
              (listItem: any) => !singletonTypes.has(listItem.getId()!)
            ),
          ]),
    })
  ],

  schema: {
    types: schemaTypes,
    
    // Filter out singleton types from the global "New document" menu options
    templates: (templates: any) =>
      templates.filter(({ schemaType }: any) => !singletonTypes.has(schemaType)),
  },

  document: {
    // For singleton types, filter out actions that are not explicitly included
    // in the `singletonActions` list defined above
    actions: (input: any, context: any) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({ action }: any) => action && singletonActions.has(action))
        : input,
  },
})
