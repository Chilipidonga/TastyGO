import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { toast } from 'react-hot-toast' // We use toast for notifications

const RestaurantMenu = () => {
  const { id } = useParams()
  const [restaurant, setRestaurant] = useState(null)
  const { addToCart, cartItems } = useCart()
  
  const [showAddForm, setShowAddForm] = useState(false)
  const [newItem, setNewItem] = useState({ name: '', price: '', description: '', image: '' })
  const [uploading, setUploading] = useState(false) // <--- New State for loading

  const userInfo = JSON.parse(localStorage.getItem('userInfo'))

  const fetchRestaurant = async () => {
    try {
      const response = await fetch(`/api/restaurants/${id}`)
      const data = await response.json()
      setRestaurant(data)
    } catch (error) {
      console.error('Error fetching menu:', error)
    }
  }

  useEffect(() => {
    fetchRestaurant()
  }, [id])

  // --- NEW: Image Upload Logic ---
  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true) // Start loading spinner
    const loadingToast = toast.loading('Uploading image...')

    const formData = new FormData()
    formData.append('file', file)
    
    // ⚠️ REPLACE 'YOUR_UPLOAD_PRESET' BELOW with the name you created (e.g., foodapp_upload)
    formData.append('upload_preset', 'foodapp_upload') 
    
    // ⚠️ REPLACE 'YOUR_CLOUD_NAME' BELOW with your Cloud Name
    const cloudName = 'debfit5nt' 

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      })
      
      const data = await res.json()
      
      // Save the URL we got back from Cloudinary
      setNewItem(prev => ({ ...prev, image: data.secure_url }))
      
      toast.dismiss(loadingToast)
      toast.success('Image uploaded!')
      setUploading(false) // Stop loading
    } catch (error) {
      console.error('Upload failed:', error)
      toast.dismiss(loadingToast)
      toast.error('Image upload failed')
      setUploading(false)
    }
  }

  const handleAddItem = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/restaurants/${id}/menu`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      })
      
      if (response.ok) {
        toast.success('Menu Item Added!')
        setShowAddForm(false)
        setNewItem({ name: '', price: '', description: '', image: '' })
        fetchRestaurant()
      }
    } catch (error) {
      toast.error('Failed to add item')
    }
  }

  if (!restaurant) return <h2 style={{ textAlign: 'center', marginTop: '50px', color: 'white' }}>Loading Menu...</h2>

  const isOwner = userInfo && restaurant.user === userInfo._id

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', paddingBottom: '80px', color: 'white' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '10px' }}>{restaurant.restaurantName}</h1>
        <p style={{ color: '#aaa', fontSize: '1.2rem' }}>{restaurant.cuisine} • {restaurant.address}</p>
        
        {isOwner && (
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              style={{ padding: '10px 20px', backgroundColor: '#555', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            >
              {showAddForm ? 'Cancel' : '➕ Add Menu Item'}
            </button>

            <Link to={`/admin/${id}`}>
              <button style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                 👨‍🍳 View Orders
              </button>
            </Link>
          </div>
        )}
      </div>

      {isOwner && showAddForm && (
        <div style={{ backgroundColor: '#222', padding: '20px', borderRadius: '10px', marginBottom: '30px', border: '1px solid #444' }}>
          <h3>Add New Dish</h3>
          <form onSubmit={handleAddItem} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            <input placeholder="Name" value={newItem.name} onChange={(e) => setNewItem({...newItem, name: e.target.value})} required style={inputStyle} />
            <input placeholder="Price" type="number" value={newItem.price} onChange={(e) => setNewItem({...newItem, price: e.target.value})} required style={inputStyle} />
            <input placeholder="Description" value={newItem.description} onChange={(e) => setNewItem({...newItem, description: e.target.value})} required style={inputStyle} />
            
            {/* File Input */}
            <input 
              type="file" 
              accept="image/*"
              onChange={handleImageUpload}
              style={{ color: 'white' }}
            />
            
            {/* Show Preview or Loading Status */}
            {uploading ? <span style={{color: '#aaa'}}>Uploading...</span> : null}
            {newItem.image && <img src={newItem.image} alt="Preview" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '5px' }} />}

            <button 
              type="submit" 
              disabled={uploading} // Disable button while uploading
              style={{ padding: '10px 20px', backgroundColor: uploading ? '#555' : '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: uploading ? 'not-allowed' : 'pointer' }}
            >
              Save
            </button>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
        {restaurant.menu.map((item, index) => (
          <div key={index} style={{ display: 'flex', border: '1px solid #444', borderRadius: '15px', overflow: 'hidden', backgroundColor: '#1a1a1a' }}>
            <img src={item.image || 'https://via.placeholder.com/150'} alt={item.name} style={{ width: '120px', height: '120px', objectFit: 'cover' }} />
            <div style={{ padding: '15px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h3 style={{ margin: '0 0 5px 0' }}>{item.name}</h3>
              <p style={{ fontSize: '12px', color: '#888', margin: '0 0 10px 0' }}>{item.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', fontSize: '18px' }}>₹{item.price}</span>
                <button 
                  onClick={() => addToCart({ ...item, restaurant: restaurant._id, image: item.image })} 
                  style={{ padding: '5px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                  Add +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {cartItems.length > 0 && (
        <Link to="/cart">
          <button style={{ position: 'fixed', bottom: '20px', right: '20px', padding: '15px 30px', backgroundColor: '#FF6347', color: 'white', border: 'none', borderRadius: '50px', fontSize: '18px', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', cursor: 'pointer' }}>
            🛒 View Cart ({cartItems.length})
          </button>
        </Link>
      )}
    </div>
  )
}

const inputStyle = { padding: '10px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#333', color: 'white' }

export default RestaurantMenu