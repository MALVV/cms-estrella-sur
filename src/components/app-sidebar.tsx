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

// This is sample data.
const getNavMain = (userRole: string) => {
  const baseNav = [
    {
      title: "Panel de Control",
      url: "/dashboard",
      icon: Home,
      isActive: true,
      showFor: ["ADMINISTRADOR", "SUPERVISOR", "TECNICO"]
    },
    {
      title: "Usuarios",
      url: "/dashboard/users",
      icon: Users,
      showFor: ["ADMINISTRADOR", "SUPERVISOR", "TECNICO"],
      items: [
        {
          title: "Gestión de Usuarios",
          url: "/dashboard/users",
          showFor: ["ADMINISTRADOR", "SUPERVISOR", "TECNICO"]
        },
      ],
    },
    {
      title: "Contenido",
      url: "#",
      icon: FileText,
      showFor: ["ADMINISTRADOR", "SUPERVISOR", "TECNICO"],
      items: [
        {
          title: "Historias Destacadas",
          url: "/dashboard/stories",
          showFor: ["ADMINISTRADOR", "SUPERVISOR", "TECNICO"]
        },
        {
          title: "Videos Testimoniales",
          url: "/dashboard/video-testimonials",
          showFor: ["ADMINISTRADOR", "SUPERVISOR", "TECNICO"]
        },
        {
          title: "Proyectos",
          url: "/dashboard/projects",
          showFor: ["ADMINISTRADOR", "SUPERVISOR", "TECNICO"]
        },
        {
          title: "Metodologías",
          url: "/dashboard/methodologies",
          showFor: ["ADMINISTRADOR", "SUPERVISOR", "TECNICO"]
        },
        {
          title: "Programas",
          url: "/dashboard/programas",
          showFor: ["ADMINISTRADOR", "SUPERVISOR", "TECNICO"]
        },
        {
          title: "Aliados Estratégicos",
          url: "/dashboard/allies",
          showFor: ["ADMINISTRADOR", "SUPERVISOR", "TECNICO"]
        },
      ],
    },
    {
      title: "Blog",
      url: "#",
      icon: BookOpen,
      showFor: ["ADMINISTRADOR", "SUPERVISOR", "TECNICO"],
      items: [
        {
          title: "Noticias",
          url: "/dashboard/news",
          showFor: ["ADMINISTRADOR", "SUPERVISOR", "TECNICO"]
        },
        {
          title: "Eventos",
          url: "/dashboard/events",
          showFor: ["ADMINISTRADOR", "SUPERVISOR", "TECNICO"]
        },
      ],
    },
    {
      title: "Transparencia",
      url: "/dashboard/transparency",
      icon: FolderOpen,
      showFor: ["ADMINISTRADOR", "SUPERVISOR", "TECNICO"],
    },
    {
      title: "Recursos",
      url: "/dashboard/resources",
      icon: BookOpen,
      showFor: ["ADMINISTRADOR", "SUPERVISOR", "TECNICO"],
    },
  ]

  // Filtrar elementos según el rol del usuario
  return baseNav.filter(item => {
    if (!item.showFor) return true
    return item.showFor.includes(userRole)
  }).map(item => ({
    ...item,
    items: item.items?.filter(subItem => {
      if (!subItem.showFor) return true
      return subItem.showFor.includes(userRole)
    })
  }))
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession()

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
        <SidebarGroup>
          <SidebarGroupLabel>Plataforma</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {getNavMain(session?.user?.role || 'TECNICO').map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  {item.items?.length ? (
                    <SidebarMenuSub>
                      {item.items.map((subItem) => (
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
                  {session?.user?.email || "usuario@ejemplo.com"}
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
