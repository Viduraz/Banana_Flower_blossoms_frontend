import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  // Check if user is logged in on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      const userData = JSON.parse(storedUser)
      setUser(userData)
      setIsAdmin(userData.roles?.includes('ROLE_ADMIN') || false)
    }
    setIsLoading(false)
  }, [])

  const login = (userData) => {
    setUser(userData)
    setIsAdmin(userData.roles?.includes('ROLE_ADMIN') || false)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    setIsAdmin(false)
    localStorage.removeItem('user')
  }

  const updateUser = (updatedUserData) => {
    setUser(updatedUserData)
    setIsAdmin(updatedUserData.roles?.includes('ROLE_ADMIN') || false)
    localStorage.setItem('user', JSON.stringify(updatedUserData))
  }

  const value = {
    user,
    isAdmin,
    isLoading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
    