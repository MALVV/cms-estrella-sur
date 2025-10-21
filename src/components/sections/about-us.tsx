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
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-text-light dark:text-text-dark leading-tight font-condensed"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            ¿QUIÉNES SOMOS?
          </motion.h1>
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-stretch">
          {/* Left Section - Text Content */}
          <motion.div 
            className="space-y-8 flex flex-col justify-center"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Introductory Paragraph */}
            <motion.p 
              className="text-base text-text-light dark:text-text-dark leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Desde 2004, Estrella del Sur trabaja en Oruro fortaleciendo las capacidades de niñas, niños, adolescentes, jóvenes, mujeres y sus familias, promoviendo su bienestar y protección. Implementamos metodologías lúdicas, participativas e inclusivas, validadas y escaladas en unidades educativas y centros de salud, con la visión de expandir nuestro impacto a otras regiones del país.
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
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-subtext-light dark:text-subtext-dark leading-relaxed">
                    <span className="font-semibold text-text-light dark:text-text-dark">Protección infantil con enfoque de derechos:</span> Garantizamos el cumplimiento de los derechos fundamentales de la niñez y adolescencia, creando entornos seguros y protectores.
                  </p>
                </div>
              </motion.div>

              <motion.div 
                className="group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <div className="flex items-start space-x-3">
                  <Heart className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-subtext-light dark:text-subtext-dark leading-relaxed">
                    <span className="font-semibold text-text-light dark:text-text-dark">Prevención de la violencia en todas sus formas:</span> Desarrollamos estrategias integrales para prevenir y erradicar la violencia, promoviendo una cultura de paz y respeto.
                  </p>
                </div>
              </motion.div>

              <motion.div 
                className="group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="flex items-start space-x-3">
                  <Stethoscope className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-subtext-light dark:text-subtext-dark leading-relaxed">
                    <span className="font-semibold text-text-light dark:text-text-dark">Salud sexual integral y educación temprana:</span> Brindamos educación integral en salud sexual y reproductiva, adaptada a cada etapa del desarrollo.
                  </p>
                </div>
              </motion.div>

              <motion.div 
                className="group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="flex items-start space-x-3">
                  <TrendingUp className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-subtext-light dark:text-subtext-dark leading-relaxed">
                    <span className="font-semibold text-text-light dark:text-text-dark">Emprendimiento juvenil y empoderamiento femenino:</span> Fomentamos el desarrollo de habilidades emprendedoras y el empoderamiento económico de jóvenes y mujeres.
                  </p>
                </div>
              </motion.div>

              <motion.div 
                className="group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                viewport={{ once: true }}
              >
                <div className="flex items-start space-x-3">
                  <Users className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-subtext-light dark:text-subtext-dark leading-relaxed">
                    <span className="font-semibold text-text-light dark:text-text-dark">Transformación de roles y estereotipos de género:</span> Promovemos la igualdad de género y la transformación de roles tradicionales para construir una sociedad más justa e inclusiva.
                  </p>
                </div>
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
                   </motion.div>
          </motion.div>

          {/* Right Section - Image with Quote */}
          <motion.div 
            className="relative flex items-center"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Main Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl w-full h-full min-h-[600px]">
                     <Image 
                       alt="Niña sonriente de Estrella del Sur" 
                       className="w-full h-full object-cover"
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
