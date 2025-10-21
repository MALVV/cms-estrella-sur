export enum UserRole {
  ADMINISTRADOR = 'ADMINISTRADOR',
  GESTOR = 'GESTOR'
}

export interface Permission {
  resource: string
  action: string
  description: string
}

export interface RolePermissions {
  role: UserRole
  permissions: Permission[]
  description: string
}

// Definición de permisos por recurso
export const PERMISSIONS = {
  // Gestión de usuarios
  USER_CREATE: { resource: 'users', action: 'create', description: 'Crear usuarios' },
  USER_READ: { resource: 'users', action: 'read', description: 'Ver usuarios' },
  USER_UPDATE: { resource: 'users', action: 'update', description: 'Editar usuarios' },
  USER_DELETE: { resource: 'users', action: 'delete', description: 'Eliminar usuarios' },
  
  // Gestión de contenido general
  CONTENT_CREATE: { resource: 'content', action: 'create', description: 'Crear contenido' },
  CONTENT_READ: { resource: 'content', action: 'read', description: 'Ver contenido' },
  CONTENT_UPDATE: { resource: 'content', action: 'update', description: 'Editar contenido' },
  CONTENT_DELETE: { resource: 'content', action: 'delete', description: 'Eliminar contenido' },
  CONTENT_PUBLISH: { resource: 'content', action: 'publish', description: 'Publicar contenido' },
  
  // Gestión específica de proyectos
  PROJECTS_CREATE: { resource: 'projects', action: 'create', description: 'Crear proyectos' },
  PROJECTS_READ: { resource: 'projects', action: 'read', description: 'Ver proyectos' },
  PROJECTS_UPDATE: { resource: 'projects', action: 'update', description: 'Editar proyectos' },
  PROJECTS_DELETE: { resource: 'projects', action: 'delete', description: 'Eliminar proyectos' },
  
  // Gestión específica de innovaciones
  INNOVATIONS_CREATE: { resource: 'innovations', action: 'create', description: 'Crear innovaciones' },
  INNOVATIONS_READ: { resource: 'innovations', action: 'read', description: 'Ver innovaciones' },
  INNOVATIONS_UPDATE: { resource: 'innovations', action: 'update', description: 'Editar innovaciones' },
  INNOVATIONS_DELETE: { resource: 'innovations', action: 'delete', description: 'Eliminar innovaciones' },
  
  // Gestión específica de programas
  PROGRAMS_CREATE: { resource: 'programs', action: 'create', description: 'Crear programas' },
  PROGRAMS_READ: { resource: 'programs', action: 'read', description: 'Ver programas' },
  PROGRAMS_UPDATE: { resource: 'programs', action: 'update', description: 'Editar programas' },
  PROGRAMS_DELETE: { resource: 'programs', action: 'delete', description: 'Eliminar programas' },
  
  // Gestión de archivos
  FILE_UPLOAD: { resource: 'files', action: 'upload', description: 'Subir archivos' },
  FILE_DELETE: { resource: 'files', action: 'delete', description: 'Eliminar archivos' },
  FILE_MANAGE: { resource: 'files', action: 'manage', description: 'Gestionar archivos' },
  
  // Configuración del sistema
  SYSTEM_CONFIG: { resource: 'system', action: 'config', description: 'Configurar sistema' },
  SYSTEM_LOGS: { resource: 'system', action: 'logs', description: 'Ver logs del sistema' },
  SYSTEM_BACKUP: { resource: 'system', action: 'backup', description: 'Realizar respaldos' },
  
  // Reportes y analytics
  REPORTS_VIEW: { resource: 'reports', action: 'view', description: 'Ver reportes' },
  REPORTS_EXPORT: { resource: 'reports', action: 'export', description: 'Exportar reportes' },
  
  // Gestión de roles
  ROLES_MANAGE: { resource: 'roles', action: 'manage', description: 'Gestionar roles' },
} as const

