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

  // Funciones específicas para gestión de proyectos
  const canManageProjects = (): boolean => {
    return hasPermission('projects', 'create') || hasPermission('projects', 'update')
  }

  const canCreateProjects = (): boolean => {
    return hasPermission('projects', 'create')
  }

  const canEditProjects = (): boolean => {
    return hasPermission('projects', 'update')
  }

  const canDeleteProjects = (): boolean => {
    return hasPermission('projects', 'delete')
  }

  // Funciones específicas para gestión de innovaciones
  const canManageInnovations = (): boolean => {
    return hasPermission('innovations', 'create') || hasPermission('innovations', 'update')
  }

  const canCreateInnovations = (): boolean => {
    return hasPermission('innovations', 'create')
  }

  const canEditInnovations = (): boolean => {
    return hasPermission('innovations', 'update')
  }

  const canDeleteInnovations = (): boolean => {
    return hasPermission('innovations', 'delete')
  }

  // Funciones específicas para gestión de programas
  const canManagePrograms = (): boolean => {
    return hasPermission('programs', 'create') || hasPermission('programs', 'update')
  }

  const canCreatePrograms = (): boolean => {
    return hasPermission('programs', 'create')
  }

  const canEditPrograms = (): boolean => {
    return hasPermission('programs', 'update')
  }

  const canDeletePrograms = (): boolean => {
    return hasPermission('programs', 'delete')
  }

  const isAdmin = (): boolean => {
    return userRole === UserRole.ADMINISTRADOR
  }

  const isContentManager = (): boolean => {
    return userRole === UserRole.GESTOR
  }

  const isDonationAdvisor = (): boolean => {
    return userRole === UserRole.ASESOR
  }

  // Funciones específicas para gestión de donaciones
  const canManageDonations = (): boolean => {
    return hasPermission('donations', 'create') || hasPermission('donations', 'update')
  }

  const canCreateDonations = (): boolean => {
    return hasPermission('donations', 'create')
  }

  const canEditDonations = (): boolean => {
    return hasPermission('donations', 'update')
  }

  const canDeleteDonations = (): boolean => {
    return hasPermission('donations', 'delete')
  }

  const canApproveDonations = (): boolean => {
    return hasPermission('donations', 'approve')
  }

  const canRejectDonations = (): boolean => {
    return hasPermission('donations', 'reject')
  }

  // Funciones específicas para gestión de metas anuales
  const canManageAnnualGoals = (): boolean => {
    return hasPermission('annual_goals', 'create') || hasPermission('annual_goals', 'update')
  }

  const canCreateAnnualGoals = (): boolean => {
    return hasPermission('annual_goals', 'create')
  }

  const canEditAnnualGoals = (): boolean => {
    return hasPermission('annual_goals', 'update')
  }

  const canDeleteAnnualGoals = (): boolean => {
    return hasPermission('annual_goals', 'delete')
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
    canManageProjects,
    canCreateProjects,
    canEditProjects,
    canDeleteProjects,
    canManageInnovations,
    canCreateInnovations,
    canEditInnovations,
    canDeleteInnovations,
    canManagePrograms,
    canCreatePrograms,
    canEditPrograms,
    canDeletePrograms,
    canPublishContent,
    canManageFiles,
    canViewReports,
    canManageSystem,
    isAdmin,
    isContentManager,
    isDonationAdvisor,
    canManageDonations,
    canCreateDonations,
    canEditDonations,
    canDeleteDonations,
    canApproveDonations,
    canRejectDonations,
    canManageAnnualGoals,
    canCreateAnnualGoals,
    canEditAnnualGoals,
    canDeleteAnnualGoals
  }
}
