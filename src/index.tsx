import 'bulmaswatch/superhero/bulmaswatch.min.css'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './state'
import CodeCell from './components/code-cell'

const App = () => {
  return (
    <Provider store={store}>
      <div>
        <CodeCell />
      </div>
    </Provider>
  )
}

const container = document.getElementById('root')
const root = createRoot(container!)
root.render(<App />)
