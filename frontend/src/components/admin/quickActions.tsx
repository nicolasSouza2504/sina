"use client";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "../ui/card";
import { Button } from "../ui/button";
import { useRouter, usePathname } from "next/navigation";
import { AlertCircle, Code, Database, Users } from "lucide-react";

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
        icon: <Users className="h-4 w-4" />,
      },
      {
        key: 2,
        title: "Gerenciar Cursos",
        link: "/admin/courses",
        icon: <Code className="h-4 w-4" />,
      },
      {
        key: 3,
        title: "Gerenciar Turmas",
        link: "/admin/class",
        icon: <Code className="h-4 w-4" />,
      },
      {
        key: 4,
        title: "Gerenciar EADs",
        link: "/admin/eads",
        icon: <Database className="h-4 w-4" />,
      },
      {
        key: 5,
        title: "Relatórios",
        link: "/admin/reports",
        icon: <AlertCircle className="h-4 w-4" />,
      },
    ],
  };

  // filter out the action if the current route matches
  const filteredActions = quickActions.quickActionsList.filter(
    (action) => action.link !== pathname
  );

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
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {filteredActions.map((action) => (
              <Button
                onClick={() => handleRedirectRoute(action.link)}
                key={action.key}
                variant="outline"
                className="h-20 flex-col gap-2 bg-transparent hover:cursor-pointer"
              >
                {action.icon}
                <span className="text-xs">{action.title}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
