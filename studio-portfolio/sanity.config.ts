import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {TranslateAction} from './actions/TranslateAction'
import {CustomLogo} from './components/CustomLogo'

export default defineConfig({
  name: 'default',
  title: 'Sukar Portfolio',

  projectId: 'nntbmkz8',
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },

  studio: {
    components: {
      logo: CustomLogo,
    },
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
