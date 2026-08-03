import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'nntbmkz8',
    dataset: 'production'
  },
  studioHost: 'sukar-sketchbook',
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
    appId: 'jccr6vvnmm23eyciokuoyzap',
  },
})
