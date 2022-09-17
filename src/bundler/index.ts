import * as esbuild from 'esbuild-wasm'
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin'
import { fetchPlugin } from './plugins/fetch-plugin'
import { BuildResult } from 'esbuild-wasm'

let waiting: Promise<void>

export const startService = () => {
  waiting = esbuild.initialize({
    worker: false,
    wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm',
  })
}

const bundle = async (rawCode: string): Promise<BuildResult> => {
  await waiting
  return esbuild
    .build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
    })
    .then((result): BuildResult => {
      return {
        code: result.outputFiles[0].text,
        err: '',
      }
    })
    .catch((err) => {
      return {
        code: '',
        err: err.message,
      }
    })
}

export default bundle
