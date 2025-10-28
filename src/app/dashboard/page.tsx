"use client"

import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AnalyticsCards } from '@/components/dashboard/analytics-cards'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { ContentStats } from '@/components/dashboard/metrics-chart'
import { AdvisorDashboard } from '@/components/dashboard/advisor-dashboard'

export default function DashboardPage() {
  const { data: session } = useSession()

  // Si el usuario es CONSULTANT, mostrar el dashboard específico para CONSULTANTes
  if (session?.user?.role === 'CONSULTANT') {
    return <AdvisorDashboard />
  }

  return (
    <div className="space-y-6">
      {/* Analíticas Reales */}
      <AnalyticsCards />

      {/* Contenido Activo y Acciones Rápidas */}
      <div className="grid gap-4 md:grid-cols-2">
        <ContentStats />
        <QuickActions />
      </div>
    </div>
  )
}