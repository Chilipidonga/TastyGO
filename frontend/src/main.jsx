import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// Import both Providers
import { CartProvider } from './context/CartContext.jsx'
import { LocationProvider } from './context/LocationContext.jsx' 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LocationProvider> {/* <--- Outer Wrapper */}
      <CartProvider>   {/* <--- Inner Wrapper */}
        <App />
      </CartProvider>
    </LocationProvider>
  </React.StrictMode>,
)