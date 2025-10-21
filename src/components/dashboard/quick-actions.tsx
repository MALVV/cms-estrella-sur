'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  FileText,
  Newspaper,
  Target,
  Upload,
  Settings
} from 'lucide-react'
import { usePermissions } from '@/hooks/use-permissions'

export function QuickActions() {
  const { canManageUsers, canManageContent } = usePermissions()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Acciones Rápidas</CardTitle>
        <CardDescription>
          Crear contenido rápidamente
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {canManageContent() && (
          <>
            <Button asChild variant="default" className="w-full justify-start">
              <Link href="/dashboard/historias/create">
                <FileText className="mr-2 h-4 w-4" />
                Nueva Historia
              </Link>
            </Button>

            <Button asChild variant="default" className="w-full justify-start">
              <Link href="/dashboard/noticias/create">
                <Newspaper className="mr-2 h-4 w-4" />
                Nueva Noticia
              </Link>
            </Button>

            <Button asChild variant="default" className="w-full justify-start">
              <Link href="/dashboard/proyectos/create">
                <Target className="mr-2 h-4 w-4" />
                Nuevo Proyecto
              </Link>
            </Button>
          </>
        )}

        <Button asChild variant="secondary" className="w-full justify-start">
          <Link href="/dashboard/galeria-imagenes/upload">
            <Upload className="mr-2 h-4 w-4" />
            Subir Imágenes
          </Link>
        </Button>

        <Button asChild variant="secondary" className="w-full justify-start">
          <Link href="/dashboard/settings">
            <Settings className="mr-2 h-4 w-4" />
            Configuración
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
