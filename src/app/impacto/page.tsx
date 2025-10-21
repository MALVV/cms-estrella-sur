'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Users,
  Heart,
  Shield,
  Globe,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';

export default function ImpactoPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Ya no necesitamos cargar datos específicos
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <SiteHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <SiteHeader />
      
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center bg-hero-impacto">
        <div className="absolute inset-0 bg-black opacity-40 dark:opacity-60"></div>
        <main className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <div className="max-w-4xl text-white text-center">
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="inline-block bg-orange-400 text-gray-900 text-sm font-bold uppercase px-4 py-2 tracking-wider rounded">
                Nuestro Impacto
              </span>
            </motion.div>
            <motion.h1 
              className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight text-white mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              NUESTRO<br/>
              IMPACTO<br/>
              SOCIAL
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Descubre nuestro trabajo integral que combina programas estratégicos, proyectos específicos y metodologías innovadoras para crear impacto social sostenible.
            </motion.p>
            <motion.div 
              className="mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <a className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-lg text-base font-bold hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl font-condensed" href="#mision">
                CONOCE NUESTRO IMPACTO
                <svg className="h-5 w-5 ml-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path clipRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" fillRule="evenodd"></path>
                </svg>
              </a>
            </motion.div>
          </div>
        </main>
      </div>

      {/* Sección Tríptico - Programas / Proyectos / Metodologías */}
      <section className="py-12 bg-background-light dark:bg-background-dark relative overflow-hidden">
        {/* Fondo decorativo sutil */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-32 h-32 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-blue-400 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-purple-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <motion.span 
              className="inline-block bg-primary text-white text-xs font-semibold px-3 py-1 rounded mb-4"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              NUESTRO IMPACTO
            </motion.span>
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-text-light dark:text-text-dark leading-tight"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              NUESTRA MISIÓN ES TRANSFORMAR VIDAS
              <br />
              A TRAVÉS DE INICIATIVAS CON IMPACTO REAL
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card Programas */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Link href="/programas" className="group">
                <div className="relative rounded-lg overflow-hidden group h-[28rem]">
                    <img
                      src="/static-images/sections/tarjeta-programas.jpg"
                      alt="Programas de Estrella del Sur"
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-yellow-300/80 to-yellow-300/0">
                    <div className="absolute top-0 right-0 p-4 transform -translate-x-2 translate-y-4">
                      <h2 className="text-white font-condensed text-5xl font-bold uppercase tracking-widest origin-bottom-right rotate-90 whitespace-nowrap">
                        PROGRAMAS
                      </h2>
                    </div>
                    <h3 className="text-white font-condensed text-2xl font-bold uppercase">Programas</h3>
                    <span className="text-white text-sm font-bold tracking-wider mt-2 underline">
                      VER PROGRAMAS
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Card Proyectos */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Link href="/proyectos" className="group">
                <div className="relative rounded-lg overflow-hidden group h-[28rem]">
                    <img
                      src="/static-images/sections/tarjeta-proyectos.jpg"
                      alt="Proyectos de Estrella del Sur"
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-emerald-400/80 to-emerald-400/0">
                    <div className="absolute top-0 right-0 p-4 transform -translate-x-2 translate-y-4">
                      <h2 className="text-white font-condensed text-5xl font-bold uppercase tracking-widest origin-bottom-right rotate-90 whitespace-nowrap">
                        PROYECTOS
                      </h2>
                    </div>
                    <h3 className="text-white font-condensed text-2xl font-bold uppercase">Proyectos</h3>
                    <span className="text-white text-sm font-bold tracking-wider mt-2 underline">
                      VER PROYECTOS
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Card Metodologías */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Link href="/iniciativas" className="group">
                <div className="relative rounded-lg overflow-hidden group h-[28rem]">
                    <img
                      src="/static-images/sections/tarjeta-metodologias.jpg"
                      alt="Iniciativas de Estrella del Sur"
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-red-400/80 to-red-400/0">
                    <div className="absolute top-0 right-0 p-4 transform -translate-x-2 translate-y-4">
                      <h2 className="text-white font-condensed text-5xl font-bold uppercase tracking-widest origin-bottom-right rotate-90 whitespace-nowrap">
                        INICIATIVAS
                      </h2>
                    </div>
                    <h3 className="text-white font-condensed text-2xl font-bold uppercase">Iniciativas</h3>
                    <span className="text-white text-sm font-bold tracking-wider mt-2 underline">
                      VER INICIATIVAS
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>


      {/* Misión y Propósito Section */}
      <section className="py-6 bg-background-light dark:bg-background-dark">
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <span className="inline-block bg-primary text-white text-xs font-semibold px-3 py-1 rounded mb-4">
                NUESTRO ENFOQUE
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-text-light dark:text-text-dark leading-tight">
                QUÉ NOS HACE DIFERENTES
              </h1>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <p className="text-text-secondary-light dark:text-text-secondary-dark text-lg">
                Nuestro enfoque integral combina experiencia local con metodologías globales probadas, creando iniciativas que transforman comunidades de manera sostenible y medible.
              </p>
            </motion.div>
          </div>
          
           <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
             <motion.div 
               className="bg-card-light dark:bg-card-dark p-8 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300"
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6, delay: 0.1 }}
               viewport={{ once: true }}
             >
               <div className="flex items-center justify-center h-16 w-16 rounded-full bg-orange-100 dark:bg-orange-900 mb-6">
                 <Heart className="h-8 w-8 text-orange-500" />
               </div>
               <h3 className="text-xl font-bold mb-3 text-text-light dark:text-text-dark">IMPACTO MEDIBLE</h3>
               <p className="text-text-secondary-light dark:text-text-secondary-dark">
                 Cada iniciativa está diseñada con indicadores claros de éxito, permitiéndonos medir y demostrar el impacto real en las vidas de los niños y sus comunidades.
               </p>
             </motion.div>
             
             <motion.div 
               className="bg-card-light dark:bg-card-dark p-8 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300"
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6, delay: 0.2 }}
               viewport={{ once: true }}
             >
               <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 mb-6">
                 <Globe className="h-8 w-8 text-green-500" />
               </div>
               <h3 className="text-xl font-bold mb-3 text-text-light dark:text-text-dark">METODOLOGÍAS GLOBALES</h3>
               <p className="text-text-secondary-light dark:text-text-secondary-dark">
                 Aplicamos metodologías probadas internacionalmente por ChildFund Alliance, adaptándolas al contexto local para maximizar la efectividad y sostenibilidad.
               </p>
             </motion.div>

             <motion.div 
               className="bg-card-light dark:bg-card-dark p-8 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300"
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6, delay: 0.3 }}
               viewport={{ once: true }}
             >
               <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900 mb-6">
                 <Users className="h-8 w-8 text-blue-500" />
               </div>
               <h3 className="text-xl font-bold mb-3 text-text-light dark:text-text-dark">ENFOQUE INTEGRAL</h3>
               <p className="text-text-secondary-light dark:text-text-secondary-dark">
                 Trabajamos con niños, familias, escuelas y comunidades de manera holística, abordando múltiples dimensiones del desarrollo para crear cambios duraderos.
               </p>
             </motion.div>

             <motion.div 
               className="bg-card-light dark:bg-card-dark p-8 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300"
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6, delay: 0.4 }}
               viewport={{ once: true }}
             >
               <div className="flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 dark:bg-purple-900 mb-6">
                 <Shield className="h-8 w-8 text-purple-500" />
               </div>
               <h3 className="text-xl font-bold mb-3 text-text-light dark:text-text-dark">SOSTENIBILIDAD</h3>
               <p className="text-text-secondary-light dark:text-text-secondary-dark">
                 Desarrollamos capacidades locales y fortalecemos sistemas comunitarios para asegurar que los beneficios continúen mucho después de que termine nuestra intervención.
               </p>
             </motion.div>
           </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-brand text-brand-foreground relative overflow-hidden">
        {/* Fondo decorativo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-yellow-200 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-orange-200 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block bg-brand/20 text-brand text-xs font-semibold px-3 py-1 rounded-full mb-4 font-condensed">
              ÚNETE A NUESTRA MISIÓN
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white dark:text-white leading-tight font-condensed">
              ¿QUIERES SER PARTE DEL CAMBIO?
            </h2>
            <p className="text-xl text-brand-foreground max-w-3xl mx-auto mt-4">
              Únete a nosotros en nuestra misión de transformar comunidades y crear un futuro mejor 
              para todos los niños. Juntos podemos hacer la diferencia.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-brand hover:bg-brand/10 font-bold font-condensed" asChild>
              <Link href="/impacto">
                CONOCE NUESTRO IMPACTO
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" className="bg-black text-white hover:bg-gray-800 font-bold font-condensed" asChild>
              <Link href="/participar">
                PARTICIPAR
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
