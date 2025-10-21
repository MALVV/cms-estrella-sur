'use client';

import { useState, useEffect } from 'react';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  imageUrl?: string;
  imageAlt?: string;
  isActive: boolean;
  isFeatured: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  author?: {
    name?: string;
    email: string;
  };
}

interface EventItem {
  id: string;
  title: string;
  description: string;
  content?: string;
  imageUrl?: string;
  imageAlt?: string;
  eventDate: string;
  location?: string;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  organizer?: {
    name?: string;
    email: string;
  };
}

export const useNewsAndEvents = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [featuredNews, setFeaturedNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    try {
      const params = new URLSearchParams();
      params.append('limit', '10');

      const response = await fetch(`/api/news?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Error al cargar noticias');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching news:', error);
      throw error;
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      if (!response.ok) {
        throw new Error('Error al cargar eventos');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  };

  const fetchFeaturedNews = async () => {
    try {
      // Obtener todas las noticias activas para seleccionar una aleatoria
      const response = await fetch('/api/news?limit=50');
      if (!response.ok) {
        throw new Error('Error al cargar noticias');
      }
      const data = await response.json();
      
      // Filtrar solo noticias activas
      const activeNews = data.filter((item: NewsItem) => item.isActive);
      
      if (activeNews.length === 0) {
        return null;
      }
      
      // Seleccionar una noticia aleatoria
      const randomIndex = Math.floor(Math.random() * activeNews.length);
      return activeNews[randomIndex];
    } catch (error) {
      console.error('Error fetching featured news:', error);
      throw error;
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [newsData, eventsData, featuredNewsData] = await Promise.all([
        fetchNews(),
        fetchEvents(),
        fetchFeaturedNews(),
      ]);

      setNews(newsData);
      setEvents(eventsData);
      setFeaturedNews(featuredNewsData);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const refreshNews = async () => {
    try {
      const newsData = await fetchNews();
      setNews(newsData);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al actualizar noticias');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    news,
    events,
    featuredNews,
    loading,
    error,
    refreshNews,
    loadData,
  };
};
