"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  DollarSign, 
  Target, 
  TrendingUp, 
  Users, 
  Calendar,
  Heart,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Plus,
  BarChart3
} from 'lucide-react'
import Link from 'next/link'

interface DonationStats {
  totalDonations: number
  totalAmount: number
  pendingDonations: number
  approvedDonations: number
  rejectedDonations: number
  monthlyGoal: number
  monthlyProgress: number
}

interface RecentDonation {
  id: string
  donorName: string
  amount: number
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: string
  donationType: string
}

interface ProjectStats {
  totalProjects: number
  activeProjects: number
  completedProjects: number
  totalRaised: number
}

export function AdvisorDashboard() {
  const [donationStats, setDonationStats] = useState<DonationStats>({
    totalDonations: 0,
    totalAmount: 0,
    pendingDonations: 0,
    approvedDonations: 0,
    rejectedDonations: 0,
    monthlyGoal: 0,
    monthlyProgress: 0
  })
  
  const [recentDonations, setRecentDonations] = useState<RecentDonation[]>([])
  const [projectStats, setProjectStats] = useState<ProjectStats>({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalRaised: 0
  })
  
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch donation statistics
      const donationsResponse = await fetch('/api/donations/stats')
      if (donationsResponse.ok) {
        const donationsData = await donationsResponse.json()
        setDonationStats(donationsData)
      }

      // Fetch recent donations
      const recentResponse = await fetch('/api/donations/recent')
      if (recentResponse.ok) {
        const recentData = await recentResponse.json()
        setRecentDonations(recentData)
      }

      // Fetch project statistics
      const projectsResponse = await fetch('/api/donation-projects/stats')
      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json()
        setProjectStats(projectsData)
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return `Bs. ${amount.toLocaleString('es-BO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Aprobada</Badge>
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pendiente</Badge>
      case 'REJECTED':
        return <Badge className="bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1" />Rechazada</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getProgressPercentage = (current: number, target: number) => {
    if (target === 0) return 0
    return Math.min((current / target) * 100, 100)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Panel de Donaciones
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gestión y seguimiento de donaciones y proyectos
          </p>
        </div>
      </div>

      {/* Estadísticas Principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Recaudado
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(donationStats.totalAmount)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {donationStats.approvedDonations} donación(es) aprobada(s)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Donaciones
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {donationStats.totalDonations}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {donationStats.rejectedDonations} rechazada(s)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Pendientes
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {donationStats.pendingDonations}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Requieren revisión
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Proyectos Activos
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {projectStats.activeProjects}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {projectStats.completedProjects} completado(s)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Meta Anual */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Meta Anual {new Date().getFullYear()}
          </CardTitle>
          <CardDescription>
            Progreso hacia la meta de recaudación anual
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Progreso Anual</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {formatCurrency(donationStats.totalAmount)} / {formatCurrency(donationStats.monthlyGoal * 12)}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-300"
                style={{ width: `${getProgressPercentage(donationStats.totalAmount, donationStats.monthlyGoal * 12)}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-sm">
              <p className="text-gray-600 dark:text-gray-400">
                {Math.round(getProgressPercentage(donationStats.totalAmount, donationStats.monthlyGoal * 12))}% completado
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Restante: {formatCurrency((donationStats.monthlyGoal * 12) - donationStats.totalAmount)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>


      {/* Estadísticas de Proyectos y Donaciones Recientes */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Estadísticas de Proyectos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Estadísticas de Proyectos
            </CardTitle>
            <CardDescription>
              Resumen de proyectos de donación
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total de Proyectos</span>
              <span className="text-lg font-bold">{projectStats.totalProjects}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Proyectos Activos</span>
              <span className="text-lg font-bold text-blue-600">{projectStats.activeProjects}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Proyectos Completados</span>
              <span className="text-lg font-bold text-green-600">{projectStats.completedProjects}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total Recaudado</span>
              <span className="text-lg font-bold text-green-600">{formatCurrency(projectStats.totalRaised)}</span>
            </div>
            <div className="pt-4">
              <Button asChild className="w-full">
                <Link href="/dashboard/proyectos-donacion">
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Todos los Proyectos
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Donaciones Recientes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="w-5 h-5 mr-2" />
              Donaciones Recientes
            </CardTitle>
            <CardDescription>
              Últimas donaciones recibidas y su estado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDonations.length === 0 ? (
                <div className="text-center py-8">
                  <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-sm text-gray-500 mb-2">No hay donaciones recientes</p>
                  <p className="text-xs text-gray-400">Las donaciones aparecerán aquí cuando se reciban</p>
                </div>
              ) : (
                recentDonations.slice(0, 5).map((donation) => (
                  <div key={donation.id} className="flex justify-between items-start p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm">{donation.donorName}</p>
                        {getStatusBadge(donation.status)}
                      </div>
                      <p className="text-xs text-gray-500 mb-1">
                        {donation.donationType === 'SPECIFIC_PROJECT' ? 'Proyecto Específico' : 
                         donation.donationType === 'GENERAL' ? 'Donación General' :
                         donation.donationType === 'EMERGENCY' ? 'Emergencia' : donation.donationType}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(donation.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-green-600">{formatCurrency(donation.amount)}</p>
                      <p className="text-xs text-gray-500">Bolivianos</p>
                    </div>
                  </div>
                ))
              )}
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium">Resumen</span>
                  <span className="text-sm text-gray-500">
                    {recentDonations.length} donación(es) total
                  </span>
                </div>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/dashboard/donaciones">
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Todas las Donaciones
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Acciones Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>
            Accesos directos a las funciones más utilizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button asChild variant="outline" className="h-20 flex-col">
              <Link href="/dashboard/donaciones">
                <Heart className="w-6 h-6 mb-2" />
                Gestionar Donaciones
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col">
              <Link href="/dashboard/proyectos-donacion">
                <Target className="w-6 h-6 mb-2" />
                Proyectos de Donación
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col">
              <Link href="/dashboard/metas-anuales">
                <Calendar className="w-6 h-6 mb-2" />
                Metas Anuales
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
