'use client'

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, FileText, Download, ArrowLeft, Upload, Link as LinkIcon, Send } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';

interface Convocatoria {
  id: string;
  title: string;
  description: string;
  image: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'upcoming' | 'closed';
  requirements: string[];
  documents: string[];
  createdAt: string;
  fullDescription: string;
  objectives: string[];
  responsibilities: string[];
  qualifications: string[];
  benefits: string[];
}

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  experience: string;
  documents: FileList | null;
  driveLink: string;
}

export default function ConvocatoriaDetailPage({ params }: { params: { id: string } }) {
  const [convocatoria, setConvocatoria] = useState<Convocatoria | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    experience: '',
    documents: null,
    driveLink: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Simular carga de datos - en producción vendría de la API
    const mockConvocatorias: Convocatoria[] = [
      {
        id: '1',
        title: 'Consultoría en Desarrollo de Capacidades Comunitarias',
        description: 'Buscamos un/a consultor/a especializado/a en desarrollo de capacidades comunitarias para fortalecer las organizaciones locales en el área rural.',
        image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        startDate: '2024-01-15',
        endDate: '2024-12-31',
        status: 'active',
        requirements: [
          'Experiencia mínima de 5 años en desarrollo comunitario',
          'Título universitario en áreas afines',
          'Experiencia en zonas rurales',
          'Disponibilidad para viajar'
        ],
        documents: ['TDR_Consultoria_Desarrollo_Comunitario.pdf'],
        createdAt: '2024-01-10',
        fullDescription: 'Esta consultoría tiene como objetivo principal fortalecer las capacidades de las organizaciones comunitarias en el área rural, mediante la implementación de metodologías participativas y el desarrollo de herramientas de gestión. El/la consultor/a trabajará directamente con las comunidades para identificar sus necesidades y desarrollar estrategias de fortalecimiento institucional.',
        objectives: [
          'Fortalecer las capacidades organizacionales de las comunidades',
          'Desarrollar herramientas de gestión participativa',
          'Implementar metodologías de desarrollo comunitario',
          'Capacitar a líderes locales en gestión de proyectos'
        ],
        responsibilities: [
          'Realizar diagnóstico participativo de las organizaciones',
          'Diseñar e implementar planes de fortalecimiento',
          'Capacitar a líderes comunitarios',
          'Elaborar informes de seguimiento y evaluación'
        ],
        qualifications: [
          'Título universitario en Desarrollo Rural, Sociología, Antropología o afín',
          'Experiencia mínima de 5 años en desarrollo comunitario',
          'Conocimiento en metodologías participativas',
          'Experiencia en zonas rurales de Bolivia',
          'Disponibilidad para viajar al interior del país'
        ],
        benefits: [
          'Remuneración competitiva según experiencia',
          'Cobertura de gastos de transporte y estadía',
          'Seguro de salud durante la consultoría',
          'Acceso a materiales y recursos de trabajo'
        ]
      }
    ];

    setTimeout(() => {
      const found = mockConvocatorias.find(c => c.id === params.id);
      setConvocatoria(found || null);
      setLoading(false);
    }, 1000);
  }, [params.id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Activa</Badge>;
      case 'upcoming':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Próxima</Badge>;
      case 'closed':
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">Cerrada</Badge>;
      default:
        return null;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
      alert('¡Postulación enviada exitosamente! Te contactaremos pronto.');
      setIsSubmitting(false);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <SiteHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              </div>
            </div>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (!convocatoria) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <SiteHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-text-light dark:text-text-dark mb-4">
              Convocatoria no encontrada
            </h1>
            <Link href="/convocatorias">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a Convocatorias
              </Button>
            </Link>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <SiteHeader />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href="/convocatorias" className="text-primary hover:text-primary/80 flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver a Convocatorias
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contenido Principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold text-text-light dark:text-text-dark mb-4">
                    {convocatoria.title}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Publicado: {formatDate(convocatoria.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Vigencia hasta: {formatDate(convocatoria.endDate)}</span>
                    </div>
                  </div>
                </div>
                <div>
                  {getStatusBadge(convocatoria.status)}
                </div>
              </div>
            </div>

            {/* Imagen */}
            <div className="relative h-64 md:h-80 rounded-lg overflow-hidden">
              <Image
                src={convocatoria.image}
                alt={convocatoria.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Descripción Completa */}
            <Card>
              <CardHeader>
                <CardTitle>Descripción del Proyecto</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
                  {convocatoria.fullDescription}
                </p>
              </CardContent>
            </Card>

            {/* Objetivos */}
            <Card>
              <CardHeader>
                <CardTitle>Objetivos</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {convocatoria.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-text-secondary-light dark:text-text-secondary-dark">
                        {objective}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Responsabilidades */}
            <Card>
              <CardHeader>
                <CardTitle>Responsabilidades</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {convocatoria.responsibilities.map((responsibility, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-text-secondary-light dark:text-text-secondary-dark">
                        {responsibility}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Requisitos */}
            <Card>
              <CardHeader>
                <CardTitle>Requisitos</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {convocatoria.qualifications.map((requirement, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-text-secondary-light dark:text-text-secondary-dark">
                        {requirement}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Beneficios */}
            <Card>
              <CardHeader>
                <CardTitle>Beneficios</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {convocatoria.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-text-secondary-light dark:text-text-secondary-dark">
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Documentos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Documentos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {convocatoria.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">{doc}</span>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Formulario de Postulación */}
            <Card>
              <CardHeader>
                <CardTitle>Formulario de Postulación</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
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

                  <div>
                    <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                      Breve Descripción de su Experiencia *
                    </label>
                    <textarea
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      placeholder="Describe tu experiencia relevante..."
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                      Adjuntar Documentos
                    </label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <input
                        type="file"
                        name="documents"
                        onChange={handleFileChange}
                        multiple
                        accept=".xlsx,.docx,.pdf,.rar"
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                          Haz clic para subir archivos
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          .xlsx, .docx, .pdf, .rar
                        </p>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                      Enlace de Google Drive (Opcional)
                    </label>
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="url"
                        name="driveLink"
                        value={formData.driveLink}
                        onChange={handleInputChange}
                        placeholder="https://drive.google.com/..."
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Enviar Postulación
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <SiteFooter />
    </div>
  );
}
