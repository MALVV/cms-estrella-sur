# CMS Estrella Sur - Full-Stack Web Application

Una aplicación web full-stack completa construida con tecnologías modernas. La plataforma proporciona una base sólida para construir aplicaciones web escalables con autenticación multi-rol, gestión de contenido, almacenamiento de archivos y características en tiempo real.

## Stack Tecnológico

### Frontend
- **Framework**: Next.js 15.1.7 con App Router
- **UI Library**: React 19.0.0
- **Styling**: TailwindCSS 3.4.17 con animaciones personalizadas
- **Componentes**: shadcn/ui con primitivos Radix UI
- **Iconos**: Lucide React
- **Formularios**: react-hook-form 7.62.0 con validación Zod
- **Gestión de Estado**: TanStack React Query 5.87.4
- **Animación**: Framer Motion 12.23.12
- **Generación PDF**: @react-pdf/renderer 4.3.0
- **Mapas**: Leaflet con react-leaflet

### Backend
- **API**: Next.js API Routes (RESTful)
- **Base de Datos**: PostgreSQL con Prisma 6.16.1 ORM
- **Autenticación**: NextAuth.js 4.24.11 con estrategia JWT
- **Almacenamiento de Archivos**: MinIO object storage
- **Cache**: Redis 7
- **Email**: Resend para emails transaccionales
- **Seguridad**: bcryptjs para hash de contraseñas, crypto-js para encriptación

### Desarrollo y Testing
- **Lenguaje**: TypeScript 5
- **Testing**: Jest 30.1.3 con Testing Library
- **Linting**: ESLint 9 con Prettier
- **Gestor de Paquetes**: npm
- **Containerización**: Docker & Docker Compose

## Instalación y Configuración

### Prerrequisitos
- Node.js 20 o superior
- Docker y Docker Compose
- PostgreSQL (si no usas Docker)
- Redis (si no usas Docker)
- MinIO (si no usas Docker)

### 1. Clonar el Repositorio
```bash
git clone <repository-url>
cd cms-estrella-sur
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configurar Variables de Entorno
```bash
cp env.example .env
```

Edita el archivo `.env` con tus configuraciones:
```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/app_dev"

# MinIO
MINIO_ENDPOINT="localhost"
MINIO_PORT=9000
MINIO_ACCESS_KEY="minioadmin"
MINIO_SECRET_KEY="minioadmin"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Iniciar Servicios con Docker
```bash
# Iniciar todos los servicios
npm run docker:up

# Solo Prisma Studio
npm run docker:studio

# Ver logs
npm run docker:logs
```

### 5. Configurar Base de Datos
```bash
# Generar cliente Prisma
npm run db:generate

# Ejecutar migraciones
npm run db:migrate

# Sembrar base de datos (opcional)
npm run db:seed
```

### 6. Inicializar MinIO
```bash
npm run minio:init
```

### 7. Iniciar Aplicación
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## Scripts Disponibles

### Desarrollo
- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia el servidor de producción

### Base de Datos
- `npm run db:generate` - Genera el cliente Prisma
- `npm run db:migrate` - Ejecuta migraciones
- `npm run db:seed` - Siembra la base de datos
- `npm run db:studio` - Abre Prisma Studio
- `npm run db:reset` - Resetea la base de datos

### Docker
- `npm run docker:up` - Inicia todos los servicios
- `npm run docker:down` - Detiene todos los servicios
- `npm run docker:logs` - Muestra logs de los servicios
- `npm run docker:clean` - Limpia volúmenes
- `npm run docker:studio` - Solo Prisma Studio

### MinIO
- `npm run minio:init` - Inicializa buckets de MinIO
- `npm run minio:test` - Prueba conexión con MinIO

### Testing
- `npm run test` - Ejecuta todos los tests
- `npm run test:unit` - Tests de componentes
- `npm run test:api` - Tests de API
- `npm run test:integration` - Tests de integración
- `npm run test:security` - Tests de seguridad
- `npm run test:coverage` - Tests con cobertura

