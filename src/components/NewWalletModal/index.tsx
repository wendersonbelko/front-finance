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

// Schema para criação de carteira
const newWalletFormSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
})
type NewWalletFormInputs = z.infer<typeof newWalletFormSchema>

export function NewWalletModal({setOpenNewWalletModal}: { setOpenNewWalletModal: (open: boolean) => void }) {
  // Obtém a função de criação de carteira do WalletContext
  const createWallet = useContextSelector(WalletContext, (context) => context.createWallet)

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<NewWalletFormInputs>({
    resolver: zodResolver(newWalletFormSchema),
  })

  async function handleCreateNewWallet(data: NewWalletFormInputs) {
    if (data.name === '') return
    try {
      await createWallet(data)
      notification({ message: 'Carteira criada com sucesso' })
      setOpenNewWalletModal(false)
    } catch (error) {
      notification({ message: 'Erro ao criar carteira' })
    }
    reset()
  }

  return (
    <Dialog.Portal>
      <Overlay />

      <Content>
        <Dialog.Title style={{ marginBottom: 20, fontSize: 24 }}>
          Nova Carteira
        </Dialog.Title>

        <CloseButton>
          <X size={24} />
        </CloseButton>

        <form onSubmit={handleSubmit(handleCreateNewWallet)}>
          <input
            type="text"
            placeholder="Nome da Carteira"
            required
            {...register('name')}
          />

          <button type="submit" disabled={isSubmitting}>
            Criar Carteira
          </button>
        </form>
      </Content>
    </Dialog.Portal>
  )
}
