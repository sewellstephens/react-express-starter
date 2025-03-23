import { defineConfig } from 'cypress'
import testomatioPlugin from '@testomatio/reporter/lib/adapter/cypress-plugin/index.js'

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // testomat.io reporter plugin:
      testomatioPlugin(on, config)
    },
    supportFile: false,
  },
})
      