'use client'

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, Users, Award, Globe, Handshake, Star, TrendingUp, Shield, Stethoscope, GraduationCap, Smile } from 'lucide-react';

export const AboutUs: React.FC = () => {
  return (
    <section className="bg-background-light dark:bg-background-dark relative overflow-hidden">
      {/* Fondo decorativo sutil */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-blue-400 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-purple-400 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 pt-16 md:pt-24 pb-16 md:pb-24 w-full max-w-7xl relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span 
            className="bg-accent-green text-primary px-3 py-1 rounded-full text-xs md:text-sm font-bold"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            QUIÉNES SOMOS
          </motion.span>
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mt-4 md:mt-6 text-text-light dark:text-text-dark leading-tight font-condensed"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            ESTRELLA DEL SUR
          </motion.h1>
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Section - Text Content */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Introductory Paragraph */}
            <motion.p 
              className="text-lg text-text-light dark:text-text-dark leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Trabajamos con bebés, niños y jóvenes en sus familias, escuelas y comunidades para asegurar que crezcan sanos y felices, con acceso a educación, salud y bienestar.
            </motion.p>

            {/* Key Initiatives */}
            <div className="space-y-6">
                     <motion.div 
                       className="group"
                       initial={{ opacity: 0, y: 20 }}
                       whileInView={{ opacity: 1, y: 0 }}
                       transition={{ duration: 0.6, delay: 0.3 }}
                       viewport={{ once: true }}
                     >
                       <div className="flex items-center space-x-3 mb-3">
                         <Heart className="h-6 w-6 text-red-600" />
                         <h3 className="text-xl font-bold text-text-light dark:text-text-dark group-hover:text-primary transition-colors">
                           CUIDADO EXTRAORDINARIO
                         </h3>
          </div>
                       <p className="text-base text-subtext-light dark:text-subtext-dark leading-relaxed">
                         Brindamos atención especializada a niños con condiciones serias o limitantes, proporcionando apoyo integral para toda la familia, desde el primer diagnóstico y durante todo el tiempo que sea necesario.
                       </p>
                     </motion.div>

              <motion.div 
                className="group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <GraduationCap className="h-6 w-6 text-green-600" />
                  <h3 className="text-xl font-bold text-text-light dark:text-text-dark group-hover:text-primary transition-colors">
                    CREAR MÁS OPORTUNIDADES PARA LOS NIÑOS
                  </h3>
                </div>
                <p className="text-base text-subtext-light dark:text-subtext-dark leading-relaxed">
                  Desarrollamos programas educativos, de salud y desarrollo que abren nuevas posibilidades para el crecimiento integral de cada niño y niña en nuestras comunidades.
                </p>
              </motion.div>

              <motion.div 
                className="group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <Smile className="h-6 w-6 text-yellow-600" />
                  <h3 className="text-xl font-bold text-text-light dark:text-text-dark group-hover:text-primary transition-colors">
                    DAR FELICIDAD A LOS NIÑOS
                  </h3>
                </div>
                <p className="text-base text-subtext-light dark:text-subtext-dark leading-relaxed">
                  A través de actividades lúdicas, programas recreativos y apoyo emocional, creamos momentos de alegría y esperanza en la vida de cada niño que atendemos.
                </p>
              </motion.div>
              </div>
              
                   {/* Call to Action */}
                   <motion.div 
                     className="space-y-4 pt-2"
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.6, delay: 0.6 }}
                     viewport={{ once: true }}
                   >
                     {/* Botón de Donación */}
                     <div className="flex flex-col sm:flex-row gap-4">
                       <a 
                         href="/donar" 
                         className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl font-condensed"
                       >
                         DONAR AHORA
                         <Heart className="ml-2 h-4 w-4 fill-current" />
                       </a>
                       
                       <a 
                         href="/contacto" 
                         className="inline-flex items-center justify-center bg-card-light dark:bg-card-dark hover:bg-card-light/90 dark:hover:bg-card-dark/90 text-text-light dark:text-text-dark border border-border-light dark:border-border-dark px-6 py-3 rounded-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl font-condensed"
                       >
                         CONTACTAR
                       </a>
                </div>
                     
                     <p className="text-sm text-subtext-light dark:text-subtext-dark">
                       ¿Necesitas ayuda? <a href="/contacto" className="underline hover:text-primary transition-colors">Encuentra una Agencia Local de Caridad</a>.
                     </p>
                   </motion.div>
          </motion.div>

          {/* Right Section - Image with Quote */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Main Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                     <Image 
                       alt="Niña sonriente de Estrella del Sur" 
                       className="w-full h-[600px] lg:h-[700px] object-cover"
                       src="https://images.pexels.com/photos/9037236/pexels-photo-9037236.jpeg"
                       width={600}
                       height={700}
                     />
              
              {/* Quote Box Overlay */}
              <motion.div 
                className="absolute bottom-6 right-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 max-w-sm shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                viewport={{ once: true }}
              >
                <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed mb-4 italic">
                  "Creemos en empoderar y equipar a líderes locales. Ayudamos a personas que ayudan a personas."
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-primary overflow-hidden">
                    <Image 
                      alt="Fundadora de Estrella del Sur"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0DKGKMYw36YxwT9YsJXl1eVtdB-GCWJZ_4WjzDxUdML2vGmj6xbZ9_DwGHVQvh1D0lRny2Gki7pbHQWxUau_Inz0RHWtE6GevDh5_mykpglJ_LQSgxeGtCVCdHkXj_urWqkI8DkcmEH4EBrDXR-5153a4nN5xOuPvOr4Vs2y0Ii2HOYhPTuOpXEheDFlaSvA3XCpWfhe04uSO1aOu70z8qif64ppIm4lQWU2hWjlhHF-fSMDaXrbvE9MC_5dHxtbxBKygXs0JoO0"
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                </div>
                <div>
                    <p className="text-gray-800 dark:text-gray-200 font-semibold text-sm">María González</p>
                    <p className="text-gray-600 dark:text-gray-400 text-xs">Fundadora</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
