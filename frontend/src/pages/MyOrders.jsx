import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const MyOrders = () => {
  const [orders, setOrders] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchOrders = async () => {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'))
      if (!userInfo) {
        navigate('/login')
        return
      }

      try {
        const response = await fetch(`/api/orders/user/${userInfo._id}`)
        const data = await response.json()
        setOrders(data)
      } catch (error) {
        console.error('Error fetching orders:', error)
      }
    }

    fetchOrders()
  }, [navigate])

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', color: '#fff' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>📦 My Orders</h1>

      {orders.length === 0 ? (
        <h3 style={{ textAlign: 'center', color: '#aaa' }}>No orders found.</h3>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map((order) => (
            <div key={order._id} style={{ 
              backgroundColor: '#1a1a1a', 
              border: '1px solid #444', 
              borderRadius: '10px', 
              padding: '20px',
              position: 'relative'
            }}>
              
              {/* Header: Restaurant Name & Status */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
                <h3 style={{ margin: 0 }}>
                  {order.restaurant ? order.restaurant.restaurantName : 'Restaurant Removed'}
                </h3>
                <span style={{ 
                  backgroundColor: order.status === 'Delivered' ? '#28a745' : '#ffc107', 
                  color: 'black', 
                  padding: '5px 10px', 
                  borderRadius: '20px', 
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {order.status}
                </span>
              </div>

              {/* Items List */}
              <div style={{ marginBottom: '15px' }}>
                {order.orderItems.map((item, index) => (
                  <div key={index} style={{ color: '#aaa', fontSize: '14px' }}>
                    {item.qty} x {item.name}
                  </div>
                ))}
              </div>

              {/* Footer: Date & Total */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px', color: '#777' }}>
                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>Total: ₹{order.totalPrice}</span>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyOrders