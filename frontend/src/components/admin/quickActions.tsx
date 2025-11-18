"use client";
import {
    Card,
    CardTitle,
    CardHeader,
    CardContent,
    CardDescription,
} from "../ui/card";
import {Button} from "../ui/button";
import {useRouter, usePathname} from "next/navigation";
import {
    AlertCircle, 
    BookOpenCheck, 
    Code, 
    Database, 
    LayoutDashboardIcon, 
    Users,
    SettingsIcon,
    GraduationCap,
    School,
    FolderOpen,
    BookOpen,
    ChartBarDecreasing,
    UserPen,
    UserStar,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import getUserFromToken from "@/lib/auth/userToken";
import { UserFromToken } from "@/lib/interfaces/userInterfaces";

export interface QuickActionsProps {
    quickActionsTitle: string;
    quickActionsSubtitle: string;
    quickActionsList: Array<QuickAction>;
}

export interface QuickAction {
    key: number;
    title: string;
    link: string;
    icon: React.ReactNode;
}

// Ações rápidas exclusivas do ADMIN (gerenciamento + professor)
const adminQuickActions = [
    {
        key: 1,
        title: "Dashboard Admin",
        link: "/admin",
        icon: <SettingsIcon className="h-4 w-4"/>,
    },
    {
        key: 2,
        title: "Gerenciar Admins",
        link: "/admin/admin",
        icon: <UserStar className="h-4 w-4"/>,
    },
    {
        key: 3,
        title: "Gerenciar Turmas",
        link: "/admin/class",
        icon: <School className="h-4 w-4"/>,
    },
    {
        key: 4,
        title: "Gerenciar Cursos",
        link: "/professor/cursos",
        icon: <FolderOpen className="h-4 w-4"/>,
    },
    {
        key: 5,
        title: "Gerenciar Conteúdos",
        link: "/professor/conteudo",
        icon: <BookOpen className="h-4 w-4"/>,
    },
    {
        key: 6,
        title: "Gerenciar Alunos",
        link: "/admin/students",
        icon: <Users className="h-4 w-4"/>,
    },
    {
        key: 7,
        title: "Gerenciar Professores",
        link: "/admin/teachers",
        icon: <GraduationCap className="h-4 w-4"/>,
    },
    {
        key: 8,
        title: "Ranking",
        link: "/ranking",
        icon: <ChartBarDecreasing className="h-4 w-4"/>,
    },
    {
        key: 9,
        title: "Avaliar Atividades",
        link: "/professor/avaliacao",
        icon: <BookOpenCheck className="h-4 w-4"/>,
    },
];

// Ações rápidas exclusivas do PROFESSOR
const teacherQuickActions = [
    {
        key: 1,
        title: "Dashboard",
        link: "/professor/dashboard",
        icon: <GraduationCap className="h-4 w-4"/>,
    },
    {
        key: 2,
        title: "Gerenciar Turmas",
        link: "/admin/class",
        icon: <School className="h-4 w-4"/>,
    },
    {
        key: 3,
        title: "Gerenciar Cursos",
        link: "/professor/cursos",
        icon: <FolderOpen className="h-4 w-4"/>,
    },
    {
        key: 4,
        title: "Gerenciar Conteúdos",
        link: "/professor/conteudo",
        icon: <BookOpen className="h-4 w-4"/>,
    },
    {
        key: 5,
        title: "Gerenciar Alunos",
        link: "/admin/students",
        icon: <Users className="h-4 w-4"/>,
    },
    {
        key: 6,
        title: "Ranking",
        link: "/ranking",
        icon: <ChartBarDecreasing className="h-4 w-4"/>,
    },
    {
        key: 7,
        title: "Avaliar Atividades",
        link: "/professor/avaliacao",
        icon: <BookOpenCheck className="h-4 w-4"/>,
    },
];

export default function QuickActions() {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<UserFromToken | undefined | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const handleRedirectRoute = (link: string) => {
        router.push(link);
    };

    // Busca dados do usuário do token
    const userDecoded = useCallback(async () => {
        try {
            const user = await getUserFromToken();
            console.log("[QuickActions] User data from token:", user);
            console.log("[QuickActions] User role:", user?.role);
            
            // Trunca nome se necessário (igual à sidebar)
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
        } catch (error) {
            console.error("[QuickActions] Error fetching user:", error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        userDecoded();
    }, [userDecoded]);

    // Obtém ações rápidas baseadas na role do usuário (mesma lógica da sidebar)
    const getQuickActions = () => {
        if (!user?.role) return []; // Fallback vazio se não tiver role
        
        switch (user.role.name) {
            case "ADMIN":
                // ADMIN tem acesso a TODAS as ações (admin + professor)
                return adminQuickActions;
            
            case "TEACHER":
                // PROFESSOR tem apenas suas ações específicas
                return teacherQuickActions;
            
            case "STUDENT":
                // ESTUDANTE não usa este componente (tem outro quickactions)
                return [];
            
            default:
                // USER ou outros roles não utilizados
                return [];
        }
    };

    const quickActionsList = getQuickActions();

    // Se está carregando ou não há ações para mostrar
    if (isLoading || quickActionsList.length === 0) {
        return null;
    }

    // Título e subtítulo baseados na role
    const quickActionsTitle = user?.role?.name === "ADMIN" ? "Ações Rápidas - Admin" : "Ações Rápidas";
    const quickActionsSubtitle = user?.role?.name === "ADMIN" 
        ? "Gerenciamento completo do sistema" 
        : "Ferramentas de ensino e gestão";

    return (
        <div className="mt-8">
            {quickActionsTitle && quickActionsSubtitle && (
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">{quickActionsTitle}</h2>
                    <p className="text-sm text-gray-600">{quickActionsSubtitle}</p>
                </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {quickActionsList.map((action) => (
                    <Button
                        onClick={() => handleRedirectRoute(action.link)}
                        key={action.key}
                        variant="outline"
                        className="h-24 flex-col border-2 border-gray-200 hover:border-blue-300 hover:bg-transparent text-gray-700 shadow-md hover:shadow-lg transition-all duration-200 group items-center justify-center"
                    >
                        <div className="flex items-center justify-center mb-2 text-blue-600 group-hover:text-blue-700 transition-colors">
                            {action.icon}
                        </div>
                        <span className="font-semibold text-xs text-center leading-tight">
                            {action.title}
                        </span>
                    </Button>
                ))}
            </div>
        </div>
    );
}
