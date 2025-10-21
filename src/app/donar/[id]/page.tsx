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

        {/* Título */}
        <h1 className="text-3xl md:text-4xl font-bold text-text-light dark:text-text-dark mb-8">
          {project.title}
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Grid del Contenido Principal */}
          <div className="lg:col-span-2">
            <div className="space-y-8">
              {/* Imagen Principal */}
              {project.imageUrl && (
                <div className="relative h-80 rounded-lg overflow-hidden">
                  <Image
                    src={project.imageUrl}
                    alt={project.imageAlt || project.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
              )}

              {/* Descripción del Proyecto */}
              <div>
                <h2 className="text-xl font-semibold text-text-light dark:text-text-dark mb-4">
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
              <div>
                <div className="flex items-center gap-2 text-text-secondary-light dark:text-text-secondary-dark">
                  <span className="font-medium">Período de ejecución:</span>
                  <span>{formatDate(project.executionStart)} - {formatDate(project.executionEnd)}</span>
                </div>
              </div>

              {/* Barra de Progreso */}
              <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-bold text-text-light dark:text-text-dark">
                    ${raisedAmount.toLocaleString()}
                  </span>
                  <span className="text-xl font-bold text-text-light dark:text-text-dark">
                    de ${goalAmount.toLocaleString()} meta
                  </span>
                </div>
                
                {/* Barra de progreso */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-3">
                  <div 
                    className="bg-gradient-to-r from-primary to-primary/80 h-4 rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-3"
                    style={{ width: `${percentage}%` }}
                  >
                    <span className="text-sm font-bold text-white">
                      {percentage}%
                    </span>
                  </div>
                </div>
                
                <div className="text-center text-text-secondary-light dark:text-text-secondary-dark">
                  {donationCount.toLocaleString()} donaciones
                </div>
              </div>
            </div>
          </div>

          {/* Grid de la Tarjeta de Donación */}
          <div className="lg:col-span-1">
            <Card className="h-fit lg:sticky lg:top-8">
              <CardContent className="p-4 h-full flex flex-col">
                {/* Formulario de Donación */}
                <div className="space-y-6 flex-1">
                  <h3 className="text-xl font-semibold text-text-light dark:text-text-dark">
                    Selecciona el Monto
                  </h3>
                  
                  {/* Montos Sugeridos */}
                  <div className="grid grid-cols-2 gap-3">
                    {donationAmounts.map((amount) => (
                      <Button
                        key={amount}
                        variant={selectedAmount === amount ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleAmountSelect(amount)}
                        className="h-12"
                      >
                        <DollarSign className="mr-2 h-4 w-4" />
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
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-transparent"
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
                      className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-transparent"
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
                      rows={4}
                      className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-secondary-dark focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    />
                  </div>
                </div>

                {/* Botones de Acción */}
                <div className="space-y-3 mt-4">
                  <Button className="w-full" size="lg" onClick={handleDonation}>
                    <Heart className="mr-2 h-4 w-4" />
                    Donar Ahora
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Share2 className="mr-2 h-4 w-4" />
                    Compartir
                  </Button>
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
