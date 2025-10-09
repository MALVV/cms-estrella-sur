'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Newspaper, Calendar, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface RelatedNews {
  id: string;
  title: string;
  excerpt?: string;
  imageUrl?: string;
  imageAlt?: string;
  publishedAt: string;
  category: string;
  author?: {
    name?: string;
    email: string;
  };
  programa?: {
    id: string;
    nombreSector: string;
  };
  project?: {
    id: string;
    title: string;
  };
  methodology?: {
    id: string;
    title: string;
  };
}

interface RelatedNewsCarouselProps {
  projectId?: string;
  methodologyId?: string;
  programaId?: string;
  title?: string;
  limit?: number;
}

export function RelatedNewsCarousel({ 
  projectId, 
  methodologyId, 
  programaId, 
  title = "Noticias Relacionadas",
  limit = 6 
}: RelatedNewsCarouselProps) {
  const [news, setNews] = useState<RelatedNews[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedNews = async () => {
      try {
        const params = new URLSearchParams();
        if (projectId) params.append('projectId', projectId);
        if (methodologyId) params.append('methodologyId', methodologyId);
        if (programaId) params.append('programaId', programaId);
        params.append('limit', limit.toString());

        const response = await fetch(`/api/public/news/related?${params}`);
        if (!response.ok) throw new Error('Error al cargar noticias');
        
        const data = await response.json();
        setNews(data.news);
      } catch (error) {
        console.error('Error fetching related news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedNews();
  }, [projectId, methodologyId, programaId, limit]);

  if (loading) {
    return (
      <div className="py-8">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Newspaper className="h-6 w-6 text-blue-600" />
          {title}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (news.length === 0) {
    return null;
  }

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold flex items-center gap-2">
          <Newspaper className="h-6 w-6 text-blue-600" />
          {title}
        </h3>
        <Button variant="outline" asChild>
          <Link href="/news" className="flex items-center gap-2">
            Ver Todas
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((article) => (
          <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
            {/* Imagen */}
            {article.imageUrl ? (
              <div className="aspect-video bg-gray-100 overflow-hidden">
                <img
                  src={article.imageUrl}
                  alt={article.imageAlt || article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ) : (
              <div className="aspect-video bg-gray-200 flex items-center justify-center">
                <Newspaper className="h-12 w-12 text-gray-400" />
              </div>
            )}

            <CardContent className="p-4 space-y-3">
              {/* Título */}
              <h4 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                {article.title}
              </h4>

              {/* Fecha */}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(article.publishedAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>

              {/* Descripción */}
              {article.excerpt && (
                <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                  {article.excerpt}
                </p>
              )}

              {/* Botón Ver Más */}
              <div className="pt-2">
                <Button asChild className="w-full" variant="outline">
                  <Link href={`/news/${article.id}`} className="flex items-center justify-center gap-2">
                    Ver Más
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
