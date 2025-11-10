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
import {AlertCircle, BookOpenCheck, Code, Database, LayoutDashboardIcon, Users} from "lucide-react";

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

export default function QuickActions() {
    const router = useRouter();
    const pathname = usePathname();

    const handleRedirectRoute = (link: string) => {
        router.push(link);
    };

    const quickActions: QuickActionsProps = {
        quickActionsTitle: "",
        quickActionsSubtitle: "",
        quickActionsList: [
            {
                key: 1,
                title: "Gerenciar Estudantes",
                link: "/admin/students",
                icon: <Users className="h-4 w-4"/>,
            },
            {
                key: 2,
                title: "Gerenciar Cursos",
                link: "/professor/cursos",
                icon: <Code className="h-4 w-4"/>,
            },
            {
                key: 3,
                title: "Gerenciar Turmas",
                link: "/admin/class",
                icon: <Code className="h-4 w-4"/>,
            },
            {
                key: 4,
                title: "Gerenciar Conteúdos",
                link: "/professor/conteudo",
                icon: <Database className="h-4 w-4"/>,
            },
            {
                key: 5,
                title: "Avaliar Atividades",
                link: "/professor/avaliacao",
                icon: <BookOpenCheck className="h-4 w-4"/>,
            },
            // {
            //     key: 6,
            //     title: "Relatórios",
            //     link: "/admin/reports",
            //     icon: <AlertCircle className="h-4 w-4"/>,
            // },
            {
                key: 7,
                title: "Dashboard",
                link: "/admin",
                icon: <LayoutDashboardIcon className="h-4 w-4"/>,
            },
        ],
    };

    // Show all actions without filtering
    const filteredActions = quickActions.quickActionsList;

    return (
        <div className="mt-8">
            {quickActions.quickActionsTitle && quickActions.quickActionsSubtitle && (
                <div className="mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">{quickActions.quickActionsTitle}</h2>
                    <p className="text-sm text-gray-600">{quickActions.quickActionsSubtitle}</p>
                </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {filteredActions.map((action) => (
                    <Button
                        onClick={() => handleRedirectRoute(action.link)}
                        key={action.key}
                        variant="outline"
                        className="h-24 flex-col border-gray-300 hover:border-blue-400 hover:bg-blue-50 text-gray-700 shadow-lg hover:shadow-xl transition-all"
                    >
                        <div className="w-8 h-8 mb-2">
                            {action.icon}
                        </div>
                        <span className="font-semibold text-xs text-center">{action.title}</span>
                    </Button>
                ))}
            </div>
        </div>
    );
}
