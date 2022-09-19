import './code-cell.css'
import { useEffect } from 'react'
import CodeEditor from './code-editor'
import Preview from './preview'
import Resizable from './resizable'
import { Cell } from '../state'
import { useActions } from '../hooks/use-actions'
import { useTypedSelector } from '../hooks/use-typed-selector'
import { startService } from '../bundler/index'

interface CodeCellProps {
  cell: Cell
}

startService()

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const { updateCell, createBundle } = useActions()
  const bundle = useTypedSelector((state) => state.bundles[cell.id])
  const cumulatedCode = useTypedSelector((state) => {
    const { data, order } = state.cells
    const orderedCells = order.map((id) => data[id])

    const cumulatedCode = []
    for (let c of orderedCells) {
      if (c.type === 'code') {
        cumulatedCode.push(c.content)
      }
      if (c.id === cell.id) {
        break
      }
    }
    return cumulatedCode
  })

  console.log(cumulatedCode)

  useEffect(() => {
    if (!bundle) {
      createBundle(cell.id, cumulatedCode.join('\n'))
      return
    }

    const timer = setTimeout(async () => {
      createBundle(cell.id, cumulatedCode.join('\n'))
    }, 750)

    return () => {
      clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cumulatedCode.join('\n'), cell.id, createBundle])

  return (
    <Resizable direction="vertical">
      <div
        style={{
          height: 'calc(100% - 10px)',
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue={cell.content}
            onChange={(value) => updateCell(cell.id, value)}
          />
        </Resizable>
        <div className="progress-wrapper">
          {!bundle || bundle.loading ? (
            <div className="progress-cover">
              <progress className="progress is-small is-primary">
                Loading...
              </progress>
            </div>
          ) : (
            <Preview code={bundle.code} err={bundle.err} />
          )}
        </div>
      </div>
    </Resizable>
  )
}

export default CodeCell
