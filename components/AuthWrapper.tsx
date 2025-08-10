import { useAuth } from '@/hooks/useAuth'
import React, { useEffect } from 'react'
import LoginPage from './LoginPage'

interface AuthWrapperProps {
  children: React.ReactNode
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { user, loading } = useAuth()

  // Check for user_id in localStorage on mount
  useEffect(() => {
    const userId = localStorage.getItem('user_id')
    if (!userId && !loading) {
      console.log('No user_id found in localStorage')
    }
  }, [loading])

  // Show loading spinner only briefly
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
          <p className="text-white text-lg">Loading your music...</p>
        </div>
      </div>
    )
  }

  // Show login page if no user
  if (!user) {
    return <LoginPage />
  }

  // Show main app if user is authenticated
  return <>{children}</>
}

export default AuthWrapper