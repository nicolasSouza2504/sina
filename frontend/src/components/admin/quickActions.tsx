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
import {AlertCircle, Code, Database, LayoutDashboardIcon, Users} from "lucide-react";

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
                link: "/cursos",
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
                title: "Gerenciar EADs",
                link: "/admin/eads",
                icon: <Database className="h-4 w-4"/>,
            },
            {
                key: 5,
                title: "Relatórios",
                link: "/admin/reports",
                icon: <AlertCircle className="h-4 w-4"/>,
            },
            {
                key: 6,
                title: "Dashboard",
                link: "/admin",
                icon: <LayoutDashboardIcon className="h-4 w-4"/>,
            },
        ],
    };

    // Show all actions without filtering
    const filteredActions = quickActions.quickActionsList;

    return (
        <div>
            <Card className="gap-0">
                {quickActions.quickActionsTitle &&
                    quickActions.quickActionsSubtitle && (
                        <CardHeader>
                            <CardTitle>{quickActions.quickActionsTitle}</CardTitle>
                            <CardDescription>
                                {quickActions.quickActionsSubtitle}
                            </CardDescription>
                        </CardHeader>
                    )}
                <CardContent className="p-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 w-full">
                        {filteredActions.map((action) => (
                            <Button
                                onClick={() => handleRedirectRoute(action.link)}
                                key={action.key}
                                variant="outline"
                                className="h-20 sm:h-24 flex flex-col items-center justify-center gap-2 bg-transparent hover:bg-accent hover:cursor-pointer w-full p-2 overflow-hidden"
                            >
                                <div className="flex-shrink-0">
                                    {action.icon}
                                </div>
                                <span className="text-[10px] sm:text-xs text-center leading-tight break-words w-full px-1 whitespace-normal">{action.title}</span>
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
