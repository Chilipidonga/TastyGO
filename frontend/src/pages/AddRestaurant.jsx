import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast' // <--- 1. Import Toast

const AddRestaurant = () => {
  const [formData, setFormData] = useState({
    restaurantName: '',
    cuisine: '',
    address: '',
    lat: '',
    lng: '',
  })
  
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    if (!userInfo) {
      toast.error('You must be logged in as Admin') // <--- Error Toast
      return
    }

    // 2. Loading Toast
    const loadingToast = toast.loading('Adding Restaurant...')

    try {
      // Prepare data
      const newRestaurant = {
        user: userInfo._id,
        restaurantName: formData.restaurantName,
        cuisine: formData.cuisine,
        address: formData.address,
        location: {
          type: 'Point',
          coordinates: [parseFloat(formData.lng), parseFloat(formData.lat)]
        },
        // Default Sample Menu Item
        menu: [{
          name: "Sample Dish",
          price: 100,
          description: "Delicious food",
          image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
        }]
      }

      const response = await fetch('/api/restaurants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRestaurant),
      })

      // Dismiss loading
      toast.dismiss(loadingToast)

      if (response.ok) {
        toast.success('Restaurant Added Successfully! 🎉') // <--- Success Toast
        navigate('/') 
      } else {
        toast.error('Failed to add restaurant')
      }
    } catch (error) {
      toast.dismiss(loadingToast)
      console.error(error)
      toast.error('Error connecting to server')
    }
  }

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px', backgroundColor: '#1a1a1a', borderRadius: '10px', border: '1px solid #444', color: 'white' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Add New Restaurant</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input name="restaurantName" placeholder="Restaurant Name" onChange={handleChange} required style={inputStyle} />
        <input name="cuisine" placeholder="Cuisine (e.g., Italian)" onChange={handleChange} required style={inputStyle} />
        <input name="address" placeholder="Address" onChange={handleChange} required style={inputStyle} />
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <input name="lat" placeholder="Latitude (e.g., 12.97)" onChange={handleChange} required style={inputStyle} />
          <input name="lng" placeholder="Longitude (e.g., 77.59)" onChange={handleChange} required style={inputStyle} />
        </div>

        <button type="submit" style={{ padding: '12px', backgroundColor: '#FF6347', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          Add Restaurant
        </button>
      </form>
    </div>
  )
}

const inputStyle = {
  padding: '12px',
  borderRadius: '5px',
  border: '1px solid #555',
  backgroundColor: '#333',
  color: 'white',
  fontSize: '16px'
}

export default AddRestaurant