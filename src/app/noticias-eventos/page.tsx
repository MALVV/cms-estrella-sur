'use client';

import React from 'react';
import { NewsEventsSection } from '@/components/sections/news-events-section';
import { useNewsAndEvents } from '@/hooks/use-news-events';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Header } from '@/components/layout/header';
import { SiteFooter } from '@/components/layout/site-footer';

export default function NewsEventsPublicPage() {
  const { news, events, featuredNews, loading, error } = useNewsAndEvents();

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <Header />
        <Navbar />
        
        {/* Content skeleton */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row gap-8 mb-16">
            <Skeleton className="w-full lg:w-1/2 h-64" />
            <div className="w-full lg:w-1/2 space-y-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-10 w-40" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="w-full h-56" />
                <div className="p-6 space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-full" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <Header />
        <Navbar />
        <div className="flex items-center justify-center">
          <Card className="p-8 text-center max-w-md">
            <div className="text-red-500 mb-4">
              <span className="material-symbols-outlined text-6xl">error</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">Error al cargar contenido</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Reintentar
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <Header />
      <Navbar />

      {/* Main content */}
      <main className="container mx-auto px-4 py-4">
        <NewsEventsSection
          featuredNews={featuredNews ? {
            id: featuredNews.id,
            title: featuredNews.title,
            excerpt: featuredNews.excerpt || featuredNews.content.substring(0, 150) + '...',
            content: featuredNews.content,
            imageUrl: featuredNews.imageUrl,
            imageAlt: featuredNews.imageAlt,
            publishedAt: featuredNews.publishedAt,
            author: featuredNews.author?.name || 'Admin',
            isFeatured: featuredNews.isFeatured,
          } : undefined}
          newsItems={news.map(item => ({
            id: item.id,
            title: item.title,
            excerpt: item.excerpt || item.content.substring(0, 100) + '...',
            imageUrl: item.imageUrl,
            imageAlt: item.imageAlt,
            publishedAt: item.publishedAt,
            author: item.author?.name || 'Admin',
            isFeatured: item.isFeatured,
          }))}
          eventItems={events.map(event => ({
            id: event.id,
            title: event.title,
            description: event.description,
            imageUrl: event.imageUrl,
            imageAlt: event.imageAlt,
            eventDate: event.eventDate,
            location: event.location,
            isFeatured: event.isFeatured,
          }))}
        />
      </main>

      <SiteFooter />
    </div>
  );
}