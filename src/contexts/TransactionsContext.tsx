import { ReactNode, useCallback, useEffect, useState } from 'react'
import { createContext } from 'use-context-selector'
import api from '../lib/axios'
import Cookies from 'js-cookie'

interface Transaction {
  id: number
  description: string
  type: 'income' | 'outcome'
  price: number
  category: {
    name: string
    id: number
  }
  createdAt: string
}

interface CreateTransactionInput {
  description: string
  price: number
  category: string
  type: 'income' | 'outcome'
}

export interface GetTransactionParams {
  search?: string
  startDate?: string
  endDate?: string
  category?: number
  limit?: number
  page?: number
}

interface TransactionContextType {
  transactions: Transaction[]
  totalTransactions: number
  fetchTransactions: (data?: GetTransactionParams) => Promise<void>
  createTransaction: (data: CreateTransactionInput) => Promise<void>
}

interface TransactionsProviderProps {
  children: ReactNode
}

export const TransactionsContext = createContext({} as TransactionContextType)

export function TransactionsProvider({ children }: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [totalTransactions, setTotalTransactions] = useState<number>(0)

  // Função para buscar transações com suporte à paginação
  const fetchTransactions = useCallback(async (params?: GetTransactionParams) => {
    const selectedWalletId = Cookies.get('selectedWalletId')
    // Define valores padrão para paginação se não forem informados
    const defaultParams: GetTransactionParams = {
      page: 1,
      limit: 10,
      ...params,
    }

    const response = await api.get('transactions', {
      params: {
        walletId: selectedWalletId,
        ...defaultParams,
      },
    })

    // O backend deve retornar { transactions: Transaction[], total: number }
    setTransactions(response.data.transactions.transactions)
    setTotalTransactions(Number(response.data.transactions.total) || 0)
  }, [])

  // Cria uma nova transação e atualiza a lista e o total de transações
  const createTransaction = useCallback(
    async (data: CreateTransactionInput) => {
      const selectedWalletId = Cookies.get('selectedWalletId')

      const { description, price, category, type } = data

      if (!selectedWalletId) {
        throw new Error('Wallet not selected')
      }

      const response = await api.post('transactions', {
        description,
        price,
        categoryId: parseInt(category),
        type,
        createdAt: new Date().toISOString(),
        walletId: parseInt(selectedWalletId as string),
        status: 'PENDING',
      })

      // O backend retorna { transaction: Transaction }
      setTransactions((state) => [response.data.transaction, ...state])
      setTotalTransactions((prevTotal) => prevTotal + 1)
    },
    []
  )

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        totalTransactions,
        fetchTransactions,
        createTransaction,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  )
}
