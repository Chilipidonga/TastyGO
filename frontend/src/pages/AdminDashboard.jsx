import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const AdminDashboard = () => {
  const { id } = useParams() // Restaurant ID
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`/api/orders/restaurant/${id}`)
        const data = await response.json()
        setOrders(data)
      } catch (error) {
        console.error('Error fetching orders:', error)
      }
    }
    fetchOrders()
  }, [id])

  // Calculate Total Earnings
  const totalEarnings = orders.reduce((acc, order) => acc + order.totalPrice, 0)

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', color: 'white' }}>
      <h1 style={{ textAlign: 'center' }}>👨‍🍳 Kitchen Dashboard</h1>
      
      <div style={{ textAlign: 'center', margin: '20px 0', padding: '20px', backgroundColor: '#1a1a1a', borderRadius: '10px', border: '1px solid #444' }}>
        <h2>Total Revenue: <span style={{ color: '#28a745' }}>₹{totalEarnings}</span></h2>
        <p>Total Orders: {orders.length}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {orders.length === 0 ? <p style={{textAlign: 'center', color: '#888'}}>No orders yet.</p> : orders.map((order) => (
          <div key={order._id} style={{ backgroundColor: '#222', padding: '20px', borderRadius: '10px', border: '1px solid #444' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #444', paddingBottom: '10px', marginBottom: '10px' }}>
              <span><strong>Customer:</strong> {order.user ? order.user.name : 'Unknown'}</span>
              <span style={{ color: '#aaa' }}>{new Date(order.createdAt).toLocaleString()}</span>
            </div>

            <div style={{ marginBottom: '15px' }}>
              {order.orderItems.map((item, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', color: '#ccc' }}>
                  <span>{item.qty} x {item.name}</span>
                  <span>₹{item.price}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #444' }}>
               <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Total: ₹{order.totalPrice}</span>
               <button style={{ padding: '8px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                 Mark Ready
               </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminDashboard