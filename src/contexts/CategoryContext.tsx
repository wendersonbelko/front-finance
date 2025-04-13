// src/contexts/CategoryContext.tsx
import { ReactNode, useCallback, useEffect, useState } from 'react'
import { createContext, useContextSelector } from 'use-context-selector'
import api from '../lib/axios'
import { AuthContext } from './AuthContext'
import Cookies from 'js-cookie'

export interface Category {
  id: number
  name: string
  // Adicione outros campos se necessário
}

export interface CreateCategoryInput {
  name: string
}

export interface CategoryContextType {
  categories: Category[]
  fetchCategories: () => Promise<void>
  createCategory: (data: CreateCategoryInput) => Promise<void>
}

interface CategoryProviderProps {
  children: ReactNode
}

export const CategoryContext = createContext({} as CategoryContextType)

export function CategoryProvider({ children }: CategoryProviderProps) {
  const [categories, setCategories] = useState<Category[]>([])
  // Obtém o token do AuthContext ou dos cookies, se necessário
  const tokenFromContext = useContextSelector(AuthContext, (context) => context.token)
  const token = tokenFromContext || Cookies.get('token')

  // Função para buscar as categorias
  const fetchCategories = useCallback(async () => {
    if (!token) return
    try {
      const response = await api.get('/categories', {
        headers: { Authorization: `Bearer ${token}` },
      })
      // Supondo que a resposta retorne um array em response.data.categories
      setCategories(response.data.categories)
    } catch (error) {
      console.error('Erro ao buscar categorias:', error)
    }
  }, [token])

  // Função para criar uma nova categoria
  const createCategory = useCallback(async (data: CreateCategoryInput) => {
    if (!token) return
    try {
      const response = await api.post('/category', data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      // Supondo que a resposta retorne { category: Category }
      setCategories((prev) => [response.data.category, ...prev])
    } catch (error) {
      console.error('Erro ao criar categoria:', error)
    }
  }, [token])

  useEffect(() => {
    if (token) {
      fetchCategories()
    }
  }, [token, fetchCategories])

  return (
    <CategoryContext.Provider value={{ categories, fetchCategories, createCategory }}>
      {children}
    </CategoryContext.Provider>
  )
}
