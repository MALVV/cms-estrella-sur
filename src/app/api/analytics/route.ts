import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function calculateTrends(data: any[], dateField: string) {
  const now = new Date()
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
  const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate())
  
  const lastMonthData = data.filter(item => {
    const itemDate = new Date(item[dateField])
    return itemDate >= lastMonth && itemDate < now
  })
  
  const previousMonthData = data.filter(item => {
    const itemDate = new Date(item[dateField])
    return itemDate >= twoMonthsAgo && itemDate < lastMonth
  })
  
  const currentCount = lastMonthData.length
  const previousCount = previousMonthData.length
  
  if (previousCount === 0) return currentCount > 0 ? 100 : 0
  
  const change = ((currentCount - previousCount) / previousCount) * 100
  return Math.round(change * 10) / 10
}

function getRecentActivity(data: any[], dateField: string, days: number = 7) {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - days)
  
  return data.filter(item => {
    const itemDate = new Date(item[dateField])
    return itemDate >= cutoffDate
  }).length
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Obtener datos reales de la base de datos
    const [
      users,
      projects,
      methodologies,
      programs,
      news,
      events,
      stories,
      images,
      allies
    ] = await Promise.all([
      prisma.user.findMany({
        select: { id: true, createdAt: true }
      }),
      prisma.project.findMany({
        select: { id: true, createdAt: true, updatedAt: true, isActive: true }
      }),
      prisma.methodology.findMany({
        select: { id: true, createdAt: true, updatedAt: true, isActive: true }
      }),
      prisma.programas.findMany({
        select: { id: true, createdAt: true, updatedAt: true, isActive: true }
      }),
      prisma.news.findMany({
        select: { id: true, createdAt: true, updatedAt: true, isActive: true }
      }),
      prisma.event.findMany({
        select: { id: true, createdAt: true, updatedAt: true, isActive: true }
      }),
      prisma.stories.findMany({
        select: { id: true, createdAt: true, updatedAt: true, isActive: true }
      }),
      prisma.imageLibrary.findMany({
        select: { id: true, createdAt: true }
      }),
      prisma.allies.findMany({
        select: { id: true, createdAt: true, isActive: true }
      })
    ])

    // Calcular métricas reales
    const analytics = {
      // Métricas principales
      totalUsers: users.length,
      totalContent: projects.length + methodologies.length + programs.length + 
                   news.length + events.length + stories.length,
      totalCommunications: news.length + events.length + stories.length,
      totalImages: images.length,
      
      // Métricas detalladas
      totalProjects: projects.length,
      totalMethodologies: methodologies.length,
      totalPrograms: programs.length,
      totalNews: news.length,
      totalEvents: events.length,
      totalStories: stories.length,
      totalAllies: allies.length,
      
      // Tendencias (último mes vs mes anterior)
      projectsTrend: calculateTrends(projects, 'createdAt'),
      methodologiesTrend: calculateTrends(methodologies, 'createdAt'),
      programsTrend: calculateTrends(programs, 'createdAt'),
      newsTrend: calculateTrends(news, 'createdAt'),
      eventsTrend: calculateTrends(events, 'createdAt'),
      storiesTrend: calculateTrends(stories, 'createdAt'),
      
      // Actividad reciente
      recentProjects: getRecentActivity(projects, 'createdAt'),
      recentNews: getRecentActivity(news, 'createdAt'),
      recentEvents: getRecentActivity(events, 'createdAt'),
      recentStories: getRecentActivity(stories, 'createdAt'),
      
      // Estadísticas adicionales
      activeProjects: projects.filter(p => p.isActive).length,
      completedProjects: projects.filter(p => !p.isActive).length,
      totalViews: 0, // No hay campo de vistas en el modelo actual
      totalAttendees: 0, // No hay campo de asistentes en el modelo actual
      
      // Contenido activo
      activeMethodologies: methodologies.filter(m => m.isActive).length,
      activePrograms: programs.filter(p => p.isActive).length,
      activeNews: news.filter(n => n.isActive).length,
      activeEvents: events.filter(e => e.isActive).length,
      activeStories: stories.filter(s => s.isActive).length,
      
      // Fechas para contexto
      lastUpdated: new Date().toISOString(),
      dataRange: {
        oldest: Math.min(
          ...users.map(u => new Date(u.createdAt).getTime()),
          ...projects.map(p => new Date(p.createdAt).getTime()),
          ...methodologies.map(m => new Date(m.createdAt).getTime()),
          ...programs.map(p => new Date(p.createdAt).getTime())
        ),
        newest: Math.max(
          ...users.map(u => new Date(u.createdAt).getTime()),
          ...projects.map(p => new Date(p.updatedAt).getTime()),
          ...methodologies.map(m => new Date(m.updatedAt).getTime()),
          ...programs.map(p => new Date(p.updatedAt).getTime())
        )
      }
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
