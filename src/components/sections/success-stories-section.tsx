'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Story {
  id: string;
  title: string;
  content?: string;
  summary?: string;
  imageUrl: string;
  imageAlt: string;
  createdAt: string;
  author?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export default function SuccessStoriesSection() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/public/stories');
      
      if (!response.ok) {
        throw new Error('Error al cargar las historias');
      }

      const data = await response.json();
      setStories(data);
    } catch (err) {
      console.error('Error fetching stories:', err);
      setError('No se pudieron cargar las historias');
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <section className="py-16 bg-background-light dark:bg-background-dark">
        <div className="max-w-7xl mx-auto">
          {/* Título de la sección */}
          <div className="text-center mb-8">
            <span className="inline-block text-text-light dark:text-text-dark text-sm font-semibold mb-4">
              HISTORIAS DESTACADAS
            </span>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-text-light dark:text-text-dark mb-2">
              CONOCE LAS HISTORIAS QUE INSPIRAN NUESTRO TRABAJO
            </h1>
          </div>

          {/* Descripción arriba de la tarjeta */}
          <div className="text-center mb-8">
            <p className="text-lg text-subtext-light dark:text-subtext-dark max-w-5xl mx-auto leading-relaxed">
              Cada historia representa una vida transformada, una familia fortalecida y una comunidad que crece. Descubre cómo nuestro trabajo conjunto está creando un futuro mejor para los niños y sus familias en Oruro.
            </p>
          </div>

          <div className="relative">
            <div className="absolute top-8 left-8 z-10">
              <span className="bg-yellow-500 text-white text-xs font-bold px-3 py-1.5 rounded-sm tracking-wider">
                HISTORIAS DESTACADAS
              </span>
            </div>
            <div className="w-full h-[300px] overflow-hidden">
              <div className="w-full h-full bg-gray-300 dark:bg-gray-600 animate-pulse"></div>
            </div>
            <div className="bg-black bg-opacity-90 dark:bg-black dark:bg-opacity-90 p-8 md:p-12">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between">
                <div className="md:w-3/5">
                  <div className="h-12 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mb-4"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                </div>
                <div className="mt-8 md:mt-0">
                  <div className="h-12 w-48 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Descripción debajo de la tarjeta */}
        <div className="text-center mt-8">
          <p className="text-lg text-subtext-light dark:text-subtext-dark max-w-3xl mx-auto leading-relaxed">
            Cada historia representa una vida transformada, una familia fortalecida y una comunidad que crece. Descubre cómo nuestro trabajo conjunto está creando un futuro mejor para los niños y sus familias en Oruro.
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-background-light dark:bg-background-dark">
        <div className="max-w-7xl mx-auto">
          {/* Título de la sección */}
          <div className="text-center mb-8">
            <span className="inline-block text-text-light dark:text-text-dark text-sm font-semibold mb-4">
              HISTORIAS DESTACADAS
            </span>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-text-light dark:text-text-dark mb-2">
              CONOCE LAS HISTORIAS QUE INSPIRAN NUESTRO TRABAJO
            </h1>
          </div>

          {/* Descripción arriba de la tarjeta */}
          <div className="text-center mb-8">
            <p className="text-lg text-subtext-light dark:text-subtext-dark max-w-5xl mx-auto leading-relaxed">
              Cada historia representa una vida transformada, una familia fortalecida y una comunidad que crece. Descubre cómo nuestro trabajo conjunto está creando un futuro mejor para los niños y sus familias en Oruro.
            </p>
          </div>

          <div className="relative">
            <div className="absolute top-8 left-8 z-10">
              <span className="bg-yellow-500 text-white text-xs font-bold px-3 py-1.5 rounded-sm tracking-wider">
                HISTORIAS DESTACADAS
              </span>
            </div>
            <div className="w-full h-[600px] overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <p className="text-gray-600 dark:text-gray-400">{error}</p>
            </div>
            <div className="bg-black bg-opacity-90 dark:bg-black dark:bg-opacity-90 p-8 md:p-12">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between">
                <div className="md:w-3/5">
                  <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                    HISTORIAS DE IMPACTO
                  </h1>
                  <p className="text-white mt-4 text-base">
                    Próximamente compartiremos historias inspiradoras de impacto.
                  </p>
                </div>
                <div className="mt-8 md:mt-0">
                  <a 
                    className="inline-flex items-center border border-white text-white px-6 py-3 rounded-sm text-sm font-semibold hover:bg-white hover:text-black transition-colors" 
                    href="/historias-impacto"
                  >
                    VER MÁS HISTORIAS
                    <span className="material-symbols-outlined ml-2">arrow_forward</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Descripción debajo de la tarjeta */}
        <div className="text-center mt-8">
          <p className="text-lg text-subtext-light dark:text-subtext-dark max-w-3xl mx-auto leading-relaxed">
            Cada historia representa una vida transformada, una familia fortalecida y una comunidad que crece. Descubre cómo nuestro trabajo conjunto está creando un futuro mejor para los niños y sus familias en Oruro.
          </p>
        </div>
      </section>
    );
  }

  if (stories.length === 0) {
    return (
      <section className="py-16 bg-background-light dark:bg-background-dark">
        <div className="max-w-7xl mx-auto">
          {/* Título de la sección */}
          <div className="text-center mb-8">
            <span className="inline-block text-text-light dark:text-text-dark text-sm font-semibold mb-4">
              HISTORIAS DESTACADAS
            </span>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-text-light dark:text-text-dark mb-2">
              CONOCE LAS HISTORIAS QUE INSPIRAN NUESTRO TRABAJO
            </h1>
          </div>

          {/* Descripción arriba de la tarjeta */}
          <div className="text-center mb-8">
            <p className="text-lg text-subtext-light dark:text-subtext-dark max-w-5xl mx-auto leading-relaxed">
              Cada historia representa una vida transformada, una familia fortalecida y una comunidad que crece. Descubre cómo nuestro trabajo conjunto está creando un futuro mejor para los niños y sus familias en Oruro.
            </p>
          </div>

          <div className="relative">
            <div className="absolute top-8 left-8 z-10">
              <span className="bg-yellow-500 text-white text-xs font-bold px-3 py-1.5 rounded-sm tracking-wider">
                HISTORIAS DESTACADAS
              </span>
            </div>
            <div className="w-full h-[600px] overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <p className="text-gray-600 dark:text-gray-400">
                Próximamente compartiremos historias inspiradoras de impacto.
              </p>
            </div>
            <div className="bg-black bg-opacity-90 dark:bg-black dark:bg-opacity-90 p-8 md:p-12">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between">
                <div className="md:w-3/5">
                  <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                    HISTORIAS DE IMPACTO
                  </h1>
                  <p className="text-white mt-4 text-base">
                    Próximamente compartiremos historias inspiradoras de impacto.
                  </p>
                </div>
                <div className="mt-8 md:mt-0">
                  <a 
                    className="inline-flex items-center border border-white text-white px-6 py-3 rounded-sm text-sm font-semibold hover:bg-white hover:text-black transition-colors" 
                    href="/historias-impacto"
                  >
                    VER MÁS HISTORIAS
                    <span className="material-symbols-outlined ml-2">arrow_forward</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Descripción debajo de la tarjeta */}
        <div className="text-center mt-8">
          <p className="text-lg text-subtext-light dark:text-subtext-dark max-w-3xl mx-auto leading-relaxed">
            Cada historia representa una vida transformada, una familia fortalecida y una comunidad que crece. Descubre cómo nuestro trabajo conjunto está creando un futuro mejor para los niños y sus familias en Oruro.
          </p>
        </div>
      </section>
    );
  }

  // Usar la primera historia disponible
  const currentStory = stories[0];

  return (
    <section className="py-16 bg-background-light dark:bg-background-dark">
      <div className="max-w-7xl mx-auto">
        {/* Título de la sección */}
        <div className="text-center mb-16">
          <span className="inline-block bg-primary text-white px-3 py-1 rounded text-xs md:text-sm font-bold mb-4">
            HISTORIAS DESTACADAS
          </span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-text-light dark:text-text-dark mb-8">
            CADA HISTORIA ES UNA VICTORIA
          </h1>
          <p className="text-lg text-text-light dark:text-text-dark max-w-4xl mx-auto">
            Cada historia representa una vida transformada, una familia fortalecida y una comunidad que crece. Descubre cómo nuestro trabajo conjunto está creando un futuro mejor para los niños y sus familias en Oruro.
          </p>
        </div>

        <div className="relative">
          <div className="absolute top-8 left-8 z-10">
            <span className="bg-yellow-500 text-white text-xs font-bold px-3 py-1.5 rounded-sm tracking-wider">
              HISTORIAS DESTACADAS
            </span>
          </div>
          
          <div className="w-full h-[300px] overflow-hidden">
            <Image
              alt={currentStory.imageAlt || currentStory.title}
              src={currentStory.imageUrl}
              width={1200}
              height={300}
              className="w-full h-full object-cover object-center"
            />
          </div>
          
          <div className="bg-black bg-opacity-90 dark:bg-black dark:bg-opacity-90 p-8 md:p-12">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between">
              <div className="md:w-3/5">
                <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                  {currentStory.title.toUpperCase()}
                </h1>
                <p className="text-white mt-4 text-base">
                  {currentStory.summary || 'No hay resumen disponible.'}
                </p>
              </div>
              <div className="mt-8 md:mt-0">
                <a 
                  className="inline-flex items-center border border-white text-white px-6 py-3 rounded-sm text-sm font-semibold hover:bg-white hover:text-black transition-colors" 
                  href="/historias-impacto"
                >
                  VER MÁS HISTORIAS
                  <span className="material-symbols-outlined ml-2">arrow_forward</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}