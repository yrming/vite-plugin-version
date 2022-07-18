import { existsSync, promises as fs } from 'fs'
import { join } from 'path'
import type { Plugin } from 'vite'
import _debug from 'debug'

const debug = _debug('vite-plugin-version')

export interface Options {
  /**
   * File path of package.json
   * @default 'package.json'
   */
  packageJsonPath?: string
  /**
   * Field name in package.json which is used to represent the version number
   * @default 'version'
   */
  field?: string
  /**
   * The name of the file where the version number is stored
   * After packaging this file will be placed in the dist folder
   * @default 'version.json'
   */
  fileName?: string
}

function vitePluginVersion(options: Options = {}): Plugin {
  const {
    packageJsonPath = join(process.cwd(), 'package.json'),
    field = 'version',
    fileName = 'version.json',
  } = options

  return {
    name: 'vite-plugin-version',
    apply: 'build',
    async buildStart() {
      if (!existsSync(packageJsonPath)) {
        debug('package.json not found at %s', packageJsonPath)
        return
      }

      try {
        const packageJson: Record<string, any> = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'))
        const version = packageJson[field]
        if (!version) {
          debug('no %s field found in package.json', field)
          return
        }
        debug('%s field found in package.json, the value is %s', field, version)
        this.emitFile({
          fileName,
          source: JSON.stringify({
            version,
          }),
          type: 'asset',
        })
      }
      catch (e) {
        debug('parse error: %o', e)
        debug('error on loading package.json at %s', packageJsonPath)
      }
    },
  }
}

export default vitePluginVersion
