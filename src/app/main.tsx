import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import { App, AuthProvider } from './app'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
)
