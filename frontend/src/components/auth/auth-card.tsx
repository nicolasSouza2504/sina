"use client";

import type React from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface AuthCardProps {
  children: React.ReactNode;
}

export function AuthCard({ children }: AuthCardProps) {
  return (
    <div className="min-h-screen sm:w-3/5 w-full flex items-center justify-center bg-background px-4 py-8">
      <Card className="w-full shadow-none border-0 ">
        <CardHeader className="space-y-1">
          <div className="flex flex-col items-center pb-6">
            <img src="/img/logo-nova-sesi-senai.png" className="size-3/5" />
          </div>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}
