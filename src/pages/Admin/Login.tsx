import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../services/supabase/client'
import { useAuth } from '../../context/AuthContext'

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  const navigate = useNavigate()
  const { user } = useAuth()

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate('/admin')
    }
  }, [user, navigate])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      const errorMessage = signInError.message
      if (errorMessage === 'Failed to fetch') {
        setError("We couldn't connect to the authentication service. Please check your connection and try again.")
      } else if (errorMessage.toLowerCase().includes('invalid login credentials')) {
        setError('Incorrect email or password.')
      } else if (errorMessage.toLowerCase().includes('unavailable') || (signInError as any).status >= 500) {
        setError('The authentication service is temporarily unavailable. Please try again shortly.')
      } else {
        setError('Something went wrong while signing you in. Please try again.')
        console.error('Login error:', signInError)
      }
      setIsLoading(false)
    } else {
      navigate('/admin')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-gray py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-sm border border-border-gray">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-charcoal tracking-tight">
            Gentle Electronics
          </h2>
          <p className="mt-2 text-center text-sm text-secondary-charcoal font-medium">
            Admin Portal
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
              {error}
            </div>
          )}
          
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-charcoal mb-1">
                Email
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-border-gray placeholder-gray-400 text-charcoal rounded-md focus:outline-none focus:ring-orange focus:border-orange focus:z-10 sm:text-sm transition-colors"
                placeholder="admin@gentleelectronics.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-charcoal mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-border-gray placeholder-gray-400 text-charcoal rounded-md focus:outline-none focus:ring-orange focus:border-orange focus:z-10 sm:text-sm transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange hover:bg-orange-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange disabled:opacity-50 transition-colors shadow-sm"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin
