import React from 'react'
import ReactDOM from 'react-dom/client'
//import { BrowserRouter } from 'react-router-dom' // Import this
import App from './App.jsx'
import './index.css'
import { SocketProvider } from './context/SocketContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  
      <SocketProvider>
        <App />
      </SocketProvider>
  
  </React.StrictMode>,
)