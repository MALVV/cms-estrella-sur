"use client"

import React from 'react'
import { useSession } from 'next-auth/react'
import { UserRole, getRoleDescription, getRolePermissions } from '@/lib/roles'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface RoleInfoProps {
  className?: string
}

export const RoleInfo: React.FC<RoleInfoProps> = ({ className }) => {
  const { data: session } = useSession()

  if (!session?.user?.role) {
    return null
  }

  const userRole = session.user.role as UserRole
  const permissions = getRolePermissions(userRole)
  const description = getRoleDescription(userRole)

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMINISTRATOR:
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
      case UserRole.MANAGER:
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
    }
  }

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMINISTRATOR:
        return '👑'
      case UserRole.MANAGER:
        return '📝'
      default:
        return '👤'
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">{getRoleIcon(userRole)}</span>
          <span>Información de Rol</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium">Rol Actual:</span>
            <Badge className={getRoleColor(userRole)}>
              {userRole}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Permisos Disponibles:</h4>
          <div className="grid grid-cols-1 gap-2">
            {permissions.map((permission, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                <span className="font-medium">{permission.resource}</span>
                <span className="text-muted-foreground">-</span>
                <span className="text-muted-foreground">{permission.description}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            Total de permisos: {permissions.length}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
