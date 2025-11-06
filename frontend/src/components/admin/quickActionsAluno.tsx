"use client";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { BookOpen, FileText, Trophy, LayoutDashboard } from "lucide-react";

export default function QuickActionsAluno() {
    const router = useRouter();

    const handleRedirectRoute = (link: string) => {
        router.push(link);
    };

    const quickActions = [
        {
            key: 1,
            title: "Trilhas",
            link: "/aluno/trilhas",
            icon: <BookOpen className="w-8 h-8" />,
        },
        {
            key: 2,
            title: "Atividades EAD",
            link: "/aluno/ead",
            icon: <FileText className="w-8 h-8" />,
        },
        {
            key: 3,
            title: "Ranking",
            link: "/aluno/ranking",
            icon: <Trophy className="w-8 h-8" />,
        },
        {
            key: 4,
            title: "Dashboard",
            link: "/aluno/dashboard",
            icon: <LayoutDashboard className="w-8 h-8" />,
        },
    ];

    return (
        <div className="mt-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickActions.map((action) => (
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

