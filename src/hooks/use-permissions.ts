"use client"

import { useSession } from 'next-auth/react'
import { UserRole, canPerformAction, hasResourceAccess, getRolePermissions } from '@/lib/roles'

export function usePermissions() {
  const { data: session } = useSession()
  const userRole = session?.user?.role as UserRole

  const hasPermission = (resource: string, action: string): boolean => {
    if (!userRole) return false
    return canPerformAction(userRole, resource, action)
  }

  const hasAccess = (resource: string): boolean => {
    if (!userRole) return false
    return hasResourceAccess(userRole, resource)
  }

  const getPermissions = () => {
    if (!userRole) return []
    return getRolePermissions(userRole)
  }

  const canManageUsers = (): boolean => {
    return hasPermission('users', 'create') || hasPermission('users', 'update')
  }

  const canManageContent = (): boolean => {
    return hasPermission('content', 'create') || hasPermission('content', 'update')
  }

  const canPublishContent = (): boolean => {
    return hasPermission('content', 'publish')
  }

  const canManageFiles = (): boolean => {
    return hasPermission('files', 'upload') || hasPermission('files', 'delete')
  }

  const canViewReports = (): boolean => {
    return hasPermission('reports', 'view')
  }

  const canManageSystem = (): boolean => {
    return hasPermission('system', 'config')
  }

  // Funciones específicas para gestión de usuarios
  const canCreateUsers = (): boolean => {
    return hasPermission('users', 'create')
  }

  const canEditUsers = (): boolean => {
    return hasPermission('users', 'update')
  }

  const canDeleteUsers = (): boolean => {
    return hasPermission('users', 'delete')
  }

  const canManageStories = (): boolean => {
    return hasPermission('content', 'create') || hasPermission('content', 'update')
  }

  const canCreateStories = (): boolean => {
    return hasPermission('content', 'create')
  }

  const canEditStories = (): boolean => {
    return hasPermission('content', 'update')
  }

  const canDeleteStories = (): boolean => {
    return hasPermission('content', 'delete')
  }

  const canManageVideoTestimonials = (): boolean => {
    return hasPermission('content', 'create') || hasPermission('content', 'update')
  }

  const canCreateVideoTestimonials = (): boolean => {
    return hasPermission('content', 'create')
  }

  const canEditVideoTestimonials = (): boolean => {
    return hasPermission('content', 'update')
  }

  const canDeleteVideoTestimonials = (): boolean => {
    return hasPermission('content', 'delete')
  }

  const isAdmin = (): boolean => {
    return userRole === UserRole.ADMINISTRADOR
  }

  const isSupervisor = (): boolean => {
    return userRole === UserRole.SUPERVISOR
  }

  const isTechnician = (): boolean => {
    return userRole === UserRole.TECNICO
  }

  return {
    userRole,
    hasPermission,
    hasAccess,
    getPermissions,
    canManageUsers,
    canCreateUsers,
    canEditUsers,
    canDeleteUsers,
    canManageContent,
    canManageStories,
    canCreateStories,
    canEditStories,
    canDeleteStories,
    canManageVideoTestimonials,
    canCreateVideoTestimonials,
    canEditVideoTestimonials,
    canDeleteVideoTestimonials,
    canPublishContent,
    canManageFiles,
    canViewReports,
    canManageSystem,
    isAdmin,
    isSupervisor,
    isTechnician
  }
}
