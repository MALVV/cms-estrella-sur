# Sección de Noticias y Eventos - CMS Estrella Sur

Esta funcionalidad permite gestionar y mostrar noticias y eventos de manera dinámica en el sitio web, adaptada a los estilos y contexto de la organización Estrella Sur.

## 🚀 Características

### Noticias
- **Categorías**: Noticias, Fundraising, Compañía, Sin Categoría
- **Contenido completo**: Título, contenido, resumen, imagen
- **Destacadas**: Posibilidad de marcar noticias como destacadas
- **Estado**: Activo/Inactivo para control de visibilidad
- **Autor**: Asociación con usuarios del sistema

### Eventos
- **Información completa**: Título, descripción, contenido adicional
- **Fecha y ubicación**: Datos específicos del evento
- **Imagen**: Soporte para imágenes representativas
- **Destacados**: Eventos especiales pueden ser marcados como destacados
- **Organizador**: Asociación con usuarios del sistema

## 📁 Archivos Creados

### Componentes
- `src/components/sections/news-events-section.tsx` - Componente principal para mostrar noticias y eventos
- `src/components/admin/news-events-management.tsx` - Panel de administración

### Hooks
- `src/hooks/use-news-events.ts` - Hook personalizado para manejar datos

### Páginas
- `src/app/news-events/page.tsx` - Página de ejemplo de uso

### API Routes
- `src/app/api/news/route.ts` - CRUD para noticias
- `src/app/api/news/[id]/route.ts` - Operaciones individuales de noticias
- `src/app/api/events/route.ts` - CRUD para eventos
- `src/app/api/events/[id]/route.ts` - Operaciones individuales de eventos

### Base de Datos
- `prisma/schema.prisma` - Modelos News y Event actualizados
- `scripts/seed-news-events.js` - Script para poblar datos de prueba

## 🎨 Estilos Adaptados

La sección utiliza los estilos existentes del proyecto:

- **Colores**: Utiliza la paleta de colores definida en `tailwind.config.ts`
- **Tipografía**: Fuente `Poppins` y `Special Gothic Condensed` para títulos
- **Componentes UI**: Utiliza los componentes de shadcn/ui existentes
- **Tema**: Soporte completo para modo claro y oscuro
- **Responsive**: Diseño adaptativo para móviles y desktop

## 🔧 Configuración

### 1. Migración de Base de Datos

```bash
npx prisma migrate dev --name add_news_and_events
```

### 2. Poblar Datos de Prueba

```bash
node scripts/seed-news-events.js
```

### 3. Usar el Componente

```tsx
import { NewsEventsSection } from '@/components/sections/news-events-section';
import { useNewsAndEvents } from '@/hooks/use-news-events';

export default function MyPage() {
  const { news, events, featuredNews, loading, error } = useNewsAndEvents();

  return (
    <NewsEventsSection
      featuredNews={featuredNews}
      newsItems={news}
      eventItems={events}
    />
  );
}
```

## 📱 Funcionalidades

### Filtrado de Noticias
- Filtro por categoría (Todas, Noticias, Fundraising, Compañía)
- Botones interactivos con estado activo
- Actualización dinámica del contenido

### Noticia Destacada
- Sección especial para la noticia más importante
- Layout de dos columnas con imagen y contenido
- Botón de "Continuar leyendo"

### Grid Responsivo
- 3 columnas en desktop
- 2 columnas en tablet
- 1 columna en móvil
- Cards con sombras y efectos hover

### Eventos Próximos
- Sección separada para eventos
- Información de fecha y ubicación
- Ordenados por fecha ascendente

## 🔐 Autenticación

Las operaciones de creación, edición y eliminación requieren autenticación:

- **GET**: Público (solo elementos activos)
- **POST/PUT/DELETE**: Requiere usuario autenticado
- **Middleware**: Utiliza `authMiddleware` existente

## 🎯 Casos de Uso

### Para Administradores
1. Crear noticias sobre actividades de la organización
2. Publicar eventos y campañas
3. Gestionar contenido destacado
4. Controlar visibilidad de elementos

### Para Visitantes
1. Leer noticias actualizadas
2. Informarse sobre próximos eventos
3. Filtrar contenido por categoría
4. Acceder a información destacada

## 🔄 Integración con el Sistema Existente

- **Usuarios**: Asociación con el modelo User existente
- **Autenticación**: Utiliza el sistema de auth actual
- **Estilos**: Compatible con el tema existente
- **Base de Datos**: Extiende el esquema Prisma actual

## 📊 Estructura de Datos

### News
```typescript
interface NewsItem {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  imageUrl?: string;
  imageAlt?: string;
  category: 'NOTICIAS' | 'FUNDRAISING' | 'COMPAÑIA' | 'SIN_CATEGORIA';
  isActive: boolean;
  isFeatured: boolean;
  publishedAt: string;
  author?: { name?: string; email: string; };
}
```

### Event
```typescript
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
  organizer?: { name?: string; email: string; };
}
```

## 🚀 Próximos Pasos

1. **Integrar en el dashboard**: Agregar el componente de gestión al panel de administración
2. **Página individual**: Crear páginas detalladas para cada noticia/evento
3. **Búsqueda**: Implementar funcionalidad de búsqueda
4. **Comentarios**: Sistema de comentarios para noticias
5. **Newsletter**: Integración con sistema de notificaciones por email

## 📝 Notas

- Las imágenes deben ser URLs válidas o rutas de archivos
- Los textos alternativos son importantes para accesibilidad
- El contenido HTML está permitido en los campos de contenido
- Las fechas deben estar en formato ISO 8601
