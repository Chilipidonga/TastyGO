import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useLocation } from '../context/LocationContext'
import LocationSearch from './LocationSearch' // <--- Import New Component

const Navbar = () => {
  const { cartItems } = useCart()
  const { location, detectLocation, setLocation } = useLocation()
  const navigate = useNavigate()
  
  // State to control the popup
  const [showLocationModal, setShowLocationModal] = useState(false)
  
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))

  const handleLogout = () => {
    localStorage.removeItem('userInfo')
    alert('Logged out successfully')
    navigate('/login')
  }

  // Called when user clicks a suggestion from the list
  const handleSelectLocation = (place) => {
    const lat = parseFloat(place.lat)
    const lng = parseFloat(place.lon)
    // Format name nicely (First 3 parts)
    const formattedAddress = place.display_name.split(',').slice(0, 3).join(',')
    
    // Update Global State
    setLocation({ lat, lng, address: formattedAddress, loaded: true })
    localStorage.setItem('userLocation', JSON.stringify({ lat, lng, address: formattedAddress }))
    
    setShowLocationModal(false) // Close modal
  }

  // Called when user clicks "Use GPS"
  const handleGPS = () => {
    detectLocation()
    setShowLocationModal(false)
  }

  return (
    <>
      <nav style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '15px 40px', 
        backgroundColor: '#1a1a1a', 
        borderBottom: '1px solid #333',
        position: 'sticky', 
        top: 0, 
        zIndex: 100 
      }}>
        
        {/* Left Side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#FF6347', fontSize: '28px', fontWeight: 'bold' }}>
            🛵 TastyGo
          </Link>

          {/* Location Trigger */}
          <div 
            onClick={() => setShowLocationModal(true)} // <--- Opens Modal
            style={{ cursor: 'pointer', color: '#ccc', fontSize: '14px', display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}
          >
            <span style={{ fontWeight: 'bold', color: 'white', display: 'flex', alignItems: 'center', gap: '5px' }}>
              📍 {location.address.split(',')[0]} 
              <span style={{ fontSize: '10px' }}>▼</span>
            </span>
            <span style={{ fontSize: '12px', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {location.address}
            </span>
          </div>
        </div>

        {/* Right Side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#fff', fontSize: '16px' }}>Home</Link>
          <Link to="/cart" style={{ textDecoration: 'none', color: 'white', position: 'relative' }}>
            <span style={{ fontSize: '24px' }}>🛒</span>
            {cartItems.length > 0 && (
              <span style={{ position: 'absolute', top: '-8px', right: '-8px', backgroundColor: '#FF6347', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '12px', fontWeight: 'bold' }}>
                {cartItems.length}
              </span>
            )}
          </Link>
          {userInfo ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <Link to="/add-restaurant" style={{ textDecoration: 'none', color: '#28a745', fontWeight: 'bold' }}>+ Add New</Link>
              <Link to="/myorders" style={{ textDecoration: 'none', color: '#007bff' }}>My Orders</Link>
              <button onClick={handleLogout} style={{ padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Logout</button>
            </div>
          ) : (
            <Link to="/login">
              <button style={{ padding: '8px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Login</button>
            </Link>
          )}
        </div>
      </nav>

      {/* --- RENDER MODAL IF OPEN --- */}
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