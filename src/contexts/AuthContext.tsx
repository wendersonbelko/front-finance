import { ReactNode, useCallback, useEffect, useState } from 'react'
import { createContext } from 'use-context-selector'
import api from '../lib/axios'
import Cookies from 'js-cookie'

interface LoginInput {
  email: string
  password: string
}

interface RegisterInput {
  name: string
  email: string
  password: string
}

interface AuthContextType {
  token: string | null
  login: (data: LoginInput) => Promise<void>
  register: (data: RegisterInput) => Promise<void>
  logout: () => void
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(null)

  // Recupera o token dos cookies ao carregar o componente
  useEffect(() => {
    const tokenFromCookie = Cookies.get('token')
    if (tokenFromCookie) {
      setToken(tokenFromCookie)
    }
  }, [])

  // Função para efetuar login
  const login = useCallback(async (data: LoginInput) => {
    const response = await api.post('/auth/login', data)
    // Supomos que o backend retorne o token no campo "token"
    const { token } = response.data
    setToken(token)
    // Salva o token no cookie com validade de 1 dia
    Cookies.set('token', token, { expires: 1 })
    window.dispatchEvent(new Event('tokenChanged'))
  }, [])

  // Função para efetuar registro
  const register = useCallback(async (data: RegisterInput) => {
    const response = await api.post('/auth/register', data)
    // Supondo que após o registro o backend retorne também um token
    const { token } = response.data
    setToken(token)
    Cookies.set('token', token, { expires: 1 })
    window.dispatchEvent(new Event('tokenChanged'))
  }, [])

  // Função para logout, removendo o token do estado e dos cookies
  const logout = useCallback(() => {
    setToken(null)
    Cookies.remove('token')
  }, [])

  return (
    <AuthContext.Provider value={{ token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
