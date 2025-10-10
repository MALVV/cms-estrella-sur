'use client'

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Target, Users, Calendar, DollarSign, ExternalLink, ArrowRight, Share2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';

interface Project {
  id: string;
  title: string;
  context: string;
  objectives: string;
  content: string;
  executionStart: string;
  executionEnd: string;
  imageUrl?: string;
  imageAlt?: string;
  isFeatured: boolean;
}

export default function DonarPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/public/projects?featured=true&limit=3');
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        }
      } catch (error) {
        console.error('Error al cargar proyectos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long'
    });
  };

  const donationAmounts = [50, 100, 200, 500, 1000];

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <SiteHeader />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-20">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Contenido de texto */}
              <div className="text-center lg:text-left">
                <Badge className="bg-primary text-white px-4 py-2 text-sm font-bold uppercase tracking-wider rounded-sm mb-6">
                  <Heart className="mr-2 h-4 w-4" />
                  DONACIONES
                </Badge>
                
                <h1 className="text-4xl md:text-6xl font-black text-text-light dark:text-text-dark leading-tight mb-6">
                  Transforma Vidas
                  <br />
                  <span className="text-primary">Con Tu Apoyo</span>
                </h1>
                
                <p className="text-xl text-text-secondary-light dark:text-text-secondary-dark mb-8 leading-relaxed">
                  Tu donación hace posible que continuemos con nuestros proyectos de impacto social, 
                  educativos y comunitarios. Cada contribución marca la diferencia en las vidas de 
                  cientos de personas.
                </p>

                {/* Botones de acción */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button size="lg" className="text-lg py-6">
                    <Heart className="mr-2 h-5 w-5" />
                    Donar Ahora
                  </Button>
                  <Button variant="outline" size="lg" className="text-lg py-6">
                    <Share2 className="mr-2 h-5 w-5" />
                    Compartir
                  </Button>
                </div>
              </div>

              {/* Imagen */}
              <div className="relative">
                <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    alt="Niños felices recibiendo ayuda educativa"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                </div>
                
                {/* Elementos decorativos */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-xl"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Meta de Recaudación Section */}
        <section className="mb-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-text-light dark:text-text-dark mb-4">
                Meta de Recaudación 2024
              </h2>
              <p className="text-lg text-text-secondary-light dark:text-text-secondary-dark">
                Ayúdanos a alcanzar nuestra meta anual para continuar transformando vidas
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-8 border border-primary/20">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-bold text-text-light dark:text-text-dark">
                    Recaudado: $45,250
                  </span>
                  <span className="text-xl font-bold text-text-light dark:text-text-dark">
                    Meta: $75,000
                  </span>
                </div>
                
                {/* Barra de progreso */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-6 mb-3">
                  <div 
                    className="bg-gradient-to-r from-primary to-primary/80 h-6 rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-3"
                    style={{ width: '60.3%' }}
                  >
                    <span className="text-sm font-bold text-white">60.3%</span>
                  </div>
                </div>
                
                <div className="text-center text-base text-text-secondary-light dark:text-text-secondary-dark">
                  Faltan $29,750 para alcanzar la meta
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center gap-6">
                <div className="flex items-center gap-3 text-text-secondary-light dark:text-text-secondary-dark">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-medium">+500 beneficiarios</span>
                </div>
                <div className="flex items-center gap-3 text-text-secondary-light dark:text-text-secondary-dark">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-medium">3 proyectos activos</span>
                </div>
                <div className="flex items-center gap-3 text-text-secondary-light dark:text-text-secondary-dark">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-medium">8 años de experiencia</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Proyectos que necesitan apoyo */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-light dark:text-text-dark mb-4">
              Proyectos que Necesitan Tu Apoyo
            </h2>
            <p className="text-lg text-text-secondary-light dark:text-text-secondary-dark max-w-2xl mx-auto">
              Conoce nuestros proyectos destacados y elige cuál deseas apoyar directamente
            </p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-t-lg"></div>
                  <CardContent className="p-6">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  {project.imageUrl && (
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={project.imageUrl}
                        alt={project.imageAlt || project.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      <Badge className="absolute top-4 right-4 bg-primary text-white">
                        Destacado
                      </Badge>
                    </div>
                  )}
                  
                  <CardContent className="p-6">
                    <CardTitle className="text-xl font-bold text-text-light dark:text-text-dark mb-3 line-clamp-2">
                      {project.title}
                    </CardTitle>
                    
                    <p className="text-text-secondary-light dark:text-text-secondary-dark mb-4 line-clamp-3">
                      {project.context.substring(0, 150)}...
                    </p>
                    
                    <div className="flex items-center gap-2 text-sm text-text-secondary-light dark:text-text-secondary-dark mb-4">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(project.executionStart)} - {formatDate(project.executionEnd)}</span>
                    </div>

                    {/* Progreso individual del proyecto */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
                       <div className="text-center mb-3">
                         <h4 className="text-sm font-semibold text-text-light dark:text-text-dark mb-1">
                           Meta de Recaudación
                         </h4>
                       </div>
                      
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-bold text-text-light dark:text-text-dark">
                          Recaudado: ${Math.floor(Math.random() * 15000) + 5000}
                        </span>
                        <span className="text-sm font-bold text-text-light dark:text-text-dark">
                          Meta: ${Math.floor(Math.random() * 20000) + 20000}
                        </span>
                      </div>
                      
                      {/* Barra de progreso del proyecto */}
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
                        <div 
                          className="bg-gradient-to-r from-primary to-primary/80 h-3 rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-2"
                          style={{ width: `${Math.floor(Math.random() * 60) + 20}%` }}
                        >
                          <span className="text-xs font-bold text-white">
                            {Math.floor(Math.random() * 60) + 20}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-center text-xs text-text-secondary-light dark:text-text-secondary-dark">
                        Faltan ${Math.floor(Math.random() * 10000) + 5000} para completar la meta
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Button className="w-full" asChild>
                        <Link href={`/donar/${project.id}`}>
                          Ver Detalles del Proyecto
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                      
                       <Button variant="outline" className="w-full" asChild>
                         <Link href={`/donar/${project.id}`}>
                           <Heart className="mr-2 h-4 w-4" />
                           Donar a este Proyecto
                         </Link>
                       </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Donación General */}
        <section className="mb-20">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-text-light dark:text-text-dark mb-4">
                Donación General
              </h2>
              <p className="text-lg text-text-secondary-light dark:text-text-secondary-dark max-w-2xl mx-auto">
                Apoya nuestra misión general y permite que destinemos los fondos donde más se necesiten
              </p>
            </div>
            
            <Card className="shadow-lg border-0 bg-card-light dark:bg-card-dark">
              <CardContent className="p-8">
               {/* Formulario de Donación General */}
               <div>
                 {/* Información importante */}
                 <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                   <p className="text-sm text-blue-800 dark:text-blue-200">
                     <strong>Importante:</strong> Completa este formulario antes de proceder con el pago. 
                     Una vez recibida la transferencia, te contactaremos para enviarte tu recibo digital.
                   </p>
                 </div>

                 <div className="grid md:grid-cols-2 gap-6 mt-0">
                   {/* Columna izquierda */}
                   <div className="space-y-4">
                     {/* Nombre Completo */}
                     <div>
                       <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                         Nombre Completo *
                       </label>
                       <input
                         type="text"
                         placeholder="Tu nombre completo"
                         className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-transparent"
                         required
                       />
                     </div>

                     {/* Correo Electrónico */}
                     <div>
                       <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                         Correo Electrónico *
                       </label>
                       <input
                         type="email"
                         placeholder="tu@email.com"
                         className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-transparent"
                         required
                       />
                     </div>

                     {/* Domicilio */}
                     <div>
                       <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                         Domicilio *
                       </label>
                       <input
                         type="text"
                         placeholder="Tu dirección"
                         className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-transparent"
                         required
                       />
                     </div>

                     {/* Teléfono de Contacto */}
                     <div>
                       <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                         Teléfono de Contacto *
                       </label>
                       <input
                         type="tel"
                         placeholder="+591 ..."
                         className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-transparent"
                         required
                       />
                     </div>
                   </div>

                   {/* Columna derecha */}
                   <div className="space-y-4">
                     {/* Monto de Donación */}
                     <div>
                       <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                         Monto de Donación (Bs.) *
                       </label>
                       <div className="relative">
                         <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary-light dark:text-text-secondary-dark" />
                         <input
                           type="number"
                           placeholder="100"
                           className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-transparent"
                           required
                         />
                       </div>
                     </div>

                     {/* Tipo de Donación */}
                     <div>
                       <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                         Tipo de Donación *
                       </label>
                       <select
                         className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-transparent"
                         required
                       >
                         <option value="">Selecciona el tipo</option>
                         <option value="general">Donación General</option>
                         <option value="emergencia">Fondo de Emergencia</option>
                         <option value="especifico">Proyecto Específico</option>
                         <option value="mensual">Donación Mensual</option>
                       </select>
                     </div>

                     {/* Mensaje adicional */}
                     <div>
                       <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                         Mensaje (Opcional)
                       </label>
                       <textarea
                         placeholder="Deja un mensaje de apoyo..."
                         rows={3}
                         className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                       />
                     </div>
                   </div>
                 </div>

                 {/* Montos Sugeridos al final */}
                 <div className="mt-6">
                   <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-3">
                     Montos Sugeridos
                   </label>
                   <div className="grid grid-cols-5 gap-3">
                     {donationAmounts.map((amount) => (
                       <Button
                         key={amount}
                         variant="outline"
                         size="sm"
                         className="h-12"
                         onClick={() => {
                           const input = document.querySelector('input[type="number"]') as HTMLInputElement;
                           if (input) input.value = amount.toString();
                         }}
                       >
                         <DollarSign className="mr-1 h-4 w-4" />
                         {amount}
                       </Button>
                     ))}
                   </div>
                 </div>
               </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button size="lg" className="w-full text-lg py-6">
                  <Heart className="mr-2 h-5 w-5" />
                  Proceder con la Donación
                </Button>
                
                <p className="text-center text-sm text-text-secondary-light dark:text-text-secondary-dark mt-4">
                  Procesamiento seguro • Recibo fiscal disponible • Transparencia total
                </p>
              </div>
              </CardContent>
            </Card>
          </div>
        </section>

      </main>

      <SiteFooter />
    </div>
  );
}
