'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'

function SignInForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const message = searchParams.get('message')

  useEffect(() => {
    if (message) {
      setError(message)
    }
  }, [message])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'
      
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        setError('Credenciales inválidas')
      } else if (result?.ok) {
        router.push(callbackUrl)
      }
    } catch {
      setError('Error de conexión. Inténtalo de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark relative overflow-hidden">
      {/* Fondo decorativo similar al Hero */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <div className="w-full h-full bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 dark:from-emerald-900/20 dark:via-blue-900/20 dark:to-purple-900/20"></div>
        {/* Patrón de fondo decorativo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-blue-400 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-purple-400 rounded-full blur-3xl"></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-background-light/90 via-background-light/70 to-background-light dark:from-background-dark/90 dark:via-background-dark/70 dark:to-background-dark"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            {/* Logo horizontal de Estrella del Sur */}
            <div className="flex justify-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-text-light dark:text-text-dark font-condensed">
                <span className="text-primary">Estrella del Sur</span>
              </h1>
            </div>
          </div>
          
          <div className="bg-card-light dark:bg-card-dark rounded-2xl shadow-2xl p-8 border border-border-light dark:border-border-dark">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                    Correo electrónico
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-border-light dark:border-border-dark rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark transition-colors"
                    placeholder="tu@email.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                    Contraseña
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-border-light dark:border-border-dark rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark transition-colors"
                    placeholder="Tu contraseña"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary border-border-light dark:border-border-dark rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-text-light dark:text-text-dark">
                    Recordarme
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-primary hover:text-primary/80 transition-colors">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
              </div>

              {error && (
                <div className={`px-4 py-3 rounded-lg text-sm ${
                  error.includes('exitosamente') 
                    ? 'bg-green-50 border border-green-200 text-green-600 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300'
                    : 'bg-red-50 border border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300'
                }`}>
                  {error}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl font-condensed font-bold"
                >
                  {isLoading ? 'Iniciando sesión...' : 'INICIAR SESIÓN'}
                </button>
              </div>

            </form>
          </div>
          
          {/* Enlace para regresar al inicio */}
          <div className="text-center mt-6">
            <Link 
              href="/" 
              className="text-text-light dark:text-text-dark hover:text-primary dark:hover:text-primary transition-colors font-medium"
            >
              ← Regresar al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-text-light dark:text-text-dark font-condensed mb-4">
            <span className="text-primary">Estrella del Sur</span>
          </h1>
          <p className="text-text-light dark:text-text-dark">Cargando...</p>
        </div>
      </div>
    }>
      <SignInForm />
    </Suspense>
  )
}