import { defineConfig } from 'vite'
import versionPlugin from '../src'

export default defineConfig({
  plugins: [
    versionPlugin(),
  ],
})
