import useRouteElement from './useRouteElement'

function App() {
  const routerElement = useRouteElement()

  return <div>{routerElement}</div>
}

export default App
