"use client"

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { UserRole } from '@/lib/roles'
import { generateTemporaryPassword } from '@/lib/temp-password'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  UserPlus, 
  Mail, 
  User, 
  Shield, 
  Eye, 
  EyeOff, 
  Loader2, 
  CheckCircle,
  Key,
  Crown,
  Briefcase,
  Wrench
} from 'lucide-react'

const createUserSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  role: z.nativeEnum(UserRole),
  isActive: z.boolean(),
  mustChangePassword: z.boolean()
})

type CreateUserFormData = z.infer<typeof createUserSchema>

interface SimpleCreateUserFormProps {
  onUserCreated: () => void
  onCancel: () => void
}

export function SimpleCreateUserForm({ onUserCreated, onCancel }: SimpleCreateUserFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [generatedCredentials, setGeneratedCredentials] = useState<{email: string, password: string} | null>(null)
  const [showCredentials, setShowCredentials] = useState(false)
  const { toast } = useToast()

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: '',
      email: '',
      role: UserRole.TECNICO,
      isActive: true,
      mustChangePassword: true
    }
  })

  const email = watch('email')

  const generateCredentials = () => {
    if (!email) {
      toast({
        title: "⚠️ Email requerido",
        description: "Primero ingresa el email del usuario",
        variant: "warning",
      })
      return
    }
    
    const password = generateTemporaryPassword()
    setGeneratedCredentials({ email, password })
    setShowCredentials(true)
  }

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
      case UserRole.ADMINISTRADOR: return 'Acceso completo al sistema y gestión de usuarios'
      case UserRole.SUPERVISOR: return 'Supervisión de contenido y gestión de técnicos'
      case UserRole.TECNICO: return 'Acceso básico para tareas técnicas y soporte'
      default: return ''
    }
  }

  const onSubmit = async (data: CreateUserFormData) => {
    if (!generatedCredentials) {
      toast({
        title: "⚠️ Credenciales requeridas",
        description: "Debes generar las credenciales antes de crear el usuario",
        variant: "warning",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: generatedCredentials.password,
          role: data.role,
          isActive: data.isActive,
          mustChangePassword: data.mustChangePassword
        }),
      })

      if (response.ok) {
        toast({
          title: "✅ Usuario creado exitosamente",
          description: `${data.name} ha sido agregado al sistema con rol ${data.role}`,
          variant: "success",
        })
        setGeneratedCredentials(null)
        setShowCredentials(false)
        onUserCreated()
      } else {
        const errorData = await response.json()
        toast({
          title: "❌ Error al crear usuario",
          description: errorData.message || "No se pudo crear el usuario",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error creating user:', error)
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
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Información Personal */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Información Personal
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre Completo</Label>
              <Input
                id="name"
                placeholder="Ej: Juan Pérez"
                {...register('name')}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="usuario@empresa.com"
                  className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Generación de Credenciales */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Credenciales de Acceso
          </h3>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200 mb-2">
              <Key className="h-4 w-4" />
              <span className="text-sm font-medium">Generación Automática de Credenciales</span>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
              El sistema generará automáticamente una contraseña segura temporal que el usuario deberá cambiar en su primer inicio de sesión.
            </p>
            
            <Button
              type="button"
              variant="outline"
              onClick={generateCredentials}
              className="w-full"
              disabled={!email}
            >
              <Key className="h-4 w-4 mr-2" />
              Generar Credenciales Temporales
            </Button>
          </div>

          {/* Mostrar credenciales generadas */}
          {showCredentials && generatedCredentials && (
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 text-green-800 dark:text-green-200 mb-3">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Credenciales Generadas</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Email:</span>
                  <span className="text-sm font-mono bg-white dark:bg-gray-800 px-2 py-1 rounded border">
                    {generatedCredentials.email}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Contraseña Temporal:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono bg-white dark:bg-gray-800 px-2 py-1 rounded border">
                      {showPassword ? generatedCredentials.password : '••••••••••••'}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
                <p className="text-xs text-yellow-800 dark:text-yellow-200">
                  ⚠️ <strong>Importante:</strong> Guarda estas credenciales de forma segura. El usuario deberá cambiar la contraseña en su primer inicio de sesión.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Configuración de Usuario */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Configuración de Usuario
          </h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">Rol del Usuario</Label>
              <Select value={watch('role')} onValueChange={(value) => setValue('role', value as UserRole)}>
                <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(UserRole).map((role) => (
                    <SelectItem key={role} value={role}>
                      <div className="flex items-center gap-2">
                        {getRoleIcon(role)}
                        <span className="capitalize">{role.toLowerCase()}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {watch('role') && (
                <p className="text-sm text-muted-foreground">
                  {getRoleDescription(watch('role'))}
                </p>
              )}
              {errors.role && (
                <p className="text-sm text-red-600">{errors.role.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={watch('isActive')}
                  onCheckedChange={(checked) => setValue('isActive', checked as boolean)}
                />
                <Label htmlFor="isActive">Usuario Activo</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="mustChangePassword"
                  checked={watch('mustChangePassword')}
                  onCheckedChange={(checked) => setValue('mustChangePassword', checked as boolean)}
                />
                <Label htmlFor="mustChangePassword">Cambiar Contraseña</Label>
              </div>
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1 transition-all duration-200 hover:bg-gray-50"
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="flex-1 transition-all duration-200 hover:bg-primary/90"
            disabled={isSubmitting || !generatedCredentials}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creando Usuario...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                {generatedCredentials ? 'Crear Usuario' : 'Genera Credenciales Primero'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
