import * as esbuild from 'esbuild-wasm'
import { useState, useEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin'
import { fetchPlugin } from './plugins/fetch-plugin'
import CodeEditor from './components/code-editor'

const App = () => {
  const ref = useRef<any>()
  const iframe = useRef<any>()
  const [input, setInput] = useState('')
  const [code, setCode] = useState('')

  const startService = async () => {
    await esbuild.initialize({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm/esbuild.wasm',
    })
    ref.current = true
  }

  useEffect(() => {
    startService()
  }, [])

  const onClick = async () => {
    if (!ref.current) {
      return
    }

    iframe.current.srcdoc = html

    const result = await esbuild.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window',
      },
    })

    // setCode(result.outputFiles[0].text)
    iframe.current.contentWindow.postMessage(result.outputFiles[0].text, '*')
  }

  const html = `
    <html>
      <head>
        <body>
          <div id='root'></div>
          <script>
            window.addEventListener('message', (event) => {
              try {
                eval(event.data)
              } catch (err) {
                const root = document.querySelector('#root')
                root.innerHTML = '<div style="color: red"><h4>Runtime Error</h4>' + err + '</div>'
               console.log(err)
              }
            }, false )
          </script>
        </body>
      </head>
    </html>
  `

  return (
    <div>
      <CodeEditor />
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <pre>{code}</pre>
      <iframe
        title="preview"
        ref={iframe}
        sandbox="allow-scripts"
        srcDoc={html}
      />
    </div>
  )
}

const container = document.getElementById('root')
const root = createRoot(container!)
root.render(<App />)
