'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Activity } from 'lucide-react'

interface ChartData {
  label: string
  value: number
  change: number
  trend: 'up' | 'down' | 'stable'
}

interface MetricsChartProps {
  title: string
  data: ChartData[]
  icon?: React.ComponentType<{ className?: string }>
}

export function MetricsChart({ title, data, icon: Icon }: MetricsChartProps) {
  const totalValue = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {data.map((item, index) => {
            const percentage = totalValue > 0 ? (item.value / totalValue) * 100 : 0
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="text-sm font-bold">{item.value}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="h-2 bg-gray-600 dark:bg-gray-400 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

// Componente para mostrar estadísticas de actividad reciente
export function RecentActivityStats() {
  const [activityData, setActivityData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActivityData = async () => {
      try {
        const response = await fetch('/api/analytics')
        if (response.ok) {
          const data = await response.json()
          
          const activityStats: ChartData[] = [
            { 
              label: 'Esta semana', 
              value: data.recentProjects + data.recentNews + data.recentEvents + data.recentStories, 
              change: ((data.recentProjects + data.recentNews + data.recentEvents + data.recentStories) / 7) * 100, 
              trend: 'up' 
            },
            { 
              label: 'Este mes', 
              value: data.totalProjects + data.totalNews + data.totalEvents + data.totalStories, 
              change: data.projectsTrend + data.newsTrend + data.eventsTrend + data.storiesTrend, 
              trend: data.projectsTrend + data.newsTrend + data.eventsTrend + data.storiesTrend > 0 ? 'up' : 'down' 
            },
            { 
              label: 'Proyectos activos', 
              value: data.activeProjects, 
              change: data.projectsTrend, 
              trend: data.projectsTrend > 0 ? 'up' : 'down' 
            },
            { 
              label: 'Total vistas', 
              value: data.totalViews, 
              change: data.newsTrend + data.storiesTrend, 
              trend: data.newsTrend + data.storiesTrend > 0 ? 'up' : 'down' 
            }
          ]
          
          setActivityData(activityStats)
        }
      } catch (error) {
        console.error('Error fetching activity data:', error)
        // Datos de fallback
        setActivityData([
          { label: 'Esta semana', value: 5, change: 12.5, trend: 'up' },
          { label: 'Este mes', value: 25, change: 8.7, trend: 'up' },
          { label: 'Proyectos activos', value: 8, change: -2.1, trend: 'down' },
          { label: 'Total vistas', value: 1250, change: 23.4, trend: 'up' }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchActivityData()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24"></div>
          <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-8"></div>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <MetricsChart 
      title="Actividad Reciente" 
      data={activityData} 
      icon={Activity}
    />
  )
}

// Componente para mostrar estadísticas de contenido
export function ContentStats() {
  const [contentData, setContentData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContentData = async () => {
      try {
        const response = await fetch('/api/analytics')
        if (response.ok) {
          const data = await response.json()
          
          const contentStats: ChartData[] = [
            { 
              label: 'Proyectos', 
              value: data.activeProjects, 
              change: 0, 
              trend: 'stable' 
            },
            { 
              label: 'Metodologías', 
              value: data.activeMethodologies, 
              change: 0, 
              trend: 'stable' 
            },
            { 
              label: 'Programas', 
              value: data.activePrograms, 
              change: 0, 
              trend: 'stable' 
            },
            { 
              label: 'Noticias', 
              value: data.activeNews, 
              change: 0, 
              trend: 'stable' 
            },
            { 
              label: 'Eventos', 
              value: data.activeEvents, 
              change: 0, 
              trend: 'stable' 
            }
          ]
          
          setContentData(contentStats)
        }
      } catch (error) {
        console.error('Error fetching content data:', error)
        // Datos de fallback
        setContentData([
          { label: 'Proyectos', value: 2, change: 0, trend: 'stable' },
          { label: 'Metodologías', value: 1, change: 0, trend: 'stable' },
          { label: 'Programas', value: 2, change: 0, trend: 'stable' },
          { label: 'Noticias', value: 2, change: 0, trend: 'stable' },
          { label: 'Eventos', value: 1, change: 0, trend: 'stable' }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchContentData()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24"></div>
          <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-8"></div>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <MetricsChart 
      title="Contenido Activo" 
      data={contentData} 
      icon={TrendingUp}
    />
  )
}
