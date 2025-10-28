"use client"

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { UserRole } from '@/lib/roles'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { 
  Crown, 
  Briefcase, 
  Wrench, 
  Users, 
  UserCheck, 
  UserX, 
  Calendar, 
  Mail, 
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Shield,
  ShieldOff,
  UserPlus,
  Eye,
  EyeOff,
  Save,
  X
} from 'lucide-react'

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
  creator?: {
    id: string
    name?: string
    email: string
  }
}

interface UserManagementSystemProps {
  className?: string
}

export const UserManagementSystem: React.FC<UserManagementSystemProps> = ({ className }) => {
  const { data: session } = useSession()
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<UserRole | 'ALL'>('ALL')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [showPasswordForm, setShowPasswordForm] = useState<User | null>(null)

  // Estados para formularios
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: UserRole.MANAGER,
    isTemporaryPassword: false
  })

  const [editData, setEditData] = useState({
    name: '',
    email: '',
    role: UserRole.MANAGER,
    isActive: true
  })

  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    if (session?.user?.role === UserRole.ADMINISTRATOR) {
      fetchUsers()
    }
  }, [session])

  useEffect(() => {
    filterUsers()
  }, [users, searchTerm, roleFilter, statusFilter])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterUsers = () => {
    let filtered = users

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtrar por rol
    if (roleFilter !== 'ALL') {
      filtered = filtered.filter(user => user.role === roleFilter)
    }

    // Filtrar por estado
    if (statusFilter === 'ACTIVE') {
      filtered = filtered.filter(user => user.isActive)
    } else if (statusFilter === 'INACTIVE') {
      filtered = filtered.filter(user => !user.isActive)
    }

    setFilteredUsers(filtered)
  }

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await fetchUsers()
        setShowCreateForm(false)
        setFormData({ email: '', password: '', name: '', role: UserRole.MANAGER, isTemporaryPassword: false })
      } else {
        const error = await response.json()
        alert(error.message)
      }
    } catch (error) {
      console.error('Error creating user:', error)
      alert('Error al crear usuario')
    }
  }

  const updateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return

    try {
      const response = await fetch(`/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData)
      })

      if (response.ok) {
        await fetchUsers()
        setEditingUser(null)
        setEditData({ name: '', email: '', role: UserRole.MANAGER, isActive: true })
      } else {
        const error = await response.json()
        alert(error.message)
      }
    } catch (error) {
      console.error('Error updating user:', error)
      alert('Error al actualizar usuario')
    }
  }

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!showPasswordForm) return

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Las contraseñas no coinciden')
      return
    }

    try {
      const response = await fetch(`/api/users/${showPasswordForm.id}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword: passwordData.newPassword })
      })

      if (response.ok) {
        await fetchUsers()
        setShowPasswordForm(null)
        setPasswordData({ newPassword: '', confirmPassword: '' })
      } else {
        const error = await response.json()
        alert(error.message)
      }
    } catch (error) {
      console.error('Error changing password:', error)
      alert('Error al cambiar contraseña')
    }
  }

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/users/${userId}/toggle-status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      })

      if (response.ok) {
        await fetchUsers()
      }
    } catch (error) {
      console.error('Error toggling user status:', error)
    }
  }

  const deleteUser = async (userId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este usuario?')) return

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchUsers()
      } else {
        const error = await response.json()
        alert(error.message)
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Error al eliminar usuario')
    }
  }

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMINISTRATOR:
        return <Crown className="h-4 w-4 text-red-500" />
      case UserRole.MANAGER:
        return <Briefcase className="h-4 w-4 text-blue-500" />
      case UserRole.MANAGER:
        return <Wrench className="h-4 w-4 text-green-500" />
      default:
        return <Users className="h-4 w-4 text-gray-500" />
    }
  }

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMINISTRATOR:
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
      case UserRole.MANAGER:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
      case UserRole.MANAGER:
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
    }
  }

  if (!session?.user || session.user.role !== UserRole.ADMINISTRATOR) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            No tienes permisos para gestionar usuarios.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={className}>
      {/* Header con filtros */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Gestión de Usuarios
            </div>
            {session.user.role === UserRole.ADMINISTRATOR && (
              <Button onClick={() => setShowCreateForm(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Crear Usuario
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Búsqueda */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filtros */}
            <div className="flex gap-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as UserRole | 'ALL')}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="ALL">Todos los roles</option>
                <option value={UserRole.ADMINISTRATOR}>ADMINISTRATOR</option>
                <option value={UserRole.MANAGER}>MANAGER de Contenido</option>
                <option value={UserRole.MANAGER}>MANAGER de Contenido</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'ALL' | 'ACTIVE' | 'INACTIVE')}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="ALL">Todos</option>
                <option value="ACTIVE">Activos</option>
                <option value="INACTIVE">Inactivos</option>
              </select>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
            <span>Total: {users.length}</span>
            <span>Activos: {users.filter(u => u.isActive).length}</span>
            <span>Inactivos: {users.filter(u => !u.isActive).length}</span>
            <span>Mostrando: {filteredUsers.length}</span>
          </div>
        </CardContent>
      </Card>

      {/* Formulario de creación */}
      {showCreateForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Crear Nuevo Usuario</span>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={createUser} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Nombre</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Contraseña</label>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Rol</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value={UserRole.MANAGER}>MANAGER de Contenido</option>
                    <option value={UserRole.MANAGER}>MANAGER de Contenido</option>
                    <option value={UserRole.ADMINISTRATOR}>ADMINISTRATOR</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isTemporaryPassword"
                  checked={formData.isTemporaryPassword}
                  onChange={(e) => setFormData({ ...formData, isTemporaryPassword: e.target.checked })}
                />
                <label htmlFor="isTemporaryPassword" className="text-sm">
                  Contraseña temporal (usuario debe cambiarla en el primer login)
                </label>
              </div>
              <div className="flex gap-2">
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  Crear Usuario
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de usuarios */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-muted-foreground">Cargando usuarios...</p>
            </div>
          ) : (
            <div className="space-y-0">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-2">No se encontraron usuarios</p>
                  <p className="text-sm text-muted-foreground">
                    Intenta ajustar los filtros de búsqueda
                  </p>
                </div>
              ) : (
                filteredUsers.map((user, index) => (
                  <div
                    key={user.id}
                    className={`flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 ${
                      index !== filteredUsers.length - 1 ? 'border-b' : ''
                    } ${!user.isActive ? 'opacity-75' : ''}`}
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="" alt={user.name || ""} />
                        <AvatarFallback>
                          {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{user.name || 'Sin nombre'}</h3>
                          {getRoleIcon(user.role)}
                          <Badge className={getRoleColor(user.role)}>
                            {user.role}
                          </Badge>
                          <Badge variant={user.isActive ? 'default' : 'secondary'}>
                            {user.isActive ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            <span>{user.email}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>Creado: {new Date(user.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>Último login: {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Nunca'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {user.mustChangePassword && (
                        <Badge variant="outline" className="text-orange-600 border-orange-600">
                          Cambiar Contraseña
                        </Badge>
                      )}
                      
                      {/* Acciones */}
                      <div className="flex gap-1">
                        {session.user.role === UserRole.ADMINISTRATOR && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingUser(user)
                                setEditData({
                                  name: user.name || '',
                                  email: user.email,
                                  role: user.role,
                                  isActive: user.isActive
                                })
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setShowPasswordForm(user)
                                setPasswordData({ newPassword: '', confirmPassword: '' })
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <Shield className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleUserStatus(user.id, user.isActive)}
                              className="h-8 w-8 p-0"
                            >
                              {user.isActive ? (
                                <ShieldOff className="h-4 w-4" />
                              ) : (
                                <Shield className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteUser(user.id)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de edición */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Editar Usuario</span>
                <Button variant="outline" onClick={() => setEditingUser(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={updateUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nombre</label>
                  <Input
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Input
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Rol</label>
                  <select
                    value={editData.role}
                    onChange={(e) => setEditData({ ...editData, role: e.target.value as UserRole })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value={UserRole.MANAGER}>MANAGER de Contenido</option>
                    <option value={UserRole.MANAGER}>MANAGER de Contenido</option>
                    <option value={UserRole.ADMINISTRATOR}>ADMINISTRATOR</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={editData.isActive}
                    onChange={(e) => setEditData({ ...editData, isActive: e.target.checked })}
                  />
                  <label htmlFor="isActive" className="text-sm">
                    Usuario activo
                  </label>
                </div>
                <div className="flex gap-2">
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Cambios
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setEditingUser(null)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal de cambio de contraseña */}
      {showPasswordForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Cambiar Contraseña</span>
                <Button variant="outline" onClick={() => setShowPasswordForm(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={changePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nueva Contraseña</label>
                  <Input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Confirmar Contraseña</label>
                  <Input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    Cambiar Contraseña
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowPasswordForm(null)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
