'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Send, Users, Heart, Calendar, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  age: string;
  occupation: string;
  areaOfInterest: string;
  availability: string;
  motivation: string;
  experience: string;
  documents: FileList | null;
  driveLink: string;
  acceptPolicies: boolean;
}

const areasOfInterest = [
  {
    name: 'Educación y Desarrollo Infantil',
    description: 'Contribuye al desarrollo educativo de niños y niñas en comunidades vulnerables. Incluye apoyo escolar, actividades recreativas, desarrollo de habilidades y acompañamiento pedagógico.',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Salud Comunitaria',
    description: 'Participa en programas de promoción de la salud, prevención de enfermedades y atención básica en comunidades rurales y urbanas. Incluye campañas de salud, educación sanitaria y apoyo en centros de salud.',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Desarrollo Rural y Medio Ambiente',
    description: 'Colabora en proyectos de desarrollo sostenible, conservación ambiental, agricultura familiar y fortalecimiento comunitario. Incluye reforestación, agricultura orgánica, gestión de recursos naturales y desarrollo de capacidades locales.',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }
];

const interventionAreas = [
  {
    name: 'Área de Patrocinio',
    description: 'Fortalece la conexión con beneficiarios y optimiza procesos internos.',
    careers: ['Secretariado', 'Sociología', 'Ingeniería de Sistemas'],
    activities: [
      'Digitalización y archivo de documentos',
      'Simplificación de procesos manuales',
      'Gestión de información en sistemas digitales'
    ],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }
];

const availabilityOptions = [
  'Tiempo completo (40+ horas/semana)',
  'Tiempo parcial (20-40 horas/semana)',
  'Fines de semana',
  'Vacaciones de verano',
  'Vacaciones de invierno',
  'Flexible según proyecto'
];

