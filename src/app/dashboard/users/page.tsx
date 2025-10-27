"use client"

import { useState, useEffect, useCallback } from 'react'
import { usePermissions } from '@/hooks/use-permissions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Users, Search, Filter, MoreHorizontal, Edit, Trash2, Eye, UserCheck, UserX, Settings } from 'lucide-react'
import { CreateUserForm } from '@/components/admin/create-user-form'
import { ToggleUserStatusDialog } from '@/components/admin/toggle-user-status-dialog'
import { EditUserModal } from '@/components/admin/edit-user-modal'

interface User {
  id: string
  name: string
  email: string
  role: string
  status: 'ACTIVE' | 'INACTIVE'
  createdAt: string
  lastLogin?: string
  department?: string
  phone?: string
  avatar?: string
}

export default function UsersPage() {
  const { canManageUsers, canCreateUsers, canEditUsers, canDeleteUsers } = usePermissions()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [sortBy, setSortBy] = useState<'name' | 'email' | 'role' | 'status' | 'lastLogin'>('name')
  const [editingUser, setEditingUser] = useState<User | null>(null)

  // Cargar usuarios desde la API
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      if (roleFilter !== 'ALL') params.append('role', roleFilter)
      if (statusFilter !== 'ALL') params.append('status', statusFilter)
      if (searchTerm) params.append('search', searchTerm)
      params.append('sortBy', sortBy)

      const response = await fetch(`/api/users?${params.toString()}`)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('Error en API de usuarios:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        })
        throw new Error(`Error al cargar usuarios: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error('Error al cargar usuarios:', error)
      // En caso de error, mantener usuarios vacíos
      setUsers([])
    } finally {
      setLoading(false)
    }
  }, [roleFilter, statusFilter, searchTerm, sortBy])

  // Debounce para la búsqueda
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchUsers()
    }, 300) // Esperar 300ms después del último cambio

    return () => clearTimeout(timeoutId)
  }, [fetchUsers])

  // Los datos ya vienen filtrados y ordenados del servidor
  const filteredUsers = users
  const activeUsers = users.filter(user => user.status === 'ACTIVE')
  const inactiveUsers = users.filter(user => user.status === 'INACTIVE')

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'ADMINISTRADOR': return 'destructive'
      case 'GESTOR': return 'secondary'
      case 'ASESOR': return 'default'
      default: return 'outline'
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    return status === 'ACTIVE' ? 'default' : 'secondary'
  }

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id))
    }
  }

  const handleBulkAction = (action: string) => {
    switch (action) {
      case 'activate':
        handleBulkToggleStatus(true)
        break
      case 'deactivate':
        handleBulkToggleStatus(false)
        break
      default:
        console.log(`Acción no reconocida: ${action}`)
    }
  }

  const handleUserStatusChanged = (userId: string, newStatus: 'ACTIVE' | 'INACTIVE') => {
    setUsers(prev => prev.map(u => 
      u.id === userId 
        ? { ...u, status: newStatus }
        : u
    ))
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer.')) {
      return
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setUsers(prev => prev.filter(user => user.id !== userId))
        setSelectedUsers(prev => prev.filter(id => id !== userId))
      } else {
        const errorData = await response.json()
        alert(errorData.message || 'Error al eliminar usuario')
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Error al eliminar usuario')
    }
  }

  const handleEditUser = async (userId: string, userData: { name: string, email: string, role: string, isActive: boolean }) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      if (response.ok) {
        const updatedUser = await response.json()
        setUsers(prev => prev.map(user => 
          user.id === userId 
            ? { 
                ...user, 
                name: updatedUser.user.name,
                email: updatedUser.user.email,
                role: updatedUser.user.role,
                status: updatedUser.user.isActive ? 'ACTIVE' : 'INACTIVE'
              }
            : user
        ))
      } else {
        const errorData = await response.json()
        alert(errorData.message || 'Error al actualizar usuario')
      }
    } catch (error) {
      console.error('Error updating user:', error)
      alert('Error al actualizar usuario')
    }
  }

  const handleOpenEditModal = (user: User) => {
    setEditingUser(user)
  }

  const handleBulkToggleStatus = async (isActive: boolean) => {
    try {
      const response = await fetch('/api/users/bulk-toggle-status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userIds: selectedUsers,
          isActive 
        }),
      })

      if (!response.ok) {
        throw new Error('Error al actualizar estado de usuarios')
      }

      const result = await response.json()
      
      // Actualizar el estado local
      setUsers(prev => prev.map(u => 
        selectedUsers.includes(u.id)
          ? { ...u, status: isActive ? 'ACTIVE' : 'INACTIVE' }
          : u
      ))

      setSelectedUsers([])
      
      // Mostrar notificación de éxito
      console.log(result.message)
    } catch (error) {
      console.error('Error al cambiar estado de usuarios en lote:', error)
    }
  }

  if (!canManageUsers()) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Acceso Denegado</h1>
          <p className="text-muted-foreground">
            No tienes permisos para acceder a la gestión de usuarios.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
          <p className="text-muted-foreground">
            Administra usuarios, roles y permisos del sistema
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {canCreateUsers() && (
            <CreateUserForm onUserCreated={(newUser) => {
              // Agregar el usuario a la lista
              setUsers(prev => [newUser, ...prev])
              
              // Limpiar filtros para mostrar el usuario recién creado
              setSearchTerm('')
              setRoleFilter('ALL')
              setStatusFilter('ALL')
            }} />
          )}
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div className="ml-2">
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <UserCheck className="h-4 w-4 text-green-600" />
              <div className="ml-2">
                <p className="text-sm font-medium text-muted-foreground">Activos</p>
                <p className="text-2xl font-bold text-green-600">{activeUsers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <UserX className="h-4 w-4 text-red-600" />
              <div className="ml-2">
                <p className="text-sm font-medium text-muted-foreground">Inactivos</p>
                <p className="text-2xl font-bold text-red-600">{inactiveUsers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Settings className="h-4 w-4 text-muted-foreground" />
              <div className="ml-2">
                <p className="text-sm font-medium text-muted-foreground">Roles</p>
                <p className="text-2xl font-bold">{new Set(users.map(u => u.role)).size}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y controles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              Filtros y Controles
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                Lista
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                Cuadrícula
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="text-sm font-medium">Buscar</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Nombre, email o departamento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Rol</label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos los roles</SelectItem>
                  <SelectItem value="ADMINISTRADOR">Administrador</SelectItem>
                  <SelectItem value="GESTOR">Gestor de Contenido</SelectItem>
                  <SelectItem value="ASESOR">Asesor de Donaciones</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Estado</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos los estados</SelectItem>
                  <SelectItem value="ACTIVE">Activo</SelectItem>
                  <SelectItem value="INACTIVE">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Ordenar por</label>
              <Select value={sortBy} onValueChange={(value: 'name' | 'email' | 'role' | 'status' | 'lastLogin') => setSortBy(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nombre</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="role">Rol</SelectItem>
                  <SelectItem value="status">Estado</SelectItem>
                  <SelectItem value="lastLogin">Último acceso</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {selectedUsers.length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-900">
                  {selectedUsers.length} usuario(s) seleccionado(s)
                </span>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction('activate')}>
                    <UserCheck className="mr-1 h-3 w-3" />
                    Activar
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction('deactivate')}>
                    <UserX className="mr-1 h-3 w-3" />
                    Desactivar
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setSelectedUsers([])}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pestañas de usuarios */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Todos ({filteredUsers.length})</TabsTrigger>
          <TabsTrigger value="active">Activos ({activeUsers.length})</TabsTrigger>
          <TabsTrigger value="inactive">Inactivos ({inactiveUsers.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <UserList 
            users={filteredUsers}
            loading={loading}
            selectedUsers={selectedUsers}
            onSelectUser={handleSelectUser}
            onSelectAll={handleSelectAll}
            onToggleStatus={handleUserStatusChanged}
            onDeleteUser={handleDeleteUser}
            onEditUser={handleEditUser}
            onOpenEditModal={handleOpenEditModal}
            canEditUsers={canEditUsers}
            canDeleteUsers={canDeleteUsers}
            getRoleBadgeVariant={getRoleBadgeVariant}
            getStatusBadgeVariant={getStatusBadgeVariant}
            viewMode={viewMode}
          />
        </TabsContent>

        <TabsContent value="active">
          <UserList 
            users={activeUsers}
            loading={loading}
            selectedUsers={selectedUsers}
            onSelectUser={handleSelectUser}
            onSelectAll={handleSelectAll}
            onToggleStatus={handleUserStatusChanged}
            onDeleteUser={handleDeleteUser}
            onEditUser={handleEditUser}
            onOpenEditModal={handleOpenEditModal}
            canEditUsers={canEditUsers}
            canDeleteUsers={canDeleteUsers}
            getRoleBadgeVariant={getRoleBadgeVariant}
            getStatusBadgeVariant={getStatusBadgeVariant}
            viewMode={viewMode}
          />
        </TabsContent>

        <TabsContent value="inactive">
          <UserList 
            users={inactiveUsers}
            loading={loading}
            selectedUsers={selectedUsers}
            onSelectUser={handleSelectUser}
            onSelectAll={handleSelectAll}
            onToggleStatus={handleUserStatusChanged}
            onDeleteUser={handleDeleteUser}
            onEditUser={handleEditUser}
            onOpenEditModal={handleOpenEditModal}
            canEditUsers={canEditUsers}
            canDeleteUsers={canDeleteUsers}
            getRoleBadgeVariant={getRoleBadgeVariant}
            getStatusBadgeVariant={getStatusBadgeVariant}
            viewMode={viewMode}
          />
        </TabsContent>
      </Tabs>

      <EditUserModal
        user={editingUser}
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        onSave={handleEditUser}
      />
    </div>
  )
}

// Componente para mostrar la lista de usuarios
interface UserListProps {
  users: User[]
  loading: boolean
  selectedUsers: string[]
  onSelectUser: (userId: string) => void
  onSelectAll: () => void
  onToggleStatus: (userId: string, newStatus: 'ACTIVE' | 'INACTIVE') => void
  onDeleteUser: (userId: string) => void
  onEditUser: (userId: string, userData: { name: string, email: string, role: string, isActive: boolean }) => void
  onOpenEditModal: (user: User) => void
  canEditUsers: () => boolean
  canDeleteUsers: () => boolean
  getRoleBadgeVariant: (role: string) => "destructive" | "default" | "secondary" | "outline"
  getStatusBadgeVariant: (status: string) => "default" | "secondary"
  viewMode: 'grid' | 'list'
}

function UserList({
  users,
  loading,
  selectedUsers,
  onSelectUser,
  onSelectAll,
  onToggleStatus,
  onDeleteUser,
  onEditUser,
  onOpenEditModal,
  canEditUsers,
  canDeleteUsers,
  getRoleBadgeVariant,
  getStatusBadgeVariant,
  viewMode
}: UserListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
            <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-8">
        <Users className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-2 text-sm font-medium">No se encontraron usuarios</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Intenta ajustar los filtros de búsqueda.
        </p>
      </div>
    )
  }

  if (viewMode === 'grid') {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <Card key={user.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={selectedUsers.includes(user.id)}
                    onCheckedChange={() => onSelectUser(user.id)}
                  />
                  <Avatar>
                    <AvatarImage src={`/avatars/${user.id}.jpg`} />
                    <AvatarFallback>
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      Ver detalles
                    </DropdownMenuItem>
                    {canEditUsers() && (
                      <DropdownMenuItem onClick={() => onOpenEditModal(user)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                    )}
                    <ToggleUserStatusDialog
                      user={user}
                      onStatusChanged={onToggleStatus}
                    >
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        {user.status === 'ACTIVE' ? (
                          <>
                            <UserX className="mr-2 h-4 w-4" />
                            Desactivar
                          </>
                        ) : (
                          <>
                            <UserCheck className="mr-2 h-4 w-4" />
                            Activar
                          </>
                        )}
                      </DropdownMenuItem>
                    </ToggleUserStatusDialog>
                    {canDeleteUsers() && (
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => onDeleteUser(user.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Eliminar
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="mt-4">
                <h3 className="font-medium">{user.name}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                {user.department && (
                  <p className="text-xs text-muted-foreground mt-1">{user.department}</p>
                )}
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant={getRoleBadgeVariant(user.role)}>
                    {user.role}
                  </Badge>
                  <Badge variant={getStatusBadgeVariant(user.status)}>
                    {user.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
                {user.lastLogin && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Último acceso: {user.lastLogin}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            Usuarios ({users.length})
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={selectedUsers.length === users.length && users.length > 0}
              onCheckedChange={onSelectAll}
            />
            <span className="text-sm text-muted-foreground">Seleccionar todos</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center space-x-4">
                <Checkbox
                  checked={selectedUsers.includes(user.id)}
                  onCheckedChange={() => onSelectUser(user.id)}
                />
                <Avatar>
                  <AvatarImage src={`/avatars/${user.id}.jpg`} />
                  <AvatarFallback>
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  {user.department && (
                    <p className="text-xs text-muted-foreground">{user.department}</p>
                  )}
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {user.role}
                    </Badge>
                    <Badge variant={getStatusBadgeVariant(user.status)}>
                      {user.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
                {canEditUsers() && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onOpenEditModal(user)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
                <ToggleUserStatusDialog
                  user={user}
                  onStatusChanged={onToggleStatus}
                >
                  <Button 
                    variant="ghost" 
                    size="sm"
                    title={user.status === 'ACTIVE' ? 'Desactivar' : 'Activar'}
                  >
                    {user.status === 'ACTIVE' ? (
                      <UserX className="h-4 w-4" />
                    ) : (
                      <UserCheck className="h-4 w-4" />
                    )}
                  </Button>
                </ToggleUserStatusDialog>
                {canDeleteUsers() && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-destructive"
                    onClick={() => onDeleteUser(user.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      Ver detalles
                    </DropdownMenuItem>
                    {canEditUsers() && (
                      <DropdownMenuItem onClick={() => onOpenEditModal(user)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                    )}
                    <ToggleUserStatusDialog
                      user={user}
                      onStatusChanged={onToggleStatus}
                    >
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        {user.status === 'ACTIVE' ? (
                          <>
                            <UserX className="mr-2 h-4 w-4" />
                            Desactivar
                          </>
                        ) : (
                          <>
                            <UserCheck className="mr-2 h-4 w-4" />
                            Activar
                          </>
                        )}
                      </DropdownMenuItem>
                    </ToggleUserStatusDialog>
                    {canDeleteUsers() && (
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => onDeleteUser(user.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Eliminar
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}