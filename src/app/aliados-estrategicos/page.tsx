'use client'

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Lightbulb, 
  Shield, 
  Award,
  Globe,
  Handshake,
  ArrowRight,
  ArrowLeft,
  Search
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';

interface Ally {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  imageAlt: string;
  description?: string;
  createdAt: string;
  isFeatured?: boolean;
  author?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export default function AliadosEstrategicosPage() {
  const [allies, setAllies] = useState<Ally[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllies();
  }, []);

  const fetchAllies = async () => {
    try {
      setLoading(true);
      console.log('Fetching all allies from API...');
      const response = await fetch('/api/public/allies-all');
      
      if (!response.ok) {
        throw new Error(`Error al cargar los aliados: ${response.status}`);
      }

      const data = await response.json();
      console.log('All allies data received:', data);
      setAllies(data);
    } catch (err) {
      console.error('Error fetching allies:', err);
      setError(`No se pudieron cargar los aliados: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <SiteHeader />
      
      {/* Hero Section */}
      <div 
        className="relative min-h-screen flex items-center"
        style={{
          backgroundImage: "url('/static-images/heroes/aliados_estrategicos_hero.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'top center'
        }}
      >
        <div className="absolute inset-0 bg-black opacity-40 dark:opacity-60"></div>
        <main className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <div className="max-w-4xl text-white text-center">
            <div className="mb-6">
              <span className="inline-block bg-orange-400 text-gray-900 text-sm font-bold uppercase px-4 py-2 tracking-wider rounded">
                Nuestros aliados
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight text-white mb-6">
              ALIADOS<br/>
              ESTRATÉGICOS
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto mb-8">
              Organizaciones, empresas y fundaciones que comparten nuestra visión de transformación social y trabajan junto a nosotros para crear un impacto positivo.
            </p>
            <div className="mt-8">
              <a className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-lg text-base font-bold hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl font-condensed" href="#aliados">
                CONOCE NUESTROS ALIADOS
                <svg className="h-5 w-5 ml-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path clipRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" fillRule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>
        </main>
      </div>


      {/* Strategic Partners Section */}
      <section className="py-12 bg-background-light dark:bg-background-dark" id="aliados">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block bg-primary text-white text-xs font-semibold px-3 py-1 rounded mb-4">
              ALIANZAS ESTRATÉGICAS
            </span>
            <h2 className="text-4xl font-bold text-text-light dark:text-text-dark mb-4">
              Nuestros Aliados Estratégicos
            </h2>
            <p className="text-lg text-text-secondary-light dark:text-text-secondary-dark max-w-3xl mx-auto">
              Organizaciones que comparten nuestra misión y trabajan con nosotros para crear un impacto social sostenible.
            </p>
          </div>
          
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center gap-3 text-text-secondary-light dark:text-text-secondary-dark">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span className="text-lg">Cargando aliados estratégicos...</span>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg p-6 max-w-md mx-auto">
                <div className="text-destructive text-lg font-medium mb-2">Error al cargar</div>
                <p className="text-text-secondary-light dark:text-text-secondary-dark">{error}</p>
              </div>
            </div>
          ) : allies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allies.map((ally, index) => (
                <div 
                  key={ally.id} 
                  className="group bg-card-light dark:bg-card-dark rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-border-light dark:border-border-dark hover:border-primary hover:-translate-y-1"
                >
                  {/* Image Container */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      alt={ally.imageAlt || ally.name}
                      src={ally.imageUrl}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    
                    {/* Role Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="inline-block bg-primary text-white text-xs font-bold px-2 py-1 rounded">
                        {ally.role}
                      </span>
                    </div>

                    {/* Title over image */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-bold text-lg leading-tight line-clamp-2 drop-shadow-lg">
                        {ally.name}
                      </h3>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-4">
                    <div className="space-y-3">
                      {ally.description && (
                        <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm leading-relaxed line-clamp-3">
                          {ally.description}
                        </p>
                      )}

                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg p-8 max-w-md mx-auto">
                <Search className="h-12 w-12 text-text-secondary-light dark:text-text-secondary-dark mx-auto mb-4" />
                <h3 className="text-lg font-medium text-text-light dark:text-text-dark mb-2">
                  No se encontraron aliados
                </h3>
                <p className="text-text-secondary-light dark:text-text-secondary-dark mb-4">
                  No hay aliados estratégicos disponibles en este momento.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Partnership Benefits Section */}
      <section className="py-6 bg-background-light dark:bg-background-dark">
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-primary text-white text-xs font-semibold px-3 py-1 rounded mb-4">
                BENEFICIOS DE LA ALIANZA
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-text-light dark:text-text-dark leading-tight">
                ¿POR QUÉ SER NUESTRO ALIADO ESTRATÉGICO?
              </h1>
            </div>
            <div>
              <p className="text-text-secondary-light dark:text-text-secondary-dark text-lg">
                Al unirte como aliado estratégico, formas parte de una red de organizaciones comprometidas con el cambio social y obtienes beneficios únicos que amplifican tu impacto.
              </p>
            </div>
          </div>
          
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-card-light dark:bg-card-dark p-8 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-orange-100 dark:bg-orange-900 mb-6">
                <Handshake className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-text-light dark:text-text-dark">IMPACTO AMPLIFICADO</h3>
              <p className="text-text-secondary-light dark:text-text-secondary-dark">
                Multiplica el alcance de tus iniciativas sociales trabajando junto a una organización con presencia nacional y reconocimiento internacional.
              </p>
            </div>
            
            <div className="bg-card-light dark:bg-card-dark p-8 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 mb-6">
                <Globe className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-text-light dark:text-text-dark">ALCANCE GLOBAL</h3>
              <p className="text-text-secondary-light dark:text-text-secondary-dark">
                Accede a nuestra red global de comunidades y proyectos en diferentes regiones del país.
              </p>
            </div>

            <div className="bg-card-light dark:bg-card-dark p-8 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900 mb-6">
                <Award className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-text-light dark:text-text-dark">RECONOCIMIENTO</h3>
              <p className="text-text-secondary-light dark:text-text-secondary-dark">
                Obtén visibilidad y reconocimiento por tu compromiso con la responsabilidad social y el desarrollo comunitario.
              </p>
            </div>

            <div className="bg-card-light dark:bg-card-dark p-8 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 dark:bg-purple-900 mb-6">
                <Users className="h-8 w-8 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-text-light dark:text-text-dark">NETWORKING</h3>
              <p className="text-text-secondary-light dark:text-text-secondary-dark">
                Conecta con otras organizaciones comprometidas con el desarrollo social y amplía tu red de contactos.
              </p>
            </div>

            <div className="bg-card-light dark:bg-card-dark p-8 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900 mb-6">
                <Lightbulb className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-text-light dark:text-text-dark">INNOVACIÓN</h3>
              <p className="text-text-secondary-light dark:text-text-secondary-dark">
                Participa en proyectos innovadores que transforman comunidades usando metodologías probadas internacionalmente.
              </p>
            </div>

            <div className="bg-card-light dark:bg-card-dark p-8 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 dark:bg-yellow-900 mb-6">
                <Shield className="h-8 w-8 text-yellow-500" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-text-light dark:text-text-dark">TRANSPARENCIA</h3>
              <p className="text-text-secondary-light dark:text-text-secondary-dark">
                Trabajamos con total transparencia y rendición de cuentas, proporcionando reportes detallados del impacto.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-orange-500 dark:bg-orange-600 text-white dark:text-white relative overflow-hidden">
        {/* Fondo decorativo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-yellow-200 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-orange-200 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block bg-orange-200 text-orange-800 dark:bg-orange-300 dark:text-orange-900 text-xs font-semibold px-3 py-1 rounded-full mb-4 font-condensed">
              ÚNETE COMO ALIADO ESTRATÉGICO
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white dark:text-white leading-tight font-condensed">
              ¿QUIERES SER PARTE DE NUESTRA RED DE ALIADOS?
            </h2>
            <p className="text-xl text-white dark:text-white max-w-3xl mx-auto mt-4">
              Si tu organización comparte nuestra visión de transformación social y quiere crear un impacto positivo,
              te invitamos a formar parte de nuestra red de aliados estratégicos.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50 font-bold font-condensed" asChild>
              <Link href="/participar">
                CONVERTIRSE EN ALIADO
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-orange-600 font-bold font-condensed transition-all duration-300 hover:scale-105" asChild>
              <Link href="/nosotros">
                CONOCER MÁS SOBRE NOSOTROS
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

