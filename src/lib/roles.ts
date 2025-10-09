export enum UserRole {
  ADMINISTRADOR = 'ADMINISTRADOR',
  TECNICO = 'TECNICO',
  SUPERVISOR = 'SUPERVISOR'
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
  
  // Gestión de contenido
  CONTENT_CREATE: { resource: 'content', action: 'create', description: 'Crear contenido' },
  CONTENT_READ: { resource: 'content', action: 'read', description: 'Ver contenido' },
  CONTENT_UPDATE: { resource: 'content', action: 'update', description: 'Editar contenido' },
  CONTENT_DELETE: { resource: 'content', action: 'delete', description: 'Eliminar contenido' },
  CONTENT_PUBLISH: { resource: 'content', action: 'publish', description: 'Publicar contenido' },
  
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
    description: 'Acceso completo al sistema',
    permissions: [
      // Todos los permisos de usuarios
      PERMISSIONS.USER_CREATE,
      PERMISSIONS.USER_READ,
      PERMISSIONS.USER_UPDATE,
      PERMISSIONS.USER_DELETE,
      
      // Todos los permisos de contenido
      PERMISSIONS.CONTENT_CREATE,
      PERMISSIONS.CONTENT_READ,
      PERMISSIONS.CONTENT_UPDATE,
      PERMISSIONS.CONTENT_DELETE,
      PERMISSIONS.CONTENT_PUBLISH,
      
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
    role: UserRole.SUPERVISOR,
    description: 'Supervisión y gestión de contenido',
    permissions: [
      // Lectura de usuarios
      PERMISSIONS.USER_READ,
      
      // Todos los permisos de contenido
      PERMISSIONS.CONTENT_CREATE,
      PERMISSIONS.CONTENT_READ,
      PERMISSIONS.CONTENT_UPDATE,
      PERMISSIONS.CONTENT_DELETE,
      PERMISSIONS.CONTENT_PUBLISH,
      
      // Gestión de archivos
      PERMISSIONS.FILE_UPLOAD,
      PERMISSIONS.FILE_DELETE,
      PERMISSIONS.FILE_MANAGE,
      
      // Reportes
      PERMISSIONS.REPORTS_VIEW,
      PERMISSIONS.REPORTS_EXPORT,
    ]
  },
  {
    role: UserRole.TECNICO,
    description: 'Operaciones técnicas básicas',
    permissions: [
      // Solo lectura de usuarios
      PERMISSIONS.USER_READ,
      
      // Gestión básica de contenido
      PERMISSIONS.CONTENT_CREATE,
      PERMISSIONS.CONTENT_READ,
      PERMISSIONS.CONTENT_UPDATE,
      
      // Gestión básica de archivos
      PERMISSIONS.FILE_UPLOAD,
      
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
    UserRole.SUPERVISOR,
    UserRole.TECNICO
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
