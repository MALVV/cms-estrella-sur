"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Copy, Eye, EyeOff, Check } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface CreateUserFormProps {
  onUserCreated?: (user: any) => void
}

export function CreateUserForm({ onUserCreated }: CreateUserFormProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'GESTOR'
  })
  const [generatedPassword, setGeneratedPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [passwordCopied, setPasswordCopied] = useState(false)
  const [createdUser, setCreatedUser] = useState<{name: string, email: string, role: string} | null>(null)
  const { toast } = useToast()

  // Generar contraseña aleatoria
  const generatePassword = () => {
    const length = 12
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
    let password = ''
    
    // Asegurar al menos un carácter de cada tipo
    password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)] // Mayúscula
    password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)] // Minúscula
    password += '0123456789'[Math.floor(Math.random() * 10)] // Número
    password += '!@#$%^&*'[Math.floor(Math.random() * 8)] // Símbolo
    
    // Completar con caracteres aleatorios
    for (let i = 4; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)]
    }
    
    // Mezclar la contraseña
    return password.split('').sort(() => Math.random() - 0.5).join('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Generar contraseña
      const password = generatePassword()
      setGeneratedPassword(password)

      // Llamar a la API para crear el usuario
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          role: formData.role,
          password: password
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al crear usuario')
      }

      const newUser = await response.json()

      // Transformar para el formato esperado por el frontend
      const transformedUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.isActive ? 'ACTIVE' : 'INACTIVE',
        createdAt: newUser.createdAt.split('T')[0],
        department: 'Sistema',
        phone: null,
        password: password
      }

      // Almacenar información del usuario creado
      setCreatedUser({
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      })

      // Llamar callback si existe
      if (onUserCreated) {
        onUserCreated(transformedUser)
      }

      toast({
        title: "Usuario creado exitosamente",
        description: "El usuario ha sido creado y la contraseña generada.",
      })

      // Resetear formulario
      setFormData({ name: '', email: '', role: 'GESTOR' })
      
    } catch (error) {
      toast({
        title: "Error al crear usuario",
        description: error instanceof Error ? error.message : "Hubo un problema al crear el usuario. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const copyPassword = async () => {
    try {
      await navigator.clipboard.writeText(generatedPassword)
      setPasswordCopied(true)
      toast({
        title: "Contraseña copiada",
        description: "La contraseña ha sido copiada al portapapeles.",
      })
      setTimeout(() => setPasswordCopied(false), 2000)
    } catch (error) {
      toast({
        title: "Error al copiar",
        description: "No se pudo copiar la contraseña al portapapeles.",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({ name: '', email: '', role: 'GESTOR' })
    setGeneratedPassword('')
    setShowPassword(false)
    setPasswordCopied(false)
    setCreatedUser(null)
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      resetForm()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Usuario
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Usuario</DialogTitle>
          <DialogDescription>
            Completa la información para crear un nuevo usuario. Se generará una contraseña automáticamente.
          </DialogDescription>
        </DialogHeader>

        {!generatedPassword ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <Input
                id="name"
                placeholder="Ej: Juan Pérez"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="juan.perez@estrellasur.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Rol</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GESTOR">Gestor de Contenido</SelectItem>
                  <SelectItem value="ADMINISTRADOR">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Creando...' : 'Crear Usuario'}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">¡Usuario Creado Exitosamente!</CardTitle>
                <CardDescription>
                  El usuario ha sido creado. Guarda la contraseña generada de forma segura.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Información del Usuario</Label>
                  <div className="space-y-1 text-sm">
                    <div><strong>Nombre:</strong> {createdUser?.name || formData.name}</div>
                    <div><strong>Email:</strong> {createdUser?.email || formData.email}</div>
                    <div><strong>Rol:</strong> 
                      <Badge variant="outline" className="ml-2">
                        {createdUser?.role || formData.role}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Contraseña Generada</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={generatedPassword}
                      readOnly
                      className="font-mono"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={copyPassword}
                    >
                      {passwordCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Esta contraseña se debe cambiar en el primer inicio de sesión.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={resetForm}>
                Crear Otro Usuario
              </Button>
              <Button onClick={() => setOpen(false)}>
                Cerrar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}