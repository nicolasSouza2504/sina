import type React from 'react'
import type {Metadata} from 'next'
import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/appSideBar";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";

export const metadata: Metadata = {
    title: "Ava UniSenai - Home",
    description: "Ava UniSenai Home",
    generator: "Ava UniSenai",
    icons: {
        'icon': '/favicon.ico',
        'shortcut': '/img/logo-senai.png',
    }
}

export default async function PrivateLayout({children}: { children: React.ReactNode }) {

    return (
        <SidebarProvider defaultOpen={false}>
            <AppSidebar/>
            <div className=" top-4 border-r md:peer-data-[state=collapsed]:pr-1 pt-4 md:peer-data-[state=expanded]:hidden md:peer-data-[state=collapsed]:pl-1  bg-sky-800 text-white">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <SidebarTrigger>
                                <span className="sr-only">Barra de Navegação </span>
                            </SidebarTrigger>
                        </TooltipTrigger>
                        <TooltipContent>Barra de Navegação</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <main className="flex flex-1 flex-col overflow-hidden ">
                {children}
            </main>
        </SidebarProvider>
    )
}
