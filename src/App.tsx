import { ThemeProvider } from 'styled-components'
import { TransactionsProvider } from './contexts/TransactionsContext'
import { AuthProvider } from './contexts/AuthContext'
import { Transactions } from './pages/Transactions'
import { GlobalStyle } from './styles/global'
import { defaultTheme } from './styles/themes/default'
import { WalletProvider } from './contexts/WalletContext'
import { CategoryProvider } from './contexts/CategoryContext'

export function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyle />

      <AuthProvider>
        <WalletProvider>
          <CategoryProvider>
            <TransactionsProvider>
              <Transactions />
            </TransactionsProvider>
          </CategoryProvider>
        </WalletProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
