"use client"

import * as React from "react"
import {
  BookOpen,
  FileText,
  Home,
  Users,
  LogOut,
  ChevronRight,
  FolderOpen,
  Image,
  ImageIcon,
  Settings,
  Briefcase,
  Newspaper,
  Camera,
  Handshake,
  Shield,
  Calendar,
  Building2,
  Megaphone,
  Palette,
  Images,
  DollarSign,
  Heart,
  Target,
  MessageSquare,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Función para normalizar el rol
const normalizeRole = (role: string): string => {
  const roleMap: Record<string, string> = {
    'ADMINISTRATOR': 'ADMINISTRATOR',
    'MANAGER': 'MANAGER',
    'CONSULTANT': 'CONSULTANT'
  }
  return roleMap[role] || 'MANAGER'
}

// Organización del sidebar por secciones con estructura original
const getNavSections = (userRole: string) => {
  // Normalizar el rol
  const normalizedRole = normalizeRole(userRole)
  
  // Si es CONSULTANT (CONSULTANT), solo mostrar secciones de donaciones
  if (normalizedRole === "CONSULTANT") {
    return [
      {
        title: "Donaciones",
        icon: DollarSign,
        items: [
          {
            title: "Panel de Control",
            url: "/dashboard",
            icon: Home,
            showFor: ["CONSULTANT"]
          },
          {
            title: "Gestión de Donaciones",
            url: "/dashboard/donaciones",
            icon: Heart,
            showFor: ["CONSULTANT"]
          },
          {
            title: "Proyectos de Donación",
            url: "/dashboard/proyectos-donacion",
            icon: Target,
            showFor: ["CONSULTANT"]
          },
          {
            title: "Metas Anuales",
            url: "/dashboard/metas-anuales",
            icon: Target,
            showFor: ["CONSULTANT"]
          },
        ]
      }
    ]
  }

  const sections = [
    {
      title: "Operaciones",
      icon: Building2,
      items: [
        {
          title: "Panel de Control",
          url: "/dashboard",
          icon: Home,
          showFor: ["ADMINISTRATOR", "MANAGER"]
        },
        {
          title: "Usuarios",
          url: "#",
          icon: Users,
          showFor: ["ADMINISTRATOR"],
              items: [
                {
                  title: "Gestión de Usuarios",
                  url: "/dashboard/users",
                  showFor: ["ADMINISTRATOR"]
                },
          ],
        },
      ]
    },
    {
      title: "Estrategia",
      icon: FileText,
      items: [
        {
          title: "Proyectos",
          url: "/dashboard/proyectos",
          icon: Briefcase,
          showFor: ["ADMINISTRATOR", "MANAGER"]
        },
        {
          title: "Iniciativas",
          url: "/dashboard/iniciativas",
          icon: Settings,
          showFor: ["ADMINISTRATOR", "MANAGER"]
        },
        {
          title: "Programas",
          url: "/dashboard/programas",
          icon: BookOpen,
          showFor: ["ADMINISTRATOR", "MANAGER"]
        },
      ]
    },
    {
      title: "Difusión",
      icon: Megaphone,
      items: [
        {
          title: "Blog",
          url: "#",
          icon: BookOpen,
          showFor: ["ADMINISTRATOR", "MANAGER"],
          items: [
            {
              title: "Noticias",
              url: "/dashboard/noticias",
              showFor: ["ADMINISTRATOR", "MANAGER"]
            },
            {
              title: "Eventos",
              url: "/dashboard/eventos",
              showFor: ["ADMINISTRATOR", "MANAGER"]
            },
          ],
        },
        {
          title: "Contenido",
          url: "#",
          icon: FileText,
          showFor: ["ADMINISTRATOR", "MANAGER"],
          items: [
            {
              title: "Historias de Impacto",
              url: "/dashboard/historias",
              showFor: ["ADMINISTRATOR", "MANAGER"]
            },
            {
              title: "Videos",
              url: "/dashboard/videos-testimoniales",
              showFor: ["ADMINISTRATOR", "MANAGER"]
            },
          ],
        },
      ]
    },
    {
      title: "Medios",
      icon: Images,
      items: [
        {
          title: "Galería",
          url: "/dashboard/galeria-imagenes",
          icon: Camera,
          showFor: ["ADMINISTRATOR", "MANAGER"]
        },
        {
          title: "Aliados",
          url: "/dashboard/aliados",
          icon: Handshake,
          showFor: ["ADMINISTRATOR", "MANAGER"]
        },
        {
          title: "Recursos",
          url: "/dashboard/recursos",
          icon: FolderOpen,
          showFor: ["ADMINISTRATOR", "MANAGER"]
        },
      ]
    },
    {
      title: "Finanzas",
      icon: DollarSign,
      items: [
        {
          title: "Donaciones",
          url: "#",
          icon: Heart,
          showFor: ["ADMINISTRATOR", "MANAGER", "CONSULTANT"],
          items: [
            {
              title: "Gestión de Donaciones",
              url: "/dashboard/donaciones",
              showFor: ["ADMINISTRATOR", "MANAGER", "CONSULTANT"]
            },
            {
              title: "Proyectos de Donación",
              url: "/dashboard/proyectos-donacion",
              showFor: ["ADMINISTRATOR", "MANAGER", "CONSULTANT"]
            },
          ],
        },
        {
          title: "Metas Anuales",
          url: "/dashboard/metas-anuales",
          icon: Target,
          showFor: ["ADMINISTRATOR", "MANAGER", "CONSULTANT"]
        },
      ]
    },
    {
      title: "Transparencia",
      icon: Shield,
      items: [
        {
          title: "Documentos",
          url: "/dashboard/transparencia",
          icon: Shield,
          showFor: ["ADMINISTRATOR", "MANAGER"]
        },
      ]
    },
    {
      title: "Comunicación",
      icon: MessageSquare,
      items: [
        {
          title: "Convocatorias",
          icon: Briefcase,
          showFor: ["ADMINISTRATOR", "MANAGER"],
          items: [
            {
              title: "Gestión de Convocatorias",
              url: "/dashboard/convocatorias",
            },
            {
              title: "Postulaciones",
              url: "/dashboard/convocatorias/postulaciones",
            },
          ]
        },
        {
          title: "Voluntariados/Pasantías",
          icon: Users,
          showFor: ["ADMINISTRATOR", "MANAGER"],
          items: [
            {
              title: "Aplicaciones",
              url: "/dashboard/voluntariados",
              showFor: ["ADMINISTRATOR", "MANAGER"]
            }
          ]
        },
        {
          title: "Mensajes de Contacto",
          icon: MessageSquare,
          showFor: ["ADMINISTRATOR", "MANAGER"],
          items: [
            {
              title: "Mensajes",
              url: "/dashboard/mensajes-contacto",
            },
            {
              title: "Canal de Denuncias",
              url: "/dashboard/denuncias",
            },
          ]
        },
      ]
    },
  ]

  // Filtrar secciones y elementos según el rol del usuario
  return sections.map(section => ({
    ...section,
    items: section.items.filter(item => {
      if (!item.showFor) return true
      return item.showFor.includes(normalizedRole)
    }).map(item => ({
      ...item,
      items: item.items?.filter((subItem: any) => {
        if (!subItem.showFor) return true
        return subItem.showFor.includes(normalizedRole)
      })
    }))
  })).filter(section => section.items.length > 0)
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session, status } = useSession()

  // Debug: mostrar información de la sesión
  if (session?.user) {
    console.log('🔍 Sidebar - Rol del usuario:', session.user.role)
    console.log('🔍 Sidebar - Datos completos:', session.user)
  }

  // Si no hay sesión, no mostrar el sidebar
  if (status === 'unauthenticated' || !session) {
    return null
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <div className="size-4 font-bold">C</div>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">CMS Estrella Sur</span>
                  <span className="truncate text-xs">Panel de Control</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {getNavSections(session?.user?.role || 'MANAGER').map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel className="flex items-center gap-2">
              <section.icon className="h-4 w-4" />
              {section.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item: any) => (
                  <SidebarMenuItem key={item.title}>
                    {item.url && item.url !== "#" ? (
                      <SidebarMenuButton asChild tooltip={item.title} className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                        <Link href={item.url}>
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    ) : (
                      <SidebarMenuButton 
                        tooltip={item.title}
                        className="bg-sidebar-accent/40 text-sidebar-foreground/70 hover:bg-sidebar-accent/40 hover:text-sidebar-foreground/70"
                      >
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    )}
                    {item.items?.length ? (
                      <SidebarMenuSub>
                        {item.items.map((subItem: any) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <Link href={subItem.url}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    ) : null}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {/* Información del Usuario */}
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src="" alt={session?.user?.name || ""} />
                <AvatarFallback className="rounded-lg bg-primary text-primary-foreground font-semibold">
                  {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {session?.user?.name || "Usuario"}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {session?.user?.email || ""}
                </span>
              </div>
              <ChevronRight className="ml-auto size-4" />
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          {/* Botón de Cerrar Sesión */}
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => signOut({ callbackUrl: '/' })}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
            >
              <LogOut className="h-4 w-4" />
              <span>Cerrar Sesión</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
