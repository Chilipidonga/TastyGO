import React, { useState } from 'react'

const LocationSearch = ({ onClose, onSelectLocation, onUseGPS }) => {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])

  // Fetch address suggestions from OpenStreetMap
  const handleSearch = async (e) => {
    const value = e.target.value
    setQuery(value)

    if (value.length > 2) {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${value}`)
        const data = await response.json()
        setSuggestions(data)
      } catch (error) {
        console.error("Error searching:", error)
      }
    } else {
      setSuggestions([])
    }
  }

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        
        {/* Header & Close Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3 style={{ margin: 0, color: '#333' }}>Change Location</h3>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', fontSize: '20px', cursor: 'pointer', color: '#999' }}>✖</button>
        </div>

        {/* Search Input */}
        <input 
          type="text" 
          placeholder="Search for area, street name..." 
          value={query}
          onChange={handleSearch}
          style={inputStyle}
          autoFocus
        />

        {/* GPS Option */}
        <div onClick={onUseGPS} style={gpsOptionStyle}>
          <span style={{ fontSize: '18px' }}>📍</span>
          <div>
            <span style={{ fontWeight: 'bold', color: '#e46d47' }}>Use my current location</span>
            <div style={{ fontSize: '12px', color: '#999' }}>Using GPS</div>
          </div>
        </div>

        {/* Search Results List */}
        <div style={{ maxHeight: '300px', overflowY: 'auto', marginTop: '10px' }}>
          {suggestions.map((place) => (
            <div 
              key={place.place_id} 
              onClick={() => onSelectLocation(place)}
              style={resultItemStyle}
            >
              <div style={{ fontWeight: 'bold', color: '#333' }}>
                {place.display_name.split(',')[0]}
              </div>
              <div style={{ fontSize: '12px', color: '#777', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {place.display_name}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

// --- CSS Styles ---
const overlayStyle = {
  position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
  backgroundColor: 'rgba(0,0,0,0.6)',
  display: 'flex', justifyContent: 'center', alignItems: 'start',
  paddingTop: '80px',
  zIndex: 1000
}

const modalStyle = {
  backgroundColor: 'white',
  width: '100%', maxWidth: '500px',
  borderRadius: '10px',
  padding: '20px',
  boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
  animation: 'slideDown 0.3s ease-out'
}

const inputStyle = {
  width: '100%', padding: '12px', borderRadius: '5px',
  border: '1px solid #ddd', fontSize: '16px', marginBottom: '15px',
  boxSizing: 'border-box'
}

const gpsOptionStyle = {
  display: 'flex', alignItems: 'center', gap: '15px',
  padding: '15px 0', borderBottom: '1px solid #eee',
  cursor: 'pointer'
}

const resultItemStyle = {
  padding: '15px 0', borderBottom: '1px solid #eee', cursor: 'pointer',
  textAlign: 'left'
}

export default LocationSearch