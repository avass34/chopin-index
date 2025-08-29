import { type SchemaTypeDefinition } from 'sanity'

// Import your schema types here
import pianist from './pianist'
import work from './work'
import podcastSnippet from './podcastSnippet'

export const schemaTypes: SchemaTypeDefinition[] = [
  // Add your schema types here
  pianist,
  work,
  podcastSnippet,
]
