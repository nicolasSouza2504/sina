"use client";
import {
  ChartBarDecreasing,
  GraduationCap,
  School,
  SettingsIcon,
  UserPen,
  Users,
  FolderOpen,
  BookOpen,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import getUserFromToken from "@/lib/auth/userToken";
import { Button } from "./ui/button";
import signOut from "@/lib/api/auth/signout";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useEffect } from "react";
import { UserFromToken } from "@/lib/interfaces/userInterfaces";
import { NotificationsBell } from '@/components/ui/notifications-bell';

// Sidebar personalizada para professores (inclui funcionalidades originais + criação de conteúdo)
const teacherItems = [
  {
    title: "Dashboard",
    url: "/professor/dashboard",
    icon: GraduationCap,
  },
  {
    title: "Turmas",
    url: "/admin/class",
    icon: School,
  },
  {
    title: "Cursos",
    url: "/professor/cursos",
    icon: FolderOpen,
  },
  {
    title: "Conteúdo",
    url: "/professor/conteudo",
    icon: BookOpen,
  },
  {
    title: "Alunos",
    url: "/admin/students",
    icon: Users,
  },
  {
    title: "Ranking",
    url: "/ranking",
    icon: ChartBarDecreasing,
  },
];

// Sidebar original (para ADMIN e USER)
const items = [
  {
    title: "Dashboard",
    url: "/home",
    icon: SettingsIcon,
  },
  {
    title: "Turmas",
    url: "/admin/class",
    icon: School,
  },
  {
    title: "Cursos",
    url: "/cursos",
    icon: FolderOpen,
  },
  {
    title: "Alunos",
    url: "/admin/students",
    icon: Users,
  },
  {
    title: "Ranking",
    url: "/ranking",
    icon: ChartBarDecreasing,
  },
];

export function AppSidebar() {
  const [user, setUser] = useState<UserFromToken | undefined | null>(null);

  const router = useRouter();
  async function handleSignout() {
    const result = await signOut();
    if (result) {
      router.push("/login");
    } else {
      console.error("Failed to sign out");
    }
  }

  const userDecoded = async () => {
    const user = await getUserFromToken();
    console.log("User data from token:", user);
    console.log("User role:", user?.role);
    if (user?.nome) {
      if (user.nome.length > 15) {
        const nameParts = user.nome.split(" ");
        if (nameParts.length > 1) {
          user.nome = `${nameParts[0]}...`;
        } else {
          user.nome = `${user.nome.substring(0, 14)}...`;
        }
      }
    }
    setUser(user);
  };

  useEffect(() => {
    userDecoded();
  }, []);

  // Get navigation items based on user role
  const getNavigationItems = () => {
    if (!user?.role) return items;
    
    // Professores têm sidebar personalizada
    if (user.role.name === "TEACHER") {
      return teacherItems;
    }
    
    // Admin tem dashboard específico
    if (user.role.name === "ADMIN") {
      const adminItems = [...items];
      adminItems[0].url = "/admin"; // Dashboard aponta para /admin
      return adminItems;
    }
    
    // Usuários comuns mantêm sidebar original
    return items;
  };

  const navigationItems = getNavigationItems();

  return (
    <Sidebar>
      <SidebarContent className="h-screen bg-sky-600 text-white">
        <div className="flex h-full justify-between pt-4">
          <SidebarGroup>
            <SidebarGroupLabel className="flex font-bold justify-center text-1xl my-5">
              <img src="/img/LogoUnisenai_Original.png" alt="Unisenai Logo" />
            </SidebarGroupLabel>
            <SidebarGroupContent className="flex flex-col justify-center gap-5 pt-5">
              <SidebarMenu className="flex flex-col gap-3">
                {navigationItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className="text-center flex py-5"
                    >
                      <Link
                        href={item.url}
                        className="flex items-center gap-2 p-2 hover:bg-sky-500 hover:text-white rounded-md text-xl text-center"
                      >
                        <item.icon className="size-2" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarTrigger className="hover:bg-transparent hover:text-white"></SidebarTrigger>
        </div>
        <div className="mt-auto">
          <div className="flex justify-between items-center py-3 mb-2 gap-6 px-3  rounded-2xl mx-1">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <h2>{user?.nome}</h2>
              <p className="text-xs text-gray-300">
                {user?.role?.name === 'TEACHER' ? 'PROFESSOR' : 
                 user?.role?.name === 'ADMIN' ? 'ADMIN' :
                 user?.role?.name === 'STUDENT' ? 'ESTUDANTE' :
                 user?.role?.name || 'USER'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* Sininho de notificações - apenas para professores */}
              {user?.role?.name === "TEACHER" && <NotificationsBell />}
              <Button className="bg-transparent hover:bg-transparent hover:cursor-pointer"
              onClick={() => router.push("/user/profile")}
              >
                <UserPen className=" size-6" />
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center px-2">
            <Button
              className="bg-white text-black hover:bg-red-600 hover:text-white hover:cursor-pointer w-full py-5"
              onClick={handleSignout}
            >
              Sair
            </Button>
          </div>
        </div>
        <SidebarFooter className="mt-auto">
          <div className="text-center text-sm p-2">
            © 2025 Unisenai. Todos os direitos reservados.
          </div>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
