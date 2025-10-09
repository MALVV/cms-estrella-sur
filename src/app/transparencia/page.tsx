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
  Star
} from 'lucide-react';
import { SiteHeader } from '@/components/layout/site-header';

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
      <main className="relative min-h-[80vh] flex items-center justify-center bg-cover bg-center" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDxj7aF9-tpq6_zWnwVuojHHQc6bgc0eYuTVzXoE54LfjueardQbB6d3EFqZK3uv57oPTiHleVgH-Yi34c27AzoP75Qy1KG7aX02vlCFgOrykyPM-7ngRDNctmwl-uvyGeoidjSDqXHYXwBToi1ZuwUrOC0WEgjGrmw6E2n9SWGVuA-jl7O9o8Jpy99P817v_9-SFCIO7Y4FJ-vvLo2jZnXag1G1XwpbZuRBQKvKBtEKeA195mYIaDVYeWR_qsqQvyMmN5lHxaP-Q4')"}}>
        <div className="absolute inset-0 bg-white/80 dark:bg-black/70"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="relative p-4">
              <div className="absolute inset-0 -z-10">
                <img 
                  alt="Transparencia" 
                  className="w-full h-full object-contain opacity-60" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6OIceM-_FT9G0DLEA6WqHqXlzlJU-VaRCRGc9YmiIowGpPowBftussI75QEvZB9_--dBx4PzUuEEy0IcDa2c_UceyI_2xYkO_HVTFssrxGoPHIw0omP5gMXjqYTSnA_3dvjAM7Lb8_71gI8ZwulPak0-RTUB6qMvKe9x6m10z9cuTF0uFGMHTQssgmxQqn0wX99_XKgOj86JVeNCaD1e0wfnzKVk4cA5Eww2nGD1KmW7CVDBSXCZjOxdgaJwWkcVw931k71FPm98"
                />
              </div>
              <div className="relative transform -rotate-6 max-w-sm mx-auto">
                <img 
                  alt="Transparencia institucional" 
                  className="rounded-lg shadow-2xl w-full" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0DKGKMYw36YxwT9YsJXl1eVtdB-GCWJZ_4WjzDxUdML2vGmj6xbZ9_DwGHVQvh1D0lRny2Gki7pbHQWxUau_Inz0RHWtE6GevDh5_mykpglJ_LQSgxeGtCVCdHkXj_urWqkI8DkcmEH4EBrDXR-5153a4nN5xOuPvOr4Vs2y0Ii2HOYhPTuOpXEheDFlaSvA3XCpWfhe04uSO1aOu70z8qif64ppIm4lQWU2hWjlhHF-fSMDaXrbvE9MC_5dHxtbxBKygXs0JoO0"
                />
              </div>
              <div className="relative transform rotate-3 mt-[-15%] ml-[20%] max-w-xs">
                <img 
                  alt="Documentos públicos" 
                  className="rounded-lg shadow-2xl w-full" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcojMb_tNeqCrnNo1DH8v1vKFm2shH7i9X_UrDGDxoSUU6JdshPCdQy99xuAfZp_78sh87ME9W706dQ75iClppApHElnQaU0Svwngv46AOmz3-ke1ulDNpRN02F5Iujger72_L06XMRQBNEq3zPIXy7Jw7GPUm4rKpHEUBemS2jq5vmMKX_KQ3c7R0qRF0B2ZWlgIBFoMbn6UOXdsCepwN_iRMrzWpzQGLKhhitD8rxMKlOOlgf2mz6zhwgpXJV_NXcrTDU92VGkE"
                />
              </div>
            </div>
            <div className="text-left">
              <span className="inline-block bg-orange-400 text-gray-800 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm mb-4">
                Transparencia
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-text-light dark:text-text-dark leading-tight">
                TRANSPARENCIA<br/>
                Y RENDICIÓN<br/>
                DE CUENTAS
              </h1>
              <p className="mt-6 text-base text-text-light dark:text-text-dark/80 max-w-xl">
                En Fundación Estrella Sur creemos en la transparencia como pilar fundamental de nuestra gestión. 
                Aquí encontrarás todos los documentos que demuestran nuestro compromiso con la rendición de cuentas.
              </p>
              <p className="mt-4 text-base text-text-light dark:text-text-dark/80 max-w-xl">
                Accede a informes financieros, documentos institucionales, reportes de gestión y toda la información 
                que necesitas para conocer nuestro trabajo.
              </p>
            </div>
          </div>
        </div>
      </main>

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

      {/* Compromiso con la Transparencia */}
      <section className="py-20 bg-orange-500 dark:bg-orange-600 text-white dark:text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-yellow-200 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-orange-200 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block bg-orange-200 text-orange-800 dark:bg-orange-300 dark:text-orange-900 text-xs font-semibold px-3 py-1 rounded-full mb-4 font-condensed">
              NUESTRO COMPROMISO
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white dark:text-white leading-tight font-condensed">
              TRANSPARENCIA TOTAL EN NUESTRA GESTIÓN
            </h2>
            <p className="text-xl text-white dark:text-white max-w-3xl mx-auto mt-4">
              Creemos que la transparencia es fundamental para generar confianza y demostrar 
              nuestro compromiso con la comunidad que servimos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-white/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Eye className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white dark:text-white mb-2">100%</h3>
              <p className="text-white dark:text-white">Transparencia</p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white dark:text-white mb-2">4</h3>
              <p className="text-white dark:text-white">Categorías de Documentos</p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white dark:text-white mb-2">24/7</h3>
              <p className="text-white dark:text-white">Acceso Público</p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white dark:text-white mb-2">100%</h3>
              <p className="text-white dark:text-white">Rendición de Cuentas</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
