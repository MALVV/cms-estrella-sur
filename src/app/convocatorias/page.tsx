'use client'

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
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
    const fetchConvocatorias = async () => {
      try {
        const response = await fetch('/api/public/convocatorias?limit=10');
        if (response.ok) {
          const data = await response.json();
          // Mapear los datos de la API al formato esperado por el frontend
          const mappedData = data.map((item: any) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            image: item.imageUrl,
            startDate: item.startDate,
            endDate: item.endDate,
            status: item.status.toLowerCase() === 'active' ? 'active' : 
                   item.status.toLowerCase() === 'upcoming' ? 'upcoming' : 'closed',
            requirements: Array.isArray(item.requirements) ? item.requirements : [],
            documents: Array.isArray(item.documents) ? item.documents : [],
            createdAt: item.createdAt
          }));
          setConvocatorias(mappedData);
        }
      } catch (error) {
        console.error('Error fetching convocatorias:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConvocatorias();
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
      
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center bg-hero">
        <div className="absolute inset-0 bg-black opacity-40 dark:opacity-60"></div>
        <main className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <div className="max-w-4xl text-white text-center">
            <div className="mb-6">
              <span className="inline-block bg-orange-400 text-gray-900 text-sm font-bold uppercase px-4 py-2 tracking-wider rounded">
                Oportunidades de Trabajo
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight text-white mb-6">
              ÚNETE A<br/>
              NUESTRO<br/>
              EQUIPO
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto mb-8">
              Descubre las oportunidades de trabajo y consultorías que tenemos disponibles. 
              Forma parte de nuestro equipo y contribuye al desarrollo social de Bolivia.
            </p>
            <div className="mt-8">
              <a className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-lg text-base font-bold hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl font-condensed" href="#convocatorias">
                VER CONVOCATORIAS
                <svg className="h-5 w-5 ml-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path clipRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" fillRule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>
        </main>
      </div>

      <main className="container mx-auto px-4 py-8" id="convocatorias">

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
