"use client"

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form'
import { useToast } from '@/components/ui/use-toast'
import { 
  Key, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  XCircle, 
  Loader2,
  Shield,
  AlertTriangle
} from 'lucide-react'

const changePasswordSchema = z.object({
  newPassword: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
    .regex(/[a-z]/, 'Debe contener al menos una letra minúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número')
    .regex(/[^A-Za-z0-9]/, 'Debe contener al menos un carácter especial'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
})

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>

interface User {
  id: string
  email: string
  name?: string
  role: string
}

interface AdvancedChangePasswordModalProps {
  user: User | null
  isOpen: boolean
  onClose: () => void
  onPasswordChanged: () => void
}

export function AdvancedChangePasswordModal({ 
  user, 
  isOpen, 
  onClose, 
  onPasswordChanged 
}: AdvancedChangePasswordModalProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
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

  const onSubmit = async (data: ChangePasswordFormData) => {
    if (!user) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/users/${user.id}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword: data.newPassword }),
      })

      if (response.ok) {
        toast({
          title: "✅ Contraseña actualizada exitosamente",
          description: `La contraseña de ${user.name || user.email} ha sido cambiada`,
          variant: "success",
        })
        form.reset()
        onPasswordChanged()
        onClose()
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

  if (!user) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Key className="h-5 w-5 text-primary" />
            Cambiar Contraseña
          </DialogTitle>
          <DialogDescription>
            Establece una nueva contraseña para {user.name || user.email}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Información del Usuario */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
              <Shield className="h-4 w-4" />
              <span className="text-sm font-medium">Información de Seguridad</span>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              La nueva contraseña debe cumplir con los requisitos de seguridad del sistema.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                          type={showPassword ? "text" : "password"}
                          placeholder="Mínimo 8 caracteres"
                          className="pr-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
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
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Fortaleza:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-2 w-8 rounded transition-all duration-200 ${
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
                    <span className={`text-sm font-medium transition-colors duration-200 ${
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
                          placeholder="Repite la nueva contraseña"
                          className="pr-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
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

              {/* Advertencia */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm font-medium">Importante</span>
                </div>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  El usuario deberá usar esta nueva contraseña en su próximo inicio de sesión.
                </p>
              </div>

              {/* Botones de Acción */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 transition-all duration-200 hover:bg-gray-50"
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 transition-all duration-200 hover:bg-primary/90"
                  disabled={isSubmitting || passwordStrength.strength < 3}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Cambiando Contraseña...
                    </>
                  ) : (
                    <>
                      <Key className="mr-2 h-4 w-4" />
                      Cambiar Contraseña
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
