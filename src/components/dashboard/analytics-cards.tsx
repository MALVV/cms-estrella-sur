'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, FileText, BookOpen, Calendar, TrendingUp, Eye } from 'lucide-react'

interface AnalyticsData {
  totalUsers: number
  totalStories: number
  totalNews: number
  totalEvents: number
  recentActivity: number
}

export function AnalyticsCards() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalUsers: 0,
    totalStories: 0,
    totalNews: 0,
    totalEvents: 0,
    recentActivity: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [usersRes, storiesRes, newsRes, eventsRes] = await Promise.all([
          fetch('/api/users'),
          fetch('/api/stories'),
          fetch('/api/news'),
          fetch('/api/events')
        ])

        const [users, stories, news, events] = await Promise.all([
          usersRes.json(),
          storiesRes.json(),
          newsRes.json(),
          eventsRes.json()
        ])

        setAnalytics({
          totalUsers: users.length || 0,
          totalStories: stories.length || 0,
          totalNews: news.length || 0,
          totalEvents: events.length || 0,
          recentActivity: (stories.length + news.length + events.length) || 0
        })
      } catch (error) {
        console.error('Error fetching analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
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
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Historias</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.totalStories}</div>
          <p className="text-xs text-muted-foreground">
            Historias publicadas
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Blog</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.totalNews + analytics.totalEvents}</div>
          <p className="text-xs text-muted-foreground">
            {analytics.totalNews} noticias, {analytics.totalEvents} eventos
          </p>
        </CardContent>
      </Card>

    </div>
  )
}
