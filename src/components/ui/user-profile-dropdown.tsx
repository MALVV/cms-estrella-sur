"use client"

import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { LogOut, User, Settings, Shield } from "lucide-react"
import { UserRole } from "@/lib/roles"

interface UserProfileDropdownProps {
  showFullInfo?: boolean
}

export function UserProfileDropdown({ }: UserProfileDropdownProps) {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)

  const getRoleIcon = (role: string) => {
    switch (role) {
      case UserRole.ADMINISTRADOR: return <Shield className="h-3 w-3 text-red-500" />
      case UserRole.GESTOR: return <User className="h-3 w-3 text-green-500" />
      default: return <User className="h-3 w-3 text-gray-500" />
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case UserRole.ADMINISTRADOR: return 'Administrador'
      case UserRole.GESTOR: return 'Gestor de Contenido'
      default: return 'Usuario'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case UserRole.ADMINISTRADOR: return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
      case UserRole.GESTOR: return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" alt={session?.user?.name || ""} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
              {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt={session?.user?.name || ""} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                  {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium leading-none">
                  {session?.user?.name || "Usuario"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {session?.user?.email || "usuario@ejemplo.com"}
                </p>
              </div>
            </div>
            
            {session?.user?.role && (
              <div className="flex items-center gap-1 mt-2">
                {getRoleIcon(session.user.role)}
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${getRoleColor(session.user.role)}`}
                >
                  {getRoleLabel(session.user.role)}
                </Badge>
              </div>
            )}
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>Perfil</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Configuración</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={() => signOut({ callbackUrl: '/' })}
          className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:text-red-400 dark:focus:text-red-300 dark:focus:bg-red-900/20"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar Sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
