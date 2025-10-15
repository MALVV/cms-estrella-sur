'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, FileText, BookOpen, Calendar, TrendingUp, Eye, Briefcase, Settings, Images, Handshake, Shield, FolderOpen } from 'lucide-react'

interface AnalyticsData {
  // Métricas principales
  totalUsers: number
  totalContent: number
  totalCommunications: number
  totalImages: number
  
  // Métricas detalladas
  totalProjects: number
  totalMethodologies: number
  totalPrograms: number
  totalNews: number
  totalEvents: number
  totalStories: number
  totalAllies: number
  
  // Tendencias
  projectsTrend: number
  methodologiesTrend: number
  programsTrend: number
  newsTrend: number
  eventsTrend: number
  storiesTrend: number
  
  // Actividad reciente
  recentProjects: number
  recentNews: number
  recentEvents: number
  recentStories: number
  
  // Estadísticas adicionales
  activeProjects: number
  completedProjects: number
  totalViews: number
  totalAttendees: number
  
  // Contenido activo
  activeMethodologies: number
  activePrograms: number
  activeNews: number
  activeEvents: number
  activeStories: number
  
  // Metadatos
  lastUpdated: string
}

export function AnalyticsCards() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalUsers: 0,
    totalContent: 0,
    totalCommunications: 0,
    totalImages: 0,
    totalProjects: 0,
    totalMethodologies: 0,
    totalPrograms: 0,
    totalNews: 0,
    totalEvents: 0,
    totalStories: 0,
    totalAllies: 0,
    projectsTrend: 0,
    methodologiesTrend: 0,
    programsTrend: 0,
    newsTrend: 0,
    eventsTrend: 0,
    storiesTrend: 0,
    recentProjects: 0,
    recentNews: 0,
    recentEvents: 0,
    recentStories: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalViews: 0,
    totalAttendees: 0,
    activeMethodologies: 0,
    activePrograms: 0,
    activeNews: 0,
    activeEvents: 0,
    activeStories: 0,
    lastUpdated: ''
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/analytics')
        
        if (!response.ok) {
          throw new Error('Error al obtener analíticas')
        }
        
        const data = await response.json()
        setAnalytics(data)
      } catch (error) {
        console.error('Error fetching analytics:', error)
        // En caso de error, mantener valores por defecto
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cargando...</CardTitle>
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse mt-2" />
            </CardContent>
          </Card>
        ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cargando...</CardTitle>
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Métricas Principales */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Resumen Ejecutivo</h3>
        <div className="grid grid-cols-3 gap-4">
          {/* Usuarios */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuarios</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                Usuarios registrados
              </p>
            </CardContent>
          </Card>

          {/* Contenido */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contenido</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalStories}</div>
              <p className="text-xs text-muted-foreground">
                Historias destacadas
              </p>
            </CardContent>
          </Card>

          {/* Medios */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Medios</CardTitle>
              <Images className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalImages}</div>
              <p className="text-xs text-muted-foreground">
                Imágenes en galería
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Métricas Detalladas por Sección */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Desglose por Área</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {/* Estrategia */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estrategia</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalProjects + analytics.totalMethodologies + analytics.totalPrograms}</div>
              <p className="text-xs text-muted-foreground">
                {analytics.totalProjects} proyectos • {analytics.totalMethodologies} metodologías • {analytics.totalPrograms} programas
              </p>
            </CardContent>
          </Card>

          {/* Noticias */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Noticias</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalNews}</div>
              <p className="text-xs text-muted-foreground">
                Artículos publicados
              </p>
            </CardContent>
          </Card>

          {/* Eventos */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Eventos</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalEvents}</div>
              <p className="text-xs text-muted-foreground">
                Eventos programados
              </p>
            </CardContent>
          </Card>

          {/* Historias */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Historias</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalStories}</div>
              <p className="text-xs text-muted-foreground">
                Historias destacadas
              </p>
            </CardContent>
          </Card>

          {/* Aliados */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aliados</CardTitle>
              <Handshake className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalAllies}</div>
              <p className="text-xs text-muted-foreground">
                Aliados estratégicos
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
