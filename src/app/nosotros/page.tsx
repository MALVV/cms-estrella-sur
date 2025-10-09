'use client'

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Map,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { SiteHeader } from '@/components/layout/site-header';

export default function AboutUsPage() {
  const [selectedTeam, setSelectedTeam] = useState<1 | 2 | 3 | 4>(1);

  // Efecto para cambiar automáticamente las imágenes
  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedTeam((prev) => {
        if (prev === 4) return 1;
        return (prev + 1) as 1 | 2 | 3 | 4;
      });
    }, 3000); // Cambia cada 3 segundos

    return () => clearInterval(interval);
  }, []);

  const teamImages: Record<1 | 2 | 3 | 4, string> = {
    1: "https://lh3.googleusercontent.com/aida-public/AB6AXuD8VUB2xLHAWgBfe1XYO7-lIP6fZh6-5bCJm9bggcbxbdADdXEV1C3EE3I4U8BgYGluLzaHwczKf3j9I0nvKUTvIp2wAK3uyYcZp6Wo2M7E0KbjYXqRoAhFHswjy8YuveSJaSAv9d2jkqak5KNi375y_88sDomAcoEoFYvPsbEctymmtN3Y3TQW_EPczouNU9ASGpu5wDX7phIuy53C9qnv7A_pZUNhquGco3FZgtOB7x6dHv36aDpjFdk856fHI_c_BDZc-BsnwCGj",
    2: "https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg",
    3: "https://lh3.googleusercontent.com/aida-public/AB6AXuB0DKGKMYw36YxwT9YsJXl1eVtdB-GCWJZ_4WjzDxUdML2vGmj6xbZ9_DwGHVQvh1D0lRny2Gki7pbHQWxUau_Inz0RHWtE6GevDh5_mykpglJ_LQSgxeGtCVCdHkXj_urWqkI8DkcmEH4EBrDXR-5153a4nN5xOuPvOr4Vs2y0Ii2HOYhPTuOpXEheDFlaSvA3XCpWfhe04uSO1aOu70z8qif64ppIm4lQWU2hWjlhHF-fSMDaXrbvE9MC_5dHxtbxBKygXs0JoO0",
    4: "https://lh3.googleusercontent.com/aida-public/AB6AXuCcojMb_tNeqCrnNo1DH8v1vKFm2shH7i9X_UrDGDxoSUU6JdshPCdQy99xuAfZp_78sh87ME9W706dQ75iClppApHElnQaU0Svwngv46AOmz3-ke1ulDNpRN02F5Iujger72_L06XMRQBNEq3zPIXy7Jw7GPUm4rKpHEUBemS2jq5vmMKX_KQ3c7R0qRF0B2ZWlgIBFoMbn6UOXdsCepwN_iRMrzWpzQGLKhhitD8rxMKlOOlgf2mz6zhwgpXJV_NXcrTDU92VGkE"
  };

  const teamDescriptions: Record<1 | 2 | 3 | 4, string> = {
    1: "Nuestro equipo está compuesto por individuos talentosos de diversos orígenes, todos unidos por un objetivo común: crear un impacto duradero.",
    2: "Somos un equipo apasionado que trabaja incansablemente para transformar las vidas de niños y jóvenes en comunidades vulnerables.",
    3: "Con años de experiencia en el campo social, nuestro equipo experimentado desarrolla programas integrales de largo plazo.",
    4: "Como parte de una red global, trabajamos con organizaciones internacionales para amplificar nuestro impacto mundial."
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <SiteHeader />
      
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center bg-hero">
        <div className="absolute inset-0 bg-black opacity-40 dark:opacity-60"></div>
        <main className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <div className="max-w-2xl text-white text-center">
            <div className="mb-4">
              <span className="inline-block bg-orange-400 text-gray-900 text-xs font-bold uppercase px-3 py-1 tracking-wider">
                Transformando Comunidades Vulnerables
              </span>
            </div>
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold leading-tight text-white">
              CAMBIAMOS LA HISTORIA DE LOS NIÑOS
          </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-200">
              Cada niño merece un hogar seguro y amoroso. Estamos dedicados a brindar apoyo inmediato y duradero a niños en situación de vulnerabilidad. Nuestra misión es romper el ciclo de la pobreza y el abandono ofreciendo refugio, educación y cuidado compasivo, empoderándolos para construir un futuro más brillante.
            </p>
            <div className="mt-8">
              <a className="inline-flex items-center bg-primary text-white text-sm font-bold py-3 px-6 rounded-sm hover:bg-opacity-90 transition-colors duration-300" href="#mision">
                CONOCE CÓMO LO HACEMOS
                <svg className="h-5 w-5 ml-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path clipRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" fillRule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>
        </main>
        </div>

      {/* Misión y Propósito Section */}
      <section id="mision" className="py-6 bg-background-light dark:bg-background-dark">
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-primary text-white text-xs font-semibold px-3 py-1 rounded mb-4">
                MISIÓN Y PROPÓSITO
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-text-light dark:text-text-dark leading-tight">
                QUÉ NOS HACE DIFERENTES
              </h1>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Somos una fundación nacional trabajando para transformar las esperanzas y la felicidad de niños y jóvenes que enfrentan vulnerabilidades, exclusión y falta de oportunidades.
              </p>
                </div>
                </div>
          
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-card-light dark:bg-card-dark p-8 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-orange-100 dark:bg-orange-900 mb-6">
                <span className="material-symbols-outlined text-orange-500 text-3xl">groups</span>
                </div>
              <h3 className="text-xl font-bold mb-3 text-text-light dark:text-text-dark">COMPARTIR</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Compartimos sentimientos y apoyo espiritual con los más necesitados, niños alrededor del mundo, ayudándolos a integrarse en la comunidad.
              </p>
                </div>
            
            <div className="bg-card-light dark:bg-card-dark p-8 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 mb-6">
                <span className="material-symbols-outlined text-green-500 text-3xl">hub</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-text-light dark:text-text-dark">COMUNIDAD</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Ayudamos a organizaciones locales a acceder al financiamiento, herramientas, capacitación y apoyo que necesitan para ser más efectivas.
            </p>
            </div>

            <div className="bg-card-light dark:bg-card-dark p-8 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900 mb-6">
                <span className="material-symbols-outlined text-red-500 text-3xl">favorite</span>
                  </div>
              <h3 className="text-xl font-bold mb-3 text-text-light dark:text-text-dark">RESPONSABILIDADES</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Compartimos sentimientos y apoyo espiritual con los más necesitados, niños alrededor del mundo, ayudándolos a integrarse en la comunidad.
              </p>
                </div>
            
            <div className="bg-card-light dark:bg-card-dark p-8 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-cyan-100 dark:bg-cyan-900 mb-6">
                <span className="material-symbols-outlined text-cyan-500 text-3xl">handshake</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-text-light dark:text-text-dark">COLABORACIÓN</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Las alianzas en todos los sectores hacen posible todo nuestro trabajo para niños y jóvenes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Equipo Section */}
      <section className="bg-background-light dark:bg-background-dark">
        <div className="relative min-h-screen">
          <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBC6gS_zQf7gG8r_5_UhrY7uXWjY7A6yqO1J0J9PjYvXb3mH3C1tV0b_0rQ6Z2nN1vR8gL2mX2gY7wS_9B8kF1kZ3zO2c3o4m5p6j7l8')"}}>
            <div className="absolute inset-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm"></div>
          </div>
          <div className="relative container mx-auto px-4 py-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div>
                  <span className="inline-block bg-primary text-white text-xs font-semibold px-3 py-1 rounded">
                    NUESTRO EQUIPO
                  </span>
                  <h1 className="text-6xl font-bold mt-4 text-zinc-900 dark:text-white">
                    CONOCE A LAS PERSONAS DETRÁS DE LA MISIÓN
                  </h1>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 cursor-pointer hover:opacity-80 transition-all duration-300 hover:scale-105" onClick={() => setSelectedTeam(1)}>
                    <span className={`text-2xl font-bold transition-all duration-500 ${selectedTeam === 1 ? 'text-orange-500 scale-110' : 'text-zinc-400 dark:text-zinc-600'}`}>01.</span>
                    <h2 className={`text-4xl font-bold transition-all duration-500 ${selectedTeam === 1 ? 'text-zinc-900 dark:text-white scale-105' : 'text-zinc-400 dark:text-zinc-500'}`}>COMPROMETIDOS</h2>
                  </div>
                  <div className="flex items-center space-x-4 cursor-pointer hover:opacity-80 transition-all duration-300 hover:scale-105" onClick={() => setSelectedTeam(2)}>
                    <span className={`text-2xl font-bold transition-all duration-500 ${selectedTeam === 2 ? 'text-orange-500 scale-110' : 'text-zinc-400 dark:text-zinc-600'}`}>02.</span>
                    <h2 className={`text-4xl font-bold transition-all duration-500 ${selectedTeam === 2 ? 'text-zinc-900 dark:text-white scale-105' : 'text-zinc-400 dark:text-zinc-500'}`}>APASIONADOS</h2>
                </div>
                  <div className="flex items-center space-x-4 cursor-pointer hover:opacity-80 transition-all duration-300 hover:scale-105" onClick={() => setSelectedTeam(3)}>
                    <span className={`text-2xl font-bold transition-all duration-500 ${selectedTeam === 3 ? 'text-orange-500 scale-110' : 'text-zinc-400 dark:text-zinc-600'}`}>03.</span>
                    <h2 className={`text-4xl font-bold transition-all duration-500 ${selectedTeam === 3 ? 'text-zinc-900 dark:text-white scale-105' : 'text-zinc-400 dark:text-zinc-500'}`}>EXPERIMENTADOS</h2>
                </div>
                  <div className="flex items-center space-x-4 cursor-pointer hover:opacity-80 transition-all duration-300 hover:scale-105" onClick={() => setSelectedTeam(4)}>
                    <span className={`text-2xl font-bold transition-all duration-500 ${selectedTeam === 4 ? 'text-orange-500 scale-110' : 'text-zinc-400 dark:text-zinc-600'}`}>04.</span>
                    <h2 className={`text-4xl font-bold transition-all duration-500 ${selectedTeam === 4 ? 'text-zinc-900 dark:text-white scale-105' : 'text-zinc-400 dark:text-zinc-500'}`}>GLOBALES</h2>
                </div>
              </div>
            </div>
              <div className="flex flex-col justify-center pt-32">
                <div className="bg-white dark:bg-zinc-800/50 rounded-lg shadow-xl overflow-hidden flex items-center justify-center transition-all duration-500 hover:shadow-2xl hover:scale-105">
                  <img 
                    alt="Equipo trabajando juntos" 
                    className="w-full h-80 object-cover transition-all duration-700 ease-in-out transform hover:scale-105" 
                    src={teamImages[selectedTeam]}
                  />
                </div>
                
                <div className="bg-white dark:bg-zinc-800/50 rounded-lg shadow-xl p-6 transition-all duration-500 hover:shadow-2xl">
                  <p className="text-lg text-zinc-700 dark:text-zinc-300 text-center mb-6 transition-all duration-500 ease-in-out">
                    {teamDescriptions[selectedTeam]}
                  </p>
                  <div className="text-center">
                    <Button size="lg" className="bg-zinc-800 text-white font-semibold px-6 py-3 rounded-md flex items-center space-x-2 hover:bg-zinc-700 transition-all duration-300 hover:scale-110 hover:shadow-lg mx-auto" asChild>
                  <Link href="/equipo">
                    <span>CONOCER MÁS</span>
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </Link>
                </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ChildFund Alliance Section */}
      <section className="py-12 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-primary text-white text-xs font-semibold px-3 py-1 rounded mb-4">
                CHILDFUND ALLIANCE
            </span>
              <h1 className="text-4xl md:text-5xl font-bold text-text-light dark:text-text-dark leading-tight">
                PARTE DE UNA RED GLOBAL DE IMPACTO
              </h1>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Somos parte de ChildFund Alliance, una red global de organizaciones independientes trabajando juntas para ayudar a los niños más vulnerables del mundo.
            </p>
          </div>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-text-light dark:text-text-dark mb-6 font-condensed">
                UNA RED GLOBAL DE TRANSFORMACIÓN
              </h3>
              <p className="text-lg text-text-secondary-light dark:text-text-secondary-dark mb-6">
                ChildFund Alliance es una red global de 12 organizaciones independientes que trabajan 
                en más de 60 países para ayudar a los niños más vulnerables del mundo. Nuestra misión 
                compartida es crear oportunidades para que los niños y jóvenes desarrollen su potencial 
                y se conviertan en líderes del cambio positivo.
              </p>
              <p className="text-lg text-text-secondary-light dark:text-text-secondary-dark mb-8">
                Como parte de esta alianza, tenemos acceso a metodologías probadas internacionalmente, 
                recursos especializados y una red de apoyo que nos permite amplificar nuestro impacto 
                y aprender de las mejores prácticas globales.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <h4 className="font-bold text-text-light dark:text-text-dark mb-1">60+ Países</h4>
                  <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Presencia Global</p>
                </div>
                <div className="text-center">
                  <h4 className="font-bold text-text-light dark:text-text-dark mb-1">12 Organizaciones</h4>
                  <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Red de Aliados</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/5029919/pexels-photo-5029919.jpeg"
                alt="ChildFund Alliance - Niños y familias trabajando juntos"
                className="w-full h-96 object-cover rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Áreas de Acción - Mapa Interactivo Section */}
      <section className="py-12 bg-background-light dark:bg-background-dark">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-primary text-white text-xs font-semibold px-3 py-1 rounded mb-4">
                ÁREAS DE ACCIÓN
            </span>
              <h1 className="text-4xl md:text-5xl font-bold text-text-light dark:text-text-dark leading-tight">
                MAPA INTERACTIVO DE NUESTRO IMPACTO
              </h1>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Explora las diferentes áreas donde desarrollamos nuestros programas y proyectos, conoce las comunidades que atendemos y descubre el impacto que generamos en cada región.
              </p>
            </div>
          </div>

          {/* Mapa Interactivo Placeholder */}
          <div className="relative mt-8 mb-8">
            <div className="relative h-96 bg-gradient-to-br from-emerald-100 to-blue-100 dark:from-emerald-900/30 dark:to-blue-900/30 rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                  <Map className="h-20 w-20 text-emerald-600 dark:text-emerald-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-emerald-700 dark:text-emerald-300 font-condensed mb-2">
                    Mapa Interactivo
                  </h3>
                  <p className="text-emerald-600 dark:text-emerald-400">
                    Próximamente: Explora nuestras áreas de acción
            </p>
          </div>
                    </div>
              
              {/* Puntos de impacto simulados */}
              <div className="absolute top-20 left-20 w-4 h-4 bg-orange-500 rounded-full animate-pulse"></div>
              <div className="absolute top-32 right-32 w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
              <div className="absolute bottom-24 left-1/3 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
              <div className="absolute bottom-32 right-20 w-4 h-4 bg-purple-500 rounded-full animate-pulse"></div>
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
              ÚNETE A NUESTRA MISIÓN
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white dark:text-white leading-tight font-condensed">
              ¿QUIERES SER PARTE DEL CAMBIO?
            </h2>
            <p className="text-xl text-white dark:text-white max-w-3xl mx-auto mt-4">
              Únete a nosotros en nuestra misión de transformar comunidades y crear un futuro mejor 
              para todos los niños. Juntos podemos hacer la diferencia.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50 font-bold font-condensed" asChild>
              <a href="/programas">
                CONOCE NUESTROS PROGRAMAS
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600 font-bold font-condensed" asChild>
              <a href="/proyectos">
                VER NUESTROS PROYECTOS
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
