import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useLocation } from '../context/LocationContext'
import LocationSearch from './LocationSearch'
import './Navbar.css' // <--- IMPORT THIS!

const Navbar = () => {
  const { cartItems } = useCart()
  const { location, detectLocation, setLocation } = useLocation()
  const navigate = useNavigate()
  const [showLocationModal, setShowLocationModal] = useState(false)
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))

  const handleLogout = () => {
    localStorage.removeItem('userInfo')
    alert('Logged out successfully')
    navigate('/login')
  }

  const handleSelectLocation = (place) => {
    const lat = parseFloat(place.lat)
    const lng = parseFloat(place.lon)
    const formattedAddress = place.display_name.split(',').slice(0, 3).join(',')
    
    setLocation({ lat, lng, address: formattedAddress, loaded: true })
    localStorage.setItem('userLocation', JSON.stringify({ lat, lng, address: formattedAddress }))
    setShowLocationModal(false)
  }

  const handleGPS = () => {
    detectLocation()
    setShowLocationModal(false)
  }

  return (
    <>
      <nav className="navbar">
        {/* --- LEFT SIDE: Logo & Location --- */}
        <div className="navbar-left">
          <Link to="/" className="logo">
            🛵 TastyGo
          </Link>

          <div className="location-box" onClick={() => setShowLocationModal(true)}>
            <span className="location-main">
              📍 {location.address.split(',')[0]} 
              <span style={{ fontSize: '10px' }}>▼</span>
            </span>
            {/* Ee Kindha Line Mobile lo Kanipinchadu (Hidden via CSS) */}
            <span className="location-sub">
              {location.address}
            </span>
          </div>
        </div>

        {/* --- RIGHT SIDE: Links & Cart --- */}
        <div className="navbar-right">
          <Link to="/" className="nav-link">Home</Link>
          
          <Link to="/cart" className="nav-link" style={{ position: 'relative' }}>
            <span style={{ fontSize: '24px' }}>🛒</span>
            {cartItems.length > 0 && (
              <span style={{ 
                position: 'absolute', top: '-8px', right: '-8px', 
                backgroundColor: '#FF6347', borderRadius: '50%', 
                padding: '2px 6px', fontSize: '10px', fontWeight: 'bold' 
              }}>
                {cartItems.length}
              </span>
            )}
          </Link>

          {userInfo ? (
            <>
              <Link to="/add-restaurant" className="nav-link" style={{color:'#28a745'}}>+ Add</Link>
              <Link to="/myorders" className="nav-link">My Orders</Link>
              <button onClick={handleLogout} style={{ 
                padding: '6px 12px', backgroundColor: '#dc3545', 
                color: 'white', border: 'none', borderRadius: '4px', cursor:'pointer' 
              }}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login">
              <button style={{ 
                padding: '6px 12px', backgroundColor: '#28a745', 
                color: 'white', border: 'none', borderRadius: '4px' 
              }}>
                Login
              </button>
            </Link>
          )}
        </div>
      </nav>

      {showLocationModal && (
        <LocationSearch 
          onClose={() => setShowLocationModal(false)}
          onSelectLocation={handleSelectLocation}
          onUseGPS={handleGPS}
        />
      )}
    </>
  )
}

export default Navbar