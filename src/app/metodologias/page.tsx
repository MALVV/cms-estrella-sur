'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Heart, Lightbulb, Shield, Target, Calendar, ArrowRight, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { SiteHeader } from '@/components/layout/site-header';

interface Methodology {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  imageUrl?: string;
  imageAlt?: string;
  ageGroup: string;
  category: 'EDUCACION' | 'SALUD' | 'SOCIAL' | 'AMBIENTAL';
  targetAudience: string;
  objectives: string;
  implementation: string;
  results: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function MethodologiesPage() {
  const [loading, setLoading] = useState(true);
  const [selectedMethodology, setSelectedMethodology] = useState<Methodology | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);

  const fetchMethodologies = async () => {
    try {
      setLoading(true);
      console.log('🔄 Cargando metodologías...');
      const response = await fetch('/api/public/methodologies');
      console.log('📡 Respuesta recibida:', response.status);
      
      if (!response.ok) {
        throw new Error('Error al cargar metodologías');
      }
      const data = await response.json();
      console.log('📊 Datos recibidos:', data);
    } catch (error) {
      console.error('❌ Error al cargar metodologías:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMethodologies();
  }, []);

  // Cleanup timeout al desmontar el componente
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const handleMethodologyHover = (methodology: Methodology) => {
    // Limpiar timeout anterior si existe
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    
    setSelectedMethodology(methodology);
    setIsDialogOpen(true);
  };

  const handleMethodologyLeave = () => {
    // Solo cerrar si no hay mouse sobre el popup
    hoverTimeoutRef.current = setTimeout(() => {
      setIsDialogOpen(false);
      setSelectedMethodology(null);
    }, 200);
  };

  const handlePopupMouseEnter = () => {
    // Cancelar el timeout cuando el mouse entra al popup
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  const handlePopupMouseLeave = () => {
    // Cerrar inmediatamente cuando el mouse sale del popup
    setIsDialogOpen(false);
    setSelectedMethodology(null);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'EDUCACION':
        return <Lightbulb className="h-6 w-6 text-blue-500" />;
      case 'SALUD':
        return <Heart className="h-6 w-6 text-red-500" />;
      case 'SOCIAL':
        return <Users className="h-6 w-6 text-green-500" />;
      case 'AMBIENTAL':
        return <Shield className="h-6 w-6 text-emerald-500" />;
      default:
        return <Target className="h-6 w-6 text-gray-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'EDUCACION':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'SALUD':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'SOCIAL':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'AMBIENTAL':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  // Datos de ejemplo para la demostración
  const exampleMethodologies: Methodology[] = [
    {
      id: '1',
      title: 'Aprendizaje Basado en Proyectos',
      description: 'Metodología educativa que involucra a los estudiantes en proyectos del mundo real para desarrollar habilidades del siglo XXI.',
      shortDescription: 'Desarrollo de habilidades a través de proyectos reales',
      ageGroup: '6-12 años',
      category: 'EDUCACION',
      targetAudience: 'Estudiantes de primaria',
      objectives: 'Fomentar el pensamiento crítico y la colaboración',
      implementation: 'Proyectos interdisciplinarios de 8 semanas',
      results: 'Mejora del 40% en habilidades de resolución de problemas',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Salud Comunitaria Preventiva',
      description: 'Programa integral de salud que empodera a las comunidades para prevenir enfermedades y promover estilos de vida saludables.',
      shortDescription: 'Prevención y promoción de salud comunitaria',
      ageGroup: 'Todas las edades',
      category: 'SALUD',
      targetAudience: 'Comunidades rurales',
      objectives: 'Reducir enfermedades prevenibles en un 60%',
      implementation: 'Talleres mensuales y seguimiento personalizado',
      results: 'Reducción del 45% en consultas por enfermedades prevenibles',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '3',
      title: 'Desarrollo Comunitario Participativo',
      description: 'Metodología que involucra activamente a los miembros de la comunidad en la identificación y solución de sus propios problemas.',
      shortDescription: 'Participación activa de la comunidad en su desarrollo',
      ageGroup: 'Adultos',
      category: 'SOCIAL',
      targetAudience: 'Líderes comunitarios',
      objectives: 'Fortalecer la organización comunitaria',
      implementation: 'Talleres participativos y planificación conjunta',
      results: 'Formación de 15 organizaciones comunitarias',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '4',
      title: 'Conservación Ambiental Participativa',
      description: 'Programa que involucra a las comunidades en la protección y conservación de sus recursos naturales locales.',
      shortDescription: 'Protección participativa del medio ambiente',
      ageGroup: 'Todas las edades',
      category: 'AMBIENTAL',
      targetAudience: 'Comunidades rurales',
      objectives: 'Conservar 500 hectáreas de bosque',
      implementation: 'Monitoreo comunitario y reforestación',
      results: 'Conservación de 300 hectáreas en el primer año',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  const methodologiesToShow = exampleMethodologies;

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <SiteHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <SiteHeader />
      
      {/* Hero Section con gradiente del home */}
      <main className="relative overflow-hidden min-h-[60vh]">
        {/* Fondo con gradiente similar al home */}
        <div className="absolute top-0 left-0 w-full h-full z-0">
          <div className="w-full h-full bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 dark:from-emerald-900/20 dark:via-blue-900/20 dark:to-purple-900/20"></div>
          {/* Patrón de fondo decorativo */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-32 h-32 bg-primary rounded-full blur-3xl"></div>
            <div className="absolute top-40 right-20 w-24 h-24 bg-blue-400 rounded-full blur-2xl"></div>
            <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-purple-400 rounded-full blur-3xl"></div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-background-light/90 via-background-light/70 to-background-light dark:from-background-dark/90 dark:via-background-dark/70 dark:to-background-dark"></div>
        </div>
        
        <div className="relative z-10 text-center py-24 px-4 sm:px-6 lg:px-8">
          {/* Badge similar al home */}
          <div className="inline-block bg-yellow-400 text-black px-3 py-2 text-sm font-bold mb-6 rounded font-condensed">
            METODOLOGÍAS INNOVADORAS
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-text-light dark:text-text-dark leading-tight mb-6 sm:mb-8 font-condensed">
            INNOVACIONES QUE<br/>TRANSFORMAN<br/>COMUNIDADES
          </h1>
          
          <p className="text-xl max-w-3xl mx-auto mb-8 text-text-secondary-light dark:text-text-secondary-dark">
            Metodologías innovadoras de alcance masivo a través de Unidades Educativas y Centros de Salud, diseñadas para diferentes grupos etarios
          </p>
        </div>
      </main>

      {/* Ruta de Metodologías */}
      <section className="py-20 bg-background-light dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block bg-green-200 text-green-800 text-xs font-semibold px-3 py-1 rounded-full mb-4 font-condensed">
              RUTA DE INNOVACIÓN
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-text-light dark:text-text-dark mb-3 font-condensed">
              METODOLOGÍAS POR GRUPOS ETARIOS
            </h2>
            <p className="text-xl text-text-secondary-light dark:text-text-secondary-dark max-w-3xl mx-auto">
              Explora nuestras metodologías innovadoras organizadas por grupos de edad. Pasa el mouse sobre cada metodología para conocer más detalles.
            </p>
          </div>

          {/* Línea de Tiempo Recta */}
          <div className="relative">
            {/* Línea vertical central */}
            <div className="absolute left-1/2 -translate-x-1/2 h-full w-0.5 bg-gray-200 dark:bg-gray-700"></div>
            
            {/* Metodologías en línea de tiempo */}
            <div className="space-y-16">
              {methodologiesToShow.map((methodology, index) => (
                <article key={methodology.id} className="relative">
                  {/* Bullet numerado en la línea central */}
                  <div 
                    className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-primary ring-8 ring-background-light dark:ring-background-dark flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-300 group"
                    onMouseEnter={() => handleMethodologyHover(methodology)}
                    onMouseLeave={handleMethodologyLeave}
                  >
                    <span className="text-white font-bold text-lg font-condensed">{index + 1}</span>
                  </div>
                  
                  {/* Contenido alternando izquierda/derecha */}
                  <div className={`flex flex-col md:flex-row items-center w-full ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                    {/* Imagen */}
                    <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}>
                      <div className="bg-card-light dark:bg-card-dark shadow-lg rounded-lg overflow-hidden">
                        {methodology.imageUrl ? (
                          <Image
                            src={methodology.imageUrl}
                            alt={methodology.imageAlt || methodology.title}
                            width={400}
                            height={300}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-64 bg-gradient-to-br from-emerald-200 to-blue-200 dark:from-emerald-800 dark:to-blue-800 flex items-center justify-center">
                            <div className="text-center">
                              <span className="material-symbols-outlined text-6xl text-emerald-600 dark:text-emerald-400 mb-4">science</span>
                              <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300 font-condensed">Metodología</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Información */}
                    <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pl-8' : 'md:pr-8'} mt-6 md:mt-0`}>
                      <div className="bg-card-light dark:bg-card-dark shadow-lg rounded-lg p-8">
                        <div className="flex items-center gap-2 mb-4">
                          {getCategoryIcon(methodology.category)}
                          <Badge className={`${getCategoryColor(methodology.category)} text-xs`}>
                            {methodology.category}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-2">
                          {methodology.ageGroup} - {methodology.targetAudience}
                        </p>
                        
                        <h2 className="text-3xl font-bold text-text-light dark:text-text-dark mb-4 font-condensed">
                          {methodology.title}
                        </h2>
                        
                        <p className="text-text-secondary-light dark:text-text-secondary-dark mb-6">
                          {methodology.shortDescription}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <a 
                            className="text-sm font-semibold text-text-light dark:text-text-dark hover:text-primary transition-colors"
                            href={`/metodologias/${methodology.id}`}
                          >
                            VER METODOLOGÍA COMPLETA
                          </a>
                          <ArrowRight className="h-4 w-4 text-primary" />
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Popup de Metodología */}
      {isDialogOpen && selectedMethodology && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => {
              setIsDialogOpen(false);
              setSelectedMethodology(null);
            }}
          />
          
          {/* Modal Content */}
          <div 
            ref={popupRef}
            className="relative bg-card-light dark:bg-card-dark rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onMouseEnter={handlePopupMouseEnter}
            onMouseLeave={handlePopupMouseLeave}
          >
            <div className="p-6 space-y-6">
              {/* Header con imagen */}
              <div className="relative">
                <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                  {selectedMethodology.imageUrl ? (
                    <Image
                      src={selectedMethodology.imageUrl}
                      alt={selectedMethodology.imageAlt || selectedMethodology.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-200 to-blue-200 dark:from-emerald-800 dark:to-blue-800 flex items-center justify-center">
                      <div className="text-center">
                        <span className="material-symbols-outlined text-6xl text-emerald-600 dark:text-emerald-400 mb-4">science</span>
                        <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300 font-condensed">Metodología Innovadora</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <Badge className={`${getCategoryColor(selectedMethodology.category)} text-sm px-3 py-1`}>
                      {selectedMethodology.category}
                    </Badge>
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-text-light dark:text-text-dark font-condensed mb-2">
                  {selectedMethodology.title}
                </h2>
                
                <div className="flex items-center gap-4 mb-4">
                  {getCategoryIcon(selectedMethodology.category)}
                  <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                    <Users className="h-4 w-4 inline mr-1" />
                    {selectedMethodology.ageGroup}
                  </span>
                  <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                    <Target className="h-4 w-4 inline mr-1" />
                    {selectedMethodology.targetAudience}
                  </span>
                </div>
              </div>
              
              {/* Descripción principal */}
              <div className="bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-lg p-4">
                <p className="text-text-secondary-light dark:text-text-secondary-dark text-lg leading-relaxed">
                  {selectedMethodology.description}
                </p>
              </div>
              
              {/* Información detallada en grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg p-4">
                    <h4 className="font-semibold text-text-light dark:text-text-dark mb-3 font-condensed flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      Objetivos
                    </h4>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                      {selectedMethodology.objectives}
                    </p>
                  </div>
                  
                  <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg p-4">
                    <h4 className="font-semibold text-text-light dark:text-text-dark mb-3 font-condensed flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      Implementación
                    </h4>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                      {selectedMethodology.implementation}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg p-4">
                    <h4 className="font-semibold text-text-light dark:text-text-dark mb-3 font-condensed flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      Público Objetivo
                    </h4>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                      {selectedMethodology.targetAudience}
                    </p>
                  </div>
                  
                  <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg p-4">
                    <h4 className="font-semibold text-text-light dark:text-text-dark mb-3 font-condensed flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      Resultados
                    </h4>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                      {selectedMethodology.results}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Botones de acción */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 border-t border-border-light dark:border-border-dark">
                 <Button 
                   size="lg"
                   className="bg-primary hover:bg-primary/90 text-white font-bold font-condensed"
                   asChild
                 >
                   <Link href={`/metodologias/${selectedMethodology.id}`}>
                     Ver Metodología Completa
                   </Link>
                 </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="font-condensed"
                >
                  Contactar para Implementación
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