## Estructura del Proyecto

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Rutas de autenticación
│   ├── (dashboard)/              # Rutas protegidas del dashboard
│   ├── api/                      # Rutas API
│   │   ├── auth/                 # Endpoints de autenticación
│   │   ├── users/                # Gestión de usuarios
│   │   ├── content/              # Gestión de contenido
│   │   ├── files/                # Gestión de archivos
│   │   ├── messaging/            # Sistema de mensajería
│   │   └── security/             # Seguridad y cumplimiento OWASP
│   └── dashboard/                # Layouts del dashboard
├── components/                   # Componentes React
│   ├── ui/                       # Componentes shadcn/ui
│   ├── auth/                     # Componentes de autenticación
│   ├── content/                  # Componentes relacionados con contenido
│   ├── profile/                  # Componentes de perfil de usuario
│   ├── messaging/                # Componentes de mensajería
│   ├── analytics/                # Componentes de analíticas
│   └── dashboard/                # Componentes del dashboard
├── hooks/                        # Custom React hooks
├── lib/                          # Funciones utilitarias y servicios
│   ├── prisma.ts                 # Configuración del cliente Prisma
│   ├── auth.ts                   # Configuración de NextAuth
│   ├── minioService.ts           # Servicio de almacenamiento MinIO
│   ├── contentService.ts         # Lógica de gestión de contenido
│   └── providers/                # Proveedores de contexto
├── types/                        # Definiciones de tipos TypeScript
└── middleware.ts                 # Middleware de Next.js para auth
```

## Características Principales

### 1. Sistema Multi-Rol
- **Roles Personalizables**: Define roles basados en las necesidades de tu aplicación
- **Control de Acceso Basado en Roles**: Acceso seguro a diferentes características
- **Gestión de Usuarios**: Registro completo de usuarios y gestión de perfiles
- **Panel de Administración**: Interfaz administrativa para gestión de la plataforma

### 2. Sistema de Gestión de Contenido
- **Tipos de Contenido Flexibles**: Crea y gestiona diferentes tipos de contenido
- **Soporte de Medios**: Soporte para video, audio y contenido de texto
- **Categorización**: Organiza contenido con etiquetas y categorías
- **Flujo de Publicación**: Borrador, revisión y publicación de contenido

### 3. Gestión de Archivos
- **Integración MinIO**: Almacenamiento de objetos escalable para archivos
- **Múltiples Tipos de Archivo**: Soporte para imágenes, videos, documentos
- **Acceso Seguro**: Permisos de archivos basados en roles
- **Listo para CDN**: Optimizado para entrega de contenido

### 4. Sistema de Mensajería
- **Comunicación en Tiempo Real**: Mensajería de usuario a usuario
- **Contexto Consciente**: Mensajes vinculados a características específicas
- **Archivos Adjuntos**: Comparte archivos a través de mensajes
- **Sistema de Notificaciones**: Notificaciones en tiempo real

### 5. Analíticas y Reportes
- **Analíticas de Usuario**: Rastrea engagement y comportamiento del usuario
- **Analíticas de Contenido**: Monitorea rendimiento del contenido
- **Reportes Personalizados**: Genera reportes basados en tus datos
- **Dashboard**: Analíticas visuales e insights

### 6. Seguridad y Cumplimiento
- **Seguridad OWASP**: Mejores prácticas de seguridad integradas
- **Validación de Entrada**: Validación de datos comprensiva
- **Autenticación**: Autenticación segura basada en JWT
- **Autorización**: Sistema de permisos de grano fino

## Despliegue en Producción

La aplicación está configurada para despliegue en producción con:
- Containerización Docker
- Configuración basada en entorno
- Headers de seguridad y CSP
- Optimización de imágenes
- Migraciones de base de datos
- Health checks y monitoreo

## Documentación de API

La plataforma incluye endpoints API comprensivos que cubren:
- Autenticación y gestión de usuarios
- Gestión de contenido y operaciones CRUD
- Carga y gestión de archivos
- Mensajería y comunicación
- Analíticas y reportes
- Endpoints de lógica de negocio personalizada

## Cobertura de Testing

Suite de testing comprensiva que incluye:
- Tests unitarios para componentes
- Testing de endpoints API
- Tests de integración para flujos de usuario
- Testing de seguridad (cumplimiento OWASP)
- Testing de funcionalidad personalizada

## Empezar

Esta plantilla proporciona una base sólida para construir aplicaciones web modernas con:

1. **Arquitectura Escalable**: Construida con mejores prácticas de la industria
2. **Stack Tecnológico Moderno**: Últimas versiones de frameworks populares
3. **Lista para Producción**: Configuración Docker y scripts de despliegue
4. **Diseño Extensible**: Fácil de personalizar para casos de uso específicos
5. **Testing Comprensivo**: Cobertura completa de tests para confiabilidad
6. **Seguridad Primero**: Medidas de seguridad integradas y cumplimiento

Perfecto para construir aplicaciones SaaS, sistemas de gestión de contenido, plataformas de e-learning, o cualquier aplicación web multi-usuario que requiera autenticación, gestión de archivos y características en tiempo real.