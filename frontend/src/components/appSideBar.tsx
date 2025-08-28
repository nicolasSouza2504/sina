import {
    BookOpen,
    ChartBarDecreasing,
    GraduationCap,
    School, SettingsIcon,
    Users
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem, SidebarTrigger,
} from "@/components/ui/sidebar"
import Link from "next/link";

const items = [
    {
        title: "Turmas",
        url: "/turmas",
        icon: School,
    },
    {
        title: "Cursos",
        url: "/cursos",
        icon: BookOpen ,
    },
    {
        title: "Alunos",
        url: "/alunos",
        icon: Users,
    },
    {
        title: "Professores",
        url: "/professores",
        icon: GraduationCap,
    },
    {
        title: "Ranking",
        url: "/ranking",
        icon: ChartBarDecreasing,
    },
    {
        title: "Admin",
        url: "/admin",
        icon: SettingsIcon,
    },
]

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarContent className="h-screen bg-sky-800 text-white">
                <div className="flex h-full justify-between pt-4">
                    <SidebarGroup>
                        <SidebarGroupLabel className="flex font-bold justify-center text-1xl my-5">
                            <img src="/img/LogoUnisenai_Original.png" alt="Unisenai Logo" />
                        </SidebarGroupLabel>
                        <SidebarGroupContent className="flex flex-col justify-center gap-5 pt-5">
                            <SidebarMenu className="flex flex-col gap-3">
                                {items.map((item) => (
                                    <SidebarMenuItem key={item.title} >
                                        <SidebarMenuButton asChild className="text-center flex py-5">
                                            <Link href={item.url} className="flex items-center gap-2 p-2 hover:bg-sky-500 hover:text-white rounded-md text-xl text-center">
                                                <item.icon className="size-2"/>
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
            </SidebarContent>
        </Sidebar>
    )
}
