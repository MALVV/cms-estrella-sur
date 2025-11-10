'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Heart, Lightbulb, Shield, Target, Calendar, ArrowRight, CheckCircle, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';

interface Initiative {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  imageUrl?: string;
  imageAlt?: string;
  ageGroup: string;
  sectors: string[]; // Cambiado de category a sectors (array)
  targetAudience: string;
  objectives: string;
  implementation: string;
  results: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function InitiativesPage() {
  const [loading, setLoading] = useState(true);
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [selectedInitiative, setSelectedInitiative] = useState<Initiative | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);

  // Mapeo de sectores enum a español para mostrar
  const sectorLabels: Record<string, string> = {
    'HEALTH': 'SALUD',
    'EDUCATION': 'EDUCACION',
    'LIVELIHOODS': 'MEDIOS_DE_VIDA',
    'PROTECTION': 'PROTECCION',
    'SUSTAINABILITY': 'SOSTENIBILIDAD',
    'EARLY_CHILD_DEVELOPMENT': 'DESARROLLO_INFANTIL_TEMPRANO',
    'CHILDREN_IN_CRISIS': 'NINEZ_EN_CRISIS',
  };

  const sectorDisplayNames: Record<string, string> = {
    'all': 'TODAS',
    'SALUD': 'SALUD',
    'EDUCACION': 'EDUCACIÓN',
    'MEDIOS_DE_VIDA': 'MEDIOS DE VIDA',
    'PROTECCION': 'PROTECCIÓN',
    'SOSTENIBILIDAD': 'SOSTENIBILIDAD',
    'DESARROLLO_INFANTIL_TEMPRANO': 'DESARROLLO INFANTIL TEMPRANO',
    'NINEZ_EN_CRISIS': 'NIÑEZ EN CRISIS',
  };

  const fetchInitiatives = async (sector?: string, search?: string) => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      if (sector && sector !== 'all') {
        // El API espera el formato español (SALUD, EDUCACION, etc.)
        params.append('sectors', sector);
      }
      if (search && search.trim()) {
        params.append('search', search.trim());
      }
      
