'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Heart, Lightbulb, Shield, Target, Calendar, ArrowRight, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';

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
  const [methodologies, setMethodologies] = useState<Methodology[]>([]);
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
        throw new Error(`Error al cargar metodologías: ${response.status}`);
      }
      const data = await response.json();
      console.log('📊 Datos recibidos:', data);
      console.log('📊 Cantidad de metodologías:', data.length);
      setMethodologies(data);
    } catch (error) {
      console.error('❌ Error al cargar metodologías:', error);
      // En caso de error, mantener metodologías vacías para mostrar mensaje de error
      setMethodologies([]);
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
      imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
      imageAlt: 'Estudiantes trabajando en proyectos colaborativos',
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
      imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800',
      imageAlt: 'Profesionales de salud trabajando con la comunidad',
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
      imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800',
      imageAlt: 'Reunión comunitaria participativa',
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
      imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
      imageAlt: 'Comunidad participando en conservación ambiental',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  // Siempre mostrar las metodologías reales de la base de datos
  const methodologiesToShow = methodologies;

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
      
      {/* Hero Section */}
      <div className="relative h-[calc(100vh-80px)] flex items-center bg-hero">
        <div className="absolute inset-0 bg-black opacity-40 dark:opacity-60"></div>
        <main className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <div className="max-w-2xl text-white text-center">
            <div className="mb-4">
              <span className="inline-block bg-orange-400 text-gray-900 text-xs font-bold uppercase px-3 py-1 tracking-wider">
                Metodologías Innovadoras
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-white">
              METODOLOGÍAS<br/>
              DE IMPACTO<br/>
              SOCIAL
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-200 max-w-3xl mx-auto">
              Metodologías innovadoras de alcance masivo a través de Unidades Educativas y Centros de Salud, diseñadas para diferentes grupos etarios.
            </p>
            <div className="mt-8">
              <a className="inline-flex items-center bg-primary text-white text-sm font-bold py-3 px-6 rounded-sm hover:bg-opacity-90 transition-colors duration-300" href="#metodologias">
                EXPLORA NUESTRAS METODOLOGÍAS
                <svg className="h-5 w-5 ml-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path clipRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" fillRule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>
        </main>
      </div>

      {/* Ruta de Metodologías */}
      <section id="metodologias" className="py-20 bg-background-light dark:bg-background-dark">
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
              {methodologiesToShow.length > 0 ? (
                methodologiesToShow.map((methodology, index) => (
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
                        
                        <div className="flex items-center gap-2">
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
                ))
              ) : (
                <div className="text-center py-16">
                  <div className="bg-card-light dark:bg-card-dark rounded-lg p-8 shadow-sm">
                    <div className="text-6xl mb-4">📚</div>
                    <h3 className="text-2xl font-bold text-text-light dark:text-text-dark mb-4">
                      No hay metodologías disponibles
                    </h3>
                    <p className="text-text-secondary-light dark:text-text-secondary-dark mb-6">
                      Actualmente no tenemos metodologías publicadas. Vuelve pronto para ver nuestras metodologías innovadoras.
                    </p>
                    <Button 
                      onClick={() => window.location.reload()}
                      className="bg-primary hover:bg-primary/90 text-white"
                    >
                      Actualizar página
                    </Button>
                  </div>
                </div>
              )}
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
              
              {/* Información detallada en grid simétrico */}
              <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-2 gap-6">
                {/* Objetivos */}
                <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg p-6 flex flex-col h-full">
                  <h4 className="font-semibold text-text-light dark:text-text-dark mb-4 font-condensed flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Objetivos
                  </h4>
                  <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark flex-grow">
                    {selectedMethodology.objectives}
                  </p>
                </div>
                
                {/* Público Objetivo */}
                <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg p-6 flex flex-col h-full">
                  <h4 className="font-semibold text-text-light dark:text-text-dark mb-4 font-condensed flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Público Objetivo
                  </h4>
                  <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark flex-grow">
                    {selectedMethodology.targetAudience}
                  </p>
                </div>
                
                {/* Implementación */}
                <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg p-6 flex flex-col h-full">
                  <h4 className="font-semibold text-text-light dark:text-text-dark mb-4 font-condensed flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Implementación
                  </h4>
                  <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark flex-grow">
                    {selectedMethodology.implementation}
                  </p>
                </div>
                
                {/* Resultados */}
                <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg p-6 flex flex-col h-full">
                  <h4 className="font-semibold text-text-light dark:text-text-dark mb-4 font-condensed flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Resultados
                  </h4>
                  <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark flex-grow">
                    {selectedMethodology.results}
                  </p>
                </div>
              </div>
              
              {/* Botón de acción */}
              <div className="flex justify-center pt-4 border-t border-border-light dark:border-border-dark">
                 <Button 
                   size="lg"
                   className="bg-primary hover:bg-primary/90 text-white font-bold font-condensed"
                   asChild
                 >
                   <Link href={`/metodologias/${selectedMethodology.id}`}>
                     Ver Metodología Completa
                   </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  );
}
