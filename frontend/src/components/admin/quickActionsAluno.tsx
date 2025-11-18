"use client";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { BookOpen, School, ChartBarDecreasing, GraduationCap } from "lucide-react";

export default function QuickActionsAluno() {
    const router = useRouter();

    const handleRedirectRoute = (link: string) => {
        router.push(link);
    };

    const quickActions = [
        {
            key: 1,
            title: "Dashboard",
            link: "/aluno/dashboard",
            icon: <GraduationCap className="w-8 h-8" />,
        },
        {
            key: 2,
            title: "Trilhas",
            link: "/aluno/trilhas",
            icon: <BookOpen className="w-8 h-8" />,
        },
        {
            key: 3,
            title: "EAD",
            link: "/aluno/ead",
            icon: <School className="w-8 h-8" />,
        },
        {
            key: 4,
            title: "Ranking EAD",
            link: "/aluno/ranking",
            icon: <ChartBarDecreasing className="w-8 h-8" />,
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

