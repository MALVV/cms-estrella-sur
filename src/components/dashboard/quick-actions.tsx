'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  FileText, 
  BookOpen, 
  Calendar, 
  Plus,
  Eye,
  Settings,
  TrendingUp
} from 'lucide-react'
import { usePermissions } from '@/hooks/use-permissions'

export function QuickActions() {
  const { canManageUsers, canManageContent } = usePermissions()

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Acceso Rápido</CardTitle>
          <CardDescription>
            Accede rápidamente a las funciones más utilizadas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {canManageUsers() && (
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/users">
                <Users className="mr-2 h-4 w-4" />
                Gestión de Usuarios
              </Link>
            </Button>
          )}
          
          {canManageContent() && (
            <>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/dashboard/stories">
                  <FileText className="mr-2 h-4 w-4" />
                  Gestión de Historias
                </Link>
              </Button>
              
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>
            Crear nuevo contenido rápidamente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {canManageContent() && (
            <>
              <Button asChild variant="default" className="w-full justify-start">
                <Link href="/dashboard/stories">
                  <Plus className="mr-2 h-4 w-4" />
                  Nueva Historia
                </Link>
              </Button>
              
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
