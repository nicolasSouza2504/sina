"use client";
import type React from "react";
import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/appSideBar";
import { FloatingNavButtons } from "@/components/FloatingNavButtons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <>
      <div className="group flex h-screen bg-sky-600">
        <AppSidebar />
        {/* Botões flutuantes - aparecem quando sidebar está colapsada */}
        {isCollapsed && (
          <div className="fixed left-0 top-0 flex flex-col gap-2 bg-sky-600 md:p-2 z-40 h-screen">
            {/* Botão de abrir a sidebar */}
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarTrigger className="text-white hover:bg-sky-500">
                    <span className="sr-only">Barra de Navegação </span>
                  </SidebarTrigger>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-sky-700 text-white border-sky-600 z-[60]">
                  <p className="font-medium text-sm">Barra de Navegação</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Botões de navegação flutuantes */}
            <FloatingNavButtons />
          </div>
        )}
      </div>
      <main className="flex flex-1 flex-col overflow-hidden w-full pl-12 md:pl-14 bg-gradient-to-br from-blue-50 to-indigo-100">{children}</main>
    </>
  );
}

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={false}>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  );
}
