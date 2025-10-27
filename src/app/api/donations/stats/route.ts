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

    // Verificar que el usuario tenga permisos para ver estadísticas de donaciones
    if (!['ADMINISTRADOR', 'ASESOR'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Permisos insuficientes' }, { status: 403 })
    }

    // Obtener estadísticas de donaciones
    const [
      totalDonations,
      totalAmount,
      pendingDonations,
      approvedDonations,
      rejectedDonations,
      monthlyGoal
    ] = await Promise.all([
      // Total de donaciones
      prisma.donation.count(),
      
      // Monto total recaudado
      prisma.donation.aggregate({
        where: { status: 'APPROVED' },
        _sum: { amount: true }
      }),
      
      // Donaciones pendientes
      prisma.donation.count({
        where: { status: 'PENDING' }
      }),
      
      // Donaciones aprobadas
      prisma.donation.count({
        where: { status: 'APPROVED' }
      }),
      
      // Donaciones rechazadas
      prisma.donation.count({
        where: { status: 'REJECTED' }
      }),
      
      // Meta mensual (usar la meta anual dividida por 12)
      prisma.annualGoal.findFirst({
        where: { 
          year: new Date().getFullYear(),
          isActive: true 
        },
        select: { targetAmount: true }
      })
    ])

    // Calcular progreso mensual
    const currentMonth = new Date().getMonth() + 1
    const monthlyTarget = monthlyGoal ? Number(monthlyGoal.targetAmount) / 12 : 0
    
    // Obtener donaciones aprobadas del mes actual
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
    
    const monthlyDonations = await prisma.donation.aggregate({
      where: {
        status: 'APPROVED',
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      },
      _sum: { amount: true }
    })

    const monthlyProgress = monthlyDonations._sum.amount ? Number(monthlyDonations._sum.amount) : 0

    const stats = {
      totalDonations,
      totalAmount: totalAmount._sum.amount ? Number(totalAmount._sum.amount) : 0,
      pendingDonations,
      approvedDonations,
      rejectedDonations,
      monthlyGoal: monthlyTarget,
      monthlyProgress
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error al obtener estadísticas de donaciones:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}


