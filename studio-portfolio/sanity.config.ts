import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {TranslateAction} from './actions/TranslateAction'
import {CustomLogo} from './components/CustomLogo'
import {myTheme} from './theme'

export default defineConfig({
  name: 'default',
  title: 'Sukar Portfolio',
  theme: myTheme,

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
