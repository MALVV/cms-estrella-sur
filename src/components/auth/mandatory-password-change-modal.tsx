"use client"

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import { getSession, signOut, signIn, useSession } from 'next-auth/react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form'
import { useToast } from '@/components/ui/use-toast'
import { Eye, EyeOff, Shield, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'

const passwordChangeSchema = z.object({
  newPassword: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
    .regex(/[a-z]/, 'Debe contener al menos una letra minúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número')
    .regex(/[^A-Za-z0-9]/, 'Debe contener al menos un carácter especial'),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
})

type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>

interface MandatoryPasswordChangeModalProps {
  isOpen: boolean
  onPasswordChanged: () => void
  userName?: string
}

export function MandatoryPasswordChangeModal({ 
  isOpen, 
  onPasswordChanged, 
  userName 
}: MandatoryPasswordChangeModalProps) {
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const { data: session } = useSession()

  const form = useForm<PasswordChangeFormData>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: ''
    }
  })

  const newPassword = form.watch('newPassword')
  const confirmPassword = form.watch('confirmPassword')

  const getPasswordStrength = (password: string) => {
    let strength = 0
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password)
    }
    
    strength = Object.values(checks).filter(Boolean).length
    return { strength, checks }
  }

  const passwordStrength = getPasswordStrength(newPassword || '')

  const onSubmit = async (data: PasswordChangeFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/auth/simple-change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newPassword: data.newPassword
        }),
      })

      if (response.ok) {
        // Mostrar estado de éxito
        setShowSuccess(true)
        form.reset()
        
        // Esperar un momento para que el usuario vea el mensaje de éxito
        setTimeout(async () => {
          console.log('🔄 Contraseña cambiada exitosamente en el modal')
          
          // Cerrar el modal primero
          onPasswordChanged()
          
          // Redirigir al login para nueva sesión
          console.log('🔄 Redirigiendo al login para nueva sesión')
          window.location.href = '/auth/sign-in?message=password-changed'
        }, 2000)
      } else {
        const errorData = await response.json()
        toast({
          title: "❌ Error al cambiar contraseña",
          description: errorData.message || "No se pudo cambiar la contraseña",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error changing password:', error)
      toast({
        title: "❌ Error de conexión",
        description: "No se pudo conectar con el servidor",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => {}} modal>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {showSuccess ? (
              <>
                <CheckCircle className="h-6 w-6 text-green-500" />
                Contraseña Actualizada
              </>
            ) : (
              <>
                <Shield className="h-6 w-6 text-orange-500" />
                Cambio de Contraseña Obligatorio
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-base">
            {showSuccess ? (
              `¡Excelente! Tu contraseña ha sido actualizada correctamente. Iniciando sesión automáticamente...`
            ) : (
              `${userName ? `Hola ${userName}, ` : ''}Por seguridad, debes cambiar tu contraseña antes de continuar.`
            )}
          </DialogDescription>
        </DialogHeader>

        {showSuccess ? (
          // Estado de éxito
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-4">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
                ¡Contraseña Actualizada Correctamente!
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300 mb-4">
                Tu contraseña ha sido cambiada exitosamente. Iniciando sesión automáticamente...
              </p>
              <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                <span className="text-sm">Procesando...</span>
              </div>
            </div>
          </div>
        ) : (
          // Estado normal del formulario
          <>
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">Acceso Restringido</span>
              </div>
              <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                No podrás acceder al sistema hasta que cambies tu contraseña temporal.
              </p>
            </div>
          </>
        )}

        {!showSuccess && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            {/* Nueva Contraseña */}
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nueva Contraseña</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Crea una nueva contraseña segura"
                        className="pr-10"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription>
                    La contraseña debe contener al menos 8 caracteres con mayúsculas, minúsculas, números y símbolos
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Indicador de fortaleza de contraseña */}
            {newPassword && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Fortaleza:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-2 w-8 rounded ${
                          level <= passwordStrength.strength
                            ? passwordStrength.strength <= 2
                              ? 'bg-red-500'
                              : passwordStrength.strength <= 3
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                            : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className={`text-sm font-medium ${
                    passwordStrength.strength <= 2 ? 'text-red-600' :
                    passwordStrength.strength <= 3 ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {passwordStrength.strength <= 2 ? 'Débil' :
                     passwordStrength.strength <= 3 ? 'Media' : 'Fuerte'}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(passwordStrength.checks).map(([key, passed]) => (
                    <div key={key} className="flex items-center gap-1">
                      {passed ? (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      ) : (
                        <XCircle className="h-3 w-3 text-red-500" />
                      )}
                      <span className={passed ? 'text-green-600' : 'text-red-600'}>
                        {key === 'length' && '8+ caracteres'}
                        {key === 'uppercase' && 'Mayúscula'}
                        {key === 'lowercase' && 'Minúscula'}
                        {key === 'number' && 'Número'}
                        {key === 'special' && 'Símbolo'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Confirmar Contraseña */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar Nueva Contraseña</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirma tu nueva contraseña"
                        className="pr-10"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  {confirmPassword && newPassword === confirmPassword && (
                    <div className="flex items-center gap-1 text-sm text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      Las contraseñas coinciden
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Botón de Envío */}
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || !form.formState.isValid}
            >
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Cambiando Contraseña...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Cambiar Contraseña
                </>
              )}
            </Button>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}
