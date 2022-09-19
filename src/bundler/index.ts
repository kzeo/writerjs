import * as esbuild from 'esbuild-wasm'
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin'
import { fetchPlugin } from './plugins/fetch-plugin'

let waiting: Promise<void>

export const startService = () => {
  waiting = esbuild.initialize({
    worker: false,
    wasmURL: 'https://unpkg.com/esbuild-wasm/esbuild.wasm',
  })
}

const bundle = async (rawCode: string) => {
  await waiting
  return esbuild
    .build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window',
      },
      jsxFactory: '_React.createElement',
      jsxFragment: '_React.Fragment',
    })
    .then((result) => {
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
