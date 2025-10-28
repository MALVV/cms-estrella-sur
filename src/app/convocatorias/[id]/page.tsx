'use client'

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ArrowLeft, Upload, Link as LinkIcon, Send } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { toast } from 'sonner';

interface Convocatoria {
  id: string;
  title: string;
  description: string;
  image: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'upcoming' | 'closed';
  requirements: any; // JSON field
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
  acceptPolicies: boolean;
}

export default function ConvocatoriaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [convocatoria, setConvocatoria] = useState<Convocatoria | null>(null);
  const [loading, setLoading] = useState(true);
  const [convocatoriaId, setConvocatoriaId] = useState<string>('');
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    experience: '',
    documents: null,
    driveLink: '',
    acceptPolicies: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setConvocatoriaId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (!convocatoriaId) return;
    
    const fetchConvocatoria = async () => {
      try {
        const response = await fetch(`/api/public/convocatorias/${convocatoriaId}`);
        if (response.ok) {
          const data = await response.json();
          setConvocatoria({
            id: data.id,
            title: data.title,
            description: data.description,
            image: data.imageUrl,
            startDate: data.startDate,
            endDate: data.endDate,
            status: data.status.toLowerCase() === 'active' ? 'active' : 
                   data.status.toLowerCase() === 'upcoming' ? 'upcoming' : 'closed',
            requirements: Array.isArray(data.requirements) ? data.requirements : [],
            documents: Array.isArray(data.documents) ? data.documents : [],
            createdAt: data.createdAt,
            fullDescription: data.fullDescription,
            objectives: Array.isArray(data.objectives) ? data.objectives : [],
            responsibilities: Array.isArray(data.responsibilities) ? data.responsibilities : [],
            qualifications: Array.isArray(data.qualifications) ? data.qualifications : [],
            benefits: Array.isArray(data.benefits) ? data.benefits : []
          });
        } else {
          setConvocatoria(null);
        }
      } catch (error) {
        console.error('Error fetching convocatoria:', error);
        setConvocatoria(null);
      } finally {
        setLoading(false);
      }
    };

    fetchConvocatoria();
  }, [convocatoriaId]);

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
    
    try {
      const response = await fetch(`/api/public/convocatorias/${convocatoriaId}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          experience: formData.experience,
          driveLink: formData.driveLink,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('¡Postulación enviada exitosamente!', {
          description: 'Te contactaremos pronto para continuar con el proceso.'
        });
        // Reset form
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          experience: '',
          documents: null,
          driveLink: '',
          acceptPolicies: false
        });
      } else {
        toast.error('Error al enviar la postulación', {
          description: data.error || 'Por favor intenta nuevamente'
        });
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Error al enviar la postulación', {
        description: 'Por favor, intenta nuevamente.'
      });
    } finally {
      setIsSubmitting(false);
    }
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

            {/* Requisitos del Voluntariado */}
            {Array.isArray(convocatoria.requirements) && convocatoria.requirements.length > 0 && (
            <Card>
              <CardHeader>
                  <CardTitle>Requisitos del Voluntariado</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                    {convocatoria.requirements.map((requirement: any, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-text-secondary-light dark:text-text-secondary-dark">
                          {typeof requirement === 'object' ? requirement.text : requirement}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
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
                      Declaro que reconozco las políticas de la organización, 
                      incluyendo el código de conducta, políticas de confidencialidad y 
                      procedimientos de seguridad. Acepto participar de manera responsable 
                      y comprometida con los valores y objetivos de la institución. *
                    </label>
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
