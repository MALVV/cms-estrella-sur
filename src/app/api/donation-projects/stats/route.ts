import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Verificar que el usuario tenga permisos para ver proyectos de donación
    if (!['ADMINISTRATOR', 'CONSULTANT'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Permisos insuficientes' }, { status: 403 })
    }

    // Obtener estadísticas de proyectos de donación
    const [
      totalProjects,
      activeProjects,
      completedProjects,
      totalRaised
    ] = await Promise.all([
      // Total de proyectos
      prisma.donationProject.count(),
      
      // Proyectos activos
      prisma.donationProject.count({
        where: { 
          isActive: true,
          isCompleted: false 
        }
      }),
      
      // Proyectos completados
      prisma.donationProject.count({
        where: { isCompleted: true }
      }),
      
      // Total recaudado en proyectos
      prisma.donationProject.aggregate({
        _sum: { currentAmount: true }
      })
    ])

    const stats = {
      totalProjects,
      activeProjects,
      completedProjects,
      totalRaised: totalRaised._sum.currentAmount ? Number(totalRaised._sum.currentAmount) : 0
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error al obtener estadísticas de proyectos:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}


