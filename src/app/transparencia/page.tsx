'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  Calendar, 
  Search,
  Eye,
  Shield,
  Users,
  Building2,
  BarChart3,
  ArrowRight,
  File,
  FolderOpen,
  CheckCircle,
  Star,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';

interface TransparencyDocument {
  id: string;
  title: string;
  description?: string;
  fileName: string;
  fileUrl: string;
  fileSize?: number;
  fileType?: string;
  category: 'CENTRO_DOCUMENTOS' | 'RENDICION_CUENTAS' | 'FINANCIADORES_ALIADOS' | 'INFORMES_ANUALES';
  year?: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  creator?: {
    name?: string;
    email: string;
  };
}

const categoryInfo = {
  CENTRO_DOCUMENTOS: {
    title: 'Centro de Documentos',
    description: 'Documentos institucionales, políticas, procedimientos y normativas',
    icon: FolderOpen,
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    bgColor: 'bg-blue-50 dark:bg-blue-950'
  },
  RENDICION_CUENTAS: {
    title: 'Rendición de Cuentas',
    description: 'Informes financieros, auditorías y reportes de gestión',
    icon: BarChart3,
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    bgColor: 'bg-green-50 dark:bg-green-950'
  },
  FINANCIADORES_ALIADOS: {
    title: 'Financiadores y Aliados',
    description: 'Información sobre nuestros socios estratégicos y financiadores',
    icon: Users,
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    bgColor: 'bg-purple-50 dark:bg-purple-950'
  },
  INFORMES_ANUALES: {
    title: 'Informes Anuales',
    description: 'Reportes anuales de actividades, logros y resultados',
    icon: FileText,
    color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    bgColor: 'bg-orange-50 dark:bg-orange-950'
  }
};

