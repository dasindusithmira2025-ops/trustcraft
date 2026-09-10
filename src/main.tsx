import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { DemoProvider } from './store'
import { WorkerProvider } from './worker/store'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DemoProvider>
      <WorkerProvider>
        <App />
      </WorkerProvider>
    </DemoProvider>
  </React.StrictMode>,
)
