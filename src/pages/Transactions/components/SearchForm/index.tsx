import { MagnifyingGlass } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { SearchFormContainer, SelectInput } from './styles'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { GetTransactionParams, TransactionsContext } from '../../../../contexts/TransactionsContext'
import { useContextSelector } from 'use-context-selector'
import { CategoryContext } from '../../../../contexts/CategoryContext'

const searchFormSchema = z.object({
  search: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  category: z.string().optional(),
})

export function SearchForm() {
  // Calcula o primeiro e último dia do mês atual
  const categories = useContextSelector(CategoryContext, (context) => context.categories)

  const currentDate = new Date()
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0]
  const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString().split('T')[0]

  const fetchTransactions = useContextSelector(
    TransactionsContext,
    (context) => context.fetchTransactions
  )

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<GetTransactionParams>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      search: '',
      startDate: firstDay,
      endDate: lastDay,
    },
  })

  async function handleSearchTransactions(data: GetTransactionParams) {
    // Aqui você envia os filtros para buscar as transações:
    // data.query, data.startDate, data.endDate e data.category
    await fetchTransactions({
      search: data.search,
      startDate: data.startDate,
      endDate: data.endDate,
      category: data.category,
    })
  }

  return (
    <SearchFormContainer onSubmit={handleSubmit(handleSearchTransactions)}>
      <input
        type="text"
        placeholder="Busque por transações"
        {...register('search')}
      />

      <input 
        type="date"
        {...register('startDate')}
      />

      <input 
        type="date"
        {...register('endDate')}
      />

      <SelectInput {...register('category')}>
        <option value="">Todas as categorias</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </SelectInput>

      <button type="submit" disabled={isSubmitting}>
        <MagnifyingGlass size={20} />
        Buscar
      </button>
    </SearchFormContainer>
  )
}
