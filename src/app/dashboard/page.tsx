"use client"

import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AnalyticsCards } from '@/components/dashboard/analytics-cards'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { ContentStats } from '@/components/dashboard/metrics-chart'

export default function DashboardPage() {
  const { data: session } = useSession()

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