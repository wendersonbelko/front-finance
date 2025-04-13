// src/components/AuthModal.tsx
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as Dialog from '@radix-ui/react-dialog'
import * as z from 'zod'
import { useContextSelector } from 'use-context-selector'
import { AuthContext } from '../../contexts/AuthContext'
import { Content, Overlay } from './styles'
import { ToastContainer, toast } from 'react-toastify'

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

// Schema para Login
const loginFormSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
})
type LoginFormInputs = z.infer<typeof loginFormSchema>

// Schema para Registro
const registerFormSchema = z
  .object({
    name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
    email: z.string().email({ message: 'Email inválido' }),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas devem ser iguais',
    path: ['confirmPassword'],
  })
type RegisterFormInputs = z.infer<typeof registerFormSchema>

export function AuthModal() {
  // Estado para alternar entre login e registro
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')

  // Obtém as funções do AuthContext
  const login = useContextSelector(AuthContext, (context) => context.login)
  const registerUser = useContextSelector(AuthContext, (context) => context.register)

  // Configuração do formulário conforme o modo atual
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<LoginFormInputs | RegisterFormInputs>({
    resolver: zodResolver(authMode === 'login' ? loginFormSchema : registerFormSchema),
  })

  // Reinicia o formulário sempre que o modo for alterado
  useEffect(() => {
    reset()
  }, [authMode, reset])

  async function onSubmit(data: LoginFormInputs | RegisterFormInputs) {
    if (authMode === 'login') {
      try {
        await login(data)
        notification({ message: 'Login efetuado com sucesso!' })
      }
      catch {
        notification({ message: 'Credenciais inválidas!' })
      }
    } else {
      try {
        await registerUser(data as RegisterFormInputs)
        notification({ message: 'Registro efetuado com sucesso!' })
      }
      catch {
        notification({ message: 'Erro ao registrar!' })
      }
    }
    reset()
  }

  return (
    <Dialog.Portal>
      <Overlay />

      <Content>
        <Dialog.Title style={{ marginBottom: 20, fontSize: 24 }}>
          {authMode === 'login' ? 'Login' : 'Registro'}
        </Dialog.Title>

        {/* Grupo de Radio Buttons para alternar entre Entrar e Cadastrar */}
        <div>
          <label style={{ paddingRight: 8 }}>
            <input
              type="radio"
              name="authMode"
              value="login"
              checked={authMode === 'login'}
              onChange={() => setAuthMode('login')}
            />
            Entrar
          </label>
          <label>
            <input
              type="radio"
              name="authMode"
              value="register"
              checked={authMode === 'register'}
              onChange={() => setAuthMode('register')}
            />
            Cadastrar
          </label>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {authMode === 'register' && (
            <input type="text" placeholder="Nome" required {...register('name')} />
          )}

          <input type="email" placeholder="Email" required {...register('email')} />

          <input type="password" placeholder="Senha" required {...register('password')} />

          {authMode === 'register' && (
            <input
              type="password"
              placeholder="Confirmar Senha"
              required
              {...register('confirmPassword')}
            />
          )}

          <button type="submit" disabled={isSubmitting}>
            {authMode === 'login' ? 'Entrar' : 'Registrar'}
          </button>
        </form>
      </Content>
    </Dialog.Portal>
  )
}
