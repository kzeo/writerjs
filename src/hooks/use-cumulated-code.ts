import { useTypedSelector } from './use-typed-selector'

export const useCumulatedCode = (cellId: string) => {
  return useTypedSelector((state) => {
    const { data, order } = state.cells
    const orderedCells = order.map((id) => data[id])

    const showFunction = `
    import _React from 'react'
    import * as _ReactDOMClient from 'react-dom/client'
    
    var show = (value) => {
      const container = document.getElementById('root')
      const root = _ReactDOMClient.createRoot(container)
      
      if (typeof value === 'object') {
        if(value.$$typeof && value.props){          
          root.render(value)
        } else {
          container.innerHTML = JSON.stringify(value)
        }
      } else {
        container.innerHTML = value
      }
    }
   `
    const showFunctionNoop = 'var show = () => {}'
    const cumulatedCode = []
    for (let c of orderedCells) {
      if (c.type === 'code') {
        if (c.id === cellId) {
          cumulatedCode.push(showFunction)
        } else {
          cumulatedCode.push(showFunctionNoop)
        }
        cumulatedCode.push(c.content)
      }
      if (c.id === cellId) {
        break
      }
    }
    return cumulatedCode
  }).join('\n')
}
