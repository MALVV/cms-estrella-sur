'use client'

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Share2, ArrowLeft, DollarSign, Users, Shield, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';

interface Project {
  id: string;
  title: string;
  context: string;
  objectives: string;
  content: string;
  executionStart: string;
  executionEnd: string;
  imageUrl?: string;
  imageAlt?: string;
  isFeatured: boolean;
}

interface DonationDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function DonationDetailPage({ params }: DonationDetailPageProps) {
  const resolvedParams = React.use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donorName, setDonorName] = useState<string>('');
  const [donorMessage, setDonorMessage] = useState<string>('');

  const donationAmounts = [25, 50, 100, 250, 500];

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/public/projects/${resolvedParams.id}`);
        if (response.ok) {
          const data = await response.json();
          setProject(data);
        }
      } catch (error) {
        console.error('Error al cargar proyecto:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [resolvedParams.id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long'
    });
  };

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
  };

  const handleDonation = () => {
    const amount = selectedAmount || parseFloat(customAmount);
    if (amount && amount > 0) {
      // Aquí iría la lógica de procesamiento de donación
      console.log('Procesando donación:', {
        amount,
        projectId: resolvedParams.id,
        donorName,
        donorMessage
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <SiteHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8"></div>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
              </div>
              <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <SiteHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-text-light dark:text-text-dark mb-4">Proyecto no encontrado</h1>
            <p className="text-text-secondary-light dark:text-text-secondary-dark mb-8">El proyecto solicitado no existe o ha sido eliminado.</p>
            <Button asChild>
              <Link href="/donar">Volver a Donaciones</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Datos simulados para la recaudación
  const raisedAmount = Math.floor(Math.random() * 50000) + 25000;
  const goalAmount = Math.floor(Math.random() * 50000) + 75000;
  const percentage = Math.round((raisedAmount / goalAmount) * 100);
  const donationCount = Math.floor(Math.random() * 2000) + 500;

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <SiteHeader />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Button variant="ghost" asChild className="p-0 h-auto">
            <Link href="/donar" className="flex items-center gap-2 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary">
              <ArrowLeft className="h-4 w-4" />
              Volver a Donaciones
            </Link>
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contenido Principal */}
          <div className="lg:col-span-2">
            {/* Título */}
            <h1 className="text-3xl md:text-4xl font-bold text-text-light dark:text-text-dark mb-6">
              {project.title}
            </h1>

            {/* Imagen Principal */}
            {project.imageUrl && (
              <div className="relative h-64 md:h-80 rounded-lg overflow-hidden mb-6">
                <Image
                  src={project.imageUrl}
                  alt={project.imageAlt || project.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
            )}

            {/* Información del Organizador */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-white" />
              </div>
              <span className="text-text-secondary-light dark:text-text-secondary-dark">
                Estrella del Sur está organizando esta recaudación
              </span>
            </div>

            {/* Badge de Protección */}
            <div className="flex items-center gap-2 mb-6">
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                <Shield className="mr-1 h-3 w-3" />
                Donación Protegida
              </Badge>
            </div>

            {/* Descripción del Proyecto */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-text-light dark:text-text-dark mb-3">
                Sobre este Proyecto
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-4">
                  {project.context}
                </p>
                <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
                  {project.objectives}
                </p>
              </div>
            </div>

            {/* Información de Fechas */}
            <div className="mb-6">
              <div className="flex items-center gap-2 text-text-secondary-light dark:text-text-secondary-dark">
                <span className="font-medium">Período de ejecución:</span>
                <span>{formatDate(project.executionStart)} - {formatDate(project.executionEnd)}</span>
              </div>
            </div>

            {/* Reacciones */}
            <div className="flex items-center gap-4 mb-8">
              <Button variant="outline" size="sm">
                <Heart className="mr-2 h-4 w-4" />
                Reaccionar
              </Button>
              <div className="flex items-center gap-2">
                <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  {Math.floor(Math.random() * 50) + 20} personas han reaccionado
                </span>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex gap-4">
              <Button size="lg" className="flex-1" onClick={handleDonation}>
                <Heart className="mr-2 h-5 w-5" />
                Donar Ahora
              </Button>
              <Button variant="outline" size="lg">
                <Share2 className="mr-2 h-5 w-5" />
                Compartir
              </Button>
            </div>
          </div>

          {/* Sidebar de Donación */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                {/* Resumen de Recaudación */}
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-text-light dark:text-text-dark mb-2">
                    ${raisedAmount.toLocaleString()}
                  </div>
                  <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-4">
                    de ${goalAmount.toLocaleString()} meta · {donationCount.toLocaleString()} donaciones
                  </div>
                  
                  {/* Barra de Progreso Circular */}
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-gray-200 dark:text-gray-700"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - percentage / 100)}`}
                        className="text-primary transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-text-light dark:text-text-dark">
                        {percentage}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Botones de Acción */}
                <div className="space-y-3 mb-6">
                  <Button className="w-full" size="lg" onClick={handleDonation}>
                    <Heart className="mr-2 h-4 w-4" />
                    Donar Ahora
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Share2 className="mr-2 h-4 w-4" />
                    Compartir
                  </Button>
                </div>

                {/* Formulario de Donación */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-text-light dark:text-text-dark">
                    Selecciona el Monto
                  </h3>
                  
                  {/* Montos Sugeridos */}
                  <div className="grid grid-cols-2 gap-2">
                    {donationAmounts.map((amount) => (
                      <Button
                        key={amount}
                        variant={selectedAmount === amount ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleAmountSelect(amount)}
                        className="h-10"
                      >
                        <DollarSign className="mr-1 h-3 w-3" />
                        {amount}
                      </Button>
                    ))}
                  </div>

                  {/* Monto Personalizado */}
                  <div>
                    <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                      Monto Personalizado
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary-light dark:text-text-secondary-dark" />
                      <input
                        type="number"
                        placeholder="Ingresa el monto"
                        value={customAmount}
                        onChange={(e) => handleCustomAmountChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Información del Donante */}
                  <div>
                    <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                      Tu Nombre (Opcional)
                    </label>
                    <input
                      type="text"
                      placeholder="Nombre del donante"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                      Mensaje (Opcional)
                    </label>
                    <textarea
                      placeholder="Deja un mensaje de apoyo..."
                      value={donorMessage}
                      onChange={(e) => setDonorMessage(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-secondary-dark focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    />
                  </div>
                </div>

                {/* Donaciones Recientes */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-text-light dark:text-text-dark">
                      {Math.floor(Math.random() * 50) + 20} personas acaban de donar
                    </h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Heart className="h-4 w-4 text-red-500" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-text-light dark:text-text-dark">
                          Anónimo
                        </div>
                        <div className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                          ${Math.floor(Math.random() * 5000) + 1000} - Donación destacada
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Heart className="h-4 w-4 text-red-500" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-text-light dark:text-text-dark">
                          María González
                        </div>
                        <div className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                          $50 - Primera donación
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Heart className="h-4 w-4 text-red-500" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-text-light dark:text-text-dark">
                          Carlos Rodríguez
                        </div>
                        <div className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                          $100 - Hace 5 min
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      Ver todas
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Star className="mr-1 h-3 w-3" />
                      Ver destacadas
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