export default function TransparencyPage() {
  const [documents, setDocuments] = useState<TransparencyDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('');

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      if (searchTerm) params.append('search', searchTerm);
      if (selectedYear) params.append('year', selectedYear);
      
      const response = await fetch(`/api/public/transparency?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Error al cargar documentos');
      }
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error('Error al cargar documentos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [selectedCategory, searchTerm, selectedYear]);

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (fileType?: string) => {
    if (!fileType) return File;
    if (fileType.includes('pdf')) return FileText;
    if (fileType.includes('word') || fileType.includes('document')) return FileText;
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return BarChart3;
    return File;
  };

  const getYears = () => {
    const years = documents
      .map(doc => doc.year)
      .filter(year => year !== null && year !== undefined)
      .sort((a, b) => b! - a!);
    return [...new Set(years)];
  };

  const groupedDocuments = documents.reduce((acc, doc) => {
    if (!acc[doc.category]) {
      acc[doc.category] = [];
    }
    acc[doc.category].push(doc);
    return acc;
  }, {} as Record<string, TransparencyDocument[]>);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <SiteHeader />
      
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center bg-hero">
        <div className="absolute inset-0 bg-black opacity-40 dark:opacity-60"></div>
        <main className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <div className="max-w-4xl text-white text-center">
            <div className="mb-6">
              <span className="inline-block bg-orange-400 text-gray-900 text-sm font-bold uppercase px-4 py-2 tracking-wider rounded">
                Transparencia y Rendición de Cuentas
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight text-white mb-6">
              TRANSPARENCIA<br/>
              Y RENDICIÓN<br/>
              DE CUENTAS
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto mb-8">
              En Fundación Estrella Sur creemos en la transparencia como pilar fundamental de nuestra gestión. 
              Aquí encontrarás todos los documentos que demuestran nuestro compromiso con la rendición de cuentas.
            </p>
            <div className="mt-8">
              <a className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-lg text-base font-bold hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl font-condensed" href="#documentos">
                VER DOCUMENTOS
                <svg className="h-5 w-5 ml-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path clipRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" fillRule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>
        </main>
      </div>

      {/* Filtros y Búsqueda */}
      <section className="py-8 bg-background-light dark:bg-background-dark">
        <div className="container mx-auto px-4">
          <div className="bg-card-light dark:bg-card-dark rounded-lg p-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Búsqueda */}
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar documentos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border-light dark:border-border-dark rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Filtro por categoría */}
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-border-light dark:border-border-dark rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Todas las categorías</option>
                  {Object.entries(categoryInfo).map(([key, info]) => (
                    <option key={key} value={key}>{info.title}</option>
                  ))}
                </select>
              </div>

              {/* Filtro por año */}
              <div>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full px-3 py-2 border border-border-light dark:border-border-dark rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Todos los años</option>
                  {getYears().map(year => (
                    <option key={year} value={year?.toString()}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Documentos por Categoría */}
      <section className="py-8 bg-background-light dark:bg-background-dark">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="bg-card-light dark:bg-card-dark">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3" />
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : selectedCategory ? (
            // Mostrar documentos de una categoría específica
            <div>
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-3 rounded-lg ${categoryInfo[selectedCategory as keyof typeof categoryInfo].bgColor}`}>
                    {React.createElement(categoryInfo[selectedCategory as keyof typeof categoryInfo].icon, { className: "h-6 w-6 text-primary" })}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-text-light dark:text-text-dark">
                      {categoryInfo[selectedCategory as keyof typeof categoryInfo].title}
                    </h2>
                    <p className="text-text-secondary-light dark:text-text-secondary-dark">
                      {categoryInfo[selectedCategory as keyof typeof categoryInfo].description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedDocuments[selectedCategory]?.map((doc) => {
                  const FileIcon = getFileIcon(doc.fileType);
                  return (
                    <Card key={doc.id} className="bg-card-light dark:bg-card-dark hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <FileIcon className="h-5 w-5 text-primary" />
                            <Badge className={`${categoryInfo[doc.category].color} text-xs`}>
                              {categoryInfo[doc.category].title}
                            </Badge>
                          </div>
                          {doc.isFeatured && (
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          )}
                        </div>

                        <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-2 line-clamp-2">
                          {doc.title}
                        </h3>

                        {doc.description && (
                          <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm mb-4 line-clamp-3">
                            {doc.description}
                          </p>
                        )}

                        <div className="space-y-2 text-sm text-text-secondary-light dark:text-text-secondary-dark mb-4">
                          <div className="flex items-center gap-2">
                            <File className="h-4 w-4" />
                            <span>{doc.fileName}</span>
                          </div>
                          {doc.fileSize && (
                            <div className="flex items-center gap-2">
                              <Download className="h-4 w-4" />
                              <span>{formatFileSize(doc.fileSize)}</span>
                            </div>
                          )}
                          {doc.year && (
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>{doc.year}</span>
                            </div>
                          )}
                        </div>

                        <Button 
                          className="w-full" 
                          asChild
                        >
                          <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4 mr-2" />
                            Descargar
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ) : (
            // Mostrar todas las categorías
            <div className="space-y-12">
              {Object.entries(categoryInfo).map(([categoryKey, categoryData]) => {
                const categoryDocs = groupedDocuments[categoryKey] || [];
                if (categoryDocs.length === 0) return null;

                return (
                  <div key={categoryKey}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`p-3 rounded-lg ${categoryData.bgColor}`}>
                        <categoryData.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-text-light dark:text-text-dark">
                          {categoryData.title}
                        </h2>
                        <p className="text-text-secondary-light dark:text-text-secondary-dark">
                          {categoryData.description}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {categoryDocs.slice(0, 3).map((doc) => {
                        const FileIcon = getFileIcon(doc.fileType);
                        return (
                          <Card key={doc.id} className="bg-card-light dark:bg-card-dark hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-2">
                                  <FileIcon className="h-5 w-5 text-primary" />
                                </div>
                                {doc.isFeatured && (
                                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                )}
                              </div>

                              <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-2 line-clamp-2">
                                {doc.title}
                              </h3>

                              {doc.description && (
                                <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm mb-4 line-clamp-3">
                                  {doc.description}
                                </p>
                              )}

                              <div className="space-y-2 text-sm text-text-secondary-light dark:text-text-secondary-dark mb-4">
                                {doc.year && (
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <span>{doc.year}</span>
                                  </div>
                                )}
                              </div>

                              <Button 
                                className="w-full" 
                                asChild
                              >
                                <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                                  <Download className="h-4 w-4 mr-2" />
                                  Descargar
                                </a>
                              </Button>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>

                    {categoryDocs.length > 3 && (
                      <div className="text-center mt-6">
                        <Button 
                          variant="outline" 
                          onClick={() => setSelectedCategory(categoryKey)}
                        >
                          Ver todos los documentos ({categoryDocs.length})
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {!loading && documents.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-text-light dark:text-text-dark mb-2">
                No se encontraron documentos
              </h3>
              <p className="text-text-secondary-light dark:text-text-secondary-dark">
                Intenta ajustar los filtros de búsqueda o vuelve más tarde.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Canal de Comunicación */}
      <section className="py-16 bg-red-600 dark:bg-red-700 text-white dark:text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-red-200 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-red-200 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <span className="inline-block bg-red-200 text-red-800 dark:bg-red-300 dark:text-red-900 text-xs font-semibold px-3 py-1 rounded-full mb-4 font-condensed">
              COMUNICACIÓN DIRECTA
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white dark:text-white leading-tight font-condensed">
              SI VE ALGO, DIGA ALGO
            </h2>
            <p className="text-lg text-white dark:text-white max-w-3xl mx-auto mt-4">
              Tu observación es valiosa para mantener los más altos estándares de integridad. 
              Si notas algo que no parece correcto, compártelo con nosotros.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <div className="text-center">
              <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white dark:text-white mb-2">Confidencial</h3>
              <p className="text-white dark:text-white text-sm">Tu información será protegida</p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white dark:text-white mb-2">Seguro</h3>
              <p className="text-white dark:text-white text-sm">Canal protegido y confiable</p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Eye className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white dark:text-white mb-2">Anónimo</h3>
              <p className="text-white dark:text-white text-sm">Puedes comunicarte sin identificarte</p>
            </div>
          </div>

          <div className="text-center">
            <Link href="/contacto?tab=complaint#formularios">
              <Button 
                size="lg" 
                className="bg-white text-red-600 hover:bg-red-50 dark:bg-white dark:text-red-600 dark:hover:bg-red-50 font-semibold px-6 py-3"
              >
                <AlertTriangle className="h-5 w-5 mr-2" />
                COMPARTIR OBSERVACIÓN
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <p className="text-white dark:text-white mt-3 text-sm">
              Al hacer clic, serás dirigido a nuestro formulario de comunicación
            </p>
          </div>
        </div>
      </section>

      
      <SiteFooter />
    </div>
  );
}