// Definición de roles y sus permisos
export const ROLE_PERMISSIONS: RolePermissions[] = [
  {
    role: UserRole.ADMINISTRADOR,
    description: 'Acceso completo al sistema - Gestión de usuarios, proyectos, innovaciones y programas',
    permissions: [
      // Todos los permisos de usuarios
      PERMISSIONS.USER_CREATE,
      PERMISSIONS.USER_READ,
      PERMISSIONS.USER_UPDATE,
      PERMISSIONS.USER_DELETE,
      
      // Todos los permisos de contenido general
      PERMISSIONS.CONTENT_CREATE,
      PERMISSIONS.CONTENT_READ,
      PERMISSIONS.CONTENT_UPDATE,
      PERMISSIONS.CONTENT_DELETE,
      PERMISSIONS.CONTENT_PUBLISH,
      
      // Todos los permisos de proyectos
      PERMISSIONS.PROJECTS_CREATE,
      PERMISSIONS.PROJECTS_READ,
      PERMISSIONS.PROJECTS_UPDATE,
      PERMISSIONS.PROJECTS_DELETE,
      
      // Todos los permisos de innovaciones
      PERMISSIONS.INNOVATIONS_CREATE,
      PERMISSIONS.INNOVATIONS_READ,
      PERMISSIONS.INNOVATIONS_UPDATE,
      PERMISSIONS.INNOVATIONS_DELETE,
      
      // Todos los permisos de programas
      PERMISSIONS.PROGRAMS_CREATE,
      PERMISSIONS.PROGRAMS_READ,
      PERMISSIONS.PROGRAMS_UPDATE,
      PERMISSIONS.PROGRAMS_DELETE,
      
      // Todos los permisos de archivos
      PERMISSIONS.FILE_UPLOAD,
      PERMISSIONS.FILE_DELETE,
      PERMISSIONS.FILE_MANAGE,
      
      // Todos los permisos del sistema
      PERMISSIONS.SYSTEM_CONFIG,
      PERMISSIONS.SYSTEM_LOGS,
      PERMISSIONS.SYSTEM_BACKUP,
      
      // Todos los permisos de reportes
      PERMISSIONS.REPORTS_VIEW,
      PERMISSIONS.REPORTS_EXPORT,
      
      // Gestión de roles
      PERMISSIONS.ROLES_MANAGE,
    ]
  },
  {
    role: UserRole.GESTOR,
    description: 'Gestión de contenido - Noticias, metodologías, historias, recursos y demás secciones',
    permissions: [
      // Solo lectura de usuarios
      PERMISSIONS.USER_READ,
      
      // Todos los permisos de contenido general
      PERMISSIONS.CONTENT_CREATE,
      PERMISSIONS.CONTENT_READ,
      PERMISSIONS.CONTENT_UPDATE,
      PERMISSIONS.CONTENT_DELETE,
      PERMISSIONS.CONTENT_PUBLISH,
      
      // Solo lectura de proyectos, innovaciones y programas
      PERMISSIONS.PROJECTS_READ,
      PERMISSIONS.INNOVATIONS_READ,
      PERMISSIONS.PROGRAMS_READ,
      
      // Gestión de archivos
      PERMISSIONS.FILE_UPLOAD,
      PERMISSIONS.FILE_DELETE,
      PERMISSIONS.FILE_MANAGE,
      
      // Reportes básicos
      PERMISSIONS.REPORTS_VIEW,
    ]
  }
]

/**
 * Obtiene los permisos de un rol específico
 */
export function getRolePermissions(role: UserRole): Permission[] {
  const roleConfig = ROLE_PERMISSIONS.find(r => r.role === role)
  return roleConfig ? roleConfig.permissions : []
}

/**
 * Verifica si un rol tiene un permiso específico
 */
export function hasPermission(role: UserRole, resource: string, action: string): boolean {
  const permissions = getRolePermissions(role)
  return permissions.some(p => p.resource === resource && p.action === action)
}

/**
 * Verifica si un rol tiene acceso a un recurso
 */
export function hasResourceAccess(role: UserRole, resource: string): boolean {
  const permissions = getRolePermissions(role)
  return permissions.some(p => p.resource === resource)
}

/**
 * Obtiene todos los recursos accesibles para un rol
 */
export function getAccessibleResources(role: UserRole): string[] {
  const permissions = getRolePermissions(role)
  return [...new Set(permissions.map(p => p.resource))]
}

/**
 * Verifica si un rol puede realizar una acción en un recurso
 */
export function canPerformAction(role: UserRole, resource: string, action: string): boolean {
  return hasPermission(role, resource, action)
}

/**
 * Obtiene la jerarquía de roles (mayor a menor privilegio)
 */
export function getRoleHierarchy(): UserRole[] {
  return [
    UserRole.ADMINISTRADOR,
    UserRole.GESTOR
  ]
}

/**
 * Verifica si un rol tiene mayor o igual privilegio que otro
 */
export function hasEqualOrHigherPrivilege(userRole: UserRole, requiredRole: UserRole): boolean {
  const hierarchy = getRoleHierarchy()
  const userIndex = hierarchy.indexOf(userRole)
  const requiredIndex = hierarchy.indexOf(requiredRole)
  
  return userIndex <= requiredIndex
}

/**
 * Obtiene la descripción de un rol
 */
export function getRoleDescription(role: UserRole): string {
  const roleConfig = ROLE_PERMISSIONS.find(r => r.role === role)
  return roleConfig ? roleConfig.description : 'Rol no definido'
}

/**
 * Obtiene todos los roles disponibles
 */
export function getAllRoles(): UserRole[] {
  return Object.values(UserRole)
}

/**
 * Valida si un rol es válido
 */
export function isValidRole(role: string): role is UserRole {
  return Object.values(UserRole).includes(role as UserRole)
}