export default function VoluntariadosPage() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    age: '',
    occupation: '',
    areaOfInterest: '',
    availability: '',
    motivation: '',
    experience: '',
    documents: null,
    driveLink: '',
    acceptPolicies: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      documents: e.target.files
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simular envío del formulario
    setTimeout(() => {
      alert('¡Solicitud de voluntariado enviada exitosamente! Te contactaremos pronto para coordinar tu participación.');
      setIsSubmitting(false);
      // Resetear formulario
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        age: '',
        occupation: '',
        areaOfInterest: '',
        availability: '',
        motivation: '',
        experience: '',
        documents: null,
        driveLink: '',
        acceptPolicies: false
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <SiteHeader />
      
      {/* Hero Section */}
      <div className="relative h-[calc(100vh-80px)] flex items-center bg-hero">
        <div className="absolute inset-0 bg-black opacity-40 dark:opacity-60"></div>
        <main className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <div className="max-w-2xl text-white text-center">
            <div className="mb-4">
              <span className="inline-block bg-orange-400 text-gray-900 text-xs font-bold uppercase px-3 py-1 tracking-wider">
                Voluntariado
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-white">
              ÚNETE COMO<br/>
              VOLUNTARIO<br/>
              SOCIAL
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-200 max-w-3xl mx-auto">
              Forma parte de nuestro equipo de voluntarios y contribuye al desarrollo social de Bolivia. 
              Tu tiempo y dedicación pueden marcar la diferencia en las vidas de muchas personas.
            </p>
            <div className="mt-8">
              <a className="inline-flex items-center bg-primary text-white text-sm font-bold py-3 px-6 rounded-sm hover:bg-opacity-90 transition-colors duration-300" href="#formulario">
                APLICAR COMO VOLUNTARIO
                <svg className="h-5 w-5 ml-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path clipRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" fillRule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>
        </main>
      </div>

      <main className="container mx-auto px-4 py-8">

        {/* Áreas de Interés */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-light dark:text-text-dark mb-4">
              Áreas de Participación
            </h2>
            <p className="text-lg text-text-secondary-light dark:text-text-secondary-dark max-w-2xl mx-auto">
              Selecciona el área donde te gustaría contribuir con tu tiempo y habilidades
            </p>
          </div>

          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
            {areasOfInterest.map((area, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 border-0 shadow-md overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={area.image}
                    alt={area.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-text-light dark:text-text-dark">
                      {area.name}
                    </h3>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
                      {area.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Áreas de Intervención */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-light dark:text-text-dark mb-4">
              Áreas de Intervención
            </h2>
            <p className="text-lg text-text-secondary-light dark:text-text-secondary-dark max-w-2xl mx-auto">
              Oportunidades específicas para estudiantes y profesionales en áreas técnicas
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {interventionAreas.map((area, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 border-0 shadow-md overflow-hidden mb-8">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative h-64 md:h-auto">
                    <Image
                      src={area.image}
                      alt={area.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-bold text-2xl text-text-light dark:text-text-dark mb-3">
                          {area.name}
                        </h3>
                        <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
                          {area.description}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-lg text-text-light dark:text-text-dark mb-3">
                          Carreras Requeridas:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {area.careers.map((career, careerIndex) => (
                            <span 
                              key={careerIndex}
                              className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                            >
                              {career}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-lg text-text-light dark:text-text-dark mb-3">
                          Actividades Principales:
                        </h4>
                        <ul className="space-y-2">
                          {area.activities.map((activity, activityIndex) => (
                            <li key={activityIndex} className="flex items-start gap-3">
                              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-text-secondary-light dark:text-text-secondary-dark">
                                {activity}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Beneficios y Acompañamiento */}
        <section className="py-6 bg-background-light dark:bg-background-dark">
          <div className="container mx-auto px-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block bg-primary text-white text-xs font-semibold px-3 py-1 rounded mb-4">
                  BENEFICIOS Y ACOMPAÑAMIENTO
                </span>
                <h1 className="text-4xl md:text-5xl font-bold text-text-light dark:text-text-dark leading-tight">
                  QUÉ OBTIENES COMO VOLUNTARIO
                </h1>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  Te ofrecemos un programa integral de desarrollo y apoyo durante tu experiencia como voluntario, con beneficios únicos que potencian tu crecimiento personal y profesional.
                </p>
              </div>
            </div>
          
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-card-light dark:bg-card-dark p-8 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-orange-100 dark:bg-orange-900 mb-6">
                  <Users className="h-8 w-8 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-text-light dark:text-text-dark">SUPERVISIÓN</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Supervisión especializada y acompañamiento continuo por parte de nuestro equipo de profesionales experimentados.
                </p>
              </div>
              
              <div className="bg-card-light dark:bg-card-dark p-8 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 mb-6">
                  <Calendar className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-text-light dark:text-text-dark">CAPACITACIÓN</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Inducción institucional y capacitación completa en salvaguarda y protocolos institucionales.
                </p>
              </div>
              
              <div className="bg-card-light dark:bg-card-dark p-8 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900 mb-6">
                  <Heart className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-text-light dark:text-text-dark">FORMACIÓN</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Formación continua para tu desarrollo profesional y personal a través de talleres y experiencias prácticas.
                </p>
              </div>
              
              <div className="bg-card-light dark:bg-card-dark p-8 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 dark:bg-purple-900 mb-6">
                  <Clock className="h-8 w-8 text-purple-500" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-text-light dark:text-text-dark">OPORTUNIDADES</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Oportunidades remuneradas en consultorías de campaña y proyectos especiales con compensación económica.
                </p>
              </div>
              
              <div className="bg-card-light dark:bg-card-dark p-8 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900 mb-6">
                  <Users className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-text-light dark:text-text-dark">COLABORACIÓN</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Ambiente colaborativo y de apoyo mutuo con trabajo en equipo y respeto constante.
                </p>
              </div>
              
              <div className="bg-card-light dark:bg-card-dark p-8 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 dark:bg-yellow-900 mb-6">
                  <Heart className="h-8 w-8 text-yellow-500" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-text-light dark:text-text-dark">CERTIFICACIÓN</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Certificación y carta de referencia oficial al finalizar tu período de voluntariado.
                </p>
              </div>
            </div>

            {/* Duración y Horarios */}
            <div className="mt-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                  <span className="inline-block bg-primary text-white text-xs font-semibold px-3 py-1 rounded mb-4">
                    COMPROMISO REQUERIDO
                  </span>
                  <h2 className="text-4xl md:text-5xl font-bold text-text-light dark:text-text-dark leading-tight">
                    DURACIÓN Y HORARIOS
                  </h2>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-300 text-lg">
                    Un compromiso mínimo que te permitirá desarrollar habilidades significativas mientras contribuyes al cambio social.
                  </p>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
                <div className="bg-card-light dark:bg-card-dark p-8 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 text-center">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-orange-100 dark:bg-orange-900 mb-6 mx-auto">
                    <Calendar className="h-8 w-8 text-orange-500" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-text-light dark:text-text-dark">6 MESES</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Compromiso mínimo de participación para desarrollar habilidades significativas.
                  </p>
                </div>
                
                <div className="bg-card-light dark:bg-card-dark p-8 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 text-center">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 mb-6 mx-auto">
                    <Clock className="h-8 w-8 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-text-light dark:text-text-dark">20-30 HORAS</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Por semana de dedicación, flexible según tu disponibilidad y proyecto asignado.
                  </p>
                </div>
                
                <div className="bg-card-light dark:bg-card-dark p-8 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 text-center">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900 mb-6 mx-auto">
                    <Users className="h-8 w-8 text-blue-500" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-text-light dark:text-text-dark">PRESENCIAL</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Trabajo presencial en Oruro para una experiencia directa con las comunidades.
                  </p>
                </div>
              </div>
            </div>

            {/* Ubicación */}
            <div className="mt-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                  <span className="inline-block bg-primary text-white text-xs font-semibold px-3 py-1 rounded mb-4">
                    UBICACIÓN DE TRABAJO
                  </span>
                  <h2 className="text-4xl md:text-5xl font-bold text-text-light dark:text-text-dark leading-tight">
                    NOS ENCUENTRAS EN
                  </h2>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-300 text-lg">
                    Trabajamos en múltiples ubicaciones estratégicas de la ciudad para maximizar nuestro impacto y llegar a más comunidades.
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <div className="bg-card-light dark:bg-card-dark p-8 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 text-center">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/20 mb-6 mx-auto">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-text-light dark:text-text-dark">
                    DISTINTAS ZONAS DE LA CIUDAD
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Ubicaciones estratégicas que nos permiten llegar a más comunidades y maximizar nuestro impacto social.
                  </p>
                  <Link href="/nosotros#mapa-interactivo" className="inline-flex items-center gap-3 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors cursor-pointer">
                    <Users className="h-5 w-5" />
                    Ver mapa de intervención
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Formulario de Solicitud */}
        <section className="max-w-4xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl md:text-3xl font-bold text-text-light dark:text-text-dark">
                Formulario de Solicitud de Voluntariado
              </CardTitle>
              <p className="text-text-secondary-light dark:text-text-secondary-dark mt-2">
                Completa el formulario para iniciar tu proceso de voluntariado con nosotros
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Información Personal */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-text-light dark:text-text-dark border-b border-gray-200 dark:border-gray-700 pb-2">
                    Información Personal
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Tu nombre completo"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                        Edad *
                      </label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        placeholder="Tu edad"
                        min="16"
                        max="80"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                        Correo Electrónico *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="tu@email.com"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                        Teléfono de Contacto *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+591 ..."
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                      Ocupación/Profesión *
                    </label>
                    <input
                      type="text"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleInputChange}
                      placeholder="Estudiante, Profesional, Empleado, etc."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Información de Voluntariado */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-text-light dark:text-text-dark border-b border-gray-200 dark:border-gray-700 pb-2">
                    Información de Voluntariado
                  </h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                        Área de Interés *
                      </label>
                      <select
                        name="areaOfInterest"
                        value={formData.areaOfInterest}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      >
                        <option value="">Selecciona un área</option>
                        {areasOfInterest.map((area, index) => (
                          <option key={index} value={area.name}>{area.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                        Disponibilidad *
                      </label>
                      <select
                        name="availability"
                        value={formData.availability}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      >
                        <option value="">Selecciona tu disponibilidad</option>
                        {availabilityOptions.map((option, index) => (
                          <option key={index} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                      ¿Por qué quieres ser voluntario/a? *
                    </label>
                    <textarea
                      name="motivation"
                      value={formData.motivation}
                      onChange={handleInputChange}
                      placeholder="Cuéntanos qué te motiva a ser voluntario/a y qué esperas lograr..."
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                      Experiencia Relevante
                    </label>
                    <textarea
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      placeholder="Describe cualquier experiencia previa en voluntariado, trabajo social, o habilidades relevantes..."
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    />
                  </div>
                </div>

                {/* Documentos */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-text-light dark:text-text-dark border-b border-gray-200 dark:border-gray-700 pb-2">
                    Documentos (Opcional)
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                      Adjuntar Documentos
                    </label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <input
                        type="file"
                        name="documents"
                        onChange={handleFileChange}
                        multiple
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                          Haz clic para subir archivos
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          CV, certificados, cartas de recomendación, etc.
                        </p>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                      Enlace de Google Drive (Opcional)
                    </label>
                    <input
                      type="url"
                      name="driveLink"
                      value={formData.driveLink}
                      onChange={handleInputChange}
                      placeholder="https://drive.google.com/..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Políticas */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      name="acceptPolicies"
                      checked={formData.acceptPolicies}
                      onChange={handleInputChange}
                      className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-600 rounded"
                      required
                    />
                    <label className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                      Declaro que reconozco las políticas de voluntariado de la organización, 
                      incluyendo el código de conducta, políticas de confidencialidad y 
                      procedimientos de seguridad. Acepto participar de manera responsable 
                      y comprometida con los valores y objetivos de la institución. *
                    </label>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full py-3 text-lg" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Enviando Solicitud...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Enviar Solicitud de Voluntariado
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>

        {/* Información Adicional */}
        <section className="mt-16 max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8">
              <div className="text-center">
                <h3 className="text-xl font-bold text-text-light dark:text-text-dark mb-4">
                  ¿Qué esperar después de enviar tu solicitud?
                </h3>
                <div className="grid md:grid-cols-3 gap-6 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">1</div>
                    <span className="font-medium">Revisión de tu solicitud</span>
                    <span>Evaluaremos tu perfil y motivación</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">2</div>
                    <span className="font-medium">Entrevista personal</span>
                    <span>Conoceremos mejor tus expectativas</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">3</div>
                    <span className="font-medium">Inicio de actividades</span>
                    <span>Te integraremos a nuestros proyectos</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
      
      <SiteFooter />
    </div>
  );
}
