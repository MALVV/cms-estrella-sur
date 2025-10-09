"use client"

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { UserRole } from '@/lib/roles'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/components/ui/use-toast'
import { 
  User, 
  Mail, 
  Shield, 
  Crown,
  Briefcase,
  Wrench,
  Save,
  X,
  Loader2,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

const editUserSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(50, 'El nombre no puede exceder 50 caracteres'),
  email: z.string().email('Email inválido').min(1, 'El email es requerido'),
  role: z.nativeEnum(UserRole, { message: 'Selecciona un rol' }),
  isActive: z.boolean(),
  mustChangePassword: z.boolean()
})

type EditUserFormData = z.infer<typeof editUserSchema>

interface User {
  id: string
  email: string
  name?: string
  role: UserRole
  emailVerified?: string
  lastLoginAt?: string
  isActive: boolean
  mustChangePassword: boolean
  createdAt: string
  updatedAt: string
}

interface AdvancedEditUserModalProps {
  user: User | null
  isOpen: boolean
  onClose: () => void
  onUserUpdated: () => void
}

export function AdvancedEditUserModal({ user, isOpen, onClose, onUserUpdated }: AdvancedEditUserModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      role: user?.role || UserRole.TECNICO,
      isActive: user?.isActive || true,
      mustChangePassword: user?.mustChangePassword || false
    }
  })

  // Reset form when user changes
  React.useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || '',
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        mustChangePassword: user.mustChangePassword
      })
    }
  }, [user, form])

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMINISTRADOR: return <Crown className="h-4 w-4 text-red-500" />
      case UserRole.SUPERVISOR: return <Briefcase className="h-4 w-4 text-blue-500" />
      case UserRole.TECNICO: return <Wrench className="h-4 w-4 text-green-500" />
      default: return <User className="h-4 w-4 text-gray-500" />
    }
  }

  const getRoleDescription = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMINISTRADOR: return 'Acceso completo al sistema'
      case UserRole.SUPERVISOR: return 'Puede supervisar contenido y usuarios'
      case UserRole.TECNICO: return 'Acceso básico para tareas técnicas'
      default: return ''
    }
  }

  const onSubmit = async (data: EditUserFormData) => {
    if (!user) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast({
          title: "✅ Usuario actualizado exitosamente",
          description: `Los datos de ${data.name} han sido actualizados`,
          variant: "success",
        })
        onUserUpdated()
        onClose()
      } else {
        const errorData = await response.json()
        toast({
          title: "❌ Error al actualizar usuario",
          description: errorData.message || "No se pudo actualizar el usuario",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error updating user:', error)
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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <User className="h-5 w-5 text-primary" />
            Editar Usuario
          </DialogTitle>
          <DialogDescription>
            Modifica la información del usuario {user.name || user.email}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Información del Usuario */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Información Actual
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">ID:</span>
                <span className="ml-2 font-mono text-xs">{user.id.slice(0, 8)}...</span>
              </div>
              <div>
                <span className="text-muted-foreground">Creado:</span>
                <span className="ml-2">{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Último login:</span>
                <span className="ml-2">
                  {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Nunca'}
                </span>
              </div>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Información Personal */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Información Personal
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre Completo</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Ej: Juan Pérez" 
                            {...field}
                            className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correo Electrónico</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input 
                              placeholder="usuario@empresa.com" 
                              type="email"
                              className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Configuración de Usuario */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Configuración de Usuario
                </h3>

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rol del Usuario</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                            <SelectValue placeholder="Selecciona un rol" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(UserRole).map((role) => (
                            <SelectItem key={role} value={role}>
                              <div className="flex items-center gap-2">
                                {getRoleIcon(role)}
                                <div>
                                  <div className="font-medium">{role}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {getRoleDescription(role)}
                                  </div>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Usuario Activo
                          </FormLabel>
                          <FormDescription>
                            El usuario podrá iniciar sesión
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mustChangePassword"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Cambiar Contraseña
                          </FormLabel>
                          <FormDescription>
                            El usuario debe cambiar su contraseña en el próximo inicio de sesión
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
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
                  <X className="mr-2 h-4 w-4" />
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 transition-all duration-200 hover:bg-primary/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Guardar Cambios
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
