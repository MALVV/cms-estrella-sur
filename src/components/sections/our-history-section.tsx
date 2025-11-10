'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function OurHistorySection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94] as const
      }
    }
  };

  return (
    <>
      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        {/* Título de la sección */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-text-light dark:text-text-dark mb-8">
            DOS DÉCADAS TRANSFORMANDO VIDAS
          </h1>
          <p className="text-lg text-text-light dark:text-text-dark max-w-4xl mx-auto">
            La historia de la Organización "Estrella del Sur" se remonta al <span className="font-bold">7 de febrero de 2004</span>, cuando en una asamblea de padres de familia se tomó la decisión de fundar esta entidad con el propósito de trabajar incansablemente por el desarrollo integral de niñas y niños en las zonas periurbanas de la ciudad de Oruro.
          </p>
        </div>

        {/* Timeline */}
        <motion.div 
          className="relative max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Timeline Line */}
          <div 
            className="absolute left-1/4 top-0 w-1 bg-gray-400 dark:bg-gray-600 hidden md:block" 
            style={{ transform: 'translateX(-50%)', height: 'calc(100% + 4rem)' }}
          ></div>

          {/* 2004 */}
          <motion.div 
            className="relative md:flex md:items-start md:space-x-8 mb-16"
            variants={itemVariants}
          >
            <div className="md:w-1/4 flex-shrink-0 mb-4 md:mb-0 relative">
              <h2 className="text-5xl font-bold text-subtle-light dark:text-subtle-dark">2004</h2>
              {/* Bullet al lado derecho del año */}
              <div className="absolute right-0 top-1/2 w-6 h-6 bg-gray-400 dark:bg-gray-600 rounded-full hidden md:block shadow-lg z-10" style={{ transform: 'translateX(-1.75rem) translateY(-50%)' }}></div>
            </div>
            <div className="relative md:w-3/4 pl-8 md:pl-0">
              <div className="timeline-decorator md:hidden"></div>
              <div className="relative pl-8 md:pl-0">
                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-text-light dark:text-text-dark">FUNDACIÓN</h4>
                </div>
                <Image
                  alt="Fundación de Estrella del Sur en 2004"
                  src="/static-images/sections/2004_timeline.jpg"
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover rounded-lg shadow-md"
                />
                <p className="mt-4 text-subtle-light dark:text-subtle-dark">
                  El 7 de febrero de 2004, en una asamblea de padres de familia se fundó "Estrella del Sur" para trabajar por el desarrollo integral de niñas y niños en las zonas periurbanas de Oruro. Con el apoyo inicial de Christian Children Fund, se patrocinó a 450 niños en el distrito 5.
                </p>
              </div>
            </div>
          </motion.div>

          {/* 2010 */}
          <motion.div 
            className="relative md:flex md:items-start md:space-x-8 mb-16"
            variants={itemVariants}
          >
            <div className="md:w-1/4 flex-shrink-0 mb-4 md:mb-0 relative">
              <h2 className="text-5xl font-bold text-subtle-light dark:text-subtle-dark">2010</h2>
              {/* Bullet al lado derecho del año */}
              <div className="absolute right-0 top-1/2 w-6 h-6 bg-gray-400 dark:bg-gray-600 rounded-full hidden md:block shadow-lg z-10" style={{ transform: 'translateX(-1.75rem) translateY(-50%)' }}></div>
            </div>
            <div className="relative md:w-3/4 pl-8 md:pl-0">
              <div className="timeline-decorator md:hidden"></div>
              <div className="relative pl-8 md:pl-0">
                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-text-light dark:text-text-dark">PROYECTOS FAMILIARES</h4>
                </div>
                <Image
                  alt="Proyectos familiares Give and Love"
                  src="/static-images/sections/2010_timeline.jpg"
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover rounded-lg shadow-md"
                />
                <p className="mt-4 text-subtle-light dark:text-subtle-dark">
                  Se implementaron proyectos familiares "Give and Love" que beneficiaron a más de 100 familias con emprendimientos en comida rápida, costura industrial y tejidos en telar. Se construyó infraestructura básica en Villa Challacollo incluyendo tanque de agua y asfaltado.
                </p>
              </div>
            </div>
          </motion.div>

          {/* 2011 */}
          <motion.div 
            className="relative md:flex md:items-start md:space-x-8 mb-16"
            variants={itemVariants}
          >
            <div className="md:w-1/4 flex-shrink-0 mb-4 md:mb-0 relative">
              <h2 className="text-5xl font-bold text-subtle-light dark:text-subtle-dark">2011</h2>
              {/* Bullet al lado derecho del año */}
              <div className="absolute right-0 top-1/2 w-6 h-6 bg-gray-400 dark:bg-gray-600 rounded-full hidden md:block shadow-lg z-10" style={{ transform: 'translateX(-1.75rem) translateY(-50%)' }}></div>
            </div>
            <div className="relative md:w-3/4 pl-8 md:pl-0">
              <div className="timeline-decorator md:hidden"></div>
              <div className="relative pl-8 md:pl-0">
                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-text-light dark:text-text-dark">EXPANSIÓN TERRITORIAL</h4>
                </div>
                <Image
                  alt="Expansión de Estrella del Sur a más distritos"
                  src="/static-images/sections/2011_timeline.jpg"
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover rounded-lg shadow-md"
                />
                <p className="mt-4 text-subtle-light dark:text-subtle-dark">
                  Estrella del Sur, expandió su área de intervención hacia los distritos 1 y 4 del municipio de Oruro, incrementando así la población participante en sus programas, además de consolidando servicios de salud para las familias beneficiarias.
                </p>
              </div>
            </div>
          </motion.div>

          {/* 2019 */}
          <motion.div 
            className="relative md:flex md:items-start md:space-x-8 mb-16"
            variants={itemVariants}
          >
            <div className="md:w-1/4 flex-shrink-0 mb-4 md:mb-0 relative">
              <h2 className="text-5xl font-bold text-subtle-light dark:text-subtle-dark">2019</h2>
              {/* Bullet al lado derecho del año */}
              <div className="absolute right-0 top-1/2 w-6 h-6 bg-gray-400 dark:bg-gray-600 rounded-full hidden md:block shadow-lg z-10" style={{ transform: 'translateX(-1.75rem) translateY(-50%)' }}></div>
            </div>
            <div className="relative md:w-3/4 pl-8 md:pl-0">
              <div className="timeline-decorator md:hidden"></div>
              <div className="relative pl-8 md:pl-0">
                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-text-light dark:text-text-dark">MODELOS PROGRAMÁTICOS</h4>
                </div>
                <Image
                  alt="Modelos programáticos y prevención de violencia"
                  src="/static-images/sections/2019_timeline.jpg"
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover rounded-lg shadow-md"
                />
                <p className="mt-4 text-subtle-light dark:text-subtle-dark">
                  Se implementaron los modelos programáticos de ChildFund: Creciendo Contigo; Niñez Segura y Protegida; Me Quiero, Me Cuido; Participación Activa y Transformando Oportunidades. Estos modelos desarrollaron conocimientos, actitudes y prácticas en diversas poblaciones, con un enfoque en la protección infantil y la prevención de toda forma de violencia hacia niños y niñas.
                </p>
              </div>
            </div>
          </motion.div>

          {/* 2020 */}
          <motion.div 
            className="relative md:flex md:items-start md:space-x-8 mb-16"
            variants={itemVariants}
          >
            <div className="md:w-1/4 flex-shrink-0 mb-4 md:mb-0 relative">
              <h2 className="text-5xl font-bold text-subtle-light dark:text-subtle-dark">2020</h2>
              {/* Bullet al lado derecho del año */}
              <div className="absolute right-0 top-1/2 w-6 h-6 bg-gray-400 dark:bg-gray-600 rounded-full hidden md:block shadow-lg z-10" style={{ transform: 'translateX(-1.75rem) translateY(-50%)' }}></div>
            </div>
            <div className="relative md:w-3/4 pl-8 md:pl-0">
              <div className="timeline-decorator md:hidden"></div>
              <div className="relative pl-8 md:pl-0">
                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-text-light dark:text-text-dark">ADAPTACIÓN DIGITAL</h4>
                </div>
                <Image
                  alt="Adaptación digital durante la pandemia"
                  src="/static-images/sections/2020_timeline.jpg"
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover rounded-lg shadow-md"
                />
                <p className="mt-4 text-subtle-light dark:text-subtle-dark">
                  La llegada de la pandemia por la Covid-19, impulsó la implementación de programas alternativos a través de medios tradicionales como la radio y la televisión, así como el uso de plataformas virtuales y redes sociales, lo que permitió identificar nuevas oportunidades y formas de llegar a la población objetivo.
                </p>
              </div>
            </div>
          </motion.div>

          {/* 2024 */}
          <motion.div 
            className="relative md:flex md:items-start md:space-x-8"
            variants={itemVariants}
          >
            <div className="md:w-1/4 flex-shrink-0 mb-4 md:mb-0 relative">
              <h2 className="text-5xl font-bold text-subtle-light dark:text-subtle-dark">2024</h2>
              {/* Bullet al lado derecho del año */}
              <div className="absolute right-0 top-1/2 w-6 h-6 bg-gray-400 dark:bg-gray-600 rounded-full hidden md:block shadow-lg z-10" style={{ transform: 'translateX(-1.75rem) translateY(-50%)' }}></div>
            </div>
            <div className="relative md:w-3/4 pl-8 md:pl-0">
              <div className="timeline-decorator md:hidden"></div>
              <div className="relative pl-8 md:pl-0">
                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-text-light dark:text-text-dark">INNOVACIÓN Y PROYECTOS QUE MARCARON LA DIFERENCIA</h4>
                </div>
                <Image
                  alt="Proyectos internacionales y metodologías innovadoras"
                  src="/static-images/sections/2024_timeline.jpg"
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover rounded-lg shadow-md"
                />
                <p className="mt-4 text-subtle-light dark:text-subtle-dark">
                  Se fortalecieron capacidades en docentes y personal de salud con metodologías innovadoras como los Planes de Convivencia, además de impulsar proyectos como Jugar para Prevenir, respaldado por UEFA Foundation for Children y ChildFund, que promueve la prevención a través del fútbol con un enfoque de género.
                </p>
              </div>
            </div>
          </motion.div>

          {/* End Timeline Point */}
          <div className="relative pl-8 md:pl-0 mt-8">
          </div>
        </motion.div>
      </div>


      <style jsx>{`
        .timeline-decorator::before {
          content: '';
          position: absolute;
          left: -2.05rem; 
          top: 0.5rem;
          width: 0.5rem;
          height: 0.5rem;
          background-color: #A8A29E;
          border-radius: 9999px;
        }
        .dark .timeline-decorator::before {
          background-color: #78716C;
        }
      `}</style>
    </>
  );
}
