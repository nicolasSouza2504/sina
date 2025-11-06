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
import { useCallback, useEffect, useState } from "react";
import { UserFromToken } from "@/lib/interfaces/userInterfaces";
import { NotificationsBell } from '@/components/ui/notifications-bell';
import { useSidebar } from "@/components/ui/sidebar";

// Telas exclusivas do ADMIN (gerenciamento)
const adminItems = [
  {
    title: "Dashboard Admin",
    url: "/admin",
    icon: SettingsIcon,
  },
  {
    title: "Admins",
    url: "/admin/admin",
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
    title: "Professores",
    url: "/admin/teachers",
    icon: GraduationCap,
  },
  {
    title: "Ranking",
    url: "/ranking",
    icon: ChartBarDecreasing,
  },
];

// Telas exclusivas do PROFESSOR
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

// Sidebar para alunos
const studentItems = [
  {
    title: "Dashboard",
    url: "/aluno/dashboard",
    icon: GraduationCap,
  },
  {
    title: "Trilhas",
    url: "/aluno/trilhas",
    icon: BookOpen,
  },
  {
    title: "EAD",
    url: "/aluno/ead",
    icon: School,
  },
  {
    title: "Ranking EAD",
    url: "/aluno/ranking",
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
    title: "Cursos",
    url: "/cursos",
    icon: FolderOpen,
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
  const { isMobile, setOpenMobile } = useSidebar();

  const closeSidebarOnNavigate = useCallback(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [isMobile, setOpenMobile]);

  const handleSignout = useCallback(async () => {
    closeSidebarOnNavigate();
    const result = await signOut();
    if (result) {
      router.push("/login");
    } else {
      console.error("Failed to sign out");
    }
  }, [closeSidebarOnNavigate, router]);

  const handleProfileClick = useCallback(() => {
    closeSidebarOnNavigate();
    router.push("/user/profile");
  }, [closeSidebarOnNavigate, router]);

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
    if (!user?.role) return studentItems; // Fallback para student
    
    switch (user.role.name) {
      case "ADMIN":
        // ADMIN tem acesso a TODAS as telas (admin + professor)
        return adminItems;
      
      case "TEACHER":
        // PROFESSOR tem apenas suas telas específicas
        return teacherItems;
      
      case "STUDENT":
        // ESTUDANTE tem acesso limitado
        return studentItems;
      
      default:
        // USER ou outros roles não utilizados
        return studentItems;
    }
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
                        onClick={closeSidebarOnNavigate}
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
                 user?.role?.name === 'STUDENT' ? 'ALUNO' :
                 user?.role?.name || 'USER'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* Sininho de notificações - apenas para professores */}
              {user?.role?.name === "TEACHER" && <NotificationsBell />}
              <Button className="bg-transparent hover:bg-transparent hover:cursor-pointer"
              onClick={handleProfileClick}
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
