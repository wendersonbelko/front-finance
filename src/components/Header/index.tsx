import React, { useState, useEffect } from 'react'
import { HeaderContainer, HeaderContent, NewTransactionButton, WalletSelect, NewWalletButton } from './styles'
import * as Dialog from '@radix-ui/react-dialog'
import Cookies from 'js-cookie'
import { useContextSelector } from 'use-context-selector'

import logoImg from '../../assets/logo.svg'
import { NewTransactionModal } from '../NewTransactionModal'
import { AuthModal } from '../Auth'
import { WalletContext } from '../../contexts/WalletContext'
import { NewWalletModal } from '../NewWalletModal'
import Avatar from '../Auth/Avatar'
import { NewUserInWalletModal } from '../NewUserInWalletModal'  // Importa o modal de novo usuário
import { TransactionsContext } from '../../contexts/TransactionsContext'
import { ScheduleCalendarModal } from '../ScheduleCalendarModal'

export function Header() {
  const [token, setToken] = useState(Cookies.get('token') || null)
  const [openNewWalletModal, setOpenNewWalletModal] = useState(false)
  const [openNewUserModal, setOpenNewUserModal] = useState(false)  // Novo estado para o modal de usuário
  const [openCalendar, setOpenCalendar] = useState(false)

  // Obtém a lista de carteiras do WalletContext
  const wallets = useContextSelector(WalletContext, (context) => context.wallets)
  const usersFromWallet = useContextSelector(WalletContext, (context) => context.users)
  const listUsersFromWallet = useContextSelector(WalletContext, (context) => context.listUsersFromWallet)
  const fetchTransactions = useContextSelector(TransactionsContext, (context) => context.fetchTransactions)

  // Recupera o id salvo do cookie ou define como vazio se não existir
  const savedWalletId = Cookies.get('selectedWalletId')
  const [selectedWalletId, setSelectedWalletId] = useState<number | ''>(
    savedWalletId ? parseInt(savedWalletId) : ''
  )

  // Função para atualizar a seleção e salvar no cookie
  function handleWalletChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const walletId = parseInt(e.target.value)
    setSelectedWalletId(walletId)
    Cookies.set('selectedWalletId', String(walletId), { expires: 7 })
    listUsersFromWallet()
    fetchTransactions()
  }

  // Se não houver seleção salva e houver carteiras, define a primeira carteira como padrão
  useEffect(() => {
    if (!savedWalletId && wallets.length > 0) {
      const firstWalletId = wallets[0].id
      setSelectedWalletId(firstWalletId)
      Cookies.set('selectedWalletId', String(firstWalletId), { expires: 7 })
      listUsersFromWallet()
      fetchTransactions()
    }
  }, [wallets, savedWalletId])

  useEffect(() => {
    const handleTokenChange = () => {
      const newToken = Cookies.get('token')
      setToken(newToken ? newToken : null)
    }

    window.addEventListener('tokenChanged', handleTokenChange)
    return () => window.removeEventListener('tokenChanged', handleTokenChange)
  }, [])

  return (
    <HeaderContainer>
      <HeaderContent>
        {/* <img src={logoImg} alt="Logo" /> */}

        {token ? (
          <>
            {/* Se houver token, exibe o select de carteiras e o botão para criar uma nova carteira */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <WalletSelect value={selectedWalletId} onChange={handleWalletChange}>
                {wallets.map((wallet) => (
                  <option key={wallet.id} value={wallet.id}>
                    {wallet.name}
                  </option>
                ))}
              </WalletSelect>

              <Dialog.Root open={openNewWalletModal} onOpenChange={setOpenNewWalletModal}>
                <Dialog.Trigger asChild>
                  <NewWalletButton onClick={() => setOpenNewWalletModal(true)}>+</NewWalletButton>
                </Dialog.Trigger>
                <NewWalletModal setOpenNewWalletModal={setOpenNewWalletModal} />
              </Dialog.Root>
            </div>

            {/* Botão para nova transação */}
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <NewTransactionButton>Nova transação</NewTransactionButton>
              </Dialog.Trigger>
              <NewTransactionModal />
            </Dialog.Root>
          </>
        ) : (
          // Se não houver token, exibe sempre o modal de autenticação
          <Dialog.Root open={!token}>
            <AuthModal />
          </Dialog.Root>
        )}

        <Dialog.Root open={openCalendar} onOpenChange={setOpenCalendar}>
          <Dialog.Trigger asChild>
            <button>Abrir Agenda</button>
          </Dialog.Trigger>

          <ScheduleCalendarModal
            events={[
              { title: 'Reunião', start: '2025-04-15', end: '2025-04-16' },
              { title: 'Aniversário', start: '2025-04-17' },
              { title: 'Reunião', start: '2025-04-18' },
              { title: 'Consulta', start: '2025-04-18' },
            ]}
          />
        </Dialog.Root>

      </HeaderContent>
      <HeaderContent>
        <div style={{ marginTop: '15px' }}>
          <h2>Usuários da carteira</h2>
          <div style={{ marginTop: '5px' }}>
            {usersFromWallet.length > 0 &&
              usersFromWallet.map((userWallet: any) => {
                return (
                  <Avatar
                    size={32}
                    shape="square"
                    name={userWallet.user.name}
                    tooltip={userWallet.user.name}
                    key={userWallet.user.id}
                  />
                )
              })}
            <Dialog.Root open={openNewUserModal} onOpenChange={setOpenNewUserModal}>
              <Dialog.Trigger asChild>
                <Avatar
                  size={32}
                  shape="square"
                  name="+"
                  tooltip="Adicionar usuário"
                  pointer
                  backgroundColor="#4B5563"
                />
              </Dialog.Trigger>
              <NewUserInWalletModal setOpenNewWalletModal={setOpenNewUserModal} />
            </Dialog.Root>
          </div>
        </div>
      </HeaderContent>
    </HeaderContainer>
  )
}
