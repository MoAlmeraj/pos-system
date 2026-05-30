import { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [token, setToken]               = useState(localStorage.getItem('token'))
  const [businessName, setBusinessName] = useState(localStorage.getItem('businessName'))

  const login = useCallback((newToken, newBusinessName) => {
    localStorage.setItem('token', newToken)
    localStorage.setItem('businessName', newBusinessName)
    setToken(newToken)
    setBusinessName(newBusinessName)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('businessName')
    setToken(null)
    setBusinessName(null)
  }, [])

  return (
    <AuthContext.Provider value={{ token, businessName, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext)
}