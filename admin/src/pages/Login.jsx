import axios from 'axios'
import React, { useContext, useState } from 'react'
import { StylistContext } from '../context/StylistContext'
import { AdminContext } from '../context/AdminContext'
import { toast } from 'react-toastify'

/**
 * Login Component for Admin/Stylist Panel
 * Allows switching between Admin and Stylist login
 * Handles authentication for both roles
 */
const Login = () => {
  const [state, setState] = useState('Admin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const { setSToken } = useContext(StylistContext)
  const { setAToken } = useContext(AdminContext)

  /**
   * Handle form submission for both Admin and Stylist login
   * Stores token in localStorage and context on success
   */
  const onSubmitHandler = async (event) => {
    event.preventDefault()
    try {
      if (state === 'Admin') {
        // Admin login API call
        const { data } = await axios.post(backendUrl + '/api/admin/login', {
          email,
          password,
        })
        if (data.success) {
          setAToken(data.token)
          localStorage.setItem('aToken', data.token)
          toast.success('Admin Login Successful')
        } else {
          toast.error(data.message)
        }
      } else {
        // Stylist login API call
        const { data } = await axios.post(backendUrl + '/api/stylist/login', {
          email,
          password,
        })
        if (data.success) {
          setSToken(data.token)
          localStorage.setItem('sToken', data.token)
          toast.success('Stylist Login Successful')
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
        {/* Login title with role indicator */}
        <p className="text-2xl font-semibold m-auto">
          <span className="text-primary">{state}</span> Login
        </p>

        {/* Email input field */}
        <div className="w-full ">
          <p>Email Address</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="border border-[#DADADA] rounded w-full p-2 mt-1 outline-primary"
            type="email"
            placeholder="admin@example.com"
            required
          />
        </div>

        {/* Password input field */}
        <div className="w-full ">
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="border border-[#DADADA] rounded w-full p-2 mt-1 outline-primary"
            type="password"
            placeholder="●●●●●●●●"
            required
          />
        </div>

        {/* Submit button */}
        <button className="bg-primary text-white w-full py-2 rounded-md text-base mt-2 hover:bg-opacity-90 transition-all">
          Login
        </button>

        {/* Toggle between Admin and Stylist login */}
        {state === 'Admin' ? (
          <p>
            Stylist Login?{' '}
            <span
              onClick={() => setState('Stylist')}
              className="text-primary underline cursor-pointer font-medium"
            >
              Click here
            </span>
          </p>
        ) : (
          <p>
            Admin Login?{' '}
            <span
              onClick={() => setState('Admin')}
              className="text-primary underline cursor-pointer font-medium"
            >
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  )
}

export default Login
