import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLocation } from '../context/LocationContext' // <--- Import Location

const Home = () => {
  const [restaurants, setRestaurants] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  
  // Get global location
  const { location } = useLocation()

  // Fetch restaurants whenever location changes
  useEffect(() => {
    const fetchRestaurants = async (lat = '', lng = '') => {
    try {
      let url = '/api/restaurants'
      if (lat && lng) {
        url = `/api/restaurants?lat=${lat}&lng=${lng}`
      }

      const response = await fetch(url)
      const data = await response.json()

      // SAFETY CHECK: Only set data if it's an array
      if (Array.isArray(data)) {
        setRestaurants(data)
      } else {
        console.error("API returned error:", data)
        setRestaurants([]) // Set empty list on error to prevent crash
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error)
      setRestaurants([])
    }
  }

    // Only fetch if location is "loaded" (prevents double fetching)
    fetchRestaurants()
    
  }, [location.lat, location.lng]) // <--- Re-run when these change

  // Filter Logic
  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.restaurantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        
        {/* Dynamic Title based on Location */}
        <h1 style={{ fontSize: '3rem', marginBottom: '10px' }}>
          {location.address === 'Select Location' ? '🍽️ All Restaurants' : `🍽️ Near You`}
        </h1>
        
        <p style={{ color: '#aaa' }}>
          {location.address === 'Select Location' ? 'Click the location in navbar to find food nearby' : `Showing results for: ${location.address}`}
        </p>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search for restaurant or cuisine..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            marginTop: '20px',
            padding: '12px 20px',
            width: '100%',
            maxWidth: '400px',
            fontSize: '16px',
            borderRadius: '30px',
            border: '1px solid #555',
            backgroundColor: '#1a1a1a',
            color: 'white',
            outline: 'none',
            textAlign: 'center'
          }}
        />
      </div>
      
      {/* List */}
      {filteredRestaurants.length === 0 ? (
        <h3 style={{ textAlign: 'center', color: '#aaa' }}>No restaurants found nearby.</h3>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', justifyContent: 'center' }}>
          {filteredRestaurants.map((restaurant) => (
            <div key={restaurant._id} style={{ border: '1px solid #444', borderRadius: '15px', overflow: 'hidden', backgroundColor: '#1a1a1a', boxShadow: '0 4px 8px rgba(0,0,0,0.3)', textAlign: 'left' }}>
              {restaurant.menu[0] && (
                <img src={restaurant.menu[0].image} alt={restaurant.restaurantName} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              )}
              <div style={{ padding: '20px' }}>
                <h2 style={{ margin: '0 0 10px 0', color: '#fff' }}>{restaurant.restaurantName}</h2>
                <p style={{ color: '#aaa', margin: '0 0 5px 0' }}>{restaurant.cuisine}</p>
                <p style={{ fontSize: '14px', color: '#777' }}>{restaurant.address}</p>
                <Link to={`/restaurant/${restaurant._id}`}>
                  <button style={{ marginTop: '15px', width: '100%', padding: '12px', backgroundColor: '#FF6347', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
                    View Menu
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Home