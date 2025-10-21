import React from 'react';
import Image from 'next/image';

export const Hero: React.FC = () => {
  return (
    <main className="relative overflow-hidden min-h-screen">
      {/* Imagen de fondo en blanco y negro */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <Image
          src="/static-images/heroes/hero-home.jpg"
          alt="Niños sonriendo de Estrella del Sur"
          fill
          className="object-cover object-center grayscale"
          priority
        />
        {/* Overlay más oscuro para mejor contraste del texto */}
        <div className="absolute inset-0 bg-black/50"></div>
        {/* Splatters de color en el lado derecho */}
        <div className="absolute top-20 right-10 w-20 h-20 bg-yellow-400 rounded-full opacity-60 blur-sm"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-orange-400 rounded-full opacity-50 blur-sm"></div>
        <div className="absolute bottom-32 right-16 w-12 h-12 bg-pink-400 rounded-full opacity-40 blur-sm"></div>
      </div>
      
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="max-w-4xl text-center">
              {/* Título principal */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-6 font-condensed">
                <span className="font-black text-blue-400">ESTRELLA DEL SUR</span>,<br/>
                <span className="font-black">ILUMINANDO</span> vidas,<br/>
                <span className="font-black">PROTEGIENDO</span> sueños.
              </h1>
              
              {/* Descripción */}
              <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto mb-8">
                Transformamos comunidades vulnerables a través de programas integrales que abordan las causas raíz de los problemas sociales.
              </p>
              
              {/* Botón de llamada a la acción */}
              <a className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-lg text-base font-bold hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl font-condensed" href="/nosotros">
                SABER MÁS
                <span className="ml-2 text-lg">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
