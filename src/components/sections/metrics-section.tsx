'use client';

import Image from 'next/image';
import { NumberTicker } from '@/components/ui/number-ticker';

export default function MetricsSection() {
  return (
    <div className="relative w-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 overflow-hidden px-4 py-16 md:py-20">
      {/* Imagen de fondo en blanco y negro */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.pexels.com/photos/9034108/pexels-photo-9034108.jpeg"
          alt="Fondo de métricas"
          fill
          className="object-cover grayscale opacity-50"
        />
        {/* Overlay oscuro para mejor contraste */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>


      {/* Contenido principal */}
      <div className="relative z-10 text-center w-full max-w-6xl mx-auto">
        {/* Badge */}
        <span className="inline-block bg-primary text-white px-3 py-1 rounded text-sm font-semibold mb-6">
          EL IMPACTO QUE GENERAMOS
        </span>

        {/* Título principal */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold max-w-4xl mx-auto leading-tight text-gray-800 dark:text-gray-200 mb-10">
          CONSTRUYENDO UN MUNDO DONDE TODOS LOS NIÑOS ESTÉN SEGUROS, FUERTES Y VALORADOS
        </h1>

        {/* Número principal */}
        <div className="my-10">
          <p className="text-6xl sm:text-7xl lg:text-8xl font-extrabold text-yellow-500 tracking-tighter">
            <NumberTicker 
              value={7200} 
              className="text-6xl sm:text-7xl lg:text-8xl font-extrabold text-yellow-500 tracking-tighter"
              delay={0.5}
            />+
          </p>
          <p className="text-lg font-semibold tracking-wider text-gray-800 dark:text-gray-200">
            NIÑAS, NIÑOS, ADOLESCENTES Y JÓVENES
          </p>
        </div>

        {/* Métricas secundarias */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-center">
            <p className="text-4xl font-extrabold text-gray-800 dark:text-gray-200">
              <NumberTicker 
                value={55000} 
                className="text-4xl font-extrabold text-gray-800 dark:text-gray-200"
                delay={0.2}
              />+
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Estudiantes
            </p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-extrabold text-gray-800 dark:text-gray-200">
              <NumberTicker 
                value={5700} 
                className="text-4xl font-extrabold text-gray-800 dark:text-gray-200"
                delay={0.2}
              />
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Familias
            </p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-extrabold text-gray-800 dark:text-gray-200">
              <NumberTicker 
                value={120} 
                className="text-4xl font-extrabold text-gray-800 dark:text-gray-200"
                delay={0.2}
              />
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Unidades Educativas
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
