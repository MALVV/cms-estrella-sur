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
  ArrowLeft
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { SiteHeader } from '@/components/layout/site-header';

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
      <main className="relative min-h-[60vh] flex items-center justify-center bg-cover bg-center" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDxj7aF9-tpq6_zWnwVuojHHQc6bgc0eYuTVzXoE54LfjueardQbB6d3EFqZK3uv57oPTiHleVgH-Yi34c27AzoP75Qy1KG7aX02vlCFgOrykyPM-7ngRDNctmwl-uvyGeoidjSDqXHYXwBToi1ZuwUrOC0WEgjGrmw6E2n9SWGVuA-jl7O9o8Jpy99P817v_9-SFCIO7Y4FJ-vvLo2jZnXag1G1XwpbZuRBQKvKBtEKeA195mYIaDVYeWR_qsqQvyMmN5lHxaP-Q4')"}}>
        <div className="absolute inset-0 bg-white/80 dark:bg-black/70"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative p-4">
              <div className="absolute inset-0 -z-10">
                <Image 
                  alt="Strategic partnerships" 
                  className="w-full h-full object-contain opacity-60" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6OIceM-_FT9G0DLEA6WqHqXlzlJU-VaRCRGc9YmiIowGpPowBftussI75QEvZB9_--dBx4PzUuEEy0IcDa2c_UceyI_2xYkO_HVTFssrxGoPHIw0omP5gMXjqYTSnA_3dvjAM7Lb8_71gI8ZwulPak0-RTUB6qMvKe9x6m10z9cuTF0uFGMHTQssgmxQqn0wX99_XKgOj86JVeNCaD1e0wfnzKVk4cA5Eww2nGD1KmW7CVDBSXCZjOxdgaJwWkcVw931k71FPm98"
                  width={400}
                  height={300}
                />
              </div>
              <div className="relative transform -rotate-6 max-w-sm mx-auto">
                <Image 
                  alt="Partnership meeting" 
                  className="rounded-lg shadow-2xl w-full" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0DKGKMYw36YxwT9YsJXl1eVtdB-GCWJZ_4WjzDxUdML2vGmj6xbZ9_DwGHVQvh1D0lRny2Gki7pbHQWxUau_Inz0RHWtE6GevDh5_mykpglJ_LQSgxeGtCVCdHkXj_urWqkI8DkcmEH4EBrDXR-5153a4nN5xOuPvOr4Vs2y0Ii2HOYhPTuOpXEheDFlaSvA3XCpWfhe04uSO1aOu70z8qif64ppIm4lQWU2hWjlhHF-fSMDaXrbvE9MC_5dHxtbxBKygXs0JoO0"
                  width={400}
                  height={300}
                />
              </div>
              <div className="relative transform rotate-3 mt-[-15%] ml-[20%] max-w-xs">
                <Image 
                  alt="Corporate alliance" 
                  className="rounded-lg shadow-2xl w-full" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcojMb_tNeqCrnNo1DH8v1vKFm2shH7i9X_UrDGDxoSUU6JdshPCdQy99xuAfZp_78sh87ME9W706dQ75iClppApHElnQaU0Svwngv46AOmz3-ke1ulDNpRN02F5Iujger72_L06XMRQBNEq3zPIXy7Jw7GPUm4rKpHEUBemS2jq5vmMKX_KQ3c7R0qRF0B2ZWlgIBFoMbn6UOXdsCepwN_iRMrzWpzQGLKhhitD8rxMKlOOlgf2mz6zhwgpXJV_NXcrTDU92VGkE"
                  width={300}
                  height={200}
                />
              </div>
            </div>
            <div className="text-left">
              <span className="inline-block bg-orange-400 text-gray-800 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm mb-4">
                Nuestros aliados
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-text-light dark:text-text-dark leading-tight">
                ALIADOS ESTRATÉGICOS<br/>
                COMPROMETIDOS<br/>
                CON EL IMPACTO SOCIAL
              </h1>
              <p className="mt-6 text-base text-text-light dark:text-text-dark/80 max-w-xl">
                Organizaciones, empresas y fundaciones que comparten nuestra visión de transformación social y trabajan junto a nosotros para crear un impacto positivo.
              </p>
              <p className="mt-4 text-base text-text-light dark:text-text-dark/80 max-w-xl">
                Nuestros aliados estratégicos son fundamentales para amplificar nuestro alcance y maximizar el impacto en las comunidades que servimos.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Strategic Partners Section */}
      <section className="py-12 bg-background-light dark:bg-background-dark">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <span className="inline-block bg-primary text-white text-xs font-bold px-3 py-1 rounded-sm mb-4">
              ALIANZAS ESTRATÉGICAS
            </span>
            <h1 className="text-4xl font-bold text-text-light dark:text-text-dark">
              ALIADOS ESTRATÉGICOS
            </h1>
            <p className="text-lg text-text-secondary-light dark:text-text-secondary-dark max-w-3xl mx-auto mt-4">
              Organizaciones que comparten nuestra misión y trabajan con nosotros para crear un impacto social sostenible.
            </p>
          </div>
          
          {loading ? (
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400">Cargando aliados estratégicos...</p>
            </div>
          ) : error ? (
            <div className="text-center">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          ) : allies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allies.map((ally) => (
                <div key={ally.id} className="bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm shadow-lg overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-white/20 dark:border-gray-600/20 rounded-lg">
                  <div className="relative h-80 sm:h-96">
                    <Image
                      alt={ally.imageAlt || ally.name}
                      src={ally.imageUrl}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="p-6">
                    <div className="text-left">
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="inline-block bg-white/60 dark:bg-gray-600/60 backdrop-blur-sm text-gray-700 dark:text-gray-200 text-xs font-medium px-2 py-1 border border-white/30 dark:border-gray-500/30 rounded">
                          {ally.role}
                        </span>
                        {ally.isFeatured && (
                          <span className="inline-block bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                            ⭐ DESTACADO
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        {ally.name}
                      </h3>
                      {ally.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                          {ally.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400">No hay aliados estratégicos disponibles en este momento.</p>
            </div>
          )}
        </div>
      </section>

      {/* Partnership Benefits Section */}
      <section className="py-8 bg-background-light dark:bg-background-dark">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <span className="inline-block bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-sm mb-4">
              BENEFICIOS DE LA ALIANZA
            </span>
            <h2 className="text-4xl font-bold text-text-light dark:text-text-dark">
              ¿POR QUÉ SER NUESTRO ALIADO ESTRATÉGICO?
            </h2>
            <p className="text-lg text-text-secondary-light dark:text-text-secondary-dark max-w-3xl mx-auto mt-4">
              Únete a nuestra red de aliados estratégicos y forma parte de la transformación social.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Handshake className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-text-light dark:text-text-dark mb-2">
                Impacto Amplificado
              </h3>
              <p className="text-text-secondary-light dark:text-text-secondary-dark">
                Multiplica el impacto de tu organización trabajando junto a nosotros en proyectos sociales.
              </p>
            </div>

            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <div className="bg-green-100 dark:bg-green-900/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-text-light dark:text-text-dark mb-2">
                Alcance Global
              </h3>
              <p className="text-text-secondary-light dark:text-text-secondary-dark">
                Accede a nuestra red global de comunidades y proyectos en diferentes regiones.
              </p>
            </div>

            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-text-light dark:text-text-dark mb-2">
                Reconocimiento
              </h3>
              <p className="text-text-secondary-light dark:text-text-secondary-dark">
                Obtén visibilidad y reconocimiento por tu compromiso con la responsabilidad social.
              </p>
            </div>

            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <div className="bg-orange-100 dark:bg-orange-900/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-bold text-text-light dark:text-text-dark mb-2">
                Networking
              </h3>
              <p className="text-text-secondary-light dark:text-text-secondary-dark">
                Conecta con otras organizaciones comprometidas con el desarrollo social.
              </p>
            </div>

            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <div className="bg-red-100 dark:bg-red-900/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-text-light dark:text-text-dark mb-2">
                Innovación
              </h3>
              <p className="text-text-secondary-light dark:text-text-secondary-dark">
                Participa en proyectos innovadores que transforman comunidades.
              </p>
            </div>

            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <div className="bg-teal-100 dark:bg-teal-900/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="text-xl font-bold text-text-light dark:text-text-dark mb-2">
                Transparencia
              </h3>
              <p className="text-text-secondary-light dark:text-text-secondary-dark">
                Trabajamos con total transparencia y rendición de cuentas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-12 bg-orange-500 dark:bg-orange-600 text-white dark:text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-yellow-200 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-orange-200 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8">
            <span className="inline-block bg-orange-200 text-orange-800 dark:bg-orange-300 dark:text-orange-900 text-xs font-semibold px-3 py-1 rounded-full mb-4 font-condensed">
              ÚNETE COMO ALIADO ESTRATÉGICO
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white dark:text-white leading-tight font-condensed">
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
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600 font-bold font-condensed" asChild>
              <Link href="/nosotros">
                CONOCER MÁS SOBRE NOSOTROS
                <ArrowLeft className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
