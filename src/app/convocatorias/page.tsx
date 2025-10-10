'use client'

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, FileText, Users, ArrowRight, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';

interface Convocatoria {
  id: string;
  title: string;
  description: string;
  image: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'upcoming' | 'closed';
  requirements: string[];
  documents: string[];
  createdAt: string;
}

export default function ConvocatoriasPage() {
  const [convocatorias, setConvocatorias] = useState<Convocatoria[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos - en producción vendría de la API
    console.log('Cargando convocatorias...', new Date().toISOString());
    const mockConvocatorias: Convocatoria[] = [
      {
        id: '1',
        title: 'Consultoría en Desarrollo de Capacidades Comunitarias',
        description: 'Buscamos un/a consultor/a especializado/a en desarrollo de capacidades comunitarias para fortalecer las organizaciones locales en el área rural.',
        image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        startDate: '2024-01-15',
        endDate: '2024-12-31',
        status: 'active',
        requirements: [
          'Experiencia mínima de 5 años en desarrollo comunitario',
          'Título universitario en áreas afines',
          'Experiencia en zonas rurales',
          'Disponibilidad para viajar'
        ],
        documents: ['TDR_Consultoria_Desarrollo_Comunitario.pdf'],
        createdAt: '2024-01-10'
      },
      {
        id: '2',
        title: 'Especialista en Monitoreo y Evaluación de Proyectos',
        description: 'Convocatoria para especialista en sistemas de monitoreo y evaluación con enfoque en proyectos sociales y educativos.',
        image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        startDate: '2024-02-01',
        endDate: '2024-11-30',
        status: 'upcoming',
        requirements: [
          'Maestría en Evaluación de Proyectos o afín',
          'Experiencia en metodologías participativas',
          'Manejo de herramientas digitales',
          'Certificación en M&E'
        ],
        documents: ['TDR_Especialista_Monitoreo_Evaluacion.pdf'],
        createdAt: '2024-01-20'
      },
      {
        id: '3',
        title: 'Coordinador/a de Proyectos Educativos',
        description: 'Buscamos coordinador/a para proyectos educativos con enfoque en educación alternativa y desarrollo de competencias.',
        image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        startDate: '2024-03-01',
        endDate: '2024-10-31',
        status: 'active',
        requirements: [
          'Licenciatura en Educación o afín',
          'Experiencia en coordinación de proyectos',
          'Conocimiento en educación alternativa',
          'Habilidades de liderazgo'
        ],
        documents: ['TDR_Coordinador_Proyectos_Educativos.pdf'],
        createdAt: '2023-11-25'
      }
    ];

    setTimeout(() => {
      console.log('Convocatorias cargadas:', mockConvocatorias);
      setConvocatorias(mockConvocatorias);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Activa</Badge>;
      case 'upcoming':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Próxima</Badge>;
      case 'closed':
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">Cerrada</Badge>;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isActive = (endDate: string) => {
    return new Date(endDate) >= new Date();
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <SiteHeader />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="max-w-4xl mx-auto">
            <Badge className="bg-primary text-white px-4 py-2 text-sm font-bold uppercase tracking-wider rounded-sm mb-6">
              <FileText className="mr-2 h-4 w-4" />
              CONVOCATORIAS
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-black text-text-light dark:text-text-dark leading-tight mb-6">
              Únete a Nuestro
              <br />
              <span className="text-primary">Equipo</span>
            </h1>
            
            <p className="text-xl text-text-secondary-light dark:text-text-secondary-dark mb-8 leading-relaxed">
              Descubre las oportunidades de trabajo y consultorías que tenemos disponibles. 
              Forma parte de nuestro equipo y contribuye al desarrollo social de Bolivia.
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm text-text-secondary-light dark:text-text-secondary-dark">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Oportunidades profesionales</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Fechas de vigencia claras</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Documentos descargables</span>
              </div>
            </div>
          </div>
        </section>

        {/* Convocatorias List */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-light dark:text-text-dark mb-4">
              Convocatorias Disponibles
            </h2>
            <p className="text-lg text-text-secondary-light dark:text-text-secondary-dark max-w-2xl mx-auto">
              Explora nuestras oportunidades de trabajo y consultorías ordenadas por fecha de vigencia
            </p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                  <CardHeader>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {convocatorias.map((convocatoria) => (
                <Card key={convocatoria.id} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <Image
                      src={convocatoria.image}
                      alt={convocatoria.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      {getStatusBadge(convocatoria.status)}
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3">
                        <div className="flex items-center gap-2 text-white text-sm">
                          <Calendar className="h-4 w-4" />
                          <span>Hasta {formatDate(convocatoria.endDate)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-bold text-text-light dark:text-text-dark line-clamp-2 group-hover:text-primary transition-colors">
                      {convocatoria.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm mb-4 line-clamp-3">
                      {convocatoria.description}
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                        <Clock className="h-4 w-4" />
                        <span>Publicado: {formatDate(convocatoria.createdAt)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                        <FileText className="h-4 w-4" />
                        <span>{convocatoria.documents.length} documento(s)</span>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      {(() => {
                        console.log(`Convocatoria ${convocatoria.id} - Estado: ${convocatoria.status}`);
                        return convocatoria.status === 'active' || convocatoria.status === 'upcoming';
                      })() ? (
                        <Link href={`/convocatorias/${convocatoria.id}`}>
                          <Button className="w-full group-hover:bg-primary/90 transition-colors">
                            Ver Detalles y Aplicar
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      ) : (
                        <Button variant="outline" className="w-full" disabled>
                          Convocatoria Cerrada
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

      </main>
      
      <SiteFooter />
    </div>
  );
}
