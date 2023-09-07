import { useEffect } from 'react'
import useRouteElement from './useRouteElement'
import { LocalStorageEventTarget } from './libs/event'

function App() {
  const routerElement = useRouteElement()

  // subscribe to clearLocalStorage event
  useEffect(() => {
    LocalStorageEventTarget.addEventListener('clearLocalStorage', () => {
      window.location.reload()
    })

    return () => {
      LocalStorageEventTarget.removeEventListener('clearLocalStorage', () => {
        window.location.reload()
      })
    }
  }, [])

  return <div>{routerElement}</div>
}

export default App
