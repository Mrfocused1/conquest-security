import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { CmsProvider } from './store/cms'
import { AuthProvider } from './store/auth'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <CmsProvider>
        <App />
      </CmsProvider>
    </AuthProvider>
  </React.StrictMode>,
)
