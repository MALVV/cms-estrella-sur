"use client"

import React from 'react'
import Link from 'next/link'
import { usePermissions } from '@/hooks/use-permissions'
import { UserRole } from '@/lib/roles'

interface NavItem {
  label: string
  href: string
  icon: string
  requiredPermission?: {
    resource: string
    action: string
  }
  requiredRole?: UserRole
}

const navigationItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: '📊'
  },
  {
    label: 'Usuarios',
    href: '/dashboard/users',
    icon: '👥',
    requiredPermission: { resource: 'users', action: 'read' }
  },
  {
    label: 'Contenido',
    href: '/dashboard/content',
    icon: '📝',
    requiredPermission: { resource: 'content', action: 'read' }
  },
  {
    label: 'Archivos',
    href: '/dashboard/files',
    icon: '📁',
    requiredPermission: { resource: 'files', action: 'upload' }
  },
  {
    label: 'Reportes',
    href: '/dashboard/reports',
    icon: '📈',
    requiredPermission: { resource: 'reports', action: 'view' }
  },
  {
    label: 'Configuración',
    href: '/dashboard/settings',
    icon: '⚙️',
    requiredRole: UserRole.ADMINISTRATOR
  }
]

export const RoleBasedNav: React.FC = () => {
  const { hasPermission, userRole } = usePermissions()

  const isItemVisible = (item: NavItem): boolean => {
    // Si no hay restricciones, siempre visible
    if (!item.requiredPermission && !item.requiredRole) {
      return true
    }

    // Verificar permiso específico
    if (item.requiredPermission) {
      return hasPermission(item.requiredPermission.resource, item.requiredPermission.action)
    }

    // Verificar rol específico
    if (item.requiredRole) {
      return userRole === item.requiredRole
    }

    return false
  }

  const visibleItems = navigationItems.filter(isItemVisible)

  return (
    <nav className="space-y-2">
      {visibleItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <span className="text-lg">{item.icon}</span>
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  )
}
