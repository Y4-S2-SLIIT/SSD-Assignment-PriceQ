import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId = '754594652411-eljf987jpne2fuo9erd8o440bqal3d4b.apps.googleusercontent.com'

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={clientId}>
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  </GoogleOAuthProvider>,
)
