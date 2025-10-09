'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Eye, ExternalLink, Globe } from 'lucide-react'

export function PublicPreview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Vista Previa del Sitio
        </CardTitle>
        <CardDescription>
          Ve cómo se ve tu sitio web para los visitantes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Button asChild variant="outline" className="w-full justify-start">
            <Link href="/" target="_blank">
              <Eye className="mr-2 h-4 w-4" />
              Ver Página Principal
              <ExternalLink className="ml-auto h-4 w-4" />
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="w-full justify-start">
            <Link href="/news-events" target="_blank">
              <Eye className="mr-2 h-4 w-4" />
              Ver Blog (Noticias y Eventos)
              <ExternalLink className="ml-auto h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            💡 <strong>Tip:</strong> Los enlaces se abren en una nueva pestaña para que puedas seguir trabajando en el dashboard.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
