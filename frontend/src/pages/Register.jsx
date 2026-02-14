import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [showPassword, setShowPassword] = useState(false) // <--- New State
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, phone, address: [] }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('userInfo', JSON.stringify(data))
        alert('Registration Successful!')
        navigate('/')
      } else {
        setError(data.message || 'Registration failed')
      }
    } catch (err) {
      setError('Failed to connect to server')
      console.error(err)
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
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Create Account</h2>
        {error && <p style={{ color: '#ff6b6b', textAlign: 'center' }}>{error}</p>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            style={inputStyle}
          />
          
          {/* Password Wrapper for the Eye Icon */}
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
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
          
          <button type="submit" style={{ padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>
            Register
          </button>
        </form>

        <p style={{ marginTop: '20px', textAlign: 'center', color: '#aaa' }}>
          Already have an account? <Link to="/login" style={{ color: '#28a745' }}>Login</Link>
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

export default Register