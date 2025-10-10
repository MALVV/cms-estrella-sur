'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface Ally {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  imageAlt: string;
  description?: string;
  createdAt: string;
  author?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export const AlliesSection: React.FC = () => {
  const [allies, setAllies] = useState<Ally[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllies();
  }, []);

  const fetchAllies = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/public/allies');
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error:', response.status, errorText);
        throw new Error(`Error al cargar los aliados: ${response.status}`);
      }

      const data = await response.json();
      setAllies(data);
    } catch (err) {
      console.error('❌ Error fetching allies:', err);
      setError(`No se pudieron cargar los aliados: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-6 sm:py-8 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 w-full max-w-7xl">
          <div className="text-center mb-16">
            <span className="inline-block bg-primary text-white px-3 py-1 rounded text-xs md:text-sm font-bold mb-4">
              ALIADOS ESTRATÉGICOS
            </span>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-text-light dark:text-text-dark mb-8">
              JUNTOS CREAMOS EL CAMBIO
            </h1>
            <p className="text-lg text-text-light dark:text-text-dark max-w-4xl mx-auto">
              Trabajamos junto a organizaciones, empresas y personas comprometidas que comparten nuestra visión de crear un mundo mejor para los niños y sus familias.
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">Cargando aliados...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-6 sm:py-8 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 w-full max-w-7xl">
          <div className="text-center mb-16">
            <span className="inline-block bg-primary text-white px-3 py-1 rounded text-xs md:text-sm font-bold mb-4">
              ALIADOS ESTRATÉGICOS
            </span>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-text-light dark:text-text-dark mb-8">
              JUNTOS CREAMOS EL CAMBIO
            </h1>
            <p className="text-lg text-text-light dark:text-text-dark max-w-4xl mx-auto">
              Trabajamos junto a organizaciones, empresas y personas comprometidas que comparten nuestra visión de crear un mundo mejor para los niños y sus familias.
            </p>
          </div>
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-6 sm:py-8 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 w-full max-w-7xl">
        {/* Encabezado */}
        <div className="text-center mb-16">
          <span className="inline-block bg-primary text-white px-3 py-1 rounded text-xs md:text-sm font-bold mb-4">
            LOS ALIADOS
          </span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-text-light dark:text-text-dark mb-8">
            ALIADOS ESTRATÉGICOS
          </h1>
          <p className="text-lg text-text-light dark:text-text-dark max-w-4xl mx-auto">
            Trabajamos junto a organizaciones, empresas y personas comprometidas que comparten nuestra visión de crear un mundo mejor para los niños y sus familias.
          </p>
        </div>

        {/* Grid de aliados */}
        {allies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {allies.slice(0, 3).map((ally) => (
              <div key={ally.id} className="bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm shadow-lg overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-white/20 dark:border-gray-600/20">
                {/* Imagen del aliado */}
                <div className="relative h-80 sm:h-96">
                  <Image
                    alt={ally.imageAlt || ally.name}
                    src={ally.imageUrl}
                    fill
                    className="object-cover"
                  />
                </div>
                
                {/* Información del aliado */}
                <div className="p-4">
                  <div className="text-left">
                    <span className="inline-block bg-white/60 dark:bg-gray-600/60 backdrop-blur-sm text-gray-700 dark:text-gray-200 text-xs font-medium px-2 py-1 mb-2 border border-white/30 dark:border-gray-500/30">
                      {ally.role}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1">
                      {ally.name}
                    </h3>
                    {ally.description && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                        {ally.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-8 max-w-md mx-auto">
              <div className="text-yellow-600 dark:text-yellow-400 text-4xl mb-4">⭐</div>
              <h3 className="text-lg font-bold text-yellow-800 dark:text-yellow-200 mb-2">
                Próximamente Aliados Destacados
              </h3>
              <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                Estamos trabajando para destacar a nuestros aliados estratégicos más importantes. 
                Pronto podrás verlos aquí en el home.
              </p>
            </div>
          </div>
        )}

        {/* Botón de acción */}
        <div className="text-center mt-8">
          <a 
            className="inline-flex items-center bg-primary text-white font-bold py-2 px-4 hover:bg-opacity-90 transition-colors text-xs sm:text-sm" 
            href="/aliados-estrategicos"
          >
            CONOCER MÁS ALIADOS
            <span className="material-symbols-outlined ml-2 text-xs sm:text-sm">arrow_forward</span>
          </a>
        </div>
      </div>
    </section>
  );
};