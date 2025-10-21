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
  ShieldOff
} from 'lucide-react'
import Link from 'next/link'

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

interface UserManagementProps {
  className?: string
}

export const UserManagement: React.FC<UserManagementProps> = ({ className }) => {
  const { data: session } = useSession()
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<UserRole | 'ALL'>('ALL')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL')

  useEffect(() => {
    if (session?.user?.role === UserRole.ADMINISTRADOR) {
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

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMINISTRADOR:
        return <Crown className="h-4 w-4 text-red-500" />
      case UserRole.GESTOR:
        return <Briefcase className="h-4 w-4 text-green-500" />
      default:
        return <Users className="h-4 w-4 text-gray-500" />
    }
  }

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMINISTRADOR:
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
      case UserRole.GESTOR:
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
    }
  }

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/users/${userId}/toggle-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus })
      })

      if (response.ok) {
        // Actualizar el estado local
        setUsers(users.map(user => 
          user.id === userId 
            ? { ...user, isActive: !currentStatus }
            : user
        ))
      }
    } catch (error) {
      console.error('Error toggling user status:', error)
    }
  }

  if (!session?.user || session.user.role !== UserRole.ADMINISTRADOR) {
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
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Gestión de Usuarios
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

            {/* Filtro por rol */}
            <div className="flex gap-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as UserRole | 'ALL')}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="ALL">Todos los roles</option>
                <option value={UserRole.ADMINISTRADOR}>Administrador</option>
                <option value={UserRole.GESTOR}>Gestor de Contenido</option>
              </select>

              {/* Filtro por estado */}
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
                        {session.user.role === UserRole.ADMINISTRADOR && (
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
                        )}
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
