import React from 'react'
import { useCart } from '../context/CartContext'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'

const Cart = () => {
  const { cartItems, removeFromCart, cartTotal } = useCart()
  const navigate = useNavigate()

  const handleCheckout = async () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    if (!userInfo) {
      toast.error('Please Login to Place Order')
      navigate('/login')
      return
    }

    const loadingToast = toast.loading('Starting Payment...')

    try {
      // 1. Get Razorpay Key from Backend
      const keyResponse = await fetch('/api/payment/get-key')
      const { key } = await keyResponse.json()

      // 2. Create Order on Backend
      const orderResponse = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: cartTotal })
      })
      const orderData = await orderResponse.json()

      toast.dismiss(loadingToast)

      // 3. Open Razorpay Popup
      const options = {
        key: key, 
        amount: orderData.amount,
        currency: "INR",
        name: "TastyGo Food",
        description: "Delicious Food Delivered",
        image: "https://cdn-icons-png.flaticon.com/512/732/732200.png", // Logo
        order_id: orderData.id, 
        handler: async function (response) {
          // 4. Payment Success -> Now Save Order to DB
          await placeOrderInDB(response.razorpay_payment_id)
        },
        prefill: {
          name: userInfo.name,
          email: userInfo.email,
          contact: "9999999999"
        },
        theme: {
          color: "#FF6347"
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();

    } catch (error) {
      toast.dismiss(loadingToast)
      console.error(error)
      toast.error('Payment Failed')
    }
  }

  // Helper function to save order after payment
  const placeOrderInDB = async (paymentId) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    const saveToast = toast.loading('Saving Order...')

    try {
      const orderData = {
        user: userInfo._id,
        restaurant: cartItems[0].restaurant,
        totalPrice: cartTotal,
        paymentMethod: 'Razorpay', // Changed from Credit Card
        paymentResult: { id: paymentId, status: 'success' }, // New Field
        orderItems: cartItems.map((item) => ({
          name: item.name,
          qty: item.qty,
          price: item.price,
          menuItem: item._id 
        }))
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      })

      toast.dismiss(saveToast)

      if (response.ok) {
        toast.success('Order Placed Successfully! 🚀')
        navigate('/')
      } else {
        toast.error('Failed to save order')
      }
    } catch (error) {
      toast.dismiss(saveToast)
      toast.error('Error connecting to server')
    }
  }

  if (cartItems.length === 0) return (
    <div style={{ textAlign: 'center', marginTop: '50px', color: '#fff' }}>
      <h2>Your Cart is Empty</h2>
      <Link to="/" style={{ color: '#FF6347', textDecoration: 'none' }}>Go back to Restaurants</Link>
    </div>
  )

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', color: '#fff' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Your Cart</h1>

      <div style={{ backgroundColor: '#1a1a1a', padding: '20px', borderRadius: '15px', border: '1px solid #444' }}>
        {cartItems.map((item, index) => (
          <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333', padding: '15px 0' }}>
            <div>
              <h3 style={{ margin: '0 0 5px 0' }}>{item.name}</h3>
              <p style={{ margin: 0, color: '#aaa' }}>₹{item.price} x {item.qty}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>₹{item.price * item.qty}</span>
              <button onClick={() => removeFromCart(item.name)} style={{ padding: '8px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Remove</button>
            </div>
          </div>
        ))}

        <div style={{ marginTop: '30px', textAlign: 'right', borderTop: '2px solid #444', paddingTop: '20px' }}>
          <h2 style={{ fontSize: '2rem' }}>Total: ₹{cartTotal}</h2>
          <button 
            onClick={handleCheckout}
            style={{ marginTop: '15px', padding: '15px 40px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '10px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Pay Now (Razorpay)
          </button>
        </div>
      </div>
    </div>
  )
}

export default Cart