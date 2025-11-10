'use client';

import Image from 'next/image';
import { NumberTicker } from '@/components/ui/number-ticker';

export default function MetricsSection() {
  return (
    <div className="relative w-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 overflow-hidden px-4 py-16 md:py-20">
      {/* Imagen de fondo a color */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/static-images/sections/seccion-impato-generado.jpg"
          alt="Fondo de métricas - Impacto generado"
          fill
          className="object-cover"
        />
        {/* Overlay de color casi transparente similar a banners de NOSOTROS */}
        <div className="absolute inset-0 bg-primary/30 dark:bg-primary/40"></div>
      </div>


      {/* Contenido principal */}
      <div className="relative z-10 text-center w-full max-w-6xl mx-auto">
        {/* Título principal */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold max-w-4xl mx-auto leading-tight text-white mb-10">
          CONSTRUYENDO UN MUNDO DONDE NIÑAS, NIÑOS GOZAN DE PROTECCIÓN Y BIENESTAR INTEGRAL
        </h1>

        {/* Número principal */}
        <div className="my-10">
          <p className="text-6xl sm:text-7xl lg:text-8xl font-extrabold text-yellow-500 tracking-tighter">
            <NumberTicker 
              value={7263} 
              className="text-6xl sm:text-7xl lg:text-8xl font-extrabold text-yellow-500 tracking-tighter"
              delay={0.5}
            />
          </p>
          <p className="text-lg font-semibold tracking-wider text-white">
            NIÑAS, NIÑOS, ADOLESCENTES Y JÓVENES BENEFICIADOS DE MANERA DIRECTA
          </p>
        </div>

        {/* Métricas secundarias */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <div className="text-center">
            <p className="text-4xl font-extrabold text-white">
              <NumberTicker 
                value={73679} 
                className="text-4xl font-extrabold text-white"
                delay={0.2}
              />
            </p>
            <p className="text-sm text-white">
              Niños impactados indirectamente
            </p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-extrabold text-white">
              <NumberTicker 
                value={5700} 
                className="text-4xl font-extrabold text-white"
                delay={0.2}
              />
            </p>
            <p className="text-sm text-white">
              Familias fortalecidas
            </p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-extrabold text-white">
              <NumberTicker 
                value={1469} 
                className="text-4xl font-extrabold text-white"
                delay={0.2}
              />
            </p>
            <p className="text-sm text-white">
              Docentes formados
            </p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-extrabold text-white">
              <NumberTicker 
                value={90} 
                className="text-4xl font-extrabold text-white"
                delay={0.2}
              />
            </p>
            <p className="text-sm text-white">
              Profesionales de salud capacitados
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
