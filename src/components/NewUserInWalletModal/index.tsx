import { zodResolver } from '@hookform/resolvers/zod'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { useContextSelector } from 'use-context-selector'
import * as z from 'zod'
import { WalletContext } from '../../contexts/WalletContext'

import { CloseButton, Content, Overlay } from './styles'
import { toast } from 'react-toastify'

const notification = ({ message }: { message: string }) => {
  toast(message, {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  })
}

// Schema para adicionar usuário (somente email)
const newUserFormSchema = z.object({
  email: z.string().email('Email inválido'),
})
type NewUserFormInputs = z.infer<typeof newUserFormSchema>

export function NewUserInWalletModal({ setOpenNewWalletModal }: { setOpenNewWalletModal: (open: boolean) => void }) {
  // Obtém a função para adicionar usuário do WalletContext
  const addUser = useContextSelector(WalletContext, (context) => context.linkUserToWallet)
  const listUsersFromWallet = useContextSelector(WalletContext, (context) => context.listUsersFromWallet)

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<NewUserFormInputs>({
    resolver: zodResolver(newUserFormSchema),
  })

  async function handleAddNewUser(data: NewUserFormInputs) {
    if (data.email === '') return
    try {
      await addUser(data.email)
      notification({ message: 'Usuário adicionado com sucesso' })
      await listUsersFromWallet()
      setOpenNewWalletModal(false)
    } catch (error) {
      notification({ message: 'Erro ao adicionar usuário' })
    }
    reset()
  }

  return (
    <Dialog.Portal>
      <Overlay />

      <Content>
        <Dialog.Title style={{ marginBottom: 20, fontSize: 24 }}>
          Novo Usuário na Carteira
        </Dialog.Title>

        <CloseButton>
          <X size={24} />
        </CloseButton>

        <form onSubmit={handleSubmit(handleAddNewUser)}>
          <input
            type="email"
            placeholder="Email do usuário"
            required
            {...register('email')}
          />

          <button type="submit" disabled={isSubmitting}>
            Adicionar Usuário
          </button>
        </form>
      </Content>
    </Dialog.Portal>
  )
}
