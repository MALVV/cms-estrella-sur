'use client'

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Target, Users, Calendar, DollarSign, ExternalLink, ArrowRight, Share2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';

interface DonationProject {
  id: string;
  title: string;
  description: string;
  context: string;
  objectives: string;
  executionStart: string;
  executionEnd: string;
  accountNumber: string;
  recipientName: string;
  qrImageUrl?: string;
  qrImageAlt?: string;
  referenceImageUrl?: string;
  referenceImageAlt?: string;
  targetAmount?: number;
  currentAmount: number;
  progressPercentage: number;
  isCompleted: boolean;
  isFeatured: boolean;
  donationCount: number;
}

interface AnnualGoal {
  id: string;
  year: number;
  targetAmount: number;
  currentAmount: number;
  description?: string;
  isActive: boolean;
  isFeatured: boolean;
}

export default function DonarPage() {
  const [donationProjects, setDonationProjects] = useState<DonationProject[]>([]);
  const [annualGoal, setAnnualGoal] = useState<AnnualGoal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Cargar proyectos de donación
        const projectsResponse = await fetch('/api/public/donation-projects?limit=10');
        if (projectsResponse.ok) {
          const projectsData = await projectsResponse.json();
          setDonationProjects(projectsData);
        }

        // Cargar meta anual
        const goalResponse = await fetch('/api/annual-goals?currentYearOnly=true');
        if (goalResponse.ok) {
          const goalData = await goalResponse.json();
          setAnnualGoal(goalData);
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long'
    });
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <SiteHeader />
      
      {/* Hero Section - Estilo Convergente */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
          <div className="flex flex-col gap-6">
            <div>
              <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-md">DONACIONES</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold font-display uppercase tracking-tight text-gray-900 dark:text-white">
              Transforma Vidas Con Tu Apoyo
                </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Tu donación hace posible que continuemos con nuestros proyectos de impacto social, educativos y comunitarios. Cada contribución marca la diferencia en las vidas de cientos de personas.
            </p>
            {/* Estadísticas de impacto */}
            <div className="grid grid-cols-3 gap-4 pt-6">
              <div className="text-center p-3 bg-card-light dark:bg-card-dark rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-primary mb-1">500+</div>
                <div className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Beneficiarios</div>
                </div>
              <div className="text-center p-3 bg-card-light dark:bg-card-dark rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-primary mb-1">15+</div>
                <div className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Proyectos</div>
              </div>
              <div className="text-center p-3 bg-card-light dark:bg-card-dark rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-primary mb-1">8</div>
                <div className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Años</div>
              </div>
            </div>

            {/* Información adicional sobre donaciones */}
            <div className="pt-4">
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                Apoya proyectos específicos o contribuye a nuestra misión general para maximizar el impacto.
              </p>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="relative h-[500px]">
            <img 
              alt="Niños felices recibiendo ayuda educativa" 
              className="w-full h-full object-cover object-center rounded-xl shadow-lg" 
              src="https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl"></div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">

        {/* Meta de Recaudación Section */}
        <section className="py-6 bg-background-light dark:bg-background-dark">
          <div className="container mx-auto px-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-8">
              <div>
                <span className="inline-block bg-primary text-white text-xs font-semibold px-3 py-1 rounded mb-4">
                  META DE RECAUDACIÓN
                </span>
                <h1 className="text-4xl md:text-5xl font-bold text-text-light dark:text-text-dark leading-tight">
                  META ANUAL {annualGoal?.year || new Date().getFullYear()}
                </h1>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  Ayúdanos a alcanzar nuestra meta anual para continuar transformando vidas y generando impacto positivo en las comunidades.
                </p>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-semibold text-text-light dark:text-text-dark">
                  Recaudado: Bs. {annualGoal ? annualGoal.currentAmount.toLocaleString('es-BO', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }) : '0,00'}
                </span>
                <span className="text-xl font-semibold text-text-light dark:text-text-dark">
                  Meta: Bs. {annualGoal ? annualGoal.targetAmount.toLocaleString('es-BO', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }) : '0,00'}
                </span>
              </div>
              
              {/* Barra de progreso */}
              <div className="relative w-full h-6 mb-3">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-6 absolute">
                  <div 
                    className="bg-gradient-to-r from-primary to-primary/80 h-6 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${annualGoal ? Math.min((annualGoal.currentAmount / annualGoal.targetAmount) * 100, 100) : 0}%` }}
                  />
                </div>
                <div 
                  className="absolute top-0 h-6 flex items-center"
                  style={{ left: `${annualGoal ? Math.min((annualGoal.currentAmount / annualGoal.targetAmount) * 100, 100) : 0}%` }}
                >
                  <span className="ml-2 text-sm font-bold text-text-light dark:text-text-dark whitespace-nowrap">
                    {annualGoal ? Math.round((annualGoal.currentAmount / annualGoal.targetAmount) * 100) : 0}%
                  </span>
                </div>
              </div>
              
              <div className="text-center text-base text-text-secondary-light dark:text-text-secondary-dark">
                {annualGoal ? (
                  annualGoal.currentAmount >= annualGoal.targetAmount ? (
                    '¡Meta alcanzada! Gracias por tu apoyo'
                  ) : (
                    `Faltan Bs. ${(annualGoal.targetAmount - annualGoal.currentAmount).toLocaleString('es-BO', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })} para alcanzar la meta`
                  )
                ) : (
                  'Cargando meta...'
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6">
                <div className="flex items-center gap-3 text-text-secondary-light dark:text-text-secondary-dark">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-medium">+500 beneficiarios</span>
                </div>
                <div className="flex items-center gap-3 text-text-secondary-light dark:text-text-secondary-dark">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-medium">3 proyectos activos</span>
                </div>
                <div className="flex items-center gap-3 text-text-secondary-light dark:text-text-secondary-dark">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-medium">8 años de experiencia</span>
                </div>
              </div>
            </div>
        </section>

        {/* Proyectos que necesitan apoyo */}
        <section className="py-6 bg-background-light dark:bg-background-dark">
          <div className="container mx-auto px-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-8">
              <div>
                <span className="inline-block bg-primary text-white text-xs font-semibold px-3 py-1 rounded mb-4">
                  PROYECTOS DE DONACIÓN
                </span>
                <h1 className="text-4xl md:text-5xl font-bold text-text-light dark:text-text-dark leading-tight">
                  PROYECTOS QUE NECESITAN TU APOYO
                </h1>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  Conoce todos nuestros proyectos de donación y elige cuál deseas apoyar directamente para generar un impacto específico en las comunidades.
                </p>
              </div>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-t-lg"></div>
                  <CardContent className="p-6">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {donationProjects.map((donationProject) => (
                <Card key={donationProject.id} className={`overflow-hidden hover:shadow-lg transition-shadow duration-300 ${
                  donationProject.isCompleted ? 'ring-1 ring-green-300/50 dark:ring-green-600/50' : ''
                }`}>
                  {(donationProject.referenceImageUrl) && (
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={donationProject.referenceImageUrl || ''}
                        alt={donationProject.referenceImageAlt || donationProject.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      {donationProject.isCompleted ? (
                        <Badge className="absolute top-4 right-4 bg-green-500/90 text-white text-xs">
                          Meta Alcanzada
                        </Badge>
                      ) : donationProject.isFeatured ? (
                      <Badge className="absolute top-4 right-4 bg-primary text-white">
                        Destacado
                      </Badge>
                      ) : null}
                    </div>
                  )}
                  
                  <CardContent className="p-6">
                    <CardTitle className="text-xl font-bold text-text-light dark:text-text-dark mb-3 line-clamp-2">
                      {donationProject.title}
                    </CardTitle>
                    
                    <p className="text-text-secondary-light dark:text-text-secondary-dark mb-4 line-clamp-3">
                      {donationProject.context.substring(0, 150)}...
                    </p>
                    
                    <div className="flex items-center gap-2 text-sm text-text-secondary-light dark:text-text-secondary-dark mb-4">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(donationProject.executionStart)} - {formatDate(donationProject.executionEnd)}</span>
                    </div>

                    {/* Progreso individual del proyecto */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
                       <div className="text-center mb-3">
                         <h4 className="text-sm font-semibold text-text-light dark:text-text-dark mb-1">
                           Meta de Recaudación
                         </h4>
                       </div>
                      
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-bold text-text-light dark:text-text-dark">
                          Recaudado: Bs. {donationProject.currentAmount.toLocaleString('es-BO', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </span>
                        <span className="text-sm font-bold text-text-light dark:text-text-dark">
                          Meta: Bs. {donationProject.targetAmount ? donationProject.targetAmount.toLocaleString('es-BO', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          }) : 'Sin meta'}
                        </span>
                      </div>
                      
                      {/* Barra de progreso del proyecto */}
                      <div className="relative mb-2 w-full h-3">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 absolute">
                          <div 
                            className={`h-3 rounded-full transition-all duration-1000 ease-out ${
                              donationProject.isCompleted 
                                ? 'bg-gradient-to-r from-green-400 to-green-500' 
                                : 'bg-gradient-to-r from-primary to-primary/80'
                            }`}
                            style={{ width: `${donationProject.progressPercentage}%` }}
                          />
                        </div>
                        <div 
                          className="absolute top-0 h-3 flex items-center"
                          style={{ left: `${donationProject.progressPercentage}%` }}
                        >
                          <span className="ml-1 text-xs font-bold text-text-light dark:text-text-dark whitespace-nowrap">
                            {Math.round(donationProject.progressPercentage)}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-center text-xs text-text-secondary-light dark:text-text-secondary-dark">
                        {donationProject.isCompleted 
                          ? 'Meta alcanzada - Gracias por tu apoyo'
                          : donationProject.targetAmount 
                            ? `Faltan Bs. ${(donationProject.targetAmount - donationProject.currentAmount).toLocaleString('es-BO', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })} para completar la meta`
                            : `${donationProject.donationCount} donaciones recibidas`
                        }
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Button className="w-full bg-black text-white hover:bg-gray-800" asChild>
                        <Link href={`/donar/${donationProject.id}`}>
                          <Heart className="mr-2 h-4 w-4 text-red-500" />
                          {donationProject.isCompleted ? 'Ver Proyecto' : 'Donar a este Proyecto'}
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          </div>
        </section>

      </main>

      <SiteFooter />
    </div>
  );
}
