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

    // Verificar que el usuario tenga permisos para ver donaciones
    if (!['ADMINISTRATOR', 'CONSULTANT'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Permisos insuficientes' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')

    // Obtener donaciones recientes
    const recentDonations = await prisma.donation.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        donorName: true,
        amount: true,
        status: true,
        createdAt: true,
        donationType: true,
        donationProject: {
          select: {
            title: true
          }
        }
      }
    })

    // Transformar datos para el frontend
    const transformedDonations = recentDonations.map(donation => ({
      id: donation.id,
      donorName: donation.donorName,
      amount: Number(donation.amount),
      status: donation.status,
      createdAt: donation.createdAt.toISOString(),
      donationType: donation.donationType,
      projectTitle: donation.donationProject?.title || 'Donación General'
    }))

    return NextResponse.json(transformedDonations)
  } catch (error) {
    console.error('Error al obtener donaciones recientes:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}


