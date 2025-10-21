"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { UserRole } from '@/lib/roles'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { SimpleCreateUserForm } from './simple-create-user-form'
import { AdvancedEditUserModal } from './advanced-edit-user-modal'
import { AdvancedChangePasswordModal } from './advanced-change-password-modal'
import { DeleteUserDialog, DeactivateUserDialog } from '@/components/ui/confirmation-dialog'
import {
  Crown, Briefcase, Wrench, Users, UserCheck, UserX, Calendar, UserPlus, 
  Edit, Key, Trash2, Search, Loader2, CheckCircle, XCircle,
  Eye, EyeOff, RefreshCw
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
}

export function AdvancedUserManagementSystem() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRole, setFilterRole] = useState<UserRole | 'all'>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 })
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')

  const isAdmin = session?.user?.role === UserRole.ADMINISTRADOR
  const isContentManager = session?.user?.role === UserRole.GESTOR

  const fetchUsers = useCallback(async (page = 1) => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('page', page.toString())
      params.append('limit', pagination.limit.toString())
      if (searchQuery) params.append('search', searchQuery)
      if (filterRole !== 'all') params.append('role', filterRole)
      if (filterStatus !== 'all') params.append('isActive', (filterStatus === 'active').toString())

      const response = await fetch(`/api/users?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
        setPagination(data.pagination)
      } else {
        toast({
          title: "❌ Error",
          description: "No se pudieron cargar los usuarios.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      toast({
        title: "❌ Error de red",
        description: "Error de conexión al cargar usuarios.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery, filterRole, filterStatus, pagination.limit, toast])

  useEffect(() => {
    if (session?.user) {
      fetchUsers()
    }
  }, [session, fetchUsers])

  const handleUserCreated = () => {
    setShowCreateForm(false)
    fetchUsers()
    toast({
      title: "✅ Usuario creado",
      description: "El nuevo usuario ha sido agregado al sistema",
      variant: "success",
    })
  }

  const handleEditUser = (user: User) => {
    setCurrentUser(user)
    setShowEditModal(true)
  }

  const handleUpdateUser = async () => {
    fetchUsers()
    setShowEditModal(false)
  }

  const handleChangePassword = (user: User) => {
    setCurrentUser(user)
    setShowPasswordModal(true)
  }

  const handlePasswordChanged = () => {
    fetchUsers()
    setShowPasswordModal(false)
  }

  const handleToggleStatus = async (user: User) => {
    if (user.id === session?.user?.id) {
      toast({
        title: "⚠️ Advertencia",
        description: "No puedes cambiar el estado de tu propia cuenta.",
        variant: "warning",
      })
      return
    }

    setCurrentUser(user)
    setShowDeactivateDialog(true)
  }

  const confirmToggleStatus = async () => {
    if (!currentUser) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/users/${currentUser.id}/toggle-status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentUser.isActive }),
      })

      if (response.ok) {
        toast({
          title: "✅ Estado actualizado",
          description: `Usuario ${!currentUser.isActive ? 'activado' : 'desactivado'} correctamente.`,
          variant: "success",
        })
        fetchUsers()
      } else {
        const errorData = await response.json()
        toast({
          title: "❌ Error",
          description: errorData.message || "No se pudo cambiar el estado del usuario.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error toggling user status:', error)
      toast({
        title: "❌ Error de red",
        description: "Error de conexión al cambiar estado del usuario.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
      setShowDeactivateDialog(false)
    }
  }

  const handleDeleteUser = (user: User) => {
    if (user.id === session?.user?.id) {
      toast({
        title: "⚠️ Advertencia",
        description: "No puedes eliminar tu propia cuenta.",
        variant: "warning",
      })
      return
    }

    setCurrentUser(user)
    setShowDeleteDialog(true)
  }

  const confirmDeleteUser = async () => {
    if (!currentUser) return

    console.log('🗑️ Intentando eliminar usuario:', currentUser.id, currentUser.email)
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/users/${currentUser.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })

      console.log('📡 Respuesta del servidor:', response.status, response.statusText)

      if (response.ok) {
        const result = await response.json()
        console.log('✅ Usuario eliminado exitosamente:', result)
        toast({
          title: "✅ Usuario eliminado",
          description: "El usuario ha sido eliminado del sistema.",
          variant: "success",
        })
        fetchUsers()
      } else {
        const errorData = await response.json()
        console.log('❌ Error del servidor:', errorData)
        toast({
          title: "❌ Error",
          description: errorData.message || "No se pudo eliminar el usuario.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('❌ Error de red eliminando usuario:', error)
      toast({
        title: "❌ Error de red",
        description: "Error de conexión al eliminar usuario.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
      setShowDeleteDialog(false)
    }
  }

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMINISTRADOR: return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
      case UserRole.GESTOR: return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
    }
  }

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMINISTRADOR: return <Crown className="h-4 w-4 text-red-500" />
      case UserRole.GESTOR: return <Briefcase className="h-4 w-4 text-green-500" />
      default: return <Users className="h-4 w-4 text-gray-500" />
    }
  }

  if (!session?.user || !isAdmin) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-muted-foreground">
                No tienes permisos para acceder a esta página.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Users className="h-6 w-6 text-primary" />
                Gestión de Usuarios
              </CardTitle>
              <CardDescription>
                Administra los usuarios del sistema, sus roles y estados
              </CardDescription>
            </div>
            {isAdmin && (
              <Button 
                onClick={() => setShowCreateForm(true)}
                className="transition-all duration-200 hover:bg-primary/90"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Crear Usuario
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Usuarios</p>
                  <p className="text-2xl font-bold">{pagination.total}</p>
                </div>
                <Users className="h-8 w-8 text-gray-400" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Usuarios Activos</p>
                  <p className="text-2xl font-bold text-green-600">{users.filter(u => u.isActive).length}</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-500" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Usuarios Inactivos</p>
                  <p className="text-2xl font-bold text-red-600">{users.filter(u => !u.isActive).length}</p>
                </div>
                <UserX className="h-8 w-8 text-red-500" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Cambiar Contraseña</p>
                  <p className="text-2xl font-bold text-yellow-600">{users.filter(u => u.mustChangePassword).length}</p>
                </div>
                <Key className="h-8 w-8 text-yellow-500" />
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Filtros y búsqueda */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre o email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <Select value={filterRole} onValueChange={(value: UserRole | 'all') => setFilterRole(value)}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue placeholder="Filtrar por rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Roles</SelectItem>
                {Object.values(UserRole).map(role => (
                  <SelectItem key={role} value={role}>{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={(value: 'all' | 'active' | 'inactive') => setFilterStatus(value)}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Estados</SelectItem>
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="inactive">Inactivos</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}
                title={`Cambiar a vista ${viewMode === 'grid' ? 'tabla' : 'tarjetas'}`}
              >
                {viewMode === 'grid' ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => fetchUsers()}
                title="Actualizar lista"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de usuarios */}
      {isLoading ? (
        <Card>
          <CardContent className="p-12">
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2 text-muted-foreground">Cargando usuarios...</p>
            </div>
          </CardContent>
        </Card>
      ) : users.length === 0 ? (
        <Card>
          <CardContent className="p-12">
            <div className="text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No se encontraron usuarios con los filtros aplicados.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
          {users.map((user) => (
            <Card key={user.id} className="transition-all duration-200 hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="" alt={user.name || ""} />
                      <AvatarFallback className="text-lg font-semibold">
                        {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{user.name || 'Sin nombre'}</h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  {isAdmin && (
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditUser(user)}
                        title="Editar usuario"
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleChangePassword(user)}
                        title="Cambiar contraseña"
                        className="h-8 w-8"
                      >
                        <Key className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {getRoleIcon(user.role)}
                    <Badge className={getRoleColor(user.role)}>
                      {user.role}
                    </Badge>
                    {user.mustChangePassword && (
                      <Badge variant="outline" className="text-orange-600 border-orange-600">
                        <Key className="h-3 w-3 mr-1" /> Cambiar Contraseña
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant={user.isActive ? 'default' : 'secondary'} className="flex items-center gap-1">
                      {user.isActive ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                      {user.isActive ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>Último login: {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Nunca'}</span>
                  </div>
                </div>

                {isAdmin && (
                  <div className="flex gap-2 mt-4 pt-4 border-t">
                    {user.id !== session?.user?.id && (
                      <Button
                        variant={user.isActive ? 'outline' : 'default'}
                        size="sm"
                        onClick={() => handleToggleStatus(user)}
                        className="flex-1"
                      >
                        {user.isActive ? <UserX className="h-4 w-4 mr-1" /> : <UserCheck className="h-4 w-4 mr-1" />}
                        {user.isActive ? 'Desactivar' : 'Activar'}
                      </Button>
                    )}
                    {user.id !== session?.user?.id && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteUser(user)}
                        className="flex-1"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Eliminar
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Paginación */}
      {pagination.pages > 1 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-center space-x-2">
              <Button
                variant="outline"
                onClick={() => fetchUsers(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                Anterior
              </Button>
              {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                const page = i + 1
                return (
                  <Button
                    key={page}
                    variant={page === pagination.page ? 'default' : 'outline'}
                    onClick={() => fetchUsers(page)}
                  >
                    {page}
                  </Button>
                )
              })}
              <Button
                variant="outline"
                onClick={() => fetchUsers(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
              >
                Siguiente
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modales */}
      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent className="sm:max-w-4xl max-h-[95vh] overflow-y-auto p-0 w-[95vw] sm:w-full">
          <DialogHeader className="p-4 sm:p-6 pb-2 sm:pb-0 sticky top-0 bg-background border-b z-10">
            <DialogTitle className="flex items-center gap-2 text-xl sm:text-2xl">
              <UserPlus className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              Crear Nuevo Usuario
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Completa la información para crear una nueva cuenta de usuario en el sistema
            </DialogDescription>
          </DialogHeader>
                <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                  <SimpleCreateUserForm
                    onUserCreated={handleUserCreated}
                    onCancel={() => setShowCreateForm(false)}
                  />
                </div>
        </DialogContent>
      </Dialog>

      <AdvancedEditUserModal
        user={currentUser}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onUserUpdated={handleUpdateUser}
      />

      <AdvancedChangePasswordModal
        user={currentUser}
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onPasswordChanged={handlePasswordChanged}
      />

      <DeleteUserDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDeleteUser}
        userName={currentUser?.name || currentUser?.email || ''}
        isLoading={isSubmitting}
      />

      <DeactivateUserDialog
        isOpen={showDeactivateDialog}
        onClose={() => setShowDeactivateDialog(false)}
        onConfirm={confirmToggleStatus}
        userName={currentUser?.name || currentUser?.email || ''}
        isLoading={isSubmitting}
      />
    </div>
  )
}
