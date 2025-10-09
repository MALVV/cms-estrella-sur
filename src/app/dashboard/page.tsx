"use client"

import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AnalyticsCards } from '@/components/dashboard/analytics-cards'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { PublicPreview } from '@/components/dashboard/public-preview'

export default function DashboardPage() {
  const { data: session } = useSession()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Panel de Control</h1>
        <p className="text-muted-foreground">
          Bienvenido de vuelta, {session?.user?.name || 'Usuario'}
        </p>
      </div>

      {/* Analíticas Reales */}
      <AnalyticsCards />

      {/* Acciones Rápidas y Vista Previa */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <QuickActions />
        </div>
        <div>
          <PublicPreview />
        </div>
      </div>

      {/* Información del Usuario */}
        <Card>
          <CardHeader>
            <CardTitle>Información del Usuario</CardTitle>
            <CardDescription>
              Detalles de tu sesión actual
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Nombre:</span>
              <span className="text-sm">{session?.user?.name || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Email:</span>
              <span className="text-sm">{session?.user?.email || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Rol:</span>
              <span className="text-sm">{session?.user?.role || 'N/A'}</span>
            </div>
          </CardContent>
        </Card>
    </div>
  )
}