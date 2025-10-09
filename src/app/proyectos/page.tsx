'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, Target, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';

interface Project {
  id: string;
  title: string;
  executionStart: string;
  executionEnd: string;
  context: string;
  objectives: string;
  content: string;
  strategicAllies?: string;
  financing?: string;
  imageUrl?: string;
  imageAlt?: string;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  creator?: {
    name?: string;
    email: string;
  };
  _count?: {
    news: number;
  };
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      console.log('🔄 Cargando proyectos...');
      const response = await fetch('/api/public/projects');
      console.log('📡 Respuesta recibida:', response.status);
      
      if (!response.ok) {
        throw new Error('Error al cargar proyectos');
      }
      const data = await response.json();
      console.log('📊 Datos recibidos:', data);
      setProjects(data);
    } catch (error) {
      console.error('❌ Error al cargar proyectos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
      fetchProjects();
  }, []);

  const formatPeriod = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    const startMonth = startDate.toLocaleDateString('es-ES', { month: 'long' });
    const endMonth = endDate.toLocaleDateString('es-ES', { month: 'long' });
    
    return `${startMonth} ${startDate.getFullYear()} - ${endMonth} ${endDate.getFullYear()}`;
  };

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
      <div className="relative min-h-screen flex items-center bg-cover bg-center" style={{backgroundImage: "url('https://images.pexels.com/photos/9543732/pexels-photo-9543732.jpeg')"}}>
        <div className="absolute inset-0 bg-black opacity-40 dark:opacity-60"></div>
        <main className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <div className="max-w-2xl text-white text-center">
            <div className="mb-4">
              <span className="inline-block bg-orange-400 text-gray-900 text-xs font-bold uppercase px-3 py-1 tracking-wider">
                Nuestros proyectos
              </span>
            </div>
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold leading-tight text-white">
              PROYECTOS<br/>
              DE IMPACTO
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-200">
              Cada proyecto representa un paso hacia un futuro más justo y sostenible, trabajando directamente con las comunidades para generar un impacto real y duradero.
            </p>
            <p className="mt-4 text-lg md:text-xl text-gray-200">
              Descubre cómo nuestros proyectos están cambiando vidas y construyendo un mejor mañana para todos.
            </p>
            <div className="mt-8">
              <a className="inline-flex items-center bg-primary text-white text-sm font-bold py-3 px-6 rounded-sm hover:bg-opacity-90 transition-colors duration-300" href="#proyectos">
                EXPLORA NUESTROS PROYECTOS
                <svg className="h-5 w-5 ml-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path clipRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" fillRule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>
        </main>
        </div>

      <main className="container mx-auto px-4 py-8" id="proyectos">
        {/* Introducción */}
        <div className="text-center mb-12">
              <span className="inline-block bg-primary text-white text-xs font-semibold px-3 py-1 rounded mb-4">
                PROYECTOS DE IMPACTO
              </span>
          <h2 className="text-3xl md:text-4xl font-bold text-text-light dark:text-text-dark leading-tight mb-6">
            Proyectos Estratégicos de Desarrollo
          </h2>
          <p className="text-lg text-text-secondary-light dark:text-text-secondary-dark max-w-4xl mx-auto">
            Descubre nuestros proyectos específicos diseñados para abordar desafíos concretos en las comunidades. 
            Cada proyecto está estructurado para generar impacto medible y transformador.
              </p>
            </div>

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-text-secondary-light dark:text-text-secondary-dark">
              No hay proyectos disponibles en este momento.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => {
              // Imágenes de fallback para proyectos sin imagen personalizada
              const fallbackImages = [
                "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800",
                "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800",
                "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
                "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800",
                "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800"
              ];
              
              // Lógica de prioridad para imágenes:
              // 1. Imagen personalizada del proyecto (imageUrl)
              // 2. Imagen de fallback basada en el índice
              const currentImage = project.imageUrl && project.imageUrl.trim() !== ''
                ? project.imageUrl
                : fallbackImages[index % fallbackImages.length];
              
              const imageAlt = project.imageAlt || project.title;
              
              return (
                <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 group">
                  {/* Imagen de fondo */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={currentImage}
                      alt={imageAlt}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    
                    {/* Badges */}
                    <div className="absolute top-3 right-3 flex flex-col gap-1">
                      {project.isFeatured && (
                        <Badge className="bg-yellow-400 text-black text-xs font-bold">Destacado</Badge>
                      )}
                      </div>
                    
                    {/* Título sobre la imagen */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-bold text-lg leading-tight line-clamp-2 drop-shadow-lg">
                        {project.title}
                      </h3>
                    </div>
              </div>
                  
                  <CardContent className="p-4 space-y-4">
                    {/* Período de ejecución */}
                    <div className="flex items-center gap-2 text-xs text-text-secondary-light dark:text-text-secondary-dark">
                      <Calendar className="h-3 w-3" />
                      <span>{formatPeriod(project.executionStart, project.executionEnd)}</span>
                </div>
                    
                    {/* Contexto del proyecto */}
                    <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm line-clamp-3">
                      {project.context}
                    </p>
                    
                    {/* Metadatos */}
                    <div className="flex items-center gap-4 text-xs text-text-secondary-light dark:text-text-secondary-dark">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{project.creator?.name || 'Admin'}</span>
              </div>
                      {project._count?.news && (
                        <div className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          <span>{project._count.news} noticias</span>
                        </div>
                      )}
                    </div>

                    {/* Botones de acción */}
                    <div className="flex gap-2">
                      <Button asChild className="flex-1">
                        <Link href={`/proyectos/${project.id}`}>
                          Ver Detalles
                        </Link>
                      </Button>
                      {project.strategicAllies && (
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/proyectos/${project.id}#aliados`}>
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
                );
            })}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}