import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/electron-vite.animate.svg'
import { request } from './helpers/request';
import './App.css'

function App() {
  const [ count, setCount ] = useState(0)
  const [ res, setRes ] = useState("testing");
  const [ server, setServer ] = useState<any>({});

  useEffect(() => {
    request.get('/').then((res) => {
      setRes(res.data)
    })
  }, [])

  useEffect(() => {
    window.electronAPI.onUpdateServerStatus((_event: any, value: any) => {
      setServer(JSON.parse(value));
    })
  }, [])

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={ viteLogo } className="logo" alt="Vite logo"/>
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={ reactLogo } className="logo react" alt="React logo"/>
        </a>
        <h3>node server status: </h3>
        <div>pid: {server.pid} connected: {server.connected} signCode: {server.signalCode}</div>
        <br/>
        <hr/>
        <p>node server test: { res }</p>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={ () => setCount((count) => count + 1) }>
          count is { count }
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
