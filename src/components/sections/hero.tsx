import React from 'react';
import Image from 'next/image';

export const Hero: React.FC = () => {
  return (
    <main className="relative overflow-hidden min-h-screen">
      {/* Imagen de fondo en blanco y negro */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <Image
          src="https://images.pexels.com/photos/9037596/pexels-photo-9037596.jpeg"
          alt="Niños sonriendo de Estrella del Sur"
          fill
          className="object-cover grayscale"
          priority
        />
        {/* Overlay más oscuro para mejor contraste del texto */}
        <div className="absolute inset-0 bg-black/50"></div>
        {/* Splatters de color en el lado derecho */}
        <div className="absolute top-20 right-10 w-20 h-20 bg-yellow-400 rounded-full opacity-60 blur-sm"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-orange-400 rounded-full opacity-50 blur-sm"></div>
        <div className="absolute bottom-32 right-16 w-12 h-12 bg-pink-400 rounded-full opacity-40 blur-sm"></div>
      </div>
      
      <div className="container mx-auto px-4 pt-8 pb-8 relative z-10 w-full max-w-7xl">
        <div className="flex items-center min-h-[60vh] sm:min-h-[70vh]">
          <div className="w-full lg:w-2/3 z-10">
            {/* Banner pequeño */}
            <div className="inline-block bg-yellow-400 text-black px-3 py-2 text-xs font-semibold mb-4 rounded font-condensed">
              OFRECEMOS ESPERANZA QUE PUEDES AYUDAR
            </div>
            
            {/* Título principal */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4 sm:mb-6 font-condensed">
              ESTRELLA DEL SUR<br/>
              ILUMINANDO VIDAS<br/>
              PROTEGIENDO SUEÑOS
            </h1>
            
            {/* Botón de llamada a la acción */}
            <a className="mt-4 sm:mt-6 inline-flex items-center bg-gray-800 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg text-sm sm:text-base font-bold hover:bg-gray-700 dark:bg-gray-200 dark:text-black dark:hover:bg-gray-300 transition-all duration-300 shadow-lg hover:shadow-xl font-condensed" href="/nosotros">
              SABER MÁS
              <span className="ml-2 text-sm sm:text-base">→</span>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
};
