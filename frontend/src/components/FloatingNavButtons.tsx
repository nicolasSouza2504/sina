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
  BookOpenCheck,
  UserStar,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "./ui/button";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { UserFromToken } from "@/lib/interfaces/userInterfaces";
import getUserFromToken from "@/lib/auth/userToken";
import signOut from "@/lib/api/auth/signout";

// Telas exclusivas do ADMIN (gerenciamento + professor)
const adminItems = [
  {
    title: "Dashboard Admin",
    url: "/admin",
    icon: SettingsIcon,
  },
  {
    title: "Admins",
    url: "/admin/admin",
    icon: UserStar,
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
  {
    title: "Avaliar",
    url: "/professor/avaliacao",
    icon: BookOpenCheck,
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
    title: "Trilhas Rankeadas",
    url: "/aluno/ead",
    icon: School,
  },
  {
    title: "Ranking",
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

export function FloatingNavButtons() {
  const [user, setUser] = useState<UserFromToken | undefined | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const handleSignout = useCallback(async () => {
    const result = await signOut();
    if (result) {
      router.push("/login");
    } else {
      console.error("Failed to sign out");
    }
  }, [router]);

  const handleProfileClick = useCallback(() => {
    router.push("/user/profile");
  }, [router]);

  const userDecoded = async () => {
    const user = await getUserFromToken();
    console.log("FloatingNav - User data from token:", user);
    console.log("FloatingNav - User role:", user?.role);
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

  // Função para verificar se a rota está ativa
  const isActiveRoute = (url: string) => {
    if (!pathname) return false;

    if (url === "/admin" && pathname === "/admin") return true;
    if (url === "/ranking" && pathname === "/ranking") return true;
    if (url === "/user/profile" && pathname === "/user/profile") return true;

    // Para rotas que começam com o caminho base
    if (url !== "/admin" && url !== "/ranking" && url !== "/user/profile") {
      return pathname.startsWith(url);
    }

    return false;
  };

  return (
    <div className="flex flex-col gap-2 h-full">
      {/* Botões de navegação */}
      <div className="flex flex-col gap-2 ps-1">
        {navigationItems.map((item) => {
          const isActive = isActiveRoute(item.url);
          return (
            <TooltipProvider key={item.title} delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`${isActive
                        ? 'bg-sky-700 text-white cursor-not-allowed'
                        : 'bg-transparent hover:bg-sky-500 text-white hover:text-white'
                      } rounded-lg p-4`}
                    asChild={!isActive}
                    disabled={isActive}
                  >
                    {isActive ? (
                      <div>
                        <item.icon className="size-6" />
                      </div>
                    ) : (
                      <Link href={item.url}>
                        <item.icon className="size-6" />
                      </Link>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-sky-700 text-white border-sky-600 z-[60]">
                  <p className="font-medium text-sm">{item.title}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>

      {/* Espaço flexível para empurrar botões para baixo */}
      <div className="flex-grow"></div>

      {/* Botões de usuário no final */}
      <div className="flex flex-col gap-2 pb-14 ps-1">
        {/* Separador */}
        <div className="border-t border-sky-400 my-2"></div>

        {/* Perfil */}
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="bg-transparent hover:bg-sky-500 text-white hover:text-white rounded-lg p-4"
                onClick={handleProfileClick}
              >
                <UserPen className="size-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-sky-700 text-white border-sky-600 z-[60]">
              <p className="font-medium text-sm">Perfil</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Sair */}
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className=" bg-transparent hover:text-bold hover:bg-transparent hover:text-red-500 text-white rounded-lg p-4"
                onClick={handleSignout}
              >
                <svg className="size-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-sky-700 text-white border-sky-600 z-[60]">
              <p className="font-medium text-sm">Sair</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
