import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {TranslateAction} from './actions/TranslateAction'

export default defineConfig({
  name: 'default',
  title: 'Studio-Portfolio',

  projectId: 'nntbmkz8',
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },

  document: {
    actions: (prev, context) => {
      if (context.schemaType === 'artwork') {
        return [...prev, TranslateAction]
      }
      return prev
    }
  },
})
