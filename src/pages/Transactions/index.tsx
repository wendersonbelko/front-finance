// pages/Transactions/index.tsx
import { useState, useEffect } from 'react';
import { useContextSelector } from 'use-context-selector';
import { Header } from '../../components/Header';
import { Summary } from '../../components/Summary';
import { TransactionsContext } from '../../contexts/TransactionsContext';
import { dateFormatter, priceFormatter } from '../../utils/formatter';
import { SearchForm } from './components/SearchForm';

import {
  PriceHighlight,
  TransactionsContainer,
  TransactionsTable,
} from './styles';
import { Pagination } from './components/Pagination';

export function Transactions() {
  const transactions = useContextSelector(TransactionsContext, (context) => context.transactions);
  const totalTransactions = useContextSelector(TransactionsContext, (context) => context.totalTransactions);
  const fetchTransactions = useContextSelector(TransactionsContext, (context) => context.fetchTransactions);

  const [page, setPage] = useState(1);
  const limit = 10;
  const totalPages = Math.ceil(totalTransactions / limit);

  useEffect(() => {
    // Busca as transações sempre que a página mudar
    fetchTransactions({ page, limit });
  }, [page, limit, fetchTransactions]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div>
      <Header />
      <Summary />

      <TransactionsContainer>
        <SearchForm />

        <TransactionsTable>
          <thead>
            <tr>
              <th style={{ width: '40%' }}>Descrição</th>
              <th>Valor</th>
              <th>Categoria</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {transactions?.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.description}</td>
                <td>
                  <PriceHighlight variant={transaction.type}>
                    {transaction.type === 'outcome' && '- '}
                    {priceFormatter.format(transaction.price)}
                  </PriceHighlight>
                </td>
                <td>{transaction.category?.name}</td>
                <td>
                  {dateFormatter.format(new Date(transaction.createdAt))}
                </td>
              </tr>
            ))}
          </tbody>
        </TransactionsTable>
      </TransactionsContainer>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