      const url = `/api/public/methodologies${params.toString() ? `?${params.toString()}` : ''}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Error al cargar iniciativas: ${response.status}`);
      }
      const data = await response.json();
      setInitiatives(data);
    } catch (error) {
      console.error('❌ Error al cargar iniciativas:', error);
      setInitiatives([]);
    } finally {
      setLoading(false);
    }
  };

  // Efecto combinado para sector y búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchInitiatives(selectedSector, searchTerm);
    }, searchTerm ? 500 : 0); // Debounce solo para búsqueda, no para cambio de sector

    return () => clearTimeout(timer);
  }, [selectedSector, searchTerm]);

  // Cleanup timeout al desmontar el componente
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const handleInitiativeHover = (initiative: Initiative) => {
    // Limpiar timeout anterior si existe
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    
    setSelectedInitiative(initiative);
    setIsDialogOpen(true);
  };

  const handleInitiativeLeave = () => {
    // Solo cerrar si no hay mouse sobre el popup
    hoverTimeoutRef.current = setTimeout(() => {
      setIsDialogOpen(false);
      setSelectedInitiative(null);
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
    setSelectedInitiative(null);
  };

  const getCategoryIcon = (sectors: string[]) => {
    // Usar el primer sector para el ícono
    const sector = sectors && sectors.length > 0 ? sectors[0] : '';
    const sectorSpanish = sectorLabels[sector] || sector;
    
    switch (sectorSpanish) {
      case 'EDUCACION':
        return <Lightbulb className="h-6 w-6 text-blue-500" />;
      case 'SALUD':
        return <Heart className="h-6 w-6 text-red-500" />;
      case 'MEDIOS_DE_VIDA':
        return <Users className="h-6 w-6 text-purple-500" />;
      case 'PROTECCION':
        return <Shield className="h-6 w-6 text-green-500" />;
      case 'SOSTENIBILIDAD':
        return <Shield className="h-6 w-6 text-emerald-500" />;
      case 'DESARROLLO_INFANTIL_TEMPRANO':
        return <Heart className="h-6 w-6 text-pink-500" />;
      case 'NINEZ_EN_CRISIS':
        return <Target className="h-6 w-6 text-orange-500" />;
      default:
        return <Target className="h-6 w-6 text-gray-500" />;
    }
  };

  const getCategoryColor = (sectors: string[]) => {
    // Usar el primer sector para el color
    const sector = sectors && sectors.length > 0 ? sectors[0] : '';
    const sectorSpanish = sectorLabels[sector] || sector;
    
    switch (sectorSpanish) {
      case 'EDUCACION':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'SALUD':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'MEDIOS_DE_VIDA':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'PROTECCION':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'SOSTENIBILIDAD':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
      case 'DESARROLLO_INFANTIL_TEMPRANO':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200';
      case 'NINEZ_EN_CRISIS':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getSectorDisplayName = (sectors: string[]) => {
    if (!sectors || sectors.length === 0) return 'Sin sector';
    const sector = sectors[0];
    const sectorSpanish = sectorLabels[sector] || sector;
    return sectorDisplayNames[sectorSpanish] || sectorSpanish;
  };

  // Mostrar las iniciativas filtradas
  const initiativesToShow = initiatives;

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
      <div 
        className="relative min-h-screen flex items-center"
        style={{
          backgroundImage: "url('/static-images/heroes/iniciativas_hero.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'top center'
        }}
      >
        <div className="absolute inset-0 bg-black opacity-40 dark:opacity-60"></div>
        <main className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <div className="max-w-4xl text-white text-center">
            <div className="mb-6">
              <span className="inline-block bg-orange-400 text-gray-900 text-sm font-bold uppercase px-4 py-2 tracking-wider rounded">
                Iniciativas Innovadoras
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight text-white mb-6">
              INICIATIVAS<br/>
              DE IMPACTO<br/>
              SOCIAL
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto mb-8">
              Proyectamos y ejecutamos iniciativas innovadoras de alcance masivo a través de Unidades Educativas y Centros de Salud, diseñadas para diferentes grupos etarios.
            </p>
            <div className="mt-8">
              <a className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-lg text-base font-bold hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl font-condensed" href="#iniciativas">
                EXPLORA NUESTRAS INICIATIVAS
                <svg className="h-5 w-5 ml-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path clipRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" fillRule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>
        </main>
      </div>

      {/* Ruta de Iniciativas */}
      <section id="iniciativas" className="py-20 bg-background-light dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Searchbar y Tabs por Sectores */}
          <div className="mb-12 space-y-6">
            {/* Barra de búsqueda */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Buscar iniciativas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border-light dark:border-border-dark rounded-lg bg-card-light dark:bg-card-dark text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Tabs por sectores */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedSector('all')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  selectedSector === 'all'
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-card-light dark:bg-card-dark text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                TODAS
              </button>
              {Object.entries(sectorDisplayNames)
                .filter(([key]) => key !== 'all')
                .map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedSector(key)}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                      selectedSector === key
                        ? 'bg-primary text-white shadow-lg'
                        : 'bg-card-light dark:bg-card-dark text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {label}
                  </button>
                ))}
            </div>
          </div>

          {/* Línea de Tiempo Recta */}
          <div className="relative">
            {/* Línea vertical central */}
            <div className="absolute left-1/2 -translate-x-1/2 h-full w-0.5 bg-gray-200 dark:bg-gray-700"></div>
            
            {/* Iniciativas en línea de tiempo */}
            <div className="space-y-16">
              {initiativesToShow.length > 0 ? (
                initiativesToShow.map((initiative, index) => (
                <article key={initiative.id} className="relative">
                  {/* Bullet numerado en la línea central */}
                  <div 
                    className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-primary ring-8 ring-background-light dark:ring-background-dark flex items-center justify-center transition-transform duration-300"
                  >
                    <span className="text-white font-bold text-lg font-condensed">{index + 1}</span>
                  </div>
                  
                  {/* Contenido alternando izquierda/derecha */}
                  <div className={`flex flex-col md:flex-row items-center w-full ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                    {/* Imagen */}
                    <div 
                      className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'} cursor-pointer group`}
                      onMouseEnter={() => handleInitiativeHover(initiative)}
                      onMouseLeave={handleInitiativeLeave}
                    >
                      <div className="bg-card-light dark:bg-card-dark shadow-lg rounded-lg overflow-hidden group-hover:shadow-xl transition-shadow duration-300">
                        {initiative.imageUrl ? (
                          <Image
                            src={initiative.imageUrl}
                            alt={initiative.imageAlt || initiative.title}
                            width={400}
                            height={300}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-64 bg-gradient-to-br from-emerald-200 to-blue-200 dark:from-emerald-800 dark:to-blue-800 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                            <div className="text-center">
                              <span className="material-symbols-outlined text-6xl text-emerald-600 dark:text-emerald-400 mb-4">science</span>
                              <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300 font-condensed">Iniciativa</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Información */}
                    <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pl-8' : 'md:pr-8'} mt-6 md:mt-0`}>
                      <div className="bg-card-light dark:bg-card-dark shadow-lg rounded-lg p-8">
                        <div className="flex items-center gap-2 mb-4 flex-wrap">
                          {getCategoryIcon(initiative.sectors || [])}
                          {(initiative.sectors || []).map((sector, idx) => {
                            const sectorSpanish = sectorLabels[sector] || sector;
                            return (
                              <Badge key={idx} className={`${getCategoryColor([sector])} text-xs`}>
                                {sectorDisplayNames[sectorSpanish] || sectorSpanish}
                              </Badge>
                            );
                          })}
                        </div>
                        
                        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-2">
                          {initiative.ageGroup} - {initiative.targetAudience}
                        </p>
                        
                        <h2 className="text-3xl font-bold text-text-light dark:text-text-dark mb-4 font-condensed">
                          {initiative.title}
                        </h2>
                        
                        <p className="text-text-secondary-light dark:text-text-secondary-dark mb-6">
                          {initiative.shortDescription}
                        </p>
                        
                        <div className="flex items-center gap-2">
                          <a 
                            className="text-sm font-semibold text-text-light dark:text-text-dark hover:text-primary transition-colors"
                            href={`/iniciativas/${initiative.id}`}
                          >
                            VER INICIATIVA COMPLETA
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
                      No hay iniciativas disponibles
                    </h3>
                    <p className="text-text-secondary-light dark:text-text-secondary-dark mb-6">
                      Actualmente no tenemos iniciativas publicadas. Vuelve pronto para ver nuestras iniciativas innovadoras.
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

      {/* Popup de Iniciativa */}
      {isDialogOpen && selectedInitiative && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => {
              setIsDialogOpen(false);
              setSelectedInitiative(null);
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
                  {selectedInitiative.imageUrl ? (
                    <Image
                      src={selectedInitiative.imageUrl}
                      alt={selectedInitiative.imageAlt || selectedInitiative.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-200 to-blue-200 dark:from-emerald-800 dark:to-blue-800 flex items-center justify-center">
                      <div className="text-center">
                        <span className="material-symbols-outlined text-6xl text-emerald-600 dark:text-emerald-400 mb-4">science</span>
                        <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300 font-condensed">Iniciativa Innovadora</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 flex flex-wrap gap-2">
                    {(selectedInitiative.sectors || []).map((sector, idx) => {
                      const sectorSpanish = sectorLabels[sector] || sector;
                      return (
                        <Badge key={idx} className={`${getCategoryColor([sector])} text-sm px-3 py-1`}>
                          {sectorDisplayNames[sectorSpanish] || sectorSpanish}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-text-light dark:text-text-dark font-condensed mb-2">
                  {selectedInitiative.title}
                </h2>
                
                <div className="flex items-center gap-4 mb-4 flex-wrap">
                  {getCategoryIcon(selectedInitiative.sectors || [])}
                  <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                    <Users className="h-4 w-4 inline mr-1" />
                    {selectedInitiative.ageGroup}
                  </span>
                  <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                    <Target className="h-4 w-4 inline mr-1" />
                    {selectedInitiative.targetAudience}
                  </span>
                </div>
              </div>
              
              {/* Descripción principal */}
              <div className="bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-lg p-4">
                <p className="text-text-secondary-light dark:text-text-secondary-dark text-lg leading-relaxed">
                  {selectedInitiative.description}
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
                    {selectedInitiative.objectives}
                  </p>
                </div>
                
                {/* Público Objetivo */}
                <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg p-6 flex flex-col h-full">
                  <h4 className="font-semibold text-text-light dark:text-text-dark mb-4 font-condensed flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Público Objetivo
                  </h4>
                  <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark flex-grow">
                    {selectedInitiative.targetAudience}
                  </p>
                </div>
                
                {/* Implementación */}
                <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg p-6 flex flex-col h-full">
                  <h4 className="font-semibold text-text-light dark:text-text-dark mb-4 font-condensed flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Implementación
                  </h4>
                  <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark flex-grow">
                    {selectedInitiative.implementation}
                  </p>
                </div>
                
                {/* Resultados */}
                <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg p-6 flex flex-col h-full">
                  <h4 className="font-semibold text-text-light dark:text-text-dark mb-4 font-condensed flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Resultados
                  </h4>
                  <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark flex-grow">
                    {selectedInitiative.results}
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
                   <Link href={`/iniciativas/${selectedInitiative.id}`}>
                     Ver Iniciativa Completa
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
