import * as esbuild from 'esbuild-wasm'
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin'
import { fetchPlugin } from './plugins/fetch-plugin'

const bundle = async (rawCode: string) => {
  try {
    const result = await esbuild.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window',
      },
    })

    return { code: result.outputFiles[0].text, err: '' }
  } catch (error) {
    if (error instanceof Error && error.message.includes('initialize')) {
      await esbuild.initialize({
        worker: false,
        wasmURL: 'https://unpkg.com/esbuild-wasm/esbuild.wasm',
      })
    } else {
      return { code: '', err: error.message }
    }
  }
}

export default bundle
