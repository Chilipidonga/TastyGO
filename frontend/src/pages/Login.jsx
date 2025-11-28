import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast' // <--- Import

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false) // <--- New State
  const [error, setError] = useState('') 
  const navigate = useNavigate()

// ... inside the component ...

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('') 

    // Toast Loading (Optional, looks cool)
    const loadingToast = toast.loading('Logging in...')

    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()
      
      // Dismiss loading toast
      toast.dismiss(loadingToast)

      if (response.ok) {
        localStorage.setItem('userInfo', JSON.stringify(data))
        
        // SUCCESS TOAST
        toast.success(`Welcome back, ${data.name}!`)
        
        navigate('/') 
      } else {
        // ERROR TOAST
        toast.error(data.message || 'Login failed')
      }
    } catch (err) {
      toast.dismiss(loadingToast)
      toast.error('Failed to connect to server')
    }
  }
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '80vh',
      width: '100%'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '400px', 
        padding: '30px', 
        border: '1px solid #444', 
        borderRadius: '10px', 
        backgroundColor: '#1a1a1a' 
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Login</h2>
        
        {error && <p style={{ color: '#ff6b6b', textAlign: 'center' }}>{error}</p>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
          
          {/* Password Wrapper for the Eye Icon */}
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? "text" : "password"} // <--- Dynamic Type
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }}
            />
            <span 
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '15px',
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                fontSize: '18px'
              }}
            >
              {showPassword ? '🙈' : '👁️'} 
            </span>
          </div>

          <button type="submit" style={{ padding: '12px', backgroundColor: '#FF6347', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>
            Sign In
          </button>
        </form>
        <p style={{ marginTop: '20px', textAlign: 'center', color: '#aaa' }}>
          New Customer? <Link to="/register" style={{ color: '#FF6347' }}>Register</Link>
        </p>
      </div>
    </div>
  )
}

const inputStyle = {
  padding: '12px',
  fontSize: '16px',
  borderRadius: '5px',
  border: '1px solid #555',
  backgroundColor: '#333',
  color: 'white'
}

export default Login