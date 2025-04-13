// src/contexts/WalletContext.tsx
import { ReactNode, useCallback, useEffect, useState } from 'react'
import { createContext, useContextSelector } from 'use-context-selector'
import api from '../lib/axios'
import { AuthContext } from './AuthContext'
import Cookies from 'js-cookie'

export interface Wallet {
  id: number
  name: string
  // Adicione outros campos da carteira, se necessário
}

export interface Users {
  id: number
  name: string
}

export interface CreateWalletInput {
  name: string
}

export interface WalletContextType {
  wallets: Wallet[]
  fetchWallets: () => Promise<void>
  createWallet: (data: CreateWalletInput) => Promise<void>
  linkUserToWallet: (userEmail: string) => Promise<void>
  listUsersFromWallet: (walletId?: number) => Promise<void>
  users: Users[]
}

interface WalletProviderProps {
  children: ReactNode
}

export const WalletContext = createContext({} as WalletContextType)

export function WalletProvider({ children }: WalletProviderProps) {
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [users, setUsers] = useState<Users[]>([])
  // Obtém o token do AuthContext
  const tokenFromContext = useContextSelector(AuthContext, (context) => context.token)
  // Se o token não estiver disponível no contexto, tenta recuperá-lo dos cookies
  const token = tokenFromContext || Cookies.get('token')

  // Função para buscar as carteiras
  const fetchWallets = useCallback(async () => {
    if (!token) return
    try {
      const response = await api.get('/wallet', {
        headers: { Authorization: `Bearer ${token}` },
      })
      // Mapeia a resposta para extrair o objeto "wallet" de cada item
      const walletList: Wallet[] = response.data.wallets.map((item: { wallet: Wallet }) => {
        return item.wallet
      })
      setWallets(walletList)
    } catch (error) {
      console.error('Erro ao buscar carteiras:', error)
    }
  }, [token])

  // Função para criar uma nova carteira
  const createWallet = useCallback(async (data: CreateWalletInput) => {
    if (!token) return
    try {
      const response = await api.post('/wallet', data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      // Supondo que a resposta retorne { wallet: Wallet }
      setWallets((prev) => [response.data.wallet, ...prev])
    } catch (error) {
      console.error('Erro ao criar carteira:', error)
    }
  }, [token])

  const linkUserToWallet = useCallback(async (userEmail: string) => {
    if (!token) return

    const walletId = Cookies.get('selectedWalletId')

    try {
      await api.post(`/wallet/${walletId}`, {
        email: userEmail,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      })
    } catch (error) {
      console.error('Erro ao vincular usuário à carteira:', error)
    }
  }, [token])

  const listUsersFromWallet = useCallback(async (walletId?: number): Promise<void> => {
    if (!token) return

    if (!walletId) {
      const selectedWalletId = Cookies.get('selectedWalletId')
      if (selectedWalletId) {
        walletId = parseInt(selectedWalletId)
      }
    }

    try {
      const response = await api.get(`/wallet/${walletId}/user`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUsers(response.data.inWallet)
      return response.data.inWallet
    } catch (error) {
      console.error('Erro ao buscar usuários da carteira:', error)
      return
    }
  }, [token])

  useEffect(() => {
    if (token) {
      fetchWallets()
      listUsersFromWallet()
    }
  }, [token, fetchWallets, listUsersFromWallet])

  return (
    <WalletContext.Provider value={{
      wallets,
      fetchWallets,
      createWallet,
      linkUserToWallet,
      listUsersFromWallet,
      users,
    }}>
      {children}
    </WalletContext.Provider>
  )
}
