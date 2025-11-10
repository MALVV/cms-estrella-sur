'use client'

import React from 'react';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';

export default function ParticiparPage() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <SiteHeader />

      {/* Hero Section - Estilo Convergente */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
            <div className="flex flex-col gap-6">
            <div>
              <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-md">¿QUIERES INVOLUCRARTE?</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold font-display uppercase tracking-tight text-gray-900 dark:text-white">
              Da una mano amiga a quienes más lo necesitan
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Tu apoyo puede transformar vidas. Con tu aporte, ayudamos a niñas, niños, adolescentes y sus familias a crecer en entornos seguros, protegidos y llenos de nuevas oportunidades.
            </p>
            {/* Estadísticas de participación */}
            <div className="grid grid-cols-3 gap-4 pt-6">
              <div className="text-center p-3 bg-card-light dark:bg-card-dark rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-primary mb-1">500+</div>
                <div className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Voluntarios/Pasantes</div>
              </div>
              <div className="text-center p-3 bg-card-light dark:bg-card-dark rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-primary mb-1">50+</div>
                <div className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Proyectos</div>
              </div>
              <div className="text-center p-3 bg-card-light dark:bg-card-dark rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-primary mb-1">100%</div>
                <div className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Transparencia</div>
              </div>
            </div>

            {/* Información adicional sobre participación */}
            <div className="pt-4">
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                Explora nuestras opciones de participación: voluntariados/pasantías, donaciones y convocatorias de trabajo.
              </p>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="relative h-[500px]">
            <img 
              alt="Personas trabajando juntas en comunidad" 
              className="w-full h-full object-cover object-center rounded-xl shadow-lg" 
              src="/static-images/heroes/participar-hero.jpg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl"></div>
          </div>
        </div>
      </div>

      {/* Opciones de Participación */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 font-display">
            OPCIONES DE PARTICIPACIÓN
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Descubre las diferentes formas en las que puedes contribuir y ser parte del cambio positivo en nuestras comunidades.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-10 mb-12">
          {/* Voluntariados */}
          <div className="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl shadow-lg p-10 relative overflow-hidden min-h-[500px]">
            <div className="absolute -top-6 -left-6 text-9xl font-black text-white/30 font-display">01</div>
            <div className="flex flex-col items-center text-center h-full justify-between">
              <div className="flex-1 flex flex-col justify-center">
                <img 
                  alt="Voluntario trabajando" 
                  className="rounded-lg w-full h-56 object-cover mb-6" 
                  src="/static-images/sections/voluntariado_tarjeta.jpg"
                />
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 uppercase font-display mb-4">VOLUNTARIADO/PASANTIA</h3>
                <p className="text-gray-700 dark:text-gray-300 text-base mb-6 leading-relaxed">Únete como voluntario/pasante y contribuye con tus habilidades ayudando en programas de liderazgo y actividades recreativas.</p>
              </div>
              <a className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-base hover:text-blue-800 dark:hover:text-blue-300" href="/voluntariados">
                VER MÁS
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Donar */}
          <div className="bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-xl shadow-lg p-10 relative overflow-hidden min-h-[500px]">
            <div className="absolute -top-6 -left-6 text-9xl font-black text-white/30 font-display">02</div>
            <div className="flex flex-col items-center text-center h-full justify-between">
              <div className="flex-1 flex flex-col justify-center">
                <img 
                  alt="Personas trabajando juntas" 
                  className="rounded-lg w-full h-56 object-cover mb-6" 
                  src="/static-images/sections/amigo_estrella_tarjeta.jpg"
                />
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 uppercase font-display mb-4">SÉ UN AMIGO ESTRELLA</h3>
                <p className="text-gray-700 dark:text-gray-300 text-base mb-6 leading-relaxed">Tu donación transforma vidas y comunidades. Contribuye con recursos económicos para apoyar nuestros programas.</p>
              </div>
              <a className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 font-bold text-base hover:text-green-800 dark:hover:text-green-300" href="/donar">
                DONAR
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Convocatorias */}
          <div className="bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-900/30 dark:to-pink-800/30 rounded-xl shadow-lg p-10 relative overflow-hidden min-h-[500px]">
            <div className="absolute -top-6 -left-6 text-9xl font-black text-white/30 font-display">03</div>
            <div className="flex flex-col items-center text-center h-full justify-between">
              <div className="flex-1 flex flex-col justify-center">
                <img 
                  alt="Persona trabajando en proyecto" 
                  className="rounded-lg w-full h-56 object-cover mb-6" 
                  src="/static-images/sections/convocatorias_tarjeta.jpg"
                />
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 uppercase font-display mb-4">CONVOCATORIAS</h3>
                <p className="text-gray-700 dark:text-gray-300 text-base mb-6 leading-relaxed">Explora nuestras convocatorias de trabajo y consultorías. Únete a nuestro equipo y contribuye al desarrollo social de Bolivia.</p>
              </div>
              <a className="inline-flex items-center gap-2 text-pink-600 dark:text-pink-400 font-bold text-base hover:text-pink-800 dark:hover:text-pink-300" href="/convocatorias">
                VER CONVOCATORIAS
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
